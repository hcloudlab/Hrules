# Hrules

## 面向真实使用场景的多客户端分流规则

Hrules 是一套路由规则，用于在现有机场订阅、自建节点或其他节点来源之上，对网络请求进行识别、归类和路由。

Hrules **不提供代理节点，也不会改变节点本身的线路、IP 或协议能力**。它负责把不同服务的请求归入对应场景，再由用户选择地区或具体节点作为出口。

- **选择地区**：在该地区已有节点之间选择，不自动跨地区切换。
- **选择具体节点**：该场景固定使用所选节点。
- **机场原有代理组**：继续保留；Hrules 作为分流层使用。

## 客户端支持

| 客户端 / 接入方式 | 状态 | 安装 |
| --- | --- | --- |
| **Clash Verge Rev** | ✅ Available | [安装说明](#clash-verge-rev) |
| **3X-UI Remote Routing → Mihomo** | ✅ Available | [安装说明](#3x-ui-remote-routing) |
| **Shadowrocket** | ✅ Available | [安装说明](#shadowrocket) |

> 后续计划适配：**Clash Mi、FlClash、sing-box / SFM、v2rayN / v2rayNG、Karing** 等代理客户端。完成配置与真实客户端验证后再加入安装中心。

## 安装中心

### Clash Verge Rev

适合已经在 Clash Verge Rev 中使用机场订阅、Mihomo 订阅或自建订阅，希望直接叠加 Hrules 分流的用户。

**标准版 Standard：** [打开 / 复制 JS](https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/editions/hrules-standard.js)  
**精细版 Fine-grained：** [打开 / 复制 JS](https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/editions/hrules-strict.js)

在目标订阅中打开 **Subscription Extension Script / 订阅扩展脚本**，复制对应 JS 的完整内容，粘贴、保存并重新更新订阅。

<sub>版本怎么选：标准版适合大多数用户，提供海外应用、流媒体、AI、金融服务和漏网之鱼；精细版进一步独立 Apple / iCloud，并拆分银行、证券 / 券商、支付 / 跨境金融、虚拟货币。精细版继续沿用 `hrules-strict.js` 文件名以保持现有链接兼容。</sub>

→ [查看 Clash Verge Rev / Mihomo 详细说明](docs/kernels/mihomo.md)

### 3X-UI 路由规则导入

适合通过 3X-UI 的 **全局路由规则** 向 Mihomo / Clash Verge Rev 下发路由配置。

**标准版 Standard：**
```text
https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/hosts/3x-ui/hrules-standard.yaml
```

**精细版 Fine-grained：**
```text
https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/hosts/3x-ui/hrules-strict.yaml
```

把对应 Raw URL 填入 3X-UI 的 **全局路由规则** 即可。

<sub>版本怎么选：标准版界面更简洁，适合日常使用；精细版提供更细的金融与 Apple / iCloud 出口控制。3X-UI **全局路由规则** 负责路由层，DNS / Sniffer 等运行时配置由最终客户端负责。</sub>

→ [查看 3X-UI / Mihomo 详细说明](docs/kernels/mihomo.md#3x-ui--远程路由)

### Shadowrocket

Shadowrocket 使用一份完整远程配置：

**配置文件：**
```text
https://raw.githubusercontent.com/hcloudlab/Hrules/main/shadowrocket/hrules.conf
```

## Clash verge 分流规则的使用场景

### 标准版 Standard

界面主要提供：

`🌐 海外应用 → 📺 流媒体 → 🤖 AI 服务 → 💳 金融服务 → 🚀 漏网之鱼`

- **海外应用**：YouTube、Telegram、TikTok、Instagram、Facebook、WhatsApp、X / Twitter、Discord、Reddit、GitHub 等。
- **流媒体**：Netflix、Disney+、Prime Video、Spotify、Twitch 等。
- **AI 服务**：Claude、ChatGPT / OpenAI、Gemini、Grok、Perplexity 等。
- **金融服务**：银行、证券 / 券商、支付 / 跨境金融、虚拟货币。
- **漏网之鱼**：承接最终未命中的流量。

### 精细版 Fine-grained

保留海外应用、流媒体和 AI 服务，并独立：

`🍎 Apple / iCloud → 🏦 银行服务 → 📈 证券 / 券商 → 💳 支付 / 跨境金融 → 💰 虚拟货币`

适合需要把不同金融业务或 Apple / iCloud 分配到不同出口的用户。

> Shadowrocket 当前使用单一配置，不跟随上述 Standard / Fine-grained 划分。

→ [查看场景与规则说明](docs/scenes.md)

## Shadowrocket/小火箭 分流规则的使用场景

在 Shadowrocket 中通过远程配置导入，并关闭 **简单模式**。当前提供：

- 🌐 海外应用
- 📺 流媒体
- 🤖 AI 服务
- 💳 金融服务
- 中国大陆 / 私有网络 DIRECT
- `FINAL,PROXY` 原生兜底

<sub>Shadowrocket 当前使用单一配置，不区分标准版 / 精细版；四个场景组可以分别选择现有节点，未命中的代理流量最终交给 Shadowrocket 的 PROXY。</sub>

→ [查看 Shadowrocket 详细说明](docs/kernels/shadowrocket.md)

## DNS 规则

Hrules 在 **Clash Verge Rev / Mihomo** 中提供经过实机验证的 DNS 配置，重点兼顾中国用户常见的机场订阅、自建节点、Reality / Hysteria2、域名节点、IP 节点以及 EdgeTunnel / Cloudflare 优选 IP 等使用方式。

- 节点解析与代理 DNS 分离，避免启动阶段循环依赖。
- 中国大陆 DIRECT 流量使用国内 DNS。
- 精细版海外 DNS 使用加密 DoH。
- Fake-IP 保留局域网域名真实解析，并避免 Fake-IP 地址段误判为 DIRECT。
- 不修改节点的 server、SNI、Host 等传输参数。
- DNS v0.1 默认关闭 IPv6 DNS，优先保证复杂网络环境下的兼容性。

Shadowrocket 使用独立的客户端 DNS 基线，具体配置见安装说明。

→ [查看 DNS 架构说明](docs/dns-architecture-v0.1.md)

## 合作与定制

### 机场 / VPS / 网络服务

| 名称 | 主要特点 | 链接 |
| --- | --- | --- |
| **九云机场** | 价格实惠、性价比较高，适合需要机场订阅和多节点日常代理的用户。 | [注册 / 购买](https://888.jiuyundl.com/#/register?code=ONhkcjrm) |
| **搬瓦工 VPS — DC9** | **CN2 GIA + CMIN2 + 联通 Premium**，面向中国大陆方向提供多运营商优质线路；当前推荐套餐 **$49.99 / 季度**。 | [购买 DC9](https://bwh81.net/aff.php?aff=82473&a=add&pid=87&billingcycle=quarterly&configoption%5B17%5D=55) |
| **DMIT** | **CN2 GIA 顶级线路，国内访问速度一流**。 | [访问 DMIT](https://www.dmit.io/aff.php?aff=20932) |
| **Proxy-Seller ISP** | 静态住宅代理 ISP，价格约 **$3 / 月起**；优惠码 **HCLOUD15**。 | [购买 ISP](https://proxy-seller.com/?partner=8Y51DM71OGR26N) |

> 上述服务与 Hrules 分流规则是两层独立能力：服务商提供节点 / 线路 / 出口 IP，Hrules 负责把不同场景的流量分配到用户选择的出口。价格、套餐和优惠以服务商实际页面为准。

### 商务合作 / 1v1 精准分流定制

**商务合作**

面向与 Hrules、H云端实验室内容方向相关的产品、服务和项目开展合作，包括机场 / 代理服务、VPS / 云服务器、网络线路、静态住宅代理 / ISP、网络工具与客户端、开发者工具、AI 服务等。可沟通产品实测、内容合作、赞助、推广及长期合作。

**1v1 精准分流定制**

面向有明确业务或使用场景、希望对不同网络流量分别控制出口的用户。可根据实际需求，为 **海外电商、自媒体平台、美股 / 证券投资、虚拟货币、AI 服务、海外金融账户** 等场景设计独立分流规则和出口策略。

定制重点不是简单增加域名，而是根据实际使用的服务，对已确认请求进行识别和归类，并按照需求配置 **指定地区或指定节点**。

定制范围以实际能够识别和验证的请求为准，不承诺覆盖第三方网站或应用产生的全部网络请求，也不承诺规避平台风控、账号审核或封禁。

**隐私边界**

1v1 定制**不需要提供账号、密码、验证码、Cookie、Token、私钥等账号凭据，也不接收账户资产或交易信息**。

**联系方式**

**Email：** hexa46656@gmail.com  
**Telegram：** @hcloudlab

## Documentation

- [Clash Verge Rev / 3X-UI 安装说明](docs/kernels/mihomo.md)
- [Shadowrocket 安装说明](docs/kernels/shadowrocket.md)
- [DNS 与分流说明](docs/dns.md)
- [场景与规则](docs/scenes.md)
- [隐私与安全边界](docs/security.md)

---

**Hrules = 分流规则层。机场 / 自建节点 / 其他节点来源 = 节点层。**
