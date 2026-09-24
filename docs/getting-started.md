# 开始使用 Hrules

Hrules 不提供节点。开始前，请先准备一个可正常使用的机场订阅、自建节点或其他节点来源。

## 1. 选择客户端 / 接入方式

| 客户端 / 接入方式 | 当前状态 | 入口 |
| --- | --- | --- |
| Clash Verge Rev / Mihomo | Available | [Mihomo 安装中心](kernels/mihomo.md) |
| 3X-UI → Mihomo Remote Routing | Available | [3X-UI Remote Routing](kernels/mihomo.md#3x-ui--remote-routing) |
| Shadowrocket | Available | [Shadowrocket 配置安装](clients/shadowrocket.md) |
| sing-box / SFM | Planned | 尚未公开 |
| v2rayN / v2rayNG | Planned | 尚未公开 |
| Karing | Planned | 尚未公开 |

## 2. 选择路由模式

Hrules 的 Mihomo 路径提供 **Standard / Stable / Strict** 三种模式。

- **Standard**：日常使用，优先可用性。
- **Stable**：减少敏感服务的地区和出口漂移。
- **Strict**：面向银行、证券、虚拟货币等重要账户，强调出口可预测性。

→ [路由模式说明](routing-modes.md)

## 3. 安装

进入对应客户端的安装入口完成 Hrules 接入。Hrules 不替换你的机场订阅或自建节点，节点仍按原来的方式维护和更新。

## 4. DNS

Mihomo 用户同时建议阅读 [DNS 规则说明](dns.md)。节点能连通不代表 DNS 路径一定正确。

## 5. 验证

不要只看客户端当前选择了哪个节点。验证完整链路：

`域名 / 请求 → 命中规则 → Hrules 场景 → 策略组 → 最终节点`

Mihomo / Clash Verge Rev 可通过 Connections 页面检查实际命中；3X-UI Remote Routing 还应确认策略组已经读取真实节点 inventory。

## 6. 出现问题

提交问题前，请删除订阅 URL、Token、UUID、密码、Private Key 和其他凭据。

→ [隐私与安全边界](security.md)
