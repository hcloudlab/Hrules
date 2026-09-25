# Shadowrocket v0.1

Hrules 的 Shadowrocket 版本提供一份可直接导入的完整远程配置，当前状态为 **Validating**。

> Validating 表示当前 Core 规则生成、Release Gate 与公共发布链已经恢复并通过自动验证，但最新版本尚未完成最终真实客户端验收。真机验收完成前不会标记为 Available。

## 导入

配置文件：

```text
https://raw.githubusercontent.com/hcloudlab/Hrules/main/shadowrocket/hrules.conf
```

在 Shadowrocket 中通过远程配置导入，并关闭 **简单模式**。简单模式可能绕过配置中的规则行为，使 PROXY 请求使用与预期不同的节点。

Shadowrocket v0.1 当前采用 **DIRECT / PROXY** 两类路由结果，不复制 Mihomo 的标准 / 稳定 / 严格三套策略组。需要代理的场景最终使用 Shadowrocket 当前选择的主节点，因此节点地区、固定出口等要求仍由用户选择的节点决定。

## 当前覆盖

配置由 Hrules Core 当前 canonical rules 自动生成，覆盖：

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
- 不默认加入 `skip-proxy`
- 不默认加入 `proxy-dns-server`
- `always-real-ip` 只保留必要的窄范围条目，不使用全局通配
- 不通过全局 UDP/443 规则强制关闭 QUIC

这些设置属于 Shadowrocket 客户端运行基线，与 Mihomo 的 DNS 配置方式不同。

## 路由尾部

在 Hrules 明确场景规则之后，配置继续使用 Shadowrocket 原生远程规则作为通用兜底：

1. Google → PROXY
2. Global → PROXY
3. ChinaMax → DIRECT
4. `.cn` → DIRECT
5. GEOIP CN → DIRECT
6. FINAL → PROXY

Hrules 的显式场景规则位于这些通用规则之前，避免被宽泛规则提前截获。

## 验证方法

最终真机验收以 Shadowrocket 请求日志为准：

`域名 / 请求 → 命中规则 → DIRECT / PROXY → 最终节点`

验收重点包括中国大陆直连、Apple 中国区与国际 Apple 分流、AI、YouTube、主流国际服务、DNS 行为，以及 Reality / Hysteria2 节点在加载该配置后的正常连接。

Reality 与具体 Xray-core / Shadowrocket TLS 指纹之间的兼容性属于节点协议兼容问题，不由 Hrules 路由规则本身解决。

## 状态

当前：**🟡 Validating**

完成最终 Shadowrocket 真机验收后，再升级为 **✅ Available**。
