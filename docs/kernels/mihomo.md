# Mihomo 安装中心

## 选择客户端 / 接入方式

先根据你的节点来源和客户端使用方式选择接入路径，再选择 **标准 / 稳定 / 严格** 对应链接。

## 选择 Hrules 版本

Hrules 的核心原则是 **安全、可控**。三个版本共用同一套 Hrules Core 和规则基础，**安全性完全相同**；区别不是安全等级，而是场景归类的颗粒度，以及你能多精确地掌控哪个节点用在哪条线路上。

> **Standard 更简单，Stable 更细化，Strict 更精准；三者安全性完全相同，区别是你能更精确地掌控哪个节点用在哪条线路上。**

| 版本 | 场景颗粒度 | 适合谁 |
| --- | --- | --- |
| 🟢 **标准 Standard** | 基础场景：AI、影音、Telegram、漏网之鱼 | 普通上网用户；保留完整 Core 规则覆盖，但把细分规则归并到少量常用场景，减少日常选择复杂度 |
| 🟡 **稳定 Stable** | 细化场景：在基础场景上拆出 Claude / OpenAI、虚拟货币、美国账户等 | 希望针对不同实际用途分别指定地区或具体节点的用户 |
| 🔴 **严格 Strict** | 精准场景：继续细分美国银行、美股 / 券商、金融账户等 | 希望把不同业务线路分别控制到更具体出口的用户；同时由 Strict 接管最终 MATCH / FINAL |

**版本变化的是场景映射，不是 Core 安全性。** 例如 Standard 不删除 Claude / OpenAI、虚拟货币、银行、券商、金融账户等 Core 规则，而是把这些规则统一归入 `🤖 AI 服务 [场景]`；Stable / Strict 再把同一批规则拆成更具体的用户可控场景。

### 地区与节点怎么选

三个版本的 Hrules 场景出口都遵循同一套控制原则：

- 选择 **地区**：例如 `🇺🇸 美国 [地区]`，Hrules 允许在美国节点范围内自动选择，但不会自动切换到日本、新加坡、香港等其他地区。
- 选择 **具体节点**：例如 `🇺🇸 美国2`，该场景直接使用这个节点；Hrules 不再替你自动切换到其他节点。
- **机场原有代理组不会被删除**：Hrules 是叠加在现有订阅之上的路由层，不破坏机场原本提供的自动选择、故障转移、负载均衡等代理组。

> 普通上网、希望界面简单，先用 **Standard**；需要把不同重要用途分别指定出口，用 **Stable**；需要进一步拆分具体业务线路，用 **Strict**。

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
