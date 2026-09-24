# Hrules 产品架构

`Client → Kernel → Edition → Integration`

## Client

README 面向用户，按实际客户端分类，例如 Clash Verge Rev、Shadowrocket、SFM、v2rayN、Karing。

## Kernel

实际规则产物按内核维护，例如 Mihomo、sing-box、Xray。多个客户端可以共享同一内核实现。

## Edition

Mihomo 公共产品当前收敛为两种 Edition：

- **Standard / 标准版**：面向公开实用，把完整 Core 映射为少量高价值场景。
- **Fine-grained / 精细版**：使用同一套 Core，但暴露更多独立出口控制点，尤其是 Apple / iCloud 与金融业务细分。

Edition 不是安全等级，也不代表规则覆盖多少。两种模式共享同一套 Core；差异是用户能独立控制的场景粒度。

精细版为兼容既有 Raw URL，当前仍沿用 `hrules-strict.js` / `hrules-strict.yaml` 文件名。

## Integration

同一内核与 Edition 可以派生不同接入产物。Clash Verge Rev 使用订阅扩展脚本；3X-UI 使用 Remote Routing YAML；其他 Mihomo / Clash Meta 客户端根据其能力使用完整 YAML、覆写 / Mixin、Rule Provider 或 Adapter。

原则：**Rules 与 Scenes 只维护一次；Edition 定义场景映射与出口控制粒度；Integration 只负责把同一产品语义交付给不同宿主。**
