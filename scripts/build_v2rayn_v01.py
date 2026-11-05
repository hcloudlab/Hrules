#!/usr/bin/env python3
"""Build and validate the Hrules v2rayN v0.1 routing rule set.

Source of truth:
  - mihomo/routing.yaml  -> rule order and DIRECT / scene targets
  - mihomo/scenes/*.yaml -> rule payloads

Output:
  - v2rayn/hrules.json   -> JSON array of v2rayN RulesItem objects

v2rayN routing only has three outbounds (proxy / direct / block), so every
Hrules scene group collapses to "proxy". Order is preserved exactly, so the
DIRECT boundary (private + cn_direct first, cn IP last) behaves like Mihomo.

Usage:
  python scripts/build_v2rayn_v01.py          # write v2rayn/hrules.json
  python scripts/build_v2rayn_v01.py --check  # fail if the file is stale
"""
from pathlib import Path
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
ROUTING = ROOT / "mihomo" / "routing.yaml"
SCENES = ROOT / "mihomo" / "scenes"
OUT = ROOT / "v2rayn" / "hrules.json"

# Scene id -> label shown in v2rayN's rule list.
LABELS = {
    "private_direct": "局域网 / 私有地址",
    "cn_direct": "中国大陆域名",
    "network_test": "IP 检测网站",
    "sensitive_ai": "Claude / OpenAI",
    "general_ai": "通用 AI",
    "apple_intelligence_route": "Apple Intelligence",
    "crypto_account": "虚拟货币",
    "us_banking_account": "美国银行",
    "brokerage_account": "证券 / 券商",
    "financial_account": "支付 / 跨境金融",
    "streaming_media": "流媒体",
    "youtube_media": "YouTube",
    "telegram": "Telegram",
    "apple_private_relay_route": "Apple Private Relay",
    "apple_global": "Apple / iCloud 国际",
    "mainstream_proxy": "海外应用",
}

# Rule providers that are not Hrules scene files.
EXTERNAL = {
    "hrules-cn-ip": {"ip": ["geoip:cn"], "label": "中国大陆 IP"},
}

errors = []


def parse_rules_order():
    """Return [(provider, target)] and the MATCH target from routing.yaml."""
    text = ROUTING.read_text(encoding="utf-8")
    m = re.search(r"^rules:\s*\n((?:- .*\n?)+)", text, re.M)
    if not m:
        sys.exit("routing.yaml: rules section not found")
    order, final = [], None
    for line in m.group(1).splitlines():
        parts = [p.strip() for p in line[2:].split(",")]
        if parts[0] == "RULE-SET":
            order.append((parts[1], parts[2]))
        elif parts[0] == "MATCH":
            final = parts[1]
        else:
            errors.append(f"routing.yaml: unsupported rule type {parts[0]}")
    return order, final


def provider_scene(provider):
    sid = provider.removeprefix("hrules-").replace("-", "_")
    return sid


def load_scene(sid):
    path = SCENES / f"{sid}.yaml"
    if not path.exists():
        errors.append(f"missing scene file: {path.relative_to(ROOT)}")
        return [], []
    domains, ips = [], []
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line.startswith("- "):
            continue
        fields = [f.strip() for f in line[2:].split(",")]
        kind, value = fields[0], fields[1] if len(fields) > 1 else ""
        if kind == "DOMAIN-SUFFIX":
            domains.append(f"domain:{value}")
        elif kind == "DOMAIN":
            domains.append(f"full:{value}")
        elif kind in ("IP-CIDR", "IP-CIDR6"):
            ips.append(value)
        else:
            errors.append(f"{path.name}: unsupported rule type {kind} ({value})")
    return domains, ips


def outbound(target):
    return "direct" if target == "DIRECT" else "proxy"


def build():
    order, final = parse_rules_order()
    items = []
    for provider, target in order:
        tag = outbound(target)
        if provider in EXTERNAL:
            ext = EXTERNAL[provider]
            items.append({"remarks": f"Hrules·{ext['label']}", "outboundTag": tag, "ip": ext["ip"]})
            continue
        sid = provider_scene(provider)
        label = LABELS.get(sid)
        if label is None:
            errors.append(f"no v2rayN label for scene {sid}")
            label = sid
        domains, ips = load_scene(sid)
        # Xray treats domain + ip in one rule as AND, so keep them separate.
        if domains:
            items.append({"remarks": f"Hrules·{label}", "outboundTag": tag, "domain": domains})
        if ips:
            items.append({"remarks": f"Hrules·{label} IP", "outboundTag": tag, "ip": ips})
    if final is None:
        errors.append("routing.yaml: MATCH rule missing")
    items.append({"remarks": "Hrules·漏网之鱼", "outboundTag": outbound(final or ""), "port": "0-65535"})
    return items


def validate(items):
    seen_direct_boundary = False
    for i, it in enumerate(items):
        if it["outboundTag"] not in ("proxy", "direct"):
            errors.append(f"item {i}: bad outboundTag {it['outboundTag']}")
        if "domain" in it and "ip" in it:
            errors.append(f"item {i}: domain and ip in one rule")
        if it["remarks"] == "Hrules·中国大陆域名":
            seen_direct_boundary = True
    if not seen_direct_boundary:
        errors.append("cn_direct rule missing")
    last = items[-1]
    if last.get("port") != "0-65535" or last["outboundTag"] != "proxy":
        errors.append("final catch-all must be port 0-65535 -> proxy")
    if any(it["outboundTag"] == "block" for it in items):
        errors.append("Hrules v2rayN must not block traffic")


def render(items):
    return json.dumps(items, ensure_ascii=False, indent=2) + "\n"


def main():
    items = build()
    validate(items)
    if errors:
        print("\n".join(f"ERROR: {e}" for e in errors))
        sys.exit(1)
    text = render(items)
    if "--check" in sys.argv:
        if not OUT.exists() or OUT.read_text(encoding="utf-8") != text:
            print("v2rayn/hrules.json is stale; run scripts/build_v2rayn_v01.py")
            sys.exit(1)
        print("v2rayN v0.1 OK")
        return
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(text, encoding="utf-8")
    d = sum(len(it.get("domain", [])) for it in items)
    p = sum(len(it.get("ip", [])) for it in items)
    print(f"wrote {OUT.relative_to(ROOT)}: {len(items)} rules, {d} domains, {p} ip entries")


if __name__ == "__main__":
    main()
