# Hrules

## 多客户端 · 场景化 · 智能路由

## Clash / Mihomo 三种路由模式

| 模式 | 主要目标 | 典型行为 | 典型场景 |
| --- | --- | --- | --- |
| 🟢 **标准** | 可用性与日常体验 | 允许自动选择和常规故障切换 | 普通网页、YouTube / 视频、一般网络服务 |
| 🟡 **稳定** | 尽量保持地区一致 | 优先同地区选择与同地区故障切换 | Claude、ChatGPT、Netflix 等地区敏感服务 |
| 🔴 **严格** | 出口更可预测 | 限制自动漂移，优先明确/固定的允许出口 | 银行、证券 / 券商、虚拟货币等重要账户 |

以上三种等级仅适用于 Clash / Mihomo。Shadowrocket 只提供一个完整配置，不分等级。

→ [了解 Clash / Mihomo 三种路由模式](docs/routing-modes.md)

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

当前公共场景覆盖：

**一般 AI 服务** · **Claude / OpenAI** · **虚拟货币** · **美国银行** · **美股 / 券商** · **金融账户** · **Telegram** · **YouTube** · **中国大陆直连** · **私有网络直连**

具体服务覆盖以当前 Scene 规则与 coverage audit 为准；场景名称不代表对该类别所有网站的穷举覆盖。\n\n→ [查看场景与规则说明](docs/scenes.md)

## DNS 规则

Hrules 在 **Clash Verge Rev / Mihomo** 中同时提供经过实机验证的 DNS 配置，不需要再手动补一套 DNS 覆写。设计重点不是单纯“换一个 DNS”，而是兼顾中国用户常见的 **机场订阅、自建节点、Reality / Hysteria2、域名节点、IP 节点、EdgeTunnel / Cloudflare 优选 IP** 等使用方式。

- **节点解析与代理 DNS 分离**：节点域名使用独立的 bootstrap / `proxy-server-nameserver`，避免“代理还没建立，却先要求通过代理解析 DNS”的循环依赖。
- **中国大陆直连解析**：DIRECT 流量使用国内 DNS，兼顾国内网站访问与 CDN 调度。
- **海外 DNS**：稳定版 / 严格版使用加密 DoH，并通过 Hrules 自己的自动选择组出站。
- **Fake-IP 兼容**：保留局域网域名真实解析，同时避免把 Fake-IP 地址段误判为 DIRECT。
- **不改写节点传输参数**：不会修改节点的 `server`、SNI、Host；EdgeTunnel / Cloudflare 优选 IP 可以继续保持“优选 IP + 原域名 SNI / Host”的结构。
- **IPv6**：DNS v0.1 默认关闭 IPv6 DNS，优先保证复杂网络环境下的兼容性。

三种模式采用同一套 DNS 安全基础，其中 **标准版** 更偏向保守兼容；**稳定版 / 严格版** 在保持节点启动解析独立的同时，将海外 DoH 绑定到 Hrules 代理组。

→ [查看 DNS 架构说明](docs/dns-architecture-v0.1.md)

## 推荐服务

- **推荐机场** — [查看推荐与适用场景](docs/recommended-services.md)
- **推荐 VPS** — [查看 VPS 推荐与用途](docs/recommended-services.md)

如页面包含联盟链接、优惠码或赞助合作，会在推荐页面明确标注。

## 合作与定制

- 机场 / VPS / 网络服务商合作
- Hrules 接入与兼容适配
- 私人定制分流规则与场景
- 商务合作、赞助与内容合作

→ [商务合作与私人定制](docs/business.md)

## 项目状态

当前公共版本：**v0.1.0-rc1**

当前已经完成 **Clash Verge Rev / Mihomo** 多订阅真实客户端验证、**3X-UI Remote Routing** 真实链路验证，以及 **Shadowrocket** 真机路由验证。Shadowrocket 采用单一完整配置，不分标准 / 稳定 / 严格。其他客户端会在完成实现与真实验收后逐步开放。

\`main\` 提供持续更新的公共运行时与规则；版本 Tag / Release 提供固定的产品契约快照。

→ [版本与发布策略](docs/releases.md)

## Documentation

- [Clash / Mihomo 路由模式：标准 / 稳定 / 严格](docs/routing-modes.md)
- [Shadowrocket 安装说明](docs/kernels/shadowrocket.md)
- [场景与规则](docs/scenes.md)
- [安装与客户端说明](docs/install.md)
- [第三方 / 机场 Integration Contract](docs/integration-contract.md)
- [隐私与安全边界](docs/security.md)
- [版本与发布策略](docs/releases.md)
- [推荐服务](docs/recommended-services.md)
- [商务合作与私人定制](docs/business.md)

---

**Hrules = 路由层。机场 / 自建节点 / 其他节点来源 = 节点层。**
