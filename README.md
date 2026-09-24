# Hrules——安全、可控的多客户端、场景化、智能路由分流规则

Hrules 是面向多客户端的场景化分流规则项目。它负责判断流量属于什么场景、应该直连还是代理，并把同一套规则能力适配到不同客户端。

**Hrules = 路由层。机场 / 自建节点 / 其他节点来源 = 节点层。**

## 客户端支持

| 客户端 / 接入方式 | 状态 | 安装 / 下载 |
| --- | --- | --- |
| **Clash Verge Rev** | ✅ Available | [进入安装中心](docs/kernels/mihomo.md#clash-verge-rev) |
| **Mihomo / Clash Meta 客户端** | ✅ Available | [进入安装中心](docs/kernels/mihomo.md) |
| **3X-UI Remote Routing** | ✅ Available | [查看安装说明](docs/install.md#3x-ui-remote-routing) |
| **Shadowrocket** | 🟡 Validating | [进入安装说明](docs/kernels/shadowrocket.md) |
| **sing-box / SFM** | 🧪 Planned | 待开放 |
| **v2rayN / v2rayNG** | 🧪 Planned | 待开放 |
| **Karing** | 🧪 Planned | 待开放 |

只有完成对应客户端真实验收的实现才会标记为 Available。

> Clash / Mihomo 的 Standard / Stable / Strict 三种路由模式不再在 README 重复展开，请直接进入 [Mihomo 安装中心](docs/kernels/mihomo.md) 按客户端和使用场景选择。

## 场景能力

当前公共场景覆盖：

| 代理组 / 场景 | 说明 |
| --- | --- |
| 🔐 **Claude / OpenAI** | Claude、OpenAI 等对出口一致性更敏感的 AI 服务 |
| 🤖 **AI 服务** | 一般 AI 服务统一入口 |
| 📺 **YouTube** | YouTube 视频与相关服务 |
| 💬 **Telegram** | Telegram 通信流量 |
| 💰 **虚拟货币** | 虚拟货币账户与相关服务 |
| 🏦 **美国银行** | 美国银行账户相关服务 |
| 📈 **美股 / 券商** | 券商、证券与美股相关服务 |
| 🌍 **主流国际服务** | TikTok、Instagram、Facebook、WhatsApp、X / Twitter、Discord、Reddit、GitHub、Netflix、Disney+、Prime Video、Spotify、Twitch |
| 🍎 **Apple / iCloud** | 国际 Apple / iCloud 服务 |
| 🧠 **Apple Intelligence / Private Relay** | 单独识别 Apple Intelligence 与 Private Relay |
| 🇨🇳 **中国大陆直连** | 中国大陆服务优先 DIRECT |
| 🏠 **私有网络直连** | 局域网与私有地址 DIRECT |

Apple 中国大陆服务保持 DIRECT 优先，避免被宽泛的国际 Apple 规则提前截获。

> DNS 由客户端 / Host 配置负责。Mihomo 当前不由 Hrules 主配置注入 `dns:`；Shadowrocket v0.1 作为完整远程配置，提供自己的 DNS 基线。

→ [查看场景与规则说明](docs/scenes.md) · [DNS 与分流说明](docs/dns.md)

## 推荐服务

> 以下链接包含推广 / 联盟链接。通过这些链接购买可能为 H云端实验室带来佣金，不影响你的购买价格；请根据自己的实际需求选择。

### 机场

**九云机场**

[https://888.jiuyundl.com/#/register?code=ONhkcjrm](https://888.jiuyundl.com/#/register?code=ONhkcjrm)

### VPS

**搬瓦工 DC9 — $49.99 / 季度**

CN2 GIA＋CMIN2＋联通 Premium，适合重视中国方向线路质量的用户。

[https://bwh81.net/aff.php?aff=82473&a=add&pid=87&billingcycle=quarterly&configoption%5B17%5D=55](https://bwh81.net/aff.php?aff=82473&a=add&pid=87&billingcycle=quarterly&configoption%5B17%5D=55)

### 静态住宅代理 ISP

**Proxy-Seller 静态住宅代理 ISP**

优惠券：`HCLOUD15`

[https://proxy-seller.com/?partner=8Y51DM71OGR26N](https://proxy-seller.com/?partner=8Y51DM71OGR26N)

## 商务合作、1v1 定制

商务合作与 1v1 定制直接联系：

- Email：[hexa46656@gmail.com](mailto:hexa46656@gmail.com)
- Telegram：**@hcloudlab**

### 商务合作内容

- 机场 / VPS / 网络服务商合作
- 软件、客户端、网络工具与相关产品合作
- Hrules 接入与兼容适配
- YouTube 内容合作、赞助与产品实测

### 1v1 定制内容

- 根据机场、自建节点、ISP / 固定 IP 等实际节点环境定制分流方案
- Claude / OpenAI、银行、证券、虚拟货币等敏感场景的出口与规则规划
- Clash Verge Rev / Mihomo / Shadowrocket 等客户端规则与配置调整
- 多节点、地区策略组、固定出口、DIRECT / PROXY / REJECT 等分流结构设计
- 现有配置排查、规则冲突分析与分流结果验证

## 项目状态

当前公共版本：**v0.1.0-rc1**

当前已经完成 **Clash Verge Rev / Mihomo** 多订阅真实客户端验证，以及 **3X-UI Remote Routing** 真实链路验证。**Shadowrocket v0.1 已恢复当前 Core 规则生成与发布链，正在进行最终真实客户端验收，因此暂标记为 Validating。** 其他客户端会在完成实现与真实验收后逐步开放。

`main` 提供持续更新的公共运行时与规则；版本 Tag / Release 提供固定的产品契约快照。

→ [版本与发布策略](docs/releases.md)

## Documentation

- [Mihomo / Clash Verge Rev 安装中心](docs/kernels/mihomo.md)
- [场景与规则](docs/scenes.md)
- [安装与客户端说明](docs/install.md)
- [Shadowrocket v0.1](docs/kernels/shadowrocket.md)
- [DNS 与分流说明](docs/dns.md)
- [第三方 / 机场 Integration Contract](docs/integration-contract.md)
- [隐私与安全边界](docs/security.md)
- [版本与发布策略](docs/releases.md)

---
