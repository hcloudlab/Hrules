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
            errors.append(f"{edition}: nameserver-policy must remain gated in DNS v0.1")



# Standard generated DNS and the static Standard artifact must keep the same
# resolver contract. This prevents documentation/candidate drift from runtime.
standard_yaml = (DNS / "hrules-standard.yaml").read_text(encoding="utf-8")
for token in ("fake-ip-filter-mode: blacklist", "223.5.5.5", "119.29.29.29"):
    if token not in standard_yaml:
        errors.append(f"standard dns artifact: missing {token}")
for forbidden in ("https://1.1.1.1/dns-query", "https://8.8.8.8/dns-query", "direct-nameserver:"):
    if forbidden in standard_yaml:
        errors.append(f"standard dns artifact: unexpected {forbidden}")

# Integration gates.
# All editions own their DNS baseline. Standard is conservative; Stable/Strict
# keep node bootstrap independent while binding overseas DoH to an Hrules group.
standard_js = (ROOT / "mihomo" / "editions" / "hrules-standard.js").read_text(encoding="utf-8")
for token in ('config["dns"] =', '"proxy-server-nameserver"', '"223.5.5.5"', '"119.29.29.29"', '"fake-ip-filter-mode": "blacklist"'):
    if token not in standard_js:
        errors.append(f"standard edition: generated DNS baseline missing {token}")

for edition in ("stable", "strict"):
    js = (ROOT / "mihomo" / "editions" / f"hrules-{edition}.js").read_text(encoding="utf-8")
    for token in ('config["dns"] =', '"proxy-server-nameserver"', '"direct-nameserver"',
                  '"direct-nameserver-follow-policy": false',
                  '"https://1.1.1.1/dns-query#" + dnsProxyGroup',
                  '"https://8.8.8.8/dns-query#" + dnsProxyGroup',
                  '"fake-ip-filter-mode": "blacklist"',
                  'hasSystem("auto")', 'hasSystem("all")',
                  '"♻️ 自动选择 [系统]"', '"🌐 全部节点 [系统]"'):
        if token not in js:
            errors.append(f"{edition} edition: production DNS contract missing {token}")

for edition in ("stable", "strict"):
    data = (DNS / f"hrules-{edition}.yaml").read_text(encoding="utf-8")
    for token in ("fake-ip-filter-mode: blacklist", "direct-nameserver-follow-policy: false",
                  "https://1.1.1.1/dns-query#♻️ 自动选择 [系统]",
                  "https://8.8.8.8/dns-query#♻️ 自动选择 [系统]"):
        if token not in data:
            errors.append(f"{edition} dns artifact: production contract missing {token}")

if errors:
    print("\n".join(errors), file=sys.stderr)
    raise SystemExit(1)
print("Hrules DNS v0.1 static contracts: PASS")
