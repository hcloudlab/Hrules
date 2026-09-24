# Mihomo 安装中心

## 选择客户端 / 接入方式

先根据节点来源和客户端使用方式选择接入路径，再选择 **标准版 / 精细版** 对应链接。

## 选择 Hrules 版本

两种模式共用同一套 Hrules Core。版本变化的是**用户可见场景和出口控制颗粒度**，不是安全等级。

| 版本 | 用户可见场景 | 定位 |
| --- | --- | --- |
| 🟢 **标准 Standard** | 海外应用、流媒体、AI 服务、金融服务、漏网之鱼 | 公开实用版；减少日常选择复杂度 |
| 🔵 **精细 Fine-grained** | 海外应用、流媒体、AI 服务、Apple / iCloud、银行服务、证券 / 券商、支付 / 跨境金融、虚拟货币、漏网之鱼 | Hrules 业务能力展示；也适合需要更细出口控制的用户 |

**标准版映射：** YouTube、Telegram 和普通国际应用归入 `🌐 海外应用`；Claude / ChatGPT / OpenAI 与其他 AI 归入 `🤖 AI 服务`；银行、券商、支付 / 跨境金融、虚拟货币归入 `💳 金融服务`。真正的流媒体服务归入 `📺 流媒体`。

**精细版映射：** AI 不再为了展示而拆分；重点拆分金融业务，并把 Apple / iCloud 独立出来。界面按“海外应用 → 流媒体 → AI → Apple / iCloud → 金融细分类 → 漏网之鱼”排列。

> 精细版当前继续沿用原 `hrules-strict.js` / `hrules-strict.yaml` 文件名，以保持现有 Raw URL 兼容；Stable 不再作为公开产品模式。

### 地区与节点怎么选

两个版本的 Hrules 场景出口都遵循同一套控制原则：

- 选择 **地区**：例如 `🇺🇸 美国 [地区]`，Hrules 允许在美国节点范围内自动选择，但不会自动切换到日本、新加坡、香港等其他地区。
- 选择 **具体节点**：例如 `🇺🇸 美国2`，该场景直接使用这个节点；Hrules 不再替你自动切换到其他节点。
- **机场原有代理组不会被删除**：Hrules 是叠加在现有订阅之上的路由层，不破坏机场原本提供的自动选择、故障转移、负载均衡等代理组。

> 日常使用优先选择 **Standard**；需要展示或使用更细的金融业务出口控制，以及独立 Apple / iCloud 出口时选择 **Fine-grained**。

### Clash Verge Rev — Subscription Extension Script

适用于机场订阅、普通 Mihomo 订阅等已经在 Clash Verge Rev 中正常使用的配置。

| 版本 | Raw |
| --- | --- |
| 🟢 标准 | [打开 Raw JS](https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/editions/hrules-standard.js) |
| 🔵 精细 | [打开 Raw JS](https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/editions/hrules-strict.js) |

打开对应链接后复制完整 JS 内容，粘贴到对应订阅的 **Subscription Extension Script / 订阅扩展脚本** 中。这样 Hrules 只作用于当前订阅，便于同一客户端同时保留原始订阅和不同 Hrules 版本进行对照。

> **精细版说明：** 当前继续沿用原 `hrules-strict.js` 文件名以保持 Raw URL 兼容。

### 3X-UI — Remote Routing

适用于通过 3X-UI 向 Mihomo / Clash Verge Rev 提供自建节点，并使用 Remote Routing 的场景。

| 版本 | Raw |
| --- | --- |
| 🟢 标准 | `https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/hosts/3x-ui/hrules-standard.yaml` |
| 🔵 精细 | `https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/hosts/3x-ui/hrules-strict.yaml` |

> **接入说明：** Clash Verge Rev 的三版 JS 与 3X-UI Remote Routing 共用 Canonical Rules / Scenes。3X-UI Remote Routing 已通过真机验证：`include-all-proxies` 可以读取最终配置中的面板真实节点，因此 标准版 / 精细版的场景选择器可以直接暴露具体节点；`PROXY` / `DIRECT` 继续作为显式回退。

### 其他 Mihomo / Clash Meta 客户端

根据客户端支持能力使用完整 YAML、Providers 或对应 Adapter。
