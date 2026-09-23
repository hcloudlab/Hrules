# Hrules 产品架构

\`Client → Kernel → Edition → Integration\`

## Client

README 面向用户，按实际客户端分类，例如 Clash Verge Rev、Shadowrocket、SFM、v2rayN、Karing。

## Kernel

实际规则产物按内核维护，例如 Mihomo、sing-box、Xray。多个客户端可以共享同一内核实现。

## Edition

每个内核逐步实现三套 Hrules 产品版本：

- Standard：基础分流与最少必要策略组
- Stable：增加地区一致性、自动选择与故障转移
- Strict：增加重要账户专用拓扑和受限出口

## Edition inheritance invariant

The editions are a nested product hierarchy:

`Strict ⊃ Stable ⊃ Standard`

Lower editions may collapse multiple higher-edition scenes into fewer policy groups, reduce automation, and relax exit constraints. They must **not** lose classification coverage. Traffic recognized by Strict must still have an explicit route in Stable and Standard; it may not disappear merely because a specialized group does not exist and then fall through to host `MATCH`.

Current Mihomo collapse contract:

- Standard: `sensitive_ai → 🔐 Claude / OpenAI`; `general_ai → 🤖 AI 服务`; `crypto_account → 💰 虚拟货币`; `us_banking_account + brokerage_account + financial_account → 🏦 美国账户`; media routes to `📺 影音媒体`.
- Stable: the same scene boundaries are retained, with region-consistency preferences added to candidate selection; the three US financial-account scenes remain consolidated under `🏦 美国账户`.
- Strict: sensitive AI, crypto, US banking, brokerage and general financial accounts keep independent groups; media remains under `📺 影音媒体`.

This invariant is enforced by CI for both Clash Verge Rev Global JS and 3X-UI Remote Routing outputs.

## Integration

同一内核与版本可以派生不同接入产物。Mihomo 首先以统一产品模型生成 Global JS，并从同源模型派生 3X-UI Remote Routing / YAML 等接入形式。

原则：**Rules 与 Scenes 只维护一次；Edition 定义策略拓扑；Integration 只负责把同一产品语义交付给不同宿主。**
