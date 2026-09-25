# Shadowrocket v0.1

Hrules 的 Shadowrocket 版本提供一份可直接导入的完整远程配置，当前状态为 **✅ Available**。配置已经完成真实客户端验收。

## 导入

### 配置文件：

```text
https://raw.githubusercontent.com/hcloudlab/Hrules/main/shadowrocket/hrules.conf
```

在 Shadowrocket 中通过远程配置导入，并关闭 **简单模式**。简单模式可能绕过配置中的规则行为，使 PROXY 请求使用与预期不同的节点。

Shadowrocket v0.1 当前提供 `🌐 海外应用`、`📺 流媒体`、`🤖 AI 服务`、`💳 金融服务` 四个场景代理组。每个场景组可以从现有节点中独立选择出口；中国大陆与私有网络保持 DIRECT，最终未命中的代理流量使用 `FINAL,PROXY`。Shadowrocket 当前采用单一配置，不区分 Mihomo 的标准版 / 精细版。

## 当前覆盖

当前配置覆盖：

- Claude / OpenAI 与通用 AI
- YouTube
- Telegram
- 虚拟货币、美国银行、美股 / 券商
- TikTok、Instagram、Facebook、WhatsApp、X / Twitter、Discord、Reddit、GitHub
- Netflix、Disney+、Prime Video、Spotify、Twitch
- Apple / iCloud、Apple Intelligence、Private Relay
- 中国大陆与私有网络直连

Apple 中国大陆服务保持 **DIRECT 优先**；Apple Intelligence、Private Relay 与国际 Apple / iCloud 会在更宽泛规则之前完成识别。

## DNS 基线

Shadowrocket v0.1 保留此前真实设备验证过的保守 DNS 基线：

- DoH：AliDNS + DNSPod
- 直连 DNS：223.5.5.5 + 119.29.29.29
- IPv6 默认关闭
- 默认加入局域网 / 私有地址 `skip-proxy`
- `icmp-auto-reply = true`
- 不默认加入 `proxy-dns-server`
- `always-real-ip` 只保留必要的窄范围条目，不使用全局通配
- 不通过全局 UDP/443 规则强制关闭 QUIC

这些设置属于 Shadowrocket 客户端运行基线，与 Mihomo 的 DNS 配置方式不同。

## 路由尾部

在 Hrules 明确场景规则之后，配置继续使用 Shadowrocket 原生远程规则作为通用兜底：

1. Google → 🌐 海外应用
2. Global → 🌐 海外应用
3. ChinaMax → DIRECT
4. `.cn` → DIRECT
5. GEOIP CN → DIRECT
6. FINAL → PROXY

Hrules 的显式场景规则位于这些通用规则之前，避免被宽泛规则提前截获。

## 验证方法

最终真机验收以 Shadowrocket 请求日志为准：

`域名 / 请求 → 命中规则 → 场景组 / DIRECT / PROXY → 最终节点`

验收重点包括中国大陆直连、Apple 中国区与国际 Apple 分流、AI、YouTube、主流国际服务、DNS 行为，以及 Reality / Hysteria2 节点在加载该配置后的正常连接。

Reality 与具体 Xray-core / Shadowrocket TLS 指纹之间的兼容性属于节点协议兼容问题，不由 Hrules 路由规则本身解决。

## 状态

当前：**✅ Available**

已完成场景代理组、真实节点读取、AI / 流媒体 / 海外应用 / 金融分流、中国大陆 DIRECT、局域网访问、DNS / ICMP 基线以及 `FINAL,PROXY` 兜底的真实客户端验收。
