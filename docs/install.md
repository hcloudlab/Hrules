# 安装指南

## Clash Verge Rev（推荐）

适用于已经有机场订阅或其他 Mihomo 配置的用户。

1. 打开 [Mihomo 安装中心](kernels/mihomo.md)，明确选择 Standard / Stable / Strict。
2. 复制安装中心中对应版本的 Global Extension Script。
3. 在 Clash Verge Rev 中打开 **Global Extension Script / 全局扩展脚本**。
4. 粘贴、保存，然后重新激活当前配置。
5. 在代理组页面确认出现 Hrules 系统组和场景组。
6. 在 Rule Provider 页面确认 Hrules Providers 已加载。
7. 用 Connections 页面检查实际请求是否命中预期 Hrules 场景。

> **Provider-only 限制：** 如果当前配置只有 \`proxy-providers\`、没有可见的顶层 \`proxies\`，请使用 Standard / Stable，**不要使用 Strict**。Strict 的敏感场景需要可见的具体节点候选。

Hrules 不替换你的订阅。之后仍按原来的方式更新机场订阅。

### 地区识别限制

全局脚本采用节点名称进行保守分类。名称中没有可靠地区信息的节点会进入“未分类”。如果你需要更强的 GeoIP/精确节点编排，应使用自己的完整 Mihomo 配置集成公共 Hrules providers，而不是依赖名称猜测。

## 3X-UI Remote Routing

使用公共文件 \`mihomo/hosts/3x-ui.yaml\` 作为 Remote Routing 配置。

该路径通过 Mihomo 的 \`include-all-proxies\` 读取 3X-UI 最终配置中的真实节点，同时保留 \`PROXY\` / \`DIRECT\` 作为显式回退。2026-09-21 真机验收已确认场景组可直接显示面板生成的具体节点。

## 验证原则

不要只看当前选中了哪个节点。以 Connections 中的实际链路为准：

\`域名/请求 → 命中规则 → Hrules 场景 → 策略组链路 → 最终节点\`
