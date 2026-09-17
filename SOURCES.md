# Sources and provenance

Hrules uses a provenance-first release process. Canonical source metadata, normalization, conflict checks and validation live in the private Hrules Core pipeline; this public file documents the source families used by released artifacts without exposing private fixtures or user-specific data.

## Source families under evaluation / integration

- MetaCubeX `meta-rules-dat` — geosite/geoip and Mihomo-oriented rule-set ecosystem.
- Loyalsoldier rule projects — mature Clash/Mihomo rule-source reference and upstream ecosystem.
- v2fly `domain-list-community` — domain categorization source used by upstream rule ecosystems.
- HCloudLab first-party research and runtime observations — narrowly scoped service-domain evidence used where mature dedicated upstream modules are insufficient.

Additional upstream projects may be used for architecture comparison or corroboration without their data being copied into a public Hrules artifact.

## Publication rule

A source being researched or registered does not mean its data is automatically redistributed. Before public release, imported or derived data must have its provenance and reuse terms reviewed, pass Hrules normalization/conflict checks, and satisfy the release policy for the target module.

HCloudLab runtime observations distinguish first-party/dedicated service namespaces from shared third-party CDN, analytics, identity and infrastructure domains. Shared third-party domains are not promoted into sensitive-service modules solely because they appear during a service session.

Per-artifact source and hash information will be added with the first validated public ruleset release.
