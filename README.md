# Hrules

**Hrules 是一套面向真实使用场景的代理分流规则。**

你继续使用自己的机场订阅、自建节点或其他节点；Hrules 负责解决另一件事：**访问不同服务时，流量到底应该走哪个出口。**

## Hrules 解决什么问题？

很多代理配置只解决“能不能访问”，但实际使用中，同一次登录、同一个网站或同一类账户流量，可能因为规则不完整、默认兜底或自动切换而走向不同节点。

Hrules 重点解决的是：

- **AI 服务出口可控**：ChatGPT / OpenAI、Claude 等请求进入对应 AI 场景，由你指定地区或具体节点。
- **金融账户分开控制**：银行、证券 / 券商、支付 / 跨境金融、虚拟货币可以使用独立出口，避免全部混在一个代理组。
- **避免敏感流量乱飞**：敏感场景不会在用户不知情的情况下回退到 DIRECT、其他地区或其他不可预期出口。
- **国内网站正常直连**：中国大陆流量使用经过边界保护的 DIRECT 规则，避免宽泛规则把海外服务误判为国内直连。
- **机场只负责提供节点，Hrules 负责分流**：启用 Hrules 后，不再让机场原有规则决定最终匹配结果；未命中流量也由 Hrules 自己的兜底场景承接。
- **规则可以持续更新**：服务域名和场景规则通过公共 Rule Provider 维护，规则数据可以独立更新。

> **一句话理解：节点决定“从哪里出去”，Hrules 决定“什么流量从哪个出口出去”。**

### 为什么这在实际使用中很重要？

例如你给 ChatGPT 固定选择了一个美国节点，并不代表所有与 ChatGPT 使用过程相关的请求天然都会走这个节点。主站、登录、WebSocket、静态资源、上传等请求可能涉及不同域名；规则是否完整，决定这些请求最终进入哪个场景和出口。

Hrules 的目标不是承诺绕过平台风控，而是让**已经识别并纳入规则的敏感流量，其路由结果可见、可控、可预期**。

→ [详细了解：Hrules 在实际使用中解决什么](docs/what-hrules-solves.md)

## 选择适合你的接入方式

| 客户端 / 接入方式 | 状态 | 适合场景 |
| --- | --- | --- |
| **Clash Verge Rev** | ✅ Available | 已有机场 / Mihomo / 自建订阅，希望叠加 Hrules |
| **3X-UI 全局路由规则 → Mihomo** | ✅ Available | 使用 3X-UI 向 Mihomo / Clash Verge Rev 下发路由 |
| **Shadowrocket** | ✅ Available | 使用完整远程配置 |
| **v2rayN** | 🧪 Beta | 直连 / 代理分流；可选用同名策略组让 AI、金融、流媒体走固定出口 |

> 后续计划适配 Clash Mi、FlClash、sing-box / SFM、v2rayNG、Karing。完成配置与真实客户端验证后再加入安装中心。

## 安装

### Clash Verge Rev

在目标订阅中打开 **Subscription Extension Script / 订阅扩展脚本**，复制对应 JS 的完整内容，粘贴、保存并重新更新订阅。

- **标准版 Standard：** [打开 / 复制 JS](https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/editions/hrules-standard.js)
- **精细版 Fine-grained：** [打开 / 复制 JS](https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/editions/hrules-strict.js)

标准版适合大多数用户；精细版进一步拆分 Apple / iCloud、银行、证券 / 券商、支付 / 跨境金融、虚拟货币等出口。

→ [Clash Verge Rev / Mihomo 详细说明](docs/kernels/mihomo.md)

### 3X-UI 全局路由规则

**标准版 Standard**
```text
https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/hosts/3x-ui/hrules-standard.yaml
```

**精细版 Fine-grained**
```text
https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/hosts/3x-ui/hrules-strict.yaml
```

把对应 Raw URL 填入 3X-UI 的 **全局路由规则**。

→ [3X-UI / Mihomo 详细说明](docs/kernels/mihomo.md#3x-ui--远程路由)

### Shadowrocket

使用完整远程配置：

```text
https://raw.githubusercontent.com/hcloudlab/Hrules/main/shadowrocket/hrules.conf
```

导入后关闭 **简单模式**。当前提供海外应用、流媒体、AI 服务、金融服务、中国大陆 / 私有网络 DIRECT，以及原生 `FINAL,PROXY` 兜底。

→ [Shadowrocket 详细说明](docs/kernels/shadowrocket.md)

### v2rayN（Beta）

路由规则集：

```text
https://raw.githubusercontent.com/hcloudlab/Hrules/main/v2rayn/hrules.json
```

在 v2rayN 中打开 **设置 → 路由设置 → 添加规则集**，别名填 `Hrules`，点 **从订阅 Url 中导入规则** 并粘贴上面的地址，确定后在主界面底部路由下拉框选择 `Hrules`。

默认所有代理场景都走当前选中的节点。如果想让某类场景走固定出口，在 **配置项 → 添加策略组** 里建一个备注为 `Hrules-AI`、`Hrules-金融` 或 `Hrules-流媒体` 的策略组即可；没有建组的场景会自动回落到当前节点，不会变成直连。

→ [v2rayN 详细说明](docs/kernels/v2rayn.md)

## 场景怎么选？

### 标准版 Standard

`🌐 海外应用 → 📺 流媒体 → 🤖 AI 服务 → 💳 金融服务 → 🚀 漏网之鱼`

适合希望界面简单、只需要控制主要业务出口的用户。

### 精细版 Fine-grained

在海外应用、流媒体和 AI 服务之外，进一步独立：

`🍎 Apple / iCloud → 🏦 银行服务 → 📈 证券 / 券商 → 💳 支付 / 跨境金融 → 💰 虚拟货币`

适合需要分别固定不同敏感业务出口的用户。

> Shadowrocket 当前使用单一配置，不区分 Standard / Fine-grained。

→ [查看场景与规则说明](docs/scenes.md)

## DNS 与分流

DNS 和代理路由不是一回事：**DNS 决定域名如何解析，Hrules 路由规则决定请求最终进入 DIRECT、代理或具体场景。**

当前 Mihomo 接入中，Hrules **不会直接覆盖宿主客户端的整个 DNS 配置**；DNS / TUN / 端口等运行时设置继续由客户端或 Host 负责。Shadowrocket 完整配置则包含对应的客户端 DNS 基线。

遇到“节点能测速，但网站打不开”“规则命中了，但访问仍异常”等问题，应按：

`域名解析 → 规则命中 → 策略组 → 最终节点 → 实际出口`

逐层检查。

→ [查看 DNS 与分流说明](docs/dns.md)

## 使用边界

Hrules **不提供代理节点，也不会改变节点本身的线路、IP、协议能力或网络质量**。

Hrules 负责的是规则识别、场景归类和出口选择。它不能保证第三方平台的账号、认证、风控或地区服务资格，也不能把质量不佳的节点变成高质量线路。

## 文档

- [Hrules 在实际使用中解决什么](docs/what-hrules-solves.md)
- [Clash Verge Rev / 3X-UI 安装说明](docs/kernels/mihomo.md)
- [Shadowrocket 安装说明](docs/kernels/shadowrocket.md)
- [DNS 与分流说明](docs/dns.md)
- [场景与规则](docs/scenes.md)
- [隐私与安全边界](docs/security.md)

---

## 合作与定制

### 机场 / VPS / 网络服务

| 名称 | 主要特点 | 链接 |
| --- | --- | --- |
| **搬瓦工 VPS — DC9** | **CN2 GIA + CMIN2 + 联通 Premium**，面向中国大陆方向提供多运营商优质线路；当前推荐套餐 **$49.99 / 季度**。 | [购买 DC9](https://bwh81.net/aff.php?aff=82473&a=add&pid=87&billingcycle=quarterly&configoption%5B17%5D=55) |
| **DMIT** | **CN2 GIA 顶级线路，国内访问速度一流**。 | [访问 DMIT](https://www.dmit.io/aff.php?aff=20932) |
| **Proxy-Seller ISP** | 静态住宅代理 ISP，价格约 **$3 / 月起**；优惠码 **HCLOUD15**。 | [购买 ISP](https://proxy-seller.com/?partner=8Y51DM71OGR26N) |

> 上述服务与 Hrules 分流规则是两层独立能力：服务商提供节点 / 线路 / 出口 IP，Hrules 负责把不同场景的流量分配到用户选择的出口。价格、套餐和优惠以服务商实际页面为准。

### 商务合作 / 1v1 精准分流定制

**商务合作：** 面向机场 / 代理服务、VPS / 云服务器、网络线路、静态住宅代理 / ISP、网络工具与客户端、开发者工具、AI 服务等相关产品，可沟通产品实测、内容合作、赞助、推广及长期合作。

**1v1 精准分流定制：** 可根据实际需求，为海外电商、自媒体平台、美股 / 证券投资、虚拟货币、AI 服务、海外金融账户等场景设计独立分流规则和出口策略。定制范围以实际能够识别和验证的请求为准，不承诺覆盖第三方网站或应用产生的全部网络请求，也不承诺规避平台风控、账号审核或封禁。

**隐私边界：** 不需要提供账号、密码、验证码、Cookie、Token、私钥等账号凭据，也不接收账户资产或交易信息。

**Email：** hexa46656@gmail.com  
**Telegram：** @hcloudlab
