#!/usr/bin/env python3
"""Representative Core coverage gate.

This does not try to mirror every upstream domain. It prevents basic supported
services from silently disappearing from Hrules scenes during refactors.
"""
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]

REQUIRED = {
    "sensitive_ai.yaml": [
        "openai.com", "chatgpt.com", "oaiusercontent.com", "oaistatic.com",
        "anthropic.com", "claude.ai", "claude.com", "claudeusercontent.com",
    ],
    "general_ai.yaml": [
        "gemini.google.com", "generativelanguage.googleapis.com",
        "grok.com", "x.ai", "perplexity.ai", "pplx.ai",
        "copilot-proxy.githubusercontent.com",
    ],
    "financial_account.yaml": [
        "paypal.com", "paypalobjects.com", "wise.com", "transferwise.com",
        "payoneer.com", "hsbc.com", "sc.com", "standardchartered.com",
    ],
    "us_banking_account.yaml": [
        "americanexpress.com", "bankofamerica.com", "capitalone.com",
        "chase.com", "citicards.com", "wellsfargo.com",
    ],
    "brokerage_account.yaml": ["interactivebrokers.com", "ibkr.com"],
    "crypto_account.yaml": [
        "binance.us", "bybit.com", "coinbase.com", "kraken.com", "okx.com",
    ],
    "telegram.yaml": ["telegram.org", "t.me", "149.154.160.0/20", "91.108.4.0/22"],
    "youtube_media.yaml": ["youtube.com", "youtu.be", "googlevideo.com", "ytimg.com", "youtubei.googleapis.com"],
    "private_direct.yaml": ["10.0.0.0/8", "100.64.0.0/10", "172.16.0.0/12", "192.168.0.0/16", "fc00::/7"],
}

errors=[]
for filename, needles in REQUIRED.items():
    path=ROOT/"mihomo"/"scenes"/filename
    if not path.exists():
        errors.append(f"missing scene: {filename}")
        continue
    text=path.read_text(encoding="utf-8")
    for needle in needles:
        if needle not in text:
            errors.append(f"{filename}: missing representative coverage {needle}")

if errors:
    print("\n".join(errors), file=sys.stderr)
    raise SystemExit(1)
print("Hrules representative Core coverage: PASS")

# Mature CN routing datasets must be wired into every integration; a bare .cn
# suffix is not an acceptable mainland-China direct-routing implementation.
for edition in ("standard", "stable", "strict"):
    for rel in (f"mihomo/editions/hrules-{edition}.js", f"mihomo/hosts/3x-ui/hrules-{edition}.yaml"):
        text=(ROOT/rel).read_text(encoding="utf-8")
        for needle in ("MetaCubeX/meta-rules-dat/meta/geo/geosite/cn.mrs",
                       "MetaCubeX/meta-rules-dat/meta/geo/geoip/cn.mrs",
                       "RULE-SET,hrules-cn-domain,DIRECT",
                       "RULE-SET,hrules-cn-ip,DIRECT,no-resolve"):
            if needle not in text:
                errors.append(f"{rel}: missing mature CN routing contract {needle}")

if errors:
    print("\n".join(errors), file=sys.stderr)
    raise SystemExit(1)
print("Hrules representative Core coverage: PASS")
