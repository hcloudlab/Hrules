# 安装指南

## Clash Verge Rev（推荐）

适用于已经有机场订阅或其他 Mihomo 配置的用户。

1. 打开 [Mihomo 安装中心](kernels/mihomo.md)，选择 **Standard / 标准版** 或 **Fine-grained / 精细版**。
2. 打开目标订阅的 **Subscription Extension Script / 订阅扩展脚本**。
3. 从安装中心打开对应版本的 Raw JS，复制完整内容并粘贴。
4. 保存并重新更新目标订阅。
5. 在代理组页面确认 Hrules 场景组出现，并能读取当前订阅中的真实节点。
6. 在 Rule Provider 页面确认 Hrules Providers 已加载。
7. 用 Connections 页面检查实际请求是否命中预期场景与最终节点。

Hrules 不替换你的订阅。之后仍按原来的方式更新机场订阅。

### 地区识别限制

订阅扩展脚本采用节点名称进行保守地区分类。名称中没有可靠地区信息的节点会进入“未分类”。选择地区时自动选择只发生在该地区内部；选择具体节点时固定使用该节点。

## Shadowrocket（Validating）

Shadowrocket v0.1 使用单一完整远程配置，不跟随 Mihomo 的标准版 / 精细版划分。

1. 打开 [Shadowrocket v0.1 安装说明](kernels/shadowrocket.md)。
2. 通过远程配置导入 Hrules。
3. 关闭 Shadowrocket 的 **简单模式**。
4. 选择你希望 PROXY 流量使用的主节点。
5. 最终验收时通过请求日志确认 `域名 → 命中规则 → DIRECT / PROXY → 最终节点`。

当前配置已进入公共发布链，但仍处于 **Validating**；完成最终真实客户端验收后才会标记为 Available。

## 3X-UI Remote Routing

3X-UI 使用版本化 Remote Routing：

- 标准版：`https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/hosts/3x-ui/hrules-standard.yaml`
- 精细版：`https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/hosts/3x-ui/hrules-strict.yaml`

精细版沿用 `strict` 文件名仅用于兼容既有 Raw URL。

该路径通过 Mihomo 的 `include-all-proxies` 读取 3X-UI 最终配置中的真实节点，同时保留 `PROXY` / `DIRECT` 作为显式回退。真实链路验收已确认场景组可以显示并使用面板生成的具体节点。

## 验证原则

不要只看当前选中了哪个节点。以 Connections 中的实际链路为准：

`域名/请求 → 命中规则 → Hrules 场景 → 策略组链路 → 最终节点`
