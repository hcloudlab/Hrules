# Clash Verge Rev / Mihomo

## Clash Verge Rev

请从 [Mihomo 安装中心](../kernels/mihomo.md) 选择 **Standard / 标准版** 或 **Fine-grained / 精细版**，再把对应 JavaScript 放入目标订阅的 **Subscription Extension Script / 订阅扩展脚本**。

Hrules 会读取当前订阅可见的真实节点，并生成地区组与场景组。选择地区时只在该地区节点内自动选择；选择具体节点时固定使用该节点。

精细版为兼容既有链接，当前继续使用 `hrules-strict.js` 文件名；产品名称统一称“精细版”。

完整步骤与验证方法：

→ [Mihomo 安装中心](../kernels/mihomo.md#clash-verge-rev--订阅扩展脚本)

## 其他 Mihomo / Clash Meta 客户端

Hrules Core 与规则语义相同，但客户端接入位置不一定与 Clash Verge Rev 相同。没有 Subscription Extension Script 的客户端，应使用其支持的完整 YAML、覆写 / Mixin、Rule Provider 或 Adapter。

尚未完成真实客户端验证的接入方式，不作为可直接跟做的正式教程。
