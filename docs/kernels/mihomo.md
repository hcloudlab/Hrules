# Mihomo 安装中心

## 选择客户端 / 接入方式

先根据你的节点来源和客户端使用方式选择接入路径，再选择 Standard / Stable / Strict 对应链接。三种版本的区别请看首页的版本说明。

### Clash Verge Rev — Global Extension Script

适用于机场订阅、普通 Mihomo 订阅等已经在 Clash Verge Rev 中正常使用的配置。

| 版本 | Raw |
| --- | --- |
| 🟢 Standard | [打开 Raw JS](https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/editions/hrules-standard.js) |
| 🟡 Stable | [打开 Raw JS](https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/editions/hrules-stable.js) |
| 🔴 Strict | [打开 Raw JS](https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/editions/hrules-strict.js) |

打开对应链接后复制完整 JS 内容，粘贴到 Clash Verge Rev 的 Global Extension Script / 全局扩展脚本中。

> **Strict 前置条件：** 只有当前 Clash Verge Rev 配置暴露具体顶层 `proxies` 节点时，才使用 Strict。若订阅配置只有 `proxy-providers`、没有可见的顶层 `proxies`，请不要使用 Strict；此时脚本无法枚举 Provider 运行时节点，敏感场景无法建立有效的受限出口候选。可改用 Standard / Stable，或使用能读取完整 `proxies` 清单的完整配置转换路径。

### 3X-UI — Remote Routing

适用于通过 3X-UI 向 Mihomo / Clash Verge Rev 提供自建节点，并使用 Remote Routing 的场景。

| 版本 | Raw |
| --- | --- |
| 🟢 Standard | `https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/hosts/3x-ui/hrules-standard.yaml` |
| 🟡 Stable | `https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/hosts/3x-ui/hrules-stable.yaml` |
| 🔴 Strict | `https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/hosts/3x-ui/hrules-strict.yaml` |

> **接入说明：** Clash Verge Rev 的三版 JS 与 3X-UI Remote Routing 共用 Canonical Rules / Scenes，但宿主能力不同。3X-UI Remote Routing 只能安全绑定宿主提供的 `PROXY` / `DIRECT`，不会发现面板生成的具体节点，因此三版在该接入方式下只区分场景集合，不提供节点级地区组、同地区故障转移或固定节点。需要这些能力时，应使用能读取完整 `proxies` 清单的完整配置转换路径。

### 其他 Mihomo / Clash Meta 客户端

根据客户端支持能力使用完整 YAML、Providers 或对应 Adapter。
