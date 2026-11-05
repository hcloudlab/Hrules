# v2rayN v0.1

Hrules 的 v2rayN 版本是一份可以直接导入 v2rayN「路由设置」的规则集，当前状态为 **🧪 Beta**：规则已通过 Xray 26.10.31 的配置校验和路由命中测试，真实客户端验收进行中。

## 和其他版本的区别

v2rayN 的路由规则只有三个去向：`proxy`（当前选中的节点）、`direct`、`block`，**没有代理组**。

| Hrules 功能 | Clash Verge Rev / Shadowrocket | v2rayN |
| --- | --- | --- |
| 国内直连边界保护 | ✅ | ✅ |
| 敏感流量不回落到 DIRECT | ✅ | ✅ |
| AI / 金融 / 流媒体各自选择出口 | ✅ | ❌ 全部走当前选中的节点 |

> v2rayN 版只负责 **「哪些走代理、哪些直连」**。需要按场景分配不同出口，请使用 Clash Verge Rev 或 Shadowrocket 版本。

## 导入

### 规则集地址

```text
https://raw.githubusercontent.com/hcloudlab/Hrules/main/v2rayn/hrules.json
```

### 步骤

1. 设置 → 路由设置 → **添加规则集**
2. 别名填 `Hrules`，**域名解析策略留空**（跟随全局 `AsIs`）
3. 点 **从订阅 Url 中导入规则**，粘贴上面的地址
4. 确定后，在主界面底部的路由下拉框选择 `Hrules`

更新规则：重新打开这个规则集，再点一次「从订阅 Url 中导入规则」。

## 规则顺序

规则按 Mihomo 版 `mihomo/routing.yaml` 的顺序生成，先匹配的先生效：

1. 局域网 / 私有地址 → 直连
2. 中国大陆域名（Hrules 边界保护列表）→ 直连
3. IP 检测、AI、虚拟货币、银行、券商、支付、流媒体、YouTube、Telegram、Apple、海外应用 → 代理
4. 中国大陆 IP（`geoip:cn`）→ 直连
5. 漏网之鱼（其他所有流量）→ 代理

和 v2rayN 自带的「绕过大陆」相比：

- 国内直连使用 Hrules 自己维护的域名列表，不使用宽泛的 `geosite:cn`，避免把海外服务误判为国内直连。
- 不阻断 UDP 443（QUIC），和 Hrules 其他版本保持一致。

## 推荐配合设置

| 位置 | 设置 |
| --- | --- |
| 路由设置 → 域名解析策略 | `AsIs`（对应 Mihomo 的 `no-resolve`） |
| Core 基础设置 → 流量探测 | 开启，勾选 http / tls / quic，**仅限路由（routeOnly）开启** |

## 已知限制

- 所有代理流量走同一个节点，无法按场景分配出口。
- 当前节点使用 sing-box 内核（如 Hysteria2）时，规则由 v2rayN 转换为 sing-box 格式，该路径尚未完成验收。
- v2rayN 的直连 DNS 默认只对 `geosite:cn` 生效；Hrules 列表中、但不在 `geosite:cn` 里的少数国内域名，会经远程 DNS 解析后再直连，可能解析到较远的 CDN 节点。

## 生成方式

`v2rayn/hrules.json` 由 `scripts/build_v2rayn_v01.py` 从 `mihomo/routing.yaml` 和 `mihomo/scenes/*.yaml` 生成，请勿手动修改。

```bash
python scripts/build_v2rayn_v01.py          # 重新生成
python scripts/build_v2rayn_v01.py --check  # 校验是否与场景文件同步
```
