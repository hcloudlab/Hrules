#!/usr/bin/env python3
"""Edition inheritance contract checks for Hrules Mihomo outputs."""
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]

EDITIONS = ("standard", "stable", "strict")
SCENES = (
    "sensitive_ai",
    "crypto_account",
    "us_banking_account",
    "brokerage_account",
    "financial_account",
    "telegram",
    "general_ai",
    "youtube_media",
    "cn_direct",
    "private_direct",
    "network_test",
)

errors = []

def read(path):
    return (ROOT / path).read_text(encoding="utf-8")

def require(text, token, where):
    if token not in text:
        errors.append(f"{where}: missing {token}")

def forbid(text, token, where):
    if token in text:
        errors.append(f"{where}: unexpected {token}")

for edition in EDITIONS:
    js = read(f"mihomo/editions/hrules-{edition}.js")
    host = read(f"mihomo/hosts/3x-ui/hrules-{edition}.yaml")
    for scene in SCENES:
        require(js, f"hrules-{scene.replace('_','-')}", f"{edition} js")
        require(host, f"hrules-{scene.replace('_','-')}", f"{edition} 3x-ui")

# Standard keeps the same Core coverage but collapses proxy-bound scenes into AI.
standard_js = read("mihomo/editions/hrules-standard.js")
standard_host = read("mihomo/hosts/3x-ui/hrules-standard.yaml")
for text, where in ((standard_js, "standard js"), (standard_host, "standard 3x-ui")):
    for scene in ("sensitive-ai", "crypto-account", "us-banking-account", "brokerage-account", "financial-account", "general-ai"):
        require(text, f"RULE-SET,hrules-{scene},🤖 AI 服务 [场景]", where)

# Stable keeps Claude/OpenAI and crypto separate; US financial scenes share one group.
stable_js = read("mihomo/editions/hrules-stable.js")
stable_host = read("mihomo/hosts/3x-ui/hrules-stable.yaml")
for text, where in ((stable_js, "stable js"), (stable_host, "stable 3x-ui")):
    require(text, "RULE-SET,hrules-sensitive-ai,🔐 Claude / OpenAI [场景]", where)
    require(text, "RULE-SET,hrules-general-ai,🤖 AI 服务 [场景]", where)
    require(text, "RULE-SET,hrules-crypto-account,💰 虚拟货币 [场景]", where)
    for scene in ("us-banking-account", "brokerage-account", "financial-account"):
        require(text, f"RULE-SET,hrules-{scene},🏦 美国账户 [场景]", where)

# Strict keeps banking, brokerage and general financial scenes independently selectable.
strict_js = read("mihomo/editions/hrules-strict.js")
strict_host = read("mihomo/hosts/3x-ui/hrules-strict.yaml")
strict_targets = {
    "crypto-account": "💰 虚拟货币 [场景]",
    "us-banking-account": "🏦 美国银行 [场景]",
    "brokerage-account": "📈 美股 [场景]",
    "financial-account": "💳 金融账户 [场景]",
}
for text, where in ((strict_js, "strict js"), (strict_host, "strict 3x-ui")):
    for scene, target in strict_targets.items():
        require(text, f"RULE-SET,hrules-{scene},{target}", where)

# Telegram remains explicit in every edition.
for text, where in ((standard_js, "standard js"), (standard_host, "standard 3x-ui"), (stable_js, "stable js"), (stable_host, "stable 3x-ui"), (strict_js, "strict js"), (strict_host, "strict 3x-ui")):
    require(text, "RULE-SET,hrules-telegram,💬 Telegram [场景]", where)

# Aggregate group must exist only where used, while Strict knows how to remove
# stale lower-edition topology when users switch editions.
forbid(standard_js, 'sceneGroup("🏦 美国账户 [场景]"', "standard js")
require(stable_js, 'sceneGroup("🏦 美国账户 [场景]"', "stable js")
require(strict_js, '"🏦 美国账户 [场景]"', "strict js legacy cleanup set")
forbid(standard_host, "- name: 🏦 美国账户 [场景]", "standard 3x-ui")
require(stable_host, "- name: 🏦 美国账户 [场景]", "stable 3x-ui")
forbid(strict_host, "- name: 🏦 美国账户 [场景]", "strict 3x-ui")

if errors:
    print("\n".join(errors), file=sys.stderr)
    raise SystemExit(1)

print("Hrules edition inheritance contracts: PASS")
