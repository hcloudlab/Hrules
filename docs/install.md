# 安装指南

## Clash Verge Rev（推荐）

适用于已经有机场订阅或其他 Mihomo 配置的用户。

1. 打开公共文件 \`mihomo/adapters/clash-verge-rev/hrules-global.js\`。
2. 复制完整脚本内容。
3. 在 Clash Verge Rev 中打开 **Global Extension Script / 全局扩展脚本**。
4. 粘贴、保存，然后重新激活当前配置。
5. 在代理组页面确认出现 Hrules 系统组和场景组。
6. 在 Rule Provider 页面确认 Hrules Providers 已加载。
7. 用 Connections 页面检查实际请求是否命中预期 Hrules 场景。

Hrules 不替换你的订阅。之后仍按原来的方式更新机场订阅。

### 地区识别限制

全局脚本采用节点名称进行保守分类。名称中没有可靠地区信息的节点会进入“未分类”。如果你需要更强的 GeoIP/精确节点编排，应使用自己的完整 Mihomo 配置集成公共 Hrules providers，而不是依赖名称猜测。

## 3X-UI Remote Routing

使用公共文件 \`mihomo/hosts/3x-ui.yaml\` 作为 Remote Routing 配置。

该路径把场景连接到 3X-UI 的共享 \`PROXY\` / \`DIRECT\`。它不会读取 3X-UI 面板中的具体节点清单，因此适合共享出口策略，不适合要求“某场景固定到某一个具体节点”的配置。

## 验证原则

不要只看当前选中了哪个节点。以 Connections 中的实际链路为准：

\`域名/请求 → 命中规则 → Hrules 场景 → 策略组链路 → 最终节点\`
