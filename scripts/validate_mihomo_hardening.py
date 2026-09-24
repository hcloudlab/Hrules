#!/usr/bin/env python3
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
errors = []
editions = [ROOT / "mihomo" / "editions" / f"hrules-{e}.js" for e in ("standard", "strict")]
adapter_path = ROOT / "mihomo" / "adapters" / "clash-verge-rev" / "hrules-global.js"

for p in editions + [adapter_path]:
    s = p.read_text(encoding="utf-8")
    if 'sceneGroup("📺 YouTube [场景]"' in s or 'name:"📺 YouTube [场景]"' in s:
        errors.append(f"{p.name}: emits stale YouTube group")
    for x in ("const sceneGroup", "MATCH,🚀 漏网之鱼 [自选]", "exclude-filter", "DIRECT,no-resolve"):
        if x not in s:
            errors.append(f"{p.name}: missing {x}")
    if p in editions:
        required = ["hrules-network-test", "📺 流媒体 [场景]"]
        if p.name != "hrules-standard.js":
            required.append("🏦 银行服务 [场景]")
        for x in required:
            if x not in s:
                errors.append(f"{p.name}: missing {x}")
    if "proxies:[]" in s or "#null" in s:
        errors.append(f"{p.name}: unsafe empty/null token")
    if p in editions:
        bootstrap='"proxy-server-nameserver": ["https://223.5.5.5/dns-query","https://1.1.1.1/dns-query","https://8.8.8.8/dns-query"]'
        if bootstrap not in s:
            errors.append(f"{p.name}: missing real-IP proxy hostname bootstrap DNS")
        if '"proxy-server-nameserver": ["223.5.5.5","119.29.29.29"]' in s:
            errors.append(f"{p.name}: stale UDP-only proxy hostname bootstrap DNS")

# Controlled-egress topology contract.
# Every edition must expose only region groups + concrete nodes in Hrules scenes.
# Region automation is bounded to members of that region; global Hrules automatic
# groups and legacy per-region sensitive fallback groups must not be emitted.
for e in ("standard", "strict"):
    s = (ROOT / "mihomo" / "editions" / f"hrules-{e}.js").read_text(encoding="utf-8")
    required = [
        'const sceneCandidates = [...regionNames,...exact];',
        'groups.push({name,type:"url-test",proxies:members,...health,tolerance:50});',
        'groups.push(sceneGroup("🤖 AI 服务 [场景]",sceneCandidates))',
        'groups.push(sceneGroup("📺 流媒体 [场景]",sceneCandidates))',
    ]
    if e != "standard":
        required += [
            'groups.push(sceneGroup("🤖 AI 服务 [场景]",sceneCandidates))',
            'groups.push(sceneGroup("💰 虚拟货币 [场景]",sceneCandidates))',
        ]
    for x in required:
        if x not in s:
            errors.append(f"{e}: missing controlled-egress contract {x}")

# Standard deliberately keeps Core coverage while collapsing user-facing scenes.
standard = (ROOT / "mihomo" / "editions" / "hrules-standard.js").read_text(encoding="utf-8")
for stale in (
    'groups.push(sceneGroup("🤖 AI 服务 [场景]",sceneCandidates))',
    'groups.push(sceneGroup("💰 虚拟货币 [场景]",sceneCandidates))',
    'groups.push(sceneGroup("🏦 银行服务 [场景]",sceneCandidates))',
):
    if stale in standard:
        errors.append(f"standard: unexpectedly emits fine-grained scene {stale}")
for provider in ("hrules-sensitive-ai","hrules-general-ai"):\n    if f"RULE-SET,{provider},🤖 AI 服务 [场景]" not in standard:\n        errors.append(f"standard: {provider} is not mapped into AI scene")\nfor provider in ("hrules-crypto-account","hrules-us-banking-account","hrules-brokerage-account","hrules-financial-account"):\n    if f"RULE-SET,{provider},💳 金融服务 [场景]" not in standard:\n        errors.append(f"standard: {provider} is not mapped into financial scene")
for e in ("standard", "strict"):
    edition_text = (ROOT / "mihomo" / "editions" / f"hrules-{e}.js").read_text(encoding="utf-8")
    for x in (
        'groups.push(mk("🌐 全部节点 [系统]"',
        'groups.push(mk("♻️ 自动选择 [系统]"',
        'groups.push(mk("🛡️ 故障转移 [系统]"',
        'groups.push(mk("⚖️ 负载均衡 [系统]"',
        'groups.push({name:sensitive',
    ):
        if x in edition_text:
            errors.append(f"{e}: stale Hrules global/sensitive automatic group {x}")

adapter = adapter_path.read_text(encoding="utf-8")
for x in ('edition === "strict"', "🏦 美国银行 [场景]", "📈 美股 [场景]", "hrules-financial-account", "💳 金融账户 [场景]"):
    if x not in adapter:
        errors.append(f"global adapter: missing Strict/financial contract {x}")

for p in (ROOT / "mihomo" / "editions" / "hrules-strict.js", adapter_path):
    s = p.read_text(encoding="utf-8")
    for x in ("nonTerminalRules", '["MATCH,🚀 漏网之鱼 [自选]"]'):
        if x not in s:
            errors.append(f"{p.name}: missing Strict terminal ownership {x}")

cn = (ROOT / "mihomo" / "scenes" / "cn_direct.yaml").read_text(encoding="utf-8")
for x in ("mmstat.com", "aliapp.org", "tdum.alibaba.com", "antpcdn.com"):
    if f"DOMAIN-SUFFIX,{x}" not in cn:
        errors.append(f"cn_direct: missing observed account dependency {x}")

fin = (ROOT / "mihomo" / "scenes" / "financial_account.yaml").read_text(encoding="utf-8")
if "DOMAIN,hsbc.edge.sdk.awswaf.com" not in fin:
    errors.append("financial_account: missing HSBC-specific AWS WAF host")
if "DOMAIN-SUFFIX,awswaf.com" in fin:
    errors.append("financial_account: generic awswaf.com capture is forbidden")

if errors:
    print("\\n".join(errors), file=sys.stderr)
    raise SystemExit(1)
print("Hrules Mihomo hardening contracts: PASS")
