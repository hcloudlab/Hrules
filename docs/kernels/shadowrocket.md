# Shadowrocket 安装说明

Hrules for Shadowrocket 只提供 **一个完整配置**，不分标准、稳定、严格，也不设置 Full / Lite 等等级。

## 导入

配置地址：

`https://raw.githubusercontent.com/hcloudlab/Hrules/main/shadowrocket/hrules.conf`

在 Shadowrocket 中导入该远程配置后，继续使用你自己的订阅或自建节点。Hrules 只负责 DNS 与路由层，不提供节点，也不会替换你的节点订阅。

### 导入后先检查“简单模式”

使用 Hrules 时，请关闭 Shadowrocket 的 **简单模式**。

如果简单模式开启，请求即使命中 `PROXY`，最终节点行为也可能与手动选择的主节点不一致，表现为不同请求自动落到不同节点。遇到“明明固定选择了一个节点，但请求日志里不断切换节点”时，先检查简单模式，而不是先修改 Hrules 规则。

## 当前路由结构

1. 私有网络 / 局域网 → DIRECT
2. Hrules 高优先级场景（AI、YouTube、Telegram、Crypto、金融账户等）→ PROXY
3. Shadowrocket 原生海外基础规则 → PROXY
4. 中国大陆基础规则 → DIRECT
5. `DOMAIN-SUFFIX,cn,DIRECT`
6. `GEOIP,CN,DIRECT`
7. `FINAL,PROXY`

## DNS 设计

Hrules 默认 DNS 采用分层设计：

- 默认上游：Cloudflare DoH + Google DoH，避免默认海外解析继续使用明文 UDP DNS。
- DIRECT 流量：保留 `223.5.5.5` + `119.29.29.29`，用于中国大陆直连域名的本地解析/CDN 行为。
- fallback：`system`，与默认 DoH 上游保持独立。
- 当前不默认启用 `hijack-dns`。DoH 负责加密上游 DNS 传输；DNS 劫持属于另一类行为，没有必要在缺少实际需求时扩大默认配置影响范围。
- 当前 Shadowrocket 配置设置 `ipv6 = false`，因此输出层不再生成 `IP-CIDR6` 规则；IPv6 数据仍保留在 Hrules canonical scenes 中，供启用 IPv6 的其他适配器使用。

DoH 已完成两类真机 A/B 验证：正常运行状态切换，以及 Shadowrocket 完全退出后重新启动的冷启动。两种情况下 Fake-IP 接管、海外代理访问和中国大陆直连访问均正常，未观察到 DNS bootstrap 循环。

## 已验证

已在 Shadowrocket 真机验证：

- Google / Google APIs / gstatic / DoubleClick / Google Analytics 等海外域名正确走 PROXY。
- 淘宝、天猫、阿里云、阿里 CDN、百度等中国大陆域名正确走 DIRECT。
- Reality 与 Hysteria2 节点可配合该配置使用。

> Reality 的实际可用性还受 Shadowrocket 客户端 TLS 指纹设置与 Xray-core 版本兼容性影响，这属于节点 / 客户端兼容层，不属于 Hrules 路由规则本身。

## 验证方法

不要只看当前选中的节点。在 Shadowrocket 请求日志中确认：

`域名 / IP → 命中规则 → DIRECT / PROXY → 最终节点`

国内网站应优先命中 DIRECT；明确需要代理的海外服务应命中 PROXY；其余流量由最终规则兜底。
