# Hrules

## 面向真实使用场景的多客户端分流规则

Hrules 是一套**路由规则层**，用于在现有机场订阅、自建节点或其他节点来源之上，对网络请求进行识别、归类和路由。

Hrules **不提供代理节点，也不会改变节点本身的线路、IP 或协议能力**。它的作用是：根据规则识别请求，把属于同一使用场景的关键流量归入对应场景组，再由用户为该场景选择地区或具体节点作为出口。

在支持的 Mihomo / Clash Verge Rev 接入方式中：

- **选择地区**：Hrules 可以在该地区已有节点之间自动选择，但不会自动跨地区切换。
- **选择具体节点**：该场景直接使用所选节点；Hrules 不会为这个场景自动切换到其他节点。
- **机场原有代理组**：继续保留。Hrules 作为叠加的路由层，不删除机场原有的自动选择、故障转移或负载均衡组。

Hrules 的目标是让用户能够明确看到：**哪些请求被归到哪个场景，以及这个场景最终允许使用哪些出口。**

## 客户端支持

| 客户端 / 接入方式 | 状态 | 安装 / 下载 |
| --- | --- | --- |
| **Clash Verge Rev** | ✅ Available | [进入安装中心](docs/kernels/mihomo.md#clash-verge-rev) |
| **Mihomo / Clash Meta 客户端** | ✅ Available | [进入安装中心](docs/kernels/mihomo.md) |
| **Shadowrocket** | ✅ Available | [进入安装说明](docs/kernels/shadowrocket.md) |
| **sing-box / SFM** | 🧪 Planned | 待开放 |
| **v2rayN / v2rayNG** | 🧪 Planned | 待开放 |
| **Karing** | 🧪 Planned | 待开放 |

只有完成对应客户端真实验收的实现才会标记为 Available。

## 场景与版本

Standard / Stable / Strict **共用同一套 Hrules Core 和规则文件**。三个版本不是安全等级，也不是三套不同的域名库；它们的主要区别是**同一批规则在用户界面中被归并成多大的场景，以及用户可以把出口控制细分到什么程度**。

> **Standard 更简单，Stable 更细化，Strict 更精准。区别在场景和出口控制的颗粒度，不代表 Standard 安全性较低或 Strict 能提高节点、账号或网站本身的安全性。**

- **Standard**：只提供 `🤖 AI 服务 [场景]`、`📺 影音媒体 [场景]`、`💬 Telegram [场景]` 和 `🚀 漏网之鱼 [自选]`。Claude / OpenAI、虚拟货币、银行、券商、金融账户等已有 Core 规则不会被删除；在 Standard 中，这些需要代理出口的细分规则统一映射到 `🤖 AI 服务 [场景]`，从而减少用户需要管理的代理组数量。
- **Stable**：使用相同 Core，但把 Claude / OpenAI、虚拟货币、美国账户等从大场景中独立出来。用户可以为这些场景分别选择地区或具体节点。
- **Strict**：继续使用相同 Core，并把部分复合账户场景进一步拆分为美国银行、美股 / 券商、金融账户等；同时 Strict 接管最终 MATCH / FINAL，使未命中前置规则的流量也进入 Hrules 明确的终端路由。

因此，版本越细并不表示“规则更安全”，而表示**同一套规则可以被分配到更多独立场景，用户能够分别决定这些场景使用哪个出口。**

### 当前 Core 覆盖的主要场景规则

- **Claude / OpenAI** — Claude、OpenAI 及已纳入 Core 的相关请求
- **通用 AI** — Gemini、Grok、Perplexity 等已纳入 Core 的 AI 服务
- **虚拟货币**
- **美国银行**
- **美股 / 券商**
- **金融账户**
- **Telegram**
- **影音媒体** — 包括 YouTube 等已纳入 Core 的影音服务
- **中国大陆直连**
- **私有网络直连**

`🚀 漏网之鱼 [自选]` 不是一个网站分类规则集，而是用于承接最终未命中前置规则的流量；Standard / Stable 保留宿主配置已有的 MATCH / FINAL 时，以宿主终端规则为准。

Hrules 的场景规则会根据真实使用和流量验证持续补充。**“场景”表示 Hrules 已识别并归类的相关请求集合，不表示能够识别某个网站或账户产生的全部网络请求。**

→ [查看场景与规则说明](docs/scenes.md)

## DNS 规则

Hrules 在 **Clash Verge Rev / Mihomo** 中同时提供经过实机验证的 DNS 配置，不需要再手动补一套 DNS 覆写。设计重点不是单纯“换一个 DNS”，而是兼顾中国用户常见的 **机场订阅、自建节点、Reality / Hysteria2、域名节点、IP 节点、EdgeTunnel / Cloudflare 优选 IP** 等使用方式。

- **节点解析与代理 DNS 分离**：节点域名使用独立的 bootstrap / `proxy-server-nameserver`，避免“代理还没建立，却先要求通过代理解析 DNS”的循环依赖。
- **中国大陆直连解析**：DIRECT 流量使用国内 DNS，兼顾国内网站访问与 CDN 调度。
- **海外 DNS**：稳定版 / 严格版使用加密 DoH；节点启动解析保持独立，不依赖 Hrules 自建的全局自动代理组。
- **Fake-IP 兼容**：保留局域网域名真实解析，同时避免把 Fake-IP 地址段误判为 DIRECT。
- **不改写节点传输参数**：不会修改节点的 `server`、SNI、Host；EdgeTunnel / Cloudflare 优选 IP 可以继续保持“优选 IP + 原域名 SNI / Host”的结构。
- **IPv6**：DNS v0.1 默认关闭 IPv6 DNS，优先保证复杂网络环境下的兼容性。

三种模式采用同一套 DNS 安全基础，其中 **标准版** 更偏向保守兼容；**稳定版 / 严格版** 保持节点启动解析独立，并使用加密海外 DoH。

→ [查看 DNS 架构说明](docs/dns-architecture-v0.1.md)

## 合作与定制

### 机场 / VPS / 网络服务

**九云机场**

[注册 / 购买九云机场](https://888.jiuyundl.com/#/register?code=ONhkcjrm)

**搬瓦工 DC9 — $49.99 / 季度**  
CN2 GIA＋CMIN2＋联通 Premium，适合重视中国方向线路质量的用户。

[购买搬瓦工 DC9](https://bwh81.net/aff.php?aff=82473&a=add&pid=87&billingcycle=quarterly&configoption%5B17%5D=55)

**Proxy-Seller 静态住宅代理 ISP**  
优惠券：**HCLOUD15**

[购买 Proxy-Seller 静态住宅代理 ISP](https://proxy-seller.com/?partner=8Y51DM71OGR26N)

### 商务合作 / 1v1 定制

- **商务合作**：机场、VPS、网络服务商合作，赞助及内容合作等。
- **1v1 定制**：根据个人实际使用的服务、域名和出口需求，定制 Hrules 场景分流规则与路由策略。
- **隐私说明**：1v1 定制不需要提供账号、密码，也不接收任何账号信息；只确认需要使用的服务、域名清单及必要的网络需求。

**Email：** hexa46656@gmail.com  
**Telegram：** @hcloudlab

## 项目状态

当前公共版本：**v0.1.0-rc1**

当前已经完成 **Clash Verge Rev / Mihomo** 多订阅真实客户端验证、**3X-UI Remote Routing** 真实链路验证，以及 **Shadowrocket** 真机路由验证。Shadowrocket 采用单一完整配置，不分标准 / 稳定 / 严格。其他客户端会在完成实现与真实验收后逐步开放。

\`main\` 提供持续更新的公共运行时与规则；版本 Tag / Release 提供固定的产品契约快照。

→ [版本与发布策略](docs/releases.md)

## Documentation

- [Mihomo 安装中心：版本选择与接入方式](docs/kernels/mihomo.md)
- [Shadowrocket 安装说明](docs/kernels/shadowrocket.md)
- [场景与规则](docs/scenes.md)
- [安装与客户端说明](docs/install.md)
- [第三方 / 机场 Integration Contract](docs/integration-contract.md)
- [隐私与安全边界](docs/security.md)
- [版本与发布策略](docs/releases.md)

---

**Hrules = 路由层。机场 / 自建节点 / 其他节点来源 = 节点层。**
