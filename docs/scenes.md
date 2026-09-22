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
| \`cn_direct\` | 中国大陆直连 |
| \`private_direct\` | 私有网络直连 |

Scene ID 是公共集成契约的一部分。底层服务域名和匹配规则可以持续维护，而客户端和第三方集成应尽量依赖稳定 Scene ID，而不是复制内部规则。

## 规则更新

公共 Rule Provider 可以独立于产品版本持续更新。新增或修正某个服务域名通常属于规则数据维护，不意味着 Hrules 产品契约版本必须升级。

→ [版本与发布策略](releases.md)
