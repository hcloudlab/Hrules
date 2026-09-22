#!/usr/bin/env python3
from pathlib import Path
import re, sys

p = Path("shadowrocket/hrules.conf")
s = p.read_text(encoding="utf-8")
errors = []

for section in ("[General]", "[Rule]"):
    if section not in s:
        errors.append(f"missing {section}")

for forbidden in ("[Proxy]", "[Proxy Group]", "[MITM]", "[URL Rewrite]", "[Script]"):
    if forbidden in s:
        errors.append(f"out-of-scope section present: {forbidden}")

required_general = (
    "dns-server =", "direct-dns-server =", "proxy-dns-server =",
    "fallback-dns-server =", "ipv6 = false", "update-url ="
)
for item in required_general:
    if item not in s:
        errors.append(f"missing General setting: {item}")

rules = []
in_rule = False
for raw in s.splitlines():
    line = raw.strip()
    if line == "[Rule]":
        in_rule = True
        continue
    if in_rule and line.startswith("["):
        in_rule = False
    if in_rule and line and not line.startswith("#"):
        rules.append(line)

if not rules or rules[-1] != "FINAL,PROXY":
    errors.append("FINAL,PROXY must be the last rule")

allowed = ("DOMAIN,", "DOMAIN-SUFFIX,", "DOMAIN-KEYWORD,", "IP-CIDR,", "IP-CIDR6,", "GEOIP,", "FINAL,")
for rule in rules:
    if not rule.startswith(allowed):
        errors.append(f"unsupported rule syntax: {rule}")
    parts = [x.strip() for x in rule.split(",")]
    if rule.startswith("FINAL,"):
        if parts != ["FINAL", "PROXY"]:
            errors.append(f"invalid FINAL: {rule}")
    elif len(parts) < 3 or parts[2] not in ("DIRECT", "PROXY", "REJECT"):
        errors.append(f"missing/invalid policy: {rule}")

if len(rules) != len(set(rules)):
    errors.append("duplicate routing rules detected")

if errors:
    print("Shadowrocket v0.1 validation FAILED")
    for e in errors:
        print(" -", e)
    sys.exit(1)

print(f"Shadowrocket v0.1 validation PASS: {len(rules)} rules")
