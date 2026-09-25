# Mihomo 安装中心

Hrules 在 Mihomo 生态中按不同客户端能力提供对应接入方式。

## Hrules 版本怎么选

Hrules 公共 Mihomo 产品分为 **标准版 / 精细版**。两者使用同一套规则；区别是用户界面里暴露多少独立场景，以及你能把不同业务分别控制到多细的出口。

| 版 本 | 用户可见场景 | 适合谁 |
| --- | --- | --- |
| 🟢 **标准版** | 海外应用、流媒体、AI 服务、金融服务、漏网之鱼 | 大多数用户；界面更简单，适合日常直接使用 |
| 🔵 **精细版** | 海外应用、流媒体、AI 服务、Apple / iCloud、银行服务、证券 / 券商、支付 / 跨境金融、虚拟货币、漏网之鱼 | 需要更细金融出口控制，或希望展示 Hrules 业务识别能力 |

### 标准版场景

界面顺序：

\`🌐 海外应用 → 📺 流媒体 → 🤖 AI 服务 → 💳 金融服务 → 🚀 漏网之鱼\`

主要映射：

- **海外应用**：YouTube、Telegram，以及普通国际应用；标准版中的 Apple / iCloud 也归入这里。
- **流媒体**：Netflix、Disney+、Prime Video、Spotify、Twitch 等真正的流媒体服务。
- **AI 服务**：Claude、ChatGPT / OpenAI、Gemini、Grok、Perplexity 等 AI 服务。
- **金融服务**：银行、证券 / 券商、支付 / 跨境金融、虚拟货币。
- **漏网之鱼**：承接最终未命中的流量。

### 精细版场景

界面顺序：

\`🌐 海外应用 → 📺 流媒体 → 🤖 AI 服务 → 🍎 Apple / iCloud → 🏦 银行服务 → 📈 证券 / 券商 → 💳 支付 / 跨境金融 → 💰 虚拟货币 → 🚀 漏网之鱼\`

精细版**不拆 AI**。它主要把金融业务进一步拆开，并把 Apple / iCloud 独立出来。

> 精细版当前继续沿用原 \`hrules-strict.js\` / \`hrules-strict.yaml\` 文件名，以保持现有 Raw URL 兼容。Stable 不再作为公开产品模式。

## 地区与节点怎么选

两个版本都遵循同一套出口控制原则：

- 选择 **地区**：例如 \`🇺🇸 美国 [地区]\`，Hrules 只允许在这个地区已有节点之间自动选择，不会跨地区切换。
- 选择 **具体节点**：该场景固定走这个节点，Hrules 不再替你自动切换到其他节点。
- **机场原有代理组继续保留**：Hrules 是路由叠加层，不删除机场已有的自动选择、故障转移、负载均衡等代理组。

---

## Clash Verge Rev — 订阅扩展脚本

适合：你已经在 Clash Verge Rev 中正常使用某个机场订阅、Mihomo 订阅或自建订阅，只想给这个订阅叠加 Hrules。

### 1. 选择版本

| 版 本 | Raw JS |
| --- | --- |
| 🟢 标准版 | [打开 Standard Raw JS](https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/editions/hrules-standard.js) |
| 🔵 精细版 | [打开 Fine-grained Raw JS](https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/editions/hrules-strict.js) |

### 2. 在 Clash Verge Rev 中添加

1. 打开目标订阅的 **Subscription Extension Script / 订阅扩展脚本**。
2. 打开上表对应的 Raw JS。
3. 复制完整 JS 内容并粘贴到该订阅的扩展脚本中。
4. 保存并重新更新该订阅。
5. 回到代理组页面，确认 Hrules 场景组已经出现，并能读取当前订阅中的真实节点。

这样 Hrules 只作用于当前订阅，不会把所有订阅强行混在一起，也方便保留原始订阅进行对照。

---

## 3X-UI — 远程路由

适合：你使用 3X-UI 提供自建节点，并通过 远程路由（Remote Routing） 向 Mihomo / Clash Verge Rev 下发路由配置。

### 1. 选择版本
 
🟢 标准版 
```text
https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/hosts/3x-ui/hrules-standard.yaml
``` 
🔵 精细版 
```text
https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/hosts/3x-ui/hrules-strict.yaml
``` 

### 2. 接入说明

把对应 Raw URL 填入 3X-UI 的 Remote Routing。

当前 3X-UI Remote Routing 路径使用 \`include-all-proxies\` 读取最终配置中的真实节点，因此 Hrules 场景选择器可以直接暴露面板实际节点；\`PROXY\` / \`DIRECT\` 继续作为显式回退。

3X-UI 与 Clash Verge Rev 的接入方式不同，但底层使用的是同一套 Hrules / Scenes 和相同的 Standard / 精细版场景映射。

---
