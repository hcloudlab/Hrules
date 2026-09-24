#!/usr/bin/env python3
"""Two-edition product contract checks for Hrules Mihomo outputs."""
from pathlib import Path
import sys
ROOT = Path(__file__).resolve().parents[1]
errors = []
def read(p): return (ROOT / p).read_text(encoding="utf-8")
def require(t,x,w):
    if x not in t: errors.append(f"{w}: missing {x}")
def forbid(t,x,w):
    if x in t: errors.append(f"{w}: unexpected {x}")

std_js=read("mihomo/editions/hrules-standard.js")
std_host=read("mihomo/hosts/3x-ui/hrules-standard.yaml")
fine_js=read("mihomo/editions/hrules-strict.js")
fine_host=read("mihomo/hosts/3x-ui/hrules-strict.yaml")

core=("sensitive-ai","crypto-account","us-banking-account","brokerage-account","financial-account",
      "telegram","general-ai","youtube-media","streaming-media","cn-direct","private-direct","network-test",
      "mainstream-proxy","apple-global","apple-intelligence-route","apple-private-relay-route")
for text,where in ((std_js,"standard js"),(std_host,"standard 3x-ui"),(fine_js,"fine js"),(fine_host,"fine 3x-ui")):
    for scene in core: require(text,f"hrules-{scene}",where)

standard_map={
 "sensitive-ai":"🤖 AI 服务 [场景]","general-ai":"🤖 AI 服务 [场景]",
 "crypto-account":"💳 金融服务 [场景]","us-banking-account":"💳 金融服务 [场景]",
 "brokerage-account":"💳 金融服务 [场景]","financial-account":"💳 金融服务 [场景]",
 "streaming-media":"📺 流媒体 [场景]","youtube-media":"🌐 海外应用 [场景]",
 "telegram":"🌐 海外应用 [场景]","mainstream-proxy":"🌐 海外应用 [场景]",
 "apple-global":"🌐 海外应用 [场景]","apple-private-relay-route":"🌐 海外应用 [场景]",
}
for text,where in ((std_js,"standard js"),(std_host,"standard 3x-ui")):
    for scene,target in standard_map.items(): require(text,f"RULE-SET,hrules-{scene},{target}",where)
    for stale in ("🔐 Claude / OpenAI [场景]","💰 虚拟货币 [场景]","💬 Telegram [场景]","🌐 国际服务 [场景]","📺 影音媒体 [场景]","🍎 Apple / iCloud [场景]"):
        forbid(text,f"name: {stale}",where) if "3x-ui" in where else forbid(text,f'sceneGroup("{stale}"',where)

fine_map={
 "sensitive-ai":"🤖 AI 服务 [场景]","general-ai":"🤖 AI 服务 [场景]",
 "crypto-account":"💰 虚拟货币 [场景]","us-banking-account":"🏦 银行服务 [场景]",
 "brokerage-account":"📈 证券 / 券商 [场景]","financial-account":"💳 支付 / 跨境金融 [场景]",
 "streaming-media":"📺 流媒体 [场景]","youtube-media":"🌐 海外应用 [场景]",
 "telegram":"🌐 海外应用 [场景]","mainstream-proxy":"🌐 海外应用 [场景]",
 "apple-global":"🍎 Apple / iCloud [场景]","apple-private-relay-route":"🍎 Apple / iCloud [场景]",
}
for text,where in ((fine_js,"fine js"),(fine_host,"fine 3x-ui")):
    for scene,target in fine_map.items(): require(text,f"RULE-SET,hrules-{scene},{target}",where)

std_order=["🌐 海外应用 [场景]","📺 流媒体 [场景]","🤖 AI 服务 [场景]","💳 金融服务 [场景]","🚀 漏网之鱼 [自选]"]
fine_order=["🌐 海外应用 [场景]","📺 流媒体 [场景]","🤖 AI 服务 [场景]","🍎 Apple / iCloud [场景]","🏦 银行服务 [场景]","📈 证券 / 券商 [场景]","💳 支付 / 跨境金融 [场景]","💰 虚拟货币 [场景]","🚀 漏网之鱼 [自选]"]
for text,names,where in ((std_host,std_order,"standard 3x-ui"),(fine_host,fine_order,"fine 3x-ui")):
    pos=[text.index(f"- name: {n}") for n in names]
    if pos != sorted(pos): errors.append(f"{where}: scene display order is wrong")

if errors:
    print("\n".join(errors),file=sys.stderr); raise SystemExit(1)
print("Hrules two-edition contracts: PASS")
