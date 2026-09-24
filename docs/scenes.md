# 场景与规则

Hrules 使用稳定 Scene ID 描述流量用途，再由客户端 Adapter 把场景映射到具体策略拓扑。

## 当前公共场景

| Scene ID | 场景 |
| --- | --- |
| \`sensitive_ai\` | Claude / OpenAI |
| \`general_ai\` | 一般 AI 服务 |
| \`crypto_account\` | 虚拟货币账户 |
| \`us_banking_account\` | 美国银行 |
| \`brokerage_account\` | 美股 / 券商 |
| \`youtube_media\` | YouTube |
| \`mainstream_proxy\`* | TikTok、Instagram、Facebook、WhatsApp、X / Twitter、Discord、Reddit、GitHub、Netflix、Disney+、Prime Video、Spotify、Twitch |
| \`apple_global\`* | 国际 Apple / iCloud |
| \`apple_intelligence_route\`* | Apple Intelligence |
| \`apple_private_relay_route\`* | Apple Private Relay |
| \`cn_direct\` | 中国大陆直连 |
| \`private_direct\` | 私有网络直连 |

不带 `*` 的 Scene ID 属于当前稳定公共集成契约。带 `*` 的项目是当前 Mihomo 产品已经发布并使用的路由 Policy / Scene Provider，但暂不承诺为第三方稳定集成 ID；第三方兼容性以 [Integration Contract](integration-contract.md) 为准。

Apple 中国大陆服务归入 `cn_direct`，必须先于宽泛的 `apple_global` 匹配，避免 `cn.apple.com` 等中国路径被国际 Apple 场景提前截获。底层服务域名和匹配规则可以持续维护。

## 规则更新

公共 Rule Provider 可以独立于产品版本持续更新。新增或修正某个服务域名通常属于规则数据维护，不意味着 Hrules 产品契约版本必须升级。

→ [版本与发布策略](releases.md)
