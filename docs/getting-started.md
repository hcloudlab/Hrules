# 开始使用 Hrules

Hrules 不提供节点。开始前，请先准备一个可正常使用的机场订阅、自建节点或其他客户端节点来源。

## 1. 选择客户端

| 客户端 / 接入方式 | 当前状态 | 入口 |
| --- | --- | --- |
| Clash Verge Rev / Mihomo | Available | [Mihomo 安装说明](install.md) |
| 3X-UI → Mihomo Remote Routing | Available | [3X-UI 安装说明](install.md#3x-ui-remote-routing) |
| Shadowrocket | Planned | 尚未公开 |
| sing-box / SFM | Planned | 尚未公开 |
| v2rayN / v2rayNG | Planned | 尚未公开 |
| Karing | Planned | 尚未公开 |

Planned 不代表已经可用。只有通过对应客户端真实验收的实现才会开放。

## 2. 选择路由模式

Hrules 使用三种用户模式：**标准、稳定、严格**。

当前 v0.1 RC 的 Mihomo 场景拓扑已经包含普通场景与敏感场景的不同出口策略；统一的三档模式属于长期公共产品契约，具体客户端映射会随各客户端实现逐步完成。

→ [路由模式说明](routing-modes.md)

## 3. 安装

进入对应客户端的安装说明，完成 Hrules 接入。

→ [安装与客户端说明](install.md)

## 4. 验证

不要只看客户端界面当前选择了哪个节点。验证链路应关注：

\`域名/请求 → 命中规则 → Hrules 场景 → 策略链路 → 最终节点\`

Mihomo / Clash Verge Rev 用户可以直接通过 Connections 页面检查。

## 5. 出现问题

提交问题前，请先删除订阅 URL、Token、UUID、密码、Private Key 和其他凭据。

→ [隐私与安全边界](security.md)
