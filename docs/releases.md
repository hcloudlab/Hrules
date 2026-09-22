# 版本与发布策略

Hrules 将“产品契约版本”和“规则数据更新”分开管理，避免每次域名规则维护都被误解为一次产品升级。

## 当前版本

- 产品版本：\`v0.1.0-rc1\`
- 发布通道：\`rc\`
- Manifest：\`manifest.json\`
- 完整性校验：\`SHA256SUMS\`

## 版本号代表什么

Hrules 使用语义化版本思路管理公共契约：

- **Major**：公共 Scene ID、接入模型或核心行为出现不兼容变化。
- **Minor**：新增兼容能力、客户端/宿主 Adapter、场景或其他向后兼容功能。
- **Patch**：产品代码、文档、Adapter 行为的向后兼容修复。
- **RC**：候选版本。已经进入真实客户端验证，但尚未满足 Stable 的全部发布门槛。

普通 Rule Provider 中的域名补充、证据修正和覆盖维护可以在不改变产品版本的情况下持续发布。用户通过 HTTP Rule Provider 自动获得这些规则数据更新。

## RC → Stable

Stable 不是简单删除 \`-rc\` 后缀。至少需要：

1. 声明范围内的模块满足 Stable publication gate。
2. Canonical / policy / profile / conflict / compiler / topology 测试全部通过。
3. 公共产物通过 Mihomo 语法验证。
4. 支持的用户路径完成真实客户端验收。
5. 公共安装文档、隐私边界和 Integration Contract 与实际行为一致。
6. 不存在对 Private Hrules Core 的用户运行时依赖。

未满足 Stable 门槛的模块或 Profile 必须继续 withheld，不能因为其他模块稳定而自动获得 Stable 标签。

## GitHub Release 与 main

\`main\` 是持续更新的公共运行时通道，Rule Provider URL 保持稳定。

Git Tag 用于标记产品契约的可复现快照。发布流水线会把当前公共树同步到与 Manifest 版本一致的 Tag（例如 \`v0.1.0-rc1\`）。GitHub Release 可在该 Tag 上补充面向用户的发行说明；Tag 本身才是运行时文件的固定快照。

因此：

\`main = 持续规则服务\`

\`tag/release = 产品契约快照\`

## 兼容性原则

第三方和机场集成应优先依赖稳定 Scene ID、公共路径和 Integration Contract，不应依赖 Private Core 的目录结构、测试文件或内部生成器实现。
