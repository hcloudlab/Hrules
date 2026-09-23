# AI Sensitive Audit

Status: P0 empirical audit. Do not mark a dependency covered only because it appears in an upstream list.

## Scope

Audit four account-sensitive web sessions independently:

- Claude
- ChatGPT
- Gemini
- Grok

For each session record four classes of traffic:

1. First-party service domains and IP endpoints.
2. Authentication / challenge / session endpoints.
3. Shared third-party dependencies (analytics, feature flags, telemetry, CDN, error reporting).
4. Unclassified destinations observed during the session.

## Required observation matrix

For every observed destination record:

- service and test action (cold login, warm login, new chat, upload, streaming response, logout);
- destination host/IP;
- current Mihomo matched rule/rule-set;
- resulting Hrules/host policy group;
- whether the dependency is account/session sensitive;
- disposition: add to sensitive scene, keep shared/general, or leave to Strict catch-all.

## Current rule ownership before capture

- Claude / ChatGPT first-party namespaces: `hrules-sensitive-ai` -> `🔐 Claude / OpenAI [场景]`.
- Gemini / Grok: currently `hrules-general-ai` -> `🤖 AI 服务 [场景]`.
- Network diagnostics: `hrules-network-test` -> `🔐 Claude / OpenAI [场景]`.
- Unknown traffic in Strict: `MATCH` -> `🚀 漏网之鱼 [自选]`.

This is intentionally an audit baseline, not a claim that Gemini/Grok or shared dependencies are already complete.

## Acceptance gate

A service is not considered audited until real traffic has been captured for the actions above and every observed destination has an explicit disposition. Shared providers such as Sift, Statsig, Sentry or generic CDN hosts must not be globally captured without evidence that routing the namespace is safe; prefer exact hosts learned from the capture.

The architecture has two safety layers:

1. Recognize account-sensitive traffic as precisely as practical.
2. Ensure anything still unrecognized has an explicit, inspectable final exit under Strict.
