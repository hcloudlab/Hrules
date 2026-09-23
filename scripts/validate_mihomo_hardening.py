#!/usr/bin/env python3
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
errors = []
editions = [ROOT / "mihomo" / "editions" / f"hrules-{e}.js" for e in ("standard", "stable", "strict")]
adapter_path = ROOT / "mihomo" / "adapters" / "clash-verge-rev" / "hrules-global.js"

for p in editions + [adapter_path]:
    s = p.read_text(encoding="utf-8")
    if 'sceneGroup("📺 YouTube [场景]"' in s or 'name:"📺 YouTube [场景]"' in s:
        errors.append(f"{p.name}: emits stale YouTube group")
    for x in ("const sceneGroup", "MATCH,🚀 漏网之鱼 [自选]", "exclude-filter", "DIRECT,no-resolve"):
        if x not in s:
            errors.append(f"{p.name}: missing {x}")
    if p in editions:
        for x in ("hrules-network-test", "📺 影音媒体 [场景]", "🏦 美国账户 [场景]"):
            if x not in s:
                errors.append(f"{p.name}: missing {x}")
    if "proxies:[]" in s or "#null" in s:
        errors.append(f"{p.name}: unsafe empty/null token")

for e in ("stable", "strict"):
    s = (ROOT / "mihomo" / "editions" / f"hrules-{e}.js").read_text(encoding="utf-8")
    for x in (
        'sceneCandidates(["us","jp","sg","tw","kr","gb","de"],["hk"])',
        'sceneCandidates(["jp","sg","hk","tw","kr"],["us"])',
        'sceneCandidates(["us"])',
    ):
        if x not in s:
            errors.append(f"{e}: missing scene-aware contract {x}")

standard = (ROOT / "mihomo" / "editions" / "hrules-standard.js").read_text(encoding="utf-8")
if "const stableCandidates" not in standard:
    errors.append("standard: missing manual-first sensitive candidates")

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
