# Shadowrocket 安装说明

Hrules for Shadowrocket 只提供 **一个完整配置**，不分标准、稳定、严格，也不设置 Full / Lite 等等级。

## 导入

配置地址：

`https://raw.githubusercontent.com/hcloudlab/Hrules/main/shadowrocket/hrules.conf`

在 Shadowrocket 中导入该远程配置后，继续使用你自己的订阅或自建节点。Hrules 只负责 DNS 与路由层，不提供节点，也不会替换你的节点订阅。

## 当前路由结构

1. 私有网络 / 局域网 → DIRECT
2. Hrules 高优先级场景（AI、YouTube、Telegram、Crypto、金融账户等）→ PROXY
3. Shadowrocket 原生海外基础规则 → PROXY
4. 中国大陆基础规则 → DIRECT
5. `DOMAIN-SUFFIX,cn,DIRECT`
6. `GEOIP,CN,DIRECT`
7. `FINAL,PROXY`

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
