#!/usr/bin/env python3
from pathlib import Path
import re, sys
ROOT=Path(__file__).resolve().parents[1]
files=[ROOT/"mihomo"/"editions"/f"hrules-{e}.js" for e in ("standard","stable","strict")]
files.append(ROOT/"mihomo"/"adapters"/"clash-verge-rev"/"hrules-global.js")
errors=[]
old=("🔐 重要账户 [场景]","🏦 美国银行 [场景]","📈 美股 [场景]","💳 金融账户 [场景]","📺 YouTube [场景]")
for p in files:
 s=p.read_text(encoding="utf-8")
 for x in old:
  if x in s: errors.append(f"{p.name}: stale group {x}")
 for x in ("const sceneGroup","MATCH,🚀 漏网之鱼 [自选]","exclude-filter","DIRECT,no-resolve"):
  if x not in s: errors.append(f"{p.name}: missing {x}")
 if "editions" in str(p):
  for x in ("hrules-network-test","📺 影音媒体 [场景]","🏦 美国账户 [场景]"):
   if x not in s: errors.append(f"{p.name}: missing {x}")
 if "proxies:[]" in s or "#null" in s: errors.append(f"{p.name}: unsafe empty/null token")
for e in ("stable","strict"):
 s=(ROOT/"mihomo"/"editions"/f"hrules-{e}.js").read_text(encoding="utf-8")
 for x in ('sceneCandidates(["us","jp","sg","tw","kr","gb","de"],["hk"])','sceneCandidates(["jp","sg","hk","tw","kr"],["us"])','sceneCandidates(["us"])','"nameserver-policy"'):
  if x not in s: errors.append(f"{e}: missing scene-aware contract {x}")
s=(ROOT/"mihomo"/"editions"/"hrules-standard.js").read_text(encoding="utf-8")
if 'const stableCandidates' not in s: errors.append("standard: missing manual-first sensitive candidates")
# P0: Strict/CVR terminal ownership must be explicit and singular.
for p in (ROOT/"mihomo"/"editions"/"hrules-strict.js", ROOT/"mihomo"/"adapters"/"clash-verge-rev"/"hrules-global.js"):
 s=p.read_text(encoding="utf-8")
 for x in ("nonTerminalRules", '["MATCH,🚀 漏网之鱼 [自选]"]'):
  if x not in s: errors.append(f"{p.name}: missing Strict terminal ownership {x}")

if errors:
 print("\n".join(errors),file=sys.stderr); raise SystemExit(1)
print("Hrules Mihomo hardening contracts: PASS")
