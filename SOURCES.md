# Sources and provenance

Hrules uses a provenance-first release process.

Canonical source metadata, normalization, conflict checks and validation live in the private Hrules Core pipeline. This public document records source families used for research, integration or released artifacts without exposing private fixtures, credentials or user-specific data.

> A source being listed here does **not** mean its entire dataset is copied into Hrules or redistributed unchanged.

## Source classes

Hrules distinguishes three broad source roles:

1. **Data candidates** — upstream data may be normalized and merged after reuse/licensing review.
2. **Research references** — used to compare coverage, taxonomy or service behavior; data is not assumed reusable.
3. **Client behavior references** — used to understand client syntax, configuration structure or runtime behavior rather than as a canonical rule source.

## Current source families

### Routing / geo / service taxonomy

| Source | Role in Hrules | Notes |
| --- | --- | --- |
| MetaCubeX `meta-rules-dat` | Primary candidate | Useful geo/service categories and Mihomo/sing-box ecosystem outputs. Service-specific categories are preferred over one broad AI bucket when independent policy is needed. |
| Loyalsoldier rule projects | Baseline candidate | Useful for broad direct/proxy/private/CN/reject layers and mature Clash/Mihomo rule-source patterns. |
| v2fly `domain-list-community` | Taxonomy/reference candidate | Important domain categorization source used throughout the proxy ecosystem. |
| GFWList | Proxy-routing candidate | Mature censorship-routing input; requires normalization rather than being exposed as raw client-specific syntax. |
| GreatFire-derived observations | Corroboration/research | Can supplement blocked-domain evidence, but must not bypass provenance and validation requirements. |
| blackmatrix7 `ios_rule_script` | Service-level research candidate | Strong service-level coverage across multiple client ecosystems. Source-level provenance and reuse requirements must be reviewed before redistribution/derivation. |
| ACL4SSR | Secondary research | Useful for historical ordering, category comparison and service coverage. Share-alike implications require explicit review. |

### Blocking / advertising / tracking

| Source | Role in Hrules | Notes |
| --- | --- | --- |
| EasyList / EasyList China | Blocking candidate | Useful advertising/filter syntax source. Hrules extracts only matcher types that can be represented safely by the target proxy client. Cosmetic filters and browser-only features are not blindly converted. |
| xinggsf / Adblock-Plus-Rule (乘风) | Blocking research/candidate | Strong Chinese web/app advertising coverage. ABP/uBO-specific operators require parser-level filtering; unsupported scriptlet/cosmetic behavior is not treated as a proxy rule. |
| Peter Lowe's list | Domain blocking candidate | Maintains ad, tracking and some malware/anti-adblock hostnames. Suitable for domain-level blocking after policy/reuse review. |

### Client behavior / configuration references

| Source | Role in Hrules | Notes |
| --- | --- | --- |
| LOWERTOP / Shadowrocket | Shadowrocket behavior/configuration reference | Useful for understanding Shadowrocket configuration layout and practical client behavior. It is not Hrules' canonical data model. |
| Johnshall / Shadowrocket-ADBlock-Rules-Forever | Aggregation/design reference | Demonstrates combining GFWList, GreatFire-related observations, EasyList China, 乘风, Peter Lowe and service/client references into generated Shadowrocket artifacts. Hrules borrows the idea of multi-source aggregation, but uses its own client-independent canonical model and validation pipeline. |

### HCloudLab first-party evidence

HCloudLab runtime observations and controlled session testing are used where mature dedicated upstream modules are insufficient.

For sensitive or account-based services, Hrules distinguishes:

- verified first-party domains,
- service-owned auth/API/static infrastructure,
- shared third-party CDN/identity/analytics dependencies,
- incidental domains observed in the same session.

Shared third-party infrastructure is not promoted into a service-specific module solely because it appears once in a capture.

## What Hrules deliberately does not do

- It does not concatenate every upstream file into one giant list.
- It does not assume every upstream rule can legally or technically be redistributed.
- It does not translate browser cosmetic filtering, scriptlets or unsupported ABP operators into fake domain rules.
- It does not treat one captured CDN/analytics hostname as proof of service ownership.
- It does not let an upstream update publish directly to users.

## Publication rule

Before imported or derived data may appear in a public artifact, it must pass:

1. provenance registration,
2. reuse/licensing review,
3. format normalization,
4. deduplication,
5. conflict/precedence checks,
6. canonical validation,
7. target-client compilation,
8. syntax/routing tests,
9. real-client acceptance where required.

Per-artifact source and hash information will accompany validated releases.
