# Hrules

**English** | [简体中文](./README.md)

**Hrules is HCloudLab's client-agnostic routing-rule aggregation and distribution platform.**

It is neither a simple concatenation of existing rule repositories nor a single oversized ruleset tied to one proxy client. Hrules studies and integrates useful upstream data and design patterns, then normalizes, deduplicates, checks conflicts, maps policy, compiles client-specific output, and validates behavior before publication.

> One routing intent, multiple client outputs, with behavior kept as consistent as practical across supported clients.

## Status

Hrules uses a two-layer architecture:

- `Hrules-core`: private build and validation core containing source registration, canonical rules, policies, tests, compilers and validation evidence.
- `Hrules`: public release boundary containing only user-facing artifacts that satisfy the current release gate, plus documentation, provenance, versions and hashes.

Current client priority:

1. Mihomo / Clash Verge
2. Shadowrocket
3. sing-box / SFM
4. v2rayN / v2rayNG
5. Other clients after adapter and acceptance work

## Principles

### 1. Aggregate strengths, do not concatenate blindly

Hrules researches multiple mature projects and original data sources. Registration of an upstream source does not mean its content is automatically copied or redistributed. Provenance, reuse terms, normalization, conflicts and runtime behavior are reviewed before public release.

### 2. Rules identify traffic; policy decides where traffic goes

Service identity and routing policy are separate concerns.

For example, identifying traffic as Claude does not imply that it must use a fixed country, residential IP or particular node. Hrules Core first determines what the traffic belongs to; profile and policy layers then decide DIRECT, PROXY, REJECT or a dedicated policy group.

### 3. Optimize for correct behavior, not the smallest rule count

Rule count alone is not a quality metric. Hrules does not remove useful coverage merely to advertise a small list, nor does it accept rules solely to make a list appear comprehensive.

The real targets are duplicate, conflicting, over-broad, stale, untraceable or semantically inconsistent rules.

### 4. Maintain canonical logic once

Canonical client-independent facts live in Hrules Core. Adapters compile that model into client-specific syntax instead of manually maintaining duplicate lists per client.

### 5. Upstream changes never publish directly

The release path is:

```text
Upstream
  ↓
Fetch
  ↓
Normalize
  ↓
Deduplicate
  ↓
Conflict check
  ↓
Canonical validation
  ↓
Policy / Profile validation
  ↓
Client compilation
  ↓
Syntax & routing tests
  ↓
Real-client acceptance
  ↓
Release
```

### 6. Provenance first

Released artifacts should make it possible to understand where a module came from, what Hrules changed, its version, integrity hash and validation status.

### 7. Shared infrastructure is not automatically service-specific

CDNs, identity providers, analytics and shared cloud infrastructure can appear in many unrelated sessions. Observation during one Claude, banking or exchange session is not sufficient evidence to permanently classify such shared infrastructure into that service module.

## Capabilities

Hrules is built around four layers:

- **Aggregation** — mature upstream rules, geo data, service modules and first-party HCloudLab validation.
- **Governance** — normalization, deduplication, conflict detection and precedence handling.
- **Policy composition** — scenario profiles such as Basic, AI, Finance and Full.
- **Multi-client compilation** — Mihomo, Shadowrocket, sing-box / SFM, v2rayN / v2rayNG and other validated clients.

## Rule families

Hrules treats different capabilities separately:

- Routing Rules
- Blocking Rules
- DNS Rules
- Rewrite Rules
- Host Rules
- Client Runtime Options

Not every client supports every capability. Hrules only emits a feature where the target client supports it and the behavior can be validated.

## Upstream sources

Sources under research or integration include:

- MetaCubeX `meta-rules-dat`
- Loyalsoldier rule projects
- v2fly `domain-list-community`
- blackmatrix7 `ios_rule_script`
- ACL4SSR
- GFWList
- GreatFire-derived blocking observations
- EasyList / EasyList China
- xinggsf Adblock Plus Rule
- Peter Lowe's ad/tracker/malware domain list
- LOWERTOP / Shadowrocket, mainly as a Shadowrocket behavior/configuration reference
- HCloudLab first-party runtime and service-session validation

See [SOURCES.md](./SOURCES.md) for provenance, reuse review and publication status.

## Usage

### General users

Once public artifacts are released, choose the profile that matches your client and actual use case rather than automatically choosing the largest ruleset.

Typical choices:

- General overseas access: Basic
- ChatGPT / Claude / Gemini: AI
- Banking / brokerage services requiring controlled egress: corresponding Finance profile
- Custom policy composition: Full / advanced modules

Import instructions are documented in each client directory.

### Advanced users

Individual modules can be used as rule providers while you keep your own proxy groups and egress policies.

Hrules does not require HCloudLab nodes, subscriptions or proxy-group naming.

## FAQ

### Are thousands of rules necessarily much slower than a few hundred?

Not necessarily.

Different engines use different indexes, caches, rule-set representations and matching structures. Modern clients should not be assumed to linearly scan every rule for every request. Hrules therefore does not use line count as its sole performance metric.

We care about load time, memory, matcher type, DNS side effects, conflicts, hit accuracy and measured behavior in the target client.

### Why not simply merge every upstream list?

Because upstreams can overlap, conflict, use different taxonomies, contain over-broad matches or have different reuse terms.

Hrules' value is the governance after aggregation, not the act of concatenating files.

### What is the difference between blacklist-style and whitelist-style routing?

The practical difference is often the fallback for unknown traffic.

- Blacklist-style: known proxy targets use PROXY; unknown traffic defaults to DIRECT.
- Whitelist-style: known direct targets use DIRECT; unknown traffic defaults to PROXY.

Hrules separates canonical data from profiles so the same rule modules can support different fallback models without duplicating the entire dataset.

### Can Hrules prevent ChatGPT, Claude, banking or exchange account risk?

No.

Hrules can make routing more predictable and reduce accidental egress changes or session splitting caused by bad routing. Service-side risk controls can still consider account history, IP, device, behavior, geography, payment method and other signals.

### Can Hrules block every advertisement?

No.

Domain- and URL-level blocking works well for many third-party ad and tracking systems, but first-party ads, dynamic application APIs, in-stream video advertising and frequently changing app behavior cannot always be handled by routing rules alone.

Blocking is an optional capability, not a promise of complete ad removal.

### Why is one root domain often insufficient for a service?

Modern services use multiple first-party domains, APIs, authentication endpoints, static assets and CDNs. The website hostname visible in the address bar does not represent the full session.

Hrules therefore maintains service modules rather than assuming one domain equals one service.

### Why not assign every CDN or shared identity hostname to a service group?

Because shared infrastructure may serve many unrelated services. Over-classification creates new routing errors.

### Should I always use the largest profile?

Usually not.

Choose the smallest profile that covers your actual needs. More rules are not inherently bad, but unrelated modules and policy groups increase operational complexity.

### Why does Hrules not publish immediately after an upstream update?

By design.

Freshness and stability are separate goals. Changes first pass normalization, diff review, conflict checks and target-client validation.

### Why do generated files look different between clients?

Shadowrocket, Mihomo and sing-box use different syntax, policy models and capabilities.

Hrules does not aim for textually identical files. It aims for equivalent routing intent and validated behavior.

## Public repository layout

As stable releases expand, this repository is expected to contain:

- `mihomo/`
- `shadowrocket/`
- `sing-box/`
- `v2rayn/`
- `manifest.json`
- `SHA256SUMS`
- `SOURCES.md`
- `CHANGELOG.md`

Research-only data, private fixtures, user nodes and subscription credentials are not published.

## Contributing

Reports are especially useful when they include:

- missed or incorrect domains
- false positives / routing errors
- client syntax issues
- service-domain changes
- upstream sources worth evaluating

For service-level reports, a hostname plus the affected feature, client and connection evidence is more useful than a bare domain alone.

## Disclaimer

Hrules is a routing-rule and configuration research project. It does not provide proxy nodes and does not promise to bypass account, geographic or security controls. Follow applicable laws and the terms of the services you use.
