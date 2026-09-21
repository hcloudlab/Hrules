# Mihomo 安装中心

Hrules 的公共入口按客户端展示，实际产物按**内核**维护。Clash Verge Rev、其他 Mihomo / Clash Meta 前端共享这一套 Mihomo 产品实现。

## 1. 选择 Hrules 版本

| 版本 | 设计目标 | 客户端中的策略拓扑 |
| --- | --- | --- |
| 🟢 Standard / 标准版 | 基础分流、低学习成本 | 最少必要场景组与基础出口选择 |
| 🟡 Stable / 稳定版 | 地区一致性与可用性 | 在标准版上增加地区组、自动选择、同地区故障转移 |
| 🔴 Strict / 严格版 | 重要账户的明确出口控制 | 在稳定版上增加受限出口与重要账户专用策略拓扑 |

三版共享 Canonical Rules / Scenes。差异由产品拓扑定义，不复制维护域名规则。

> 当前 v0.1 RC 已验证的是现有 Mihomo 拓扑。Standard / Stable / Strict 三版产物会在完成生成器与真实客户端验收后逐项标记为 Available。

## 2. 选择客户端 / 接入方式

### Clash Verge Rev

- 机场订阅 / 普通订阅：Global Extension Script
- 3X-UI 自建节点：由同源 Mihomo 产品模型生成 Remote Routing URL
- 完整配置 / 高级用户：Mihomo YAML / Providers

### 其他 Mihomo / Clash Meta 客户端

根据客户端支持能力使用完整 YAML、Providers 或对应 Adapter。

## 3. 单一产品源

Hrules 不为 JS 和 3X-UI 分别维护两套策略逻辑：

\`Canonical Rules + Scenes + Edition Topology → Mihomo Generator → JS / 3X-UI Remote Routing / YAML\`

3X-UI 是派生接入产物，不是独立规则源。
