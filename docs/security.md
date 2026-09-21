# 隐私与安全边界

Hrules 是路由规则层，不是代理节点服务。

## 不收集的内容

公共 Hrules 仓库和 Rule Providers 不需要用户提交：
- 订阅 URL
- UUID / 密码 / Private Key
- 节点服务器凭据
- 机场账户信息

Clash Verge Rev Global Extension Script 在客户端本地读取当前运行配置，用于建立策略拓扑。

## 第三方服务

使用某个 Hrules 场景并不意味着 Hrules 能保证第三方服务不会封号、触发风控，或保证某个地区具备服务资格。Hrules 只控制符合规则的流量被送往哪个策略场景。

## 报告问题

公开 issue 或日志前，请删除订阅 URL、Token、UUID、密码、服务器私密信息和其他凭据。复现问题优先提供脱敏后的节点名称、命中规则、策略组链路和客户端版本。
