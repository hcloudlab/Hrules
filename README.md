# Hrules

HCloudLab Rules — validated routing-rule artifacts for supported proxy clients.

## Status

The first Mihomo / Clash Verge release is currently in **v0.1 release-candidate validation** in the private Hrules Core pipeline.

This public repository is the publication boundary. It will contain only artifacts that satisfy the release policy and CI gates; research, candidate, partial-validation records, private test fixtures, provider credentials, and user-specific configurations are not published here.

## Planned public layout

- `mihomo/` — validated Mihomo / Clash Verge rule artifacts
- `shadowrocket/` — future validated Shadowrocket artifacts
- `sing-box/` — future validated sing-box / SFM artifacts
- `manifest.json` — version and artifact metadata
- `SHA256SUMS` — integrity hashes
- `SOURCES.md` — provenance, attribution and licensing notes
- `CHANGELOG.md` — release history

## Release principles

- Rules identify traffic; routing policy decides where that traffic goes.
- Sensitive-service routing is about controlled and predictable egress, not a promise to prevent service-side account checks, fraud controls or bans.
- Shared CDN, analytics and identity domains are not automatically classified as sensitive-service traffic merely because they appear in the same browsing session.
- Upstream changes are normalized and validated in Hrules Core before any public artifact changes.
- Public artifacts are versioned and accompanied by hashes and source/provenance information.

## Current client priority

1. Mihomo / Clash Verge
2. Shadowrocket
3. sing-box / SFM

No user-specific proxy nodes or subscription credentials belong in this repository.
