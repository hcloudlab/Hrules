# Hrules Integration Contract

本文档定义机场、订阅服务、自建面板和第三方客户端与 Hrules 的公共接入边界。

## 1. 责任边界

**Host / Partner 负责：**
- 节点与节点凭据
- 订阅生命周期
- DNS / TUN / 端口等运行时配置
- 原生兜底策略与服务可用性

**Hrules 负责：**
- 公共 Rule Providers
- 场景规则顺序
- 场景/系统策略拓扑
- Hrules 自有组名与公共场景 ID

任何集成都不应要求把用户节点凭据提交给 Hrules。

## 2. 稳定场景 ID

当前公共场景：

| Scene ID | 用途 |
| --- | --- |
| \`sensitive_ai\` | Claude / OpenAI 敏感 AI 场景 |
| \`crypto_account\` | 虚拟货币账户场景 |
| \`us_banking_account\` | 美国银行账户场景 |
| \`brokerage_account\` | 美股 / 券商账户场景 |
| \`general_ai\` | 一般 AI 服务 |
| \`youtube_media\` | YouTube 媒体 |
| \`cn_direct\` | 中国大陆直连 |
| \`private_direct\` | 私有网络直连 |

公共 scene provider 路径：

\`https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/scenes/<scene_id>.yaml\`

## 3. 集成模式

### A. Clash Verge Rev Subscription Extension Script

推荐给普通订阅用户。版本化脚本从当前订阅读取可见真实节点，不要求合作方修改订阅格式。

### B. Host Adapter

宿主可以把 Hrules 场景映射到自己稳定的上游策略组。例如 3X-UI Adapter 使用 \`PROXY\` / \`DIRECT\`。

合作方不应假定 Hrules 会管理其节点。

### C. Native Integration

合作方可以直接消费 Hrules scene providers，并把 Scene ID 映射到自己的策略组体系。宿主保留节点与最终出口控制权。

## 4. 必须保持的行为

- Hrules 场景规则必须位于会提前截获同类流量的通用规则之前。
- 接入层必须明确终态规则所有权，避免出现多个相互冲突的 MATCH / FINAL；当前版本化 Mihomo 产物提供可审计的最终兜底。
- 订阅刷新后，Hrules 接入应可重建或继续存在。
- 不得把机场状态行、流量余额、到期时间、官网提示等伪节点当作真实节点。
- 对敏感场景不得把跨地区自动切换包装成“同地区故障转移”。

## 5. 版本与兼容

当前公共通道为 \`v0.1 RC\`。合作接入应优先依赖稳定 Scene ID 和公开路径，而不是依赖 Hrules 内部构建结构。

重大不兼容变化应通过新的公共契约版本发布；公共运行时不依赖私有 Hrules Core 仓库。

## 6. 验收

第三方集成至少应验证：

1. Hrules providers 可正常下载和更新。
2. Hrules 场景规则位于预期优先级。
3. Host 原有节点与规则仍存在。
4. 实际 Connections 链路命中正确场景和最终节点。
5. Host 订阅刷新后集成仍有效。
6. 不向 Hrules 公共仓库或服务泄露节点凭据。
