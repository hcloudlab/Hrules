#!/usr/bin/env python3
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
p = ROOT / "shadowrocket" / "hrules.conf"
s = p.read_text(encoding="utf-8")
errors = []

def section_lines(name):
    out, active = [], False
    for raw in s.splitlines():
        line = raw.strip()
        if line == f"[{name}]":
            active = True
            continue
        if active and line.startswith("[") and line.endswith("]"):
            break
        if active and line and not line.startswith("#"):
            out.append(line)
    return out

for section in ("General", "Rule"):
    if f"[{section}]" not in s:
        errors.append(f"missing [{section}]")

for forbidden in ("[Proxy]", "[Proxy Group]", "[MITM]", "[URL Rewrite]", "[Script]"):
    if forbidden in s:
        errors.append(f"out-of-scope section present: {forbidden}")

general = section_lines("General")
settings = {}
for line in general:
    if "=" in line:
        key, value = line.split("=", 1)
        settings[key.strip()] = value.strip()

required_general = {
    "dns-server": "https://cloudflare-dns.com/dns-query,https://dns.google/dns-query",
    "direct-dns-server": None,
    "fallback-dns-server": "system",
    "ipv6": "false",
    "update-url": None,
}
for key, expected in required_general.items():
    if key not in settings:
        errors.append(f"missing active [General] setting: {key}")
    elif expected is not None and settings[key].lower() != expected:
        errors.append(f"invalid [General] setting: {key}={settings[key]}")

rules = section_lines("Rule")
normalized = [",".join(x.strip() for x in rule.split(",")) for rule in rules]

if not normalized or normalized[-1] != "FINAL,PROXY":
    errors.append("FINAL,PROXY must be the last rule")
if sum(1 for rule in normalized if rule.startswith("FINAL,")) != 1:
    errors.append("exactly one FINAL rule is allowed")

allowed = ("DOMAIN,", "DOMAIN-SUFFIX,", "DOMAIN-KEYWORD,", "IP-CIDR,", "IP-CIDR6,", "GEOIP,", "RULE-SET,", "FINAL,")
for rule in normalized:
    if not rule.startswith(allowed):
        errors.append(f"unsupported rule syntax: {rule}")
    parts = rule.split(",")
    if parts[0] == "FINAL":
        if parts != ["FINAL", "PROXY"]:
            errors.append(f"invalid FINAL: {rule}")
    elif parts[0] == "RULE-SET":
        if len(parts) < 3 or parts[2] not in ("DIRECT", "PROXY", "REJECT"):
            errors.append(f"invalid RULE-SET policy: {rule}")
    elif len(parts) < 3 or parts[2] not in ("DIRECT", "PROXY", "REJECT"):
        errors.append(f"missing/invalid policy: {rule}")

if len(normalized) != len(set(normalized)):
    errors.append("duplicate routing rules detected")

if settings.get("ipv6", "").lower() == "false" and any(rule.startswith("IP-CIDR6,") for rule in normalized):
    errors.append("IP-CIDR6 rules must not be emitted when ipv6=false")

# CN direct routing must use maintained domain + IP datasets, not only .cn/GEOIP.
cn_required = (
    "RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Shadowrocket/ChinaMax/ChinaMax.list,DIRECT",
)
for rule in cn_required:
    if rule not in normalized:
        errors.append(f"missing maintained CN routing rule: {rule}")

# Shadowrocket v0.1 embeds Hrules scene payloads. Enforce parity so scene updates
# cannot silently leave this adapter stale.
scene_policy = {
    "private_direct.yaml": "DIRECT",
    "sensitive_ai.yaml": "PROXY",
    "crypto_account.yaml": "PROXY",
    "us_banking_account.yaml": "PROXY",
    "brokerage_account.yaml": "PROXY",
    "financial_account.yaml": "PROXY",
    "telegram.yaml": "PROXY",
    "general_ai.yaml": "PROXY",
    "youtube_media.yaml": "PROXY",
}
for filename, policy in scene_policy.items():
    scene = ROOT / "mihomo" / "scenes" / filename
    for raw in scene.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line.startswith("- "):
            continue
        payload = line[2:].strip()
        parts = [x.strip() for x in payload.split(",")]
        kind = parts[0]
        if kind in ("DOMAIN", "DOMAIN-SUFFIX", "DOMAIN-KEYWORD"):
            expected = f"{kind},{parts[1]},{policy}"
        elif kind == "IP-CIDR6" and settings.get("ipv6", "").lower() == "false":
            # Canonical scenes keep IPv6 coverage for other adapters, but this
            # Shadowrocket profile disables IPv6 and must not emit dead IPv6 rules.
            continue
        elif kind == "IP-CIDR":
            expected = f"{kind},{parts[1]},{policy}" + (",no-resolve" if "no-resolve" in parts[2:] else "")
        else:
            errors.append(f"{filename}: unsupported scene rule for Shadowrocket adapter: {payload}")
            continue
        # geetest.com is intentionally not forced through PROXY in Shadowrocket:
        # it is a shared CN verification dependency used outside crypto services.
        if filename == "crypto_account.yaml" and expected == "DOMAIN-SUFFIX,geetest.com,PROXY":
            continue
        if expected not in normalized:
            errors.append(f"{filename}: Shadowrocket parity missing {expected}")

if errors:
    print("Shadowrocket v0.1 validation FAILED")
    for e in errors:
        print(" -", e)
    sys.exit(1)

print(f"Shadowrocket v0.1 validation PASS: {len(rules)} rules")
