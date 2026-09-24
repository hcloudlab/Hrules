# Mihomo 安装中心

## 选择客户端 / 接入方式

先根据你的节点来源和客户端使用方式选择接入路径，再选择 **标准 / 稳定 / 严格** 对应链接。

## 选择 Hrules 版本

Hrules 的核心原则是 **安全、可控**。三个版本共用同一套场景规则体系，区别主要在路由控制范围和最终兜底方式；Hrules 自己创建的场景出口尽量保持明确、可审计，不用无边界的自动切换替用户决定出口。

| 版本 | 适合谁 | 路由控制特点 |
| --- | --- | --- |
| 🟢 **标准 Standard** | 日常使用、第一次使用 Hrules | 保留宿主配置原有的最终兜底逻辑；Hrules 场景仍可手动选择地区或具体节点 |
| 🟡 **稳定 Stable** | 希望场景出口更稳定、地区边界更明确的用户 | 场景可选择具体地区或具体节点；选择地区后，自动选择只发生在该地区内部，不跨地区漂移 |
| 🔴 **严格 Strict** | 银行、券商、虚拟货币及其他希望出口更可预测的重要场景 | Hrules 接管最终 MATCH / FINAL；场景出口仍由用户明确选择地区或具体节点，终端路由更可审计 |

### 地区与节点怎么选

Hrules 场景组主要提供两类出口：**具体地区**和**具体节点**。

- 选择 **地区**：例如 `🇺🇸 美国 [地区]`，Hrules 允许在美国节点范围内自动选择，但不会自动切换到日本、新加坡、香港等其他地区。
- 选择 **具体节点**：例如 `🇺🇸 美国2`，该场景直接使用这个节点；Hrules 不再替你自动切换到其他节点。
- **机场原有代理组不会被删除**：Hrules 是叠加在现有订阅之上的路由层，不破坏机场原本提供的自动选择、故障转移、负载均衡等代理组。

> **不知道选哪个版本时，建议先使用 Stable。** 它在可用性和出口可控之间保持较清晰的边界。

### Clash Verge Rev — Subscription Extension Script

适用于机场订阅、普通 Mihomo 订阅等已经在 Clash Verge Rev 中正常使用的配置。

| 版本 | Raw |
| --- | --- |
| 🟢 标准 | [打开 Raw JS](https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/editions/hrules-standard.js) |
| 🟡 稳定 | [打开 Raw JS](https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/editions/hrules-stable.js) |
| 🔴 严格 | [打开 Raw JS](https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/editions/hrules-strict.js) |

打开对应链接后复制完整 JS 内容，粘贴到对应订阅的 **Subscription Extension Script / 订阅扩展脚本** 中。这样 Hrules 只作用于当前订阅，便于同一客户端同时保留原始订阅和不同 Hrules 版本进行对照。

> **严格版前置条件：** 只有当前 Clash Verge Rev 配置暴露具体顶层 `proxies` 节点时，才使用严格版。若订阅配置只有 `proxy-providers`、没有可见的顶层 `proxies`，请不要使用严格版；此时脚本无法枚举 Provider 运行时节点，敏感场景无法建立有效的受限出口候选。可改用 标准 / 稳定，或使用能读取完整 `proxies` 清单的完整配置转换路径。

### 3X-UI — Remote Routing

适用于通过 3X-UI 向 Mihomo / Clash Verge Rev 提供自建节点，并使用 Remote Routing 的场景。

| 版本 | Raw |
| --- | --- |
| 🟢 标准 | `https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/hosts/3x-ui/hrules-standard.yaml` |
| 🟡 稳定 | `https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/hosts/3x-ui/hrules-stable.yaml` |
| 🔴 严格 | `https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/hosts/3x-ui/hrules-strict.yaml` |

> **接入说明：** Clash Verge Rev 的三版 JS 与 3X-UI Remote Routing 共用 Canonical Rules / Scenes。3X-UI Remote Routing 已通过真机验证：`include-all-proxies` 可以读取最终配置中的面板真实节点，因此 标准 / 稳定 / 严格 的场景选择器可以直接暴露具体节点；`PROXY` / `DIRECT` 继续作为显式回退。

### 其他 Mihomo / Clash Meta 客户端

根据客户端支持能力使用完整 YAML、Providers 或对应 Adapter。
