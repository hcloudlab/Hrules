# Hrules

## 多客户端 · 场景化 · 分级路由

Hrules 是面向机场订阅、自建节点和多节点环境的分流规则项目。它负责决定“什么流量走哪里”，不提供节点本身。

## 三种路由模式

| 模式 | 主要目标 | 典型行为 | 典型场景 |
| --- | --- | --- | --- |
| 🟢 **Standard / 标准** | 可用性与日常体验 | 自动选择、常规故障切换 | 普通网页、YouTube、社交、影音、一般网络服务 |
| 🟡 **Stable / 稳定** | 尽量保持敏感场景的地区与出口一致 | 对已实现同地区策略的敏感场景减少节点漂移 | Claude / OpenAI 等敏感 AI 场景 |
| 🔴 **Strict / 严格** | 出口更可预测 | 敏感账户优先明确/固定出口 | 银行、证券 / 券商、虚拟货币等重要账户 |

→ [了解 Standard / Stable / Strict](docs/routing-modes.md)

## 安装入口

| 客户端 / 接入方式 | 状态 | 入口 |
| --- | --- | --- |
| **Clash Verge Rev** | ✅ Available | [Mihomo 安装中心](docs/kernels/mihomo.md#clash-verge-rev--global-extension-script) |
| **3X-UI → Mihomo Remote Routing** | ✅ Available | [3X-UI Remote Routing](docs/kernels/mihomo.md#3x-ui--remote-routing) |
| **Mihomo / Clash Meta** | ✅ Available | [Mihomo 安装中心](docs/kernels/mihomo.md) |
| **Shadowrocket** | 🧪 Planned | 待开放 |
| **sing-box / SFM** | 🧪 Planned | 待开放 |
| **v2rayN / v2rayNG** | 🧪 Planned | 待开放 |
| **Karing** | 🧪 Planned | 待开放 |

→ [开始使用 Hrules](docs/getting-started.md)

## 当前规则覆盖

### AI
**Claude / Anthropic · OpenAI / ChatGPT · Gemini · 一般 AI 服务**

### 社交与通信
**TikTok · Facebook · Instagram · WhatsApp · X / Twitter · Discord · Reddit**

### 影音
**YouTube · Netflix · Disney+ · Prime Video · Spotify · Twitch**

### 平台与生态
**Apple 中国大陆服务 · Apple 国际服务 · iCloud · Apple Private Relay · Apple Intelligence · GitHub**

### 账户敏感场景
**虚拟货币 · 美国银行 · 美股 / 券商**

此外包含 **中国大陆直连** 与 **私有网络直连** 基础规则。

→ [查看场景与规则说明](docs/scenes.md)

## DNS

Hrules 当前不接管 Mihomo 主配置中的 DNS；DNS 仍由用户现有配置负责。这里提供 DNS 与分流协同的使用说明和排查原则：路由规则决定请求最终走 DIRECT 还是代理场景，DNS 负责域名解析路径。

→ [DNS 规则说明](docs/dns.md)

## 3X-UI Remote Routing

3X-UI 使用独立的 Standard / Stable / Strict Remote Routing 文件，并通过 `include-all-proxies` 读取 3X-UI 最终配置中的真实节点 inventory，而不是使用固定模板节点。

→ [进入 Mihomo / 3X-UI 安装中心](docs/kernels/mihomo.md#3x-ui--remote-routing)

## 推荐服务

- **推荐机场** — [查看推荐与适用场景](docs/recommended-services.md)
- **推荐 VPS** — [查看 VPS 推荐与用途](docs/recommended-services.md)

如页面包含联盟链接、优惠码或赞助合作，会明确标注。

## Documentation

- [开始使用](docs/getting-started.md)
- [安装与客户端说明](docs/install.md)
- [Mihomo 安装中心](docs/kernels/mihomo.md)
- [Shadowrocket 配置安装](docs/clients/shadowrocket.md)
- [路由模式：Standard / Stable / Strict](docs/routing-modes.md)
- [场景与规则](docs/scenes.md)
- [DNS 规则](docs/dns.md)
- [第三方 / 机场 Integration Contract](docs/integration-contract.md)
- [隐私与安全边界](docs/security.md)
- [版本与发布策略](docs/releases.md)
- [商务合作与私人定制](docs/business.md)

---

**Hrules = 路由层。机场 / 自建节点 / 其他节点来源 = 节点层。**
