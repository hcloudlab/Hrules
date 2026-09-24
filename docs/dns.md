# DNS 与分流

DNS 与代理路由是两个不同层面：路由规则决定请求最终进入 DIRECT、代理或具体场景；DNS 决定域名通过什么解析路径得到地址。

## 当前边界

Hrules 当前**不会**向 Mihomo 主配置注入 `dns:`、nameserver 或 DNS 路由设置。DNS / TUN / 端口等运行时配置继续由客户端或 Host 配置负责。

因此，对于 Mihomo，本页是使用与排查指导，不代表安装 Hrules 后 DNS 已被自动修改。

## Shadowrocket v0.1

Shadowrocket 与 Mihomo 的交付方式不同。Hrules 的 Shadowrocket v0.1 是完整远程配置，因此包含客户端运行所需的 DNS 基线：

- `dns-server = https://223.5.5.5/dns-query,https://1.12.12.12/dns-query`
- `direct-dns-server = 223.5.5.5,119.29.29.29`
- `fallback-dns-server = system`
- `dns-direct-system = false`
- `dns-direct-fallback-proxy = true`
- IPv6 默认关闭

同时不默认加入 `skip-proxy` 或 `proxy-dns-server`，`always-real-ip` 只保留窄范围兼容条目。

这些参数属于 Shadowrocket v0.1 的客户端基线，不代表 Mihomo 也采用相同 DNS 方案。

## 使用原则

1. 中国大陆域名使用适合大陆网络环境的解析路径。
2. 需要代理的国际服务应避免 DNS 路径破坏实际分流结果。
3. DNS 配置必须与客户端能力匹配，不同客户端不能直接复用同一份语法。
4. 最终验证以实际 Connections / 请求命中与出口为准。

## 排查顺序

遇到“节点能测速但网站打不开”时，依次确认：

`域名解析 → 规则命中 → 策略组 → 最终节点 → 实际出口`
