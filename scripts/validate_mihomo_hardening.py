#!/usr/bin/env python3
from pathlib import Path
import re, sys
ROOT=Path(__file__).resolve().parents[1]
files=[ROOT/"mihomo"/"editions"/f"hrules-{e}.js" for e in ("standard","stable","strict")]
files.append(ROOT/"mihomo"/"adapters"/"clash-verge-rev"/"hrules-global.js")
errors=[]
for p in files:
 s=p.read_text(encoding="utf-8")
 # Legacy group names are allowed in owned cleanup sets, but must never be emitted.
 if 'sceneGroup("📺 YouTube [场景]"' in s or 'name:"📺 YouTube [场景]"' in s:
  errors.append(f"{p.name}: emits stale YouTube group")
 for x in ("const sceneGroup","MATCH,🚀 漏网之鱼 [自选]","exclude-filter","DIRECT,no-resolve"):
  if x not in s: errors.append(f"{p.name}: missing {x}")
 if "editions" in str(p):
  for x in ("hrules-network-test","📺 影音媒体 [场景]","🏦 美国账户 [场景]"):
   if x not in s: errors.append(f"{p.name}: missing {x}")
 if "proxies:[]" in s or "#null" in s: errors.append(f"{p.name}: unsafe empty/null token")
for e in ("stable","strict"):
 s=(ROOT/"mihomo"/"editions"/f"hrules-{e}.js").read_text(encoding="utf-8")
 for x in ('sceneCandidates(["us","jp","sg","tw","kr","gb","de"],["hk"])','sceneCandidates(["jp","sg","hk","tw","kr"],["us"])','sceneCandidates(["us"])'):
  if x not in s: errors.append(f"{e}: missing scene-aware contract {x}")
s=(ROOT/"mihomo"/"editions"/"hrules-standard.js").read_text(encoding="utf-8")
if 'const stableCandidates' not in s: errors.append("standard: missing manual-first sensitive candidates")
# CVR defaults to Strict, so banking and brokerage must remain independently selectable.\nadapter=(ROOT/"mihomo"/"adapters"/"clash-verge-rev"/"hrules-global.js").read_text(encoding="utf-8")\nfor x in ('edition === "strict"', '🏦 美国银行 [场景]', '📈 美股 [场景]', 'hrules-financial-account', '💳 金融账户 [场景]'):\n if x not in adapter: errors.append(f"global adapter: missing Strict split contract {x}")\n# P0: Strict/CVR terminal ownership must be explicit and singular.
for p in (ROOT/"mihomo"/"editions"/"hrules-strict.js", ROOT/"mihomo"/"adapters"/"clash-verge-rev"/"hrules-global.js"):
 s=p.read_text(encoding="utf-8")
 for x in ("nonTerminalRules", '["MATCH,🚀 漏网之鱼 [自选]"]'):
  if x not in s: errors.append(f"{p.name}: missing Strict terminal ownership {x}")

if errors:
 print("\n".join(errors),file=sys.stderr); raise SystemExit(1)
print("Hrules Mihomo hardening contracts: PASS")
\n# Real-device regression contracts: Taobao dependencies stay deterministic DIRECT;\n# HSBC-specific WAF stays on the financial account scene without capturing all AWS WAF.\ncn=(ROOT/"mihomo"/"scenes"/"cn_direct.yaml").read_text(encoding="utf-8")\nfor x in ("mmstat.com","aliapp.org","tdum.alibaba.com","antpcdn.com"):\n if f"DOMAIN-SUFFIX,{x}" not in cn: errors.append(f"cn_direct: missing observed account dependency {x}")\nfin=(ROOT/"mihomo"/"scenes"/"financial_account.yaml").read_text(encoding="utf-8")\nif "DOMAIN,hsbc.edge.sdk.awswaf.com" not in fin: errors.append("financial_account: missing HSBC-specific AWS WAF host")\nif "DOMAIN-SUFFIX,awswaf.com" in fin: errors.append("financial_account: generic awswaf.com capture is forbidden")\n