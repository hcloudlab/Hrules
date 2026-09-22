# Mihomo 安装中心

## 选择客户端 / 接入方式

先根据你的节点来源和客户端使用方式选择接入路径，再选择 标准 / 稳定 / 严格 对应链接。三种版本的区别请看首页的版本说明。

### Clash Verge Rev — Global Extension Script

适用于机场订阅、普通 Mihomo 订阅等已经在 Clash Verge Rev 中正常使用的配置。

| 版本 | Raw |
| --- | --- |
| 🟢 标准 | [打开 Raw JS](https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/editions/hrules-standard.js) |
| 🟡 稳定 | [打开 Raw JS](https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/editions/hrules-stable.js) |
| 🔴 严格 | [打开 Raw JS](https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/editions/hrules-strict.js) |

打开对应链接后复制完整 JS 内容，粘贴到 Clash Verge Rev 的 Global Extension Script / 全局扩展脚本中。

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
