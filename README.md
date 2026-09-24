# Hrules

## 安全、可控的多客户端、场景化、智能路由分流规则

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

## 场景能力

Hrules 的 Standard / Stable / Strict 共用同一套 Core 和规则基础，三者安全性完全相同。版本区别在于**场景归类颗粒度**：Standard 更简单，Stable 更细化，Strict 更精准，让用户按需要更精确地掌控哪个节点用在哪条线路上。

- **Standard**：AI、影音、Telegram、漏网之鱼。细分的 Claude / OpenAI、虚拟货币、银行、券商、金融账户等 Core 规则仍然保留，但在 Standard 中统一归入 `🤖 AI 服务 [场景]`，不额外增加用户需要管理的场景组。
- **Stable**：在基础场景上拆出 Claude / OpenAI、虚拟货币、美国账户等，便于分别指定出口。
- **Strict**：进一步拆分美国银行、美股 / 券商、金融账户等，让业务线路与出口控制更精准。

当前公共场景覆盖：

- **🔐 Claude / OpenAI [场景]** — Claude、OpenAI 等重要 AI 账户相关流量
- **🤖 AI 服务 [场景]** — Gemini、Grok、Perplexity 等通用 AI 服务
- **💰 虚拟货币 [场景]** — 虚拟货币相关服务与账户流量
- **🏦 美国账户 [场景]** — Standard / Stable 中统一承载美国银行、美股 / 券商及金融账户场景
- **🏦 美国银行 [场景]** — Strict 中独立的美国银行账户场景
- **📈 美股 [场景]** — Strict 中独立的美股 / 券商账户场景
- **💳 金融账户 [场景]** — Strict 中独立的 PayPal、Wise、Payoneer 等金融账户场景
- **💬 Telegram [场景]** — Telegram 相关流量
- **📺 影音媒体 [场景]** — YouTube 等影音媒体流量
- **🚀 漏网之鱼 [自选]** — 未命中前置规则的最终自选出口
- **中国大陆直连** — 国内域名 / IP 按 DIRECT 处理
- **私有网络直连** — 局域网及私有地址按 DIRECT 处理

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
