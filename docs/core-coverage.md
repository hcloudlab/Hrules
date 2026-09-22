# Hrules Core Coverage Matrix

Status: audit baseline (2026-09-22)

This matrix is a release contract, not a claim that every third-party dependency
used by every website belongs to the same scene. Shared analytics, generic CDN,
WAF and payment infrastructure stay outside a scene unless ownership/session
consistency requires otherwise.

| Scene | Representative services | Standard | Stable | Strict |
|---|---|---|---|---|
| sensitive_ai | OpenAI/ChatGPT, Claude/Anthropic | 🤖 AI 服务 | 🔐 Claude / OpenAI | 🔐 Claude / OpenAI |
| general_ai | Gemini/Google AI, Grok/xAI, Perplexity, Copilot endpoints | 🤖 AI 服务 | 🤖 AI 服务 | 🤖 AI 服务 |
| financial_account | PayPal/Venmo/Xoom, Wise, Payoneer, HSBC, Standard Chartered | 🔐 重要账户 | 🔐 重要账户 | 💳 金融账户 |
| us_banking_account | AmEx, BofA, Capital One, Chase, Citi, Wells Fargo, US Bank, PNC, Ally, Discover | 🔐 重要账户 | 🔐 重要账户 | 🏦 美国银行 |
| brokerage_account | IBKR, Schwab, Robinhood, Fidelity, E*TRADE, Webull, moomoo | 🔐 重要账户 | 🔐 重要账户 | 📈 美股 |
| crypto_account | Binance US, Bybit, Coinbase, Kraken, OKX | 🔐 重要账户 | 🔐 重要账户 | 💰 虚拟货币 |
| telegram | Telegram domains + official IPv4/IPv6 ranges | 💬 Telegram | 💬 Telegram | 💬 Telegram |
| youtube_media | YouTube web/video/image/API endpoints | 📺 YouTube | 📺 YouTube | 📺 YouTube |
| private_direct | RFC/local address and local-name baseline | DIRECT | DIRECT | DIRECT |
| cn_direct | Hrules local override + MetaCubeX CN domain/IP datasets | DIRECT | DIRECT | DIRECT |

## Source policy

1. Mature maintained datasets are preferred where they exist and are semantically
   safe to consume. CN direct routing is bound to MetaCubeX geosite/geoip MRS
   datasets instead of pretending that `.cn` alone represents mainland traffic.
2. Hrules keeps first-party account/service domains locally when a scene needs a
   stable product boundary or when mature upstreams do not provide a dedicated
   service list.
3. Shared third-party infrastructure is excluded by default. A site loading
   Stripe, generic AWS, analytics or a common CDN does not make that shared
   hostname part of the site's scene.
4. Representative coverage is enforced by
   `scripts/validate_core_coverage.py`; Edition collapse is independently
   enforced by `scripts/validate_edition_inheritance.py`.
5. Real-device testing validates routing paths and session consistency after the
   static coverage audit; it is not the primary service-discovery mechanism.

## Known audit boundary

The matrix is a representative product baseline, not an exhaustive mirror of
all upstream rules. Adding a new supported service requires an explicit scene
mapping and a representative CI assertion. Removing a representative service
requires a deliberate product decision rather than silent fall-through to
host MATCH.
