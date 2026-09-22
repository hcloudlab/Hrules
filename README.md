# Hrules

## 多客户端 · 场景化 · 分级路由

## 三种路由模式

| 模式 | 主要目标 | 典型行为 | 典型场景 |
| --- | --- | --- | --- |
| 🟢 **标准** | 可用性与日常体验 | 允许自动选择和常规故障切换 | 普通网页、YouTube / 视频、一般网络服务 |
| 🟡 **稳定** | 尽量保持地区一致 | 优先同地区选择与同地区故障切换 | Claude、ChatGPT、Netflix 等地区敏感服务 |
| 🔴 **严格** | 出口更可预测 | 限制自动漂移，优先明确/固定的允许出口 | 银行、证券 / 券商、虚拟货币等重要账户 |

→ [了解三种路由模式](docs/routing-modes.md)

## 客户端支持

| 客户端 / 接入方式 | 状态 | 安装 / 下载 |
| --- | --- | --- |
| **Clash Verge Rev** | ✅ Available | [进入安装中心](docs/kernels/mihomo.md#clash-verge-rev) |
| **Mihomo / Clash Meta 客户端** | ✅ Available | [进入安装中心](docs/kernels/mihomo.md) |
| **Shadowrocket** | 🧪 Planned | 待开放 |
| **sing-box / SFM** | 🧪 Planned | 待开放 |
| **v2rayN / v2rayNG** | 🧪 Planned | 待开放 |
| **Karing** | 🧪 Planned | 待开放 |

只有完成对应客户端真实验收的实现才会标记为 Available。

## 场景能力

当前公共场景覆盖：

**AI（Gemini / Grok / Perplexity 等）** · **Claude / OpenAI** · **虚拟货币** · **美国银行** · **美股 / 券商** · **金融账户（PayPal / Wise / Payoneer 等）** · **Telegram** · **YouTube** · **中国大陆直连** · **私有网络直连**

→ [查看场景与规则说明](docs/scenes.md)

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

当前已经完成 **Clash Verge Rev / Mihomo** 多订阅真实客户端验证，以及 **3X-UI Remote Routing** 真实链路验证。其他客户端会在完成实现与真实验收后逐步开放。

\`main\` 提供持续更新的公共运行时与规则；版本 Tag / Release 提供固定的产品契约快照。

→ [版本与发布策略](docs/releases.md)

## Documentation

- [路由模式：标准 / 稳定 / 严格](docs/routing-modes.md)
- [场景与规则](docs/scenes.md)
- [安装与客户端说明](docs/install.md)
- [第三方 / 机场 Integration Contract](docs/integration-contract.md)
- [隐私与安全边界](docs/security.md)
- [版本与发布策略](docs/releases.md)
- [推荐服务](docs/recommended-services.md)
- [商务合作与私人定制](docs/business.md)

---

**Hrules = 路由层。机场 / 自建节点 / 其他节点来源 = 节点层。**
