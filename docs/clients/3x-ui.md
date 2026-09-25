# 3X-UI → Mihomo Remote Routing

3X-UI 使用版本化 Remote Routing 文件。

## 标准版

```text
https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/hosts/3x-ui/hrules-standard.yaml
```
```

## 精细版

```text
https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/hosts/3x-ui/hrules-strict.yaml
```
```

精细版继续沿用 `strict` 文件名，仅用于兼容既有 Raw URL。

这两个文件都通过 `include-all-proxies` 读取 3X-UI 最终配置中的真实节点，并保留 `PROXY` / `DIRECT` 作为显式回退。

完整版本说明、场景结构与验证方法：

→ [Mihomo 安装中心](../kernels/mihomo.md#3x-ui--remote-routing)
