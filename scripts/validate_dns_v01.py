#!/usr/bin/env python3
"""Static contract checks for Hrules Mihomo DNS v0.1 candidates."""
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
DNS = ROOT / "mihomo" / "dns"

COMMON = [
    "enable: true",
    "ipv6: false",
    "enhanced-mode: fake-ip",
    "fake-ip-range: 198.18.0.1/16",
    "default-nameserver:",
    "proxy-server-nameserver:",
    "223.5.5.5",
    "119.29.29.29",
]
FORBIDDEN_ALL = ["respect-rules: true", "geosite:cn", "dhcp://", "- system"]
FORBIDDEN_STANDARD = ["1.1.1.1", "8.8.8.8", "nameserver-policy:", "direct-nameserver:"]
FORBIDDEN_POLICY = ["nameserver-policy:\n"]

errors = []
for edition in ("standard", "stable", "strict"):
    path = DNS / f"hrules-{edition}.yaml"
    text = path.read_text(encoding="utf-8")
    for token in COMMON:
        if token not in text:
            errors.append(f"{edition}: missing {token}")
    for token in FORBIDDEN_ALL:
        if token in text:
            errors.append(f"{edition}: forbidden v0.1 token {token}")
    if edition == "standard":
        for token in FORBIDDEN_STANDARD:
            if token in text:
                errors.append(f"standard: unexpected dependency {token}")
    else:
        for token in ("direct-nameserver:", "https://1.1.1.1/dns-query", "https://8.8.8.8/dns-query"):
            if token not in text:
                errors.append(f"{edition}: missing {token}")
        if "nameserver-policy:\n" in text:
            errors.append(f"{edition}: nameserver-policy must remain gated")

if errors:
    print("\n".join(errors), file=sys.stderr)
    raise SystemExit(1)
print("Hrules DNS v0.1 static contracts: PASS")
