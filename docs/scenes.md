# 场景与规则

Hrules 使用 Scene / Policy 描述流量用途，再由客户端 Adapter 映射到具体策略拓扑。底层域名规则可以持续更新，不要求用户复制和维护大量单独域名。下表同时包含稳定集成 Scene 与当前客户端内部使用的路由 Policy；第三方兼容性契约以 [Integration Contract](integration-contract.md) 中明确列出的稳定 Scene ID 为准。

## 当前核心路由场景

| Scene / Policy | 场景 |
| --- | --- |
| `sensitive_ai` | Claude / OpenAI 等敏感 AI 服务 |
| `general_ai` | 一般 AI 服务 |
| `youtube_media` | YouTube |
| `mainstream_proxy` | 国际社交、影音与一般国际服务 |
| `apple_global` | Apple / iCloud 国际服务 |
| `crypto_account` | 虚拟货币账户 |
| `us_banking_account` | 美国银行 |
| `brokerage_account` | 美股 / 券商 |
| `cn_direct` | 中国大陆直连 |
| `private_direct` | 私有网络直连 |

## 主流平台覆盖

### 社交与通信
TikTok、Facebook、Instagram、WhatsApp、X / Twitter、Discord、Reddit。

### 影音
YouTube、Netflix、Disney+、Prime Video、Spotify、Twitch。

### AI
OpenAI / ChatGPT、Claude / Anthropic、Gemini，以及一般 AI 服务。

### 平台与生态
Apple 中国大陆服务、Apple 国际服务、iCloud、Apple Private Relay、Apple Intelligence、GitHub。

Apple 不是简单的“全部 DIRECT”或“全部 PROXY”。Hrules 将中国大陆 Apple 服务、国际 Apple / iCloud、Private Relay 和 Apple Intelligence 分层处理，以避免宽泛 Apple 规则覆盖更具体的服务路径。

## 规则优先级

更具体的规则必须先于更宽泛的规则。例如 Apple 中国大陆服务与 Apple Intelligence / Private Relay 的专用路径需要先于宽泛 Apple 国际服务匹配。

## 规则更新

公共 Rule Provider 可以独立于产品版本持续更新。新增或修正服务域名属于规则数据维护，不代表 Hrules 产品契约必须升级。

→ [版本与发布策略](releases.md)
