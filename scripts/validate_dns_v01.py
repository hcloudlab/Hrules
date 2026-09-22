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

errors = []
for edition in ("standard", "stable", "strict"):
    path = DNS / f"hrules-{edition}.yaml"
    data = path.read_text(encoding="utf-8")
    active = "\n".join(
        line for line in data.splitlines()
        if not line.lstrip().startswith("#")
    )
    for token in COMMON:
        if token not in active:
            errors.append(f"{edition}: missing active {token}")
    for token in FORBIDDEN_ALL:
        if token in active:
            errors.append(f"{edition}: forbidden v0.1 token {token}")
    if edition == "standard":
        for token in FORBIDDEN_STANDARD:
            if token in active:
                errors.append(f"standard: unexpected dependency {token}")
    else:
        for token in ("direct-nameserver:", "https://1.1.1.1/dns-query", "https://8.8.8.8/dns-query"):
            if token not in active:
                errors.append(f"{edition}: missing active {token}")
        if "nameserver-policy:" in active:
            errors.append(f"{edition}: nameserver-policy must remain gated")

# Guard the integration boundary: DNS v0.1 may prepare a binding candidate but
# must not mutate host-profile DNS in the generated edition yet.
stable_js = (ROOT / "mihomo" / "editions" / "hrules-stable.js").read_text(encoding="utf-8")
if 'config["dns"] =' in stable_js or "config.dns =" in stable_js:
    errors.append("stable edition: DNS ownership enabled before runtime gate")
for token in ('hasSystem("auto")', 'hasSystem("all")', '"♻️ 自动选择 [系统]"', '"🌐 全部节点 [系统]"'):
    if token not in stable_js:
        errors.append(f"stable edition: inventory-aware binding helper missing {token}")

if errors:
    print("\n".join(errors), file=sys.stderr)
    raise SystemExit(1)
print("Hrules DNS v0.1 static contracts: PASS")
