# Shadowrocket 配置安装

> Shadowrocket 入口已恢复。该客户端与 Mihomo 的配置格式不同，因此不要直接导入 Mihomo YAML / JS。

## 使用方式

Shadowrocket 用户应使用 Hrules 为 Shadowrocket 提供的规则配置入口，将 Hrules 作为分流规则层使用；机场订阅或自建节点仍由 Shadowrocket 自己管理。

Hrules 的基本模型保持一致：

`请求 → 规则 → 策略 → 节点`

对于 Claude / OpenAI、Apple / iCloud、银行、证券和虚拟货币等对出口一致性更敏感的场景，建议在 Shadowrocket 中将对应策略指向明确、稳定的节点，而不是依赖可能跨地区漂移的自动选择。

## DNS

Shadowrocket 的 DNS 设置与 Mihomo 配置格式不同。不要把 Mihomo 的 `dns:` YAML 直接复制到 Shadowrocket。

Hrules 后续会继续维护 Shadowrocket 专用的 DNS / 分流适配说明。

## 验证

导入或更新配置后，至少确认：

1. 国内常用站点按预期直连。
2. 国际服务按预期进入代理策略。
3. Claude / OpenAI 等敏感场景命中指定策略。
4. Apple / iCloud 使用场景符合你的 Apple Account 与网络环境。
5. 实际出口 IP 与所选节点一致。

> 本页是 Shadowrocket 的公共安装入口。具体配置文件和一键导入链接应以 Hrules 公共仓库实际发布的 Shadowrocket 工件为准；不存在的工件不会在这里伪造链接。
