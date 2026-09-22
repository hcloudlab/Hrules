# Hrules Mihomo DNS Architecture v0.1

Status: **experimental design / not released**

## Goal

Hrules DNS is designed for real Chinese-user mixed-node environments: airport subscriptions, self-hosted Reality/Hysteria2 nodes, Cloudflare/EdgeTunnel preferred-IP nodes, and future chained-proxy scenarios.

The primary invariant is:

> Any DNS path required to establish a proxy must remain usable before that proxy exists.

## Ownership boundary

Hrules currently acts as a routing overlay and the host profile owns DNS. DNS v0.1 does **not** change that production contract yet. This branch introduces an explicit DNS design and candidate profiles for validation first. DNS ownership may move into an integration only after compatibility tests pass.

## Hard invariants

1. Node reachability has higher priority than DNS privacy.
2. Proxy-server DNS is isolated from ordinary user-domain DNS.
3. Bootstrap and proxy-server DNS must not depend on an already-established proxy.
4. DIRECT traffic uses mainland-reachable resolvers suitable for mainland CDN selection.
5. Global encrypted DNS may be proxied only when its proxy dependency is explicit and non-circular.
6. Fake-IP filtering is for protocol/application compatibility, not CN routing.
7. Rule-set DNS policy is an enhancement, never a prerequisite for bootstrap or node reachability.
8. Hrules must not rewrite node `server`, `SNI`, `Host`, preferred IP, or equivalent transport semantics.
9. IPv6 remains disabled in v0.1 candidates until dual-stack behavior is separately validated.
10. Chained/`dialer-proxy` DNS behavior is experimental until runtime tests pass.

## Resolver roles

- Bootstrap: `223.5.5.5`, `119.29.29.29`
- Proxy-server DNS: mainland-reachable resolvers; must work without proxy. It is explicitly configured because Mihomo otherwise falls back to nameserver-policy/nameserver/fallback for proxy-node domains.
- DIRECT DNS: mainland-reachable resolvers
- Global DNS: encrypted resolver candidate; Stable/Strict may bind it to a real generated Hrules proxy group after runtime validation

## Edition intent

### Standard
Maximum compatibility. No rule-set DNS policy and no dependency on proxied DNS.

### Stable
Mainland default. Preserve safe bootstrap/node DNS, separate DIRECT DNS, and validate proxied global DoH against the actual generated proxy-group inventory.

### Strict
Build on Stable. Add narrowly-scoped `nameserver-policy` only after rule-provider startup ordering and cold-start behavior are validated.

## Non-goals for v0.1

- No claim of perfect DNS/egress identity for all UDP/QUIC traffic.
- No automatic `geosite:cn` injection into `fake-ip-filter`.
- No dependence on `system`/DHCP DNS for core availability.
- No default DoT dependency.
- No production mutation of Clash Verge Rev host DNS in this branch.

## Integration binding contract

The static DNS candidates do not hard-code a proxy group. When DNS ownership is promoted into a generated Mihomo integration, the adapter must resolve the DNS egress group from the same final inventory used to build Hrules proxy groups.

Preferred binding order for the current edition topology:

1. `♻️ 自动选择 [系统]` when that Hrules-owned group exists.
2. `🌐 全部节点 [系统]` when auto-selection is absent.
3. If neither Hrules-owned group can be guaranteed, do not force proxied global DoH; fail open to the edition's compatibility behavior.

The binding must never target a source-profile group merely because it happens to be named `PROXY`. Hrules may consume airport profiles with arbitrary group names.

Standard deliberately has no proxied-DNS dependency. Stable/Strict may add `#<resolved Hrules group>` only after runtime validation.

The `#group` suffix controls the DNS server connection's egress. It must not be confused with choosing which resolver answers a domain. Hrules therefore keeps resolver selection, node bootstrap, and DNS-server egress as separate concerns.

`respect-rules` remains disabled in v0.1 candidates. If evaluated later, it requires an explicit `proxy-server-nameserver` and must not be combined casually with HTTP/3 DNS. Explicit group binding is preferred when Hrules needs deterministic global-DoH egress.

## Release gate

DNS ownership must not be enabled in production integrations until the test matrix in `docs/dns-test-matrix-v0.1.md` passes for the supported node classes.
