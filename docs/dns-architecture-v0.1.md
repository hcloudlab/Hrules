# Hrules Mihomo DNS Architecture v0.1

Status: **implementation complete / runtime acceptance pending**

## Goal

Hrules DNS is designed for real Chinese-user mixed-node environments: airport subscriptions, self-hosted Reality/Hysteria2 nodes, Cloudflare/EdgeTunnel preferred-IP nodes, and future chained-proxy scenarios.

The primary invariant is:

> Any DNS path required to establish a proxy must remain usable before that proxy exists.

## Ownership boundary

Clash Verge Rev Hrules editions now own their generated DNS baseline. Standard uses a conservative mainland-reachable resolver path. Stable/Strict preserve independent bootstrap/node DNS and bind ordinary overseas DoH to an Hrules-owned proxy group. Host DNS remains authoritative only for integrations that do not declare Hrules DNS ownership.

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
- Global DNS: Stable/Strict bind Cloudflare/Google DoH to the generated Hrules automatic group; node/bootstrap resolution remains independent

## Edition intent

### Standard
Maximum compatibility. No rule-set DNS policy and no dependency on proxied DNS.

### Stable
Mainland-oriented default. Preserves safe bootstrap/node DNS, separates DIRECT DNS, and routes ordinary global DoH through the actual Hrules automatic group.

### Strict
Builds on Stable's resolver model while keeping `nameserver-policy` disabled in v0.1. Strictness is currently expressed by routing topology/exit constraints, not by making bootstrap depend on rule-provider DNS policy.

## Non-goals for v0.1

- No claim of perfect DNS/egress identity for all UDP/QUIC traffic.
- No automatic `geosite:cn` injection into `fake-ip-filter`.
- No dependence on `system`/DHCP DNS for core availability.
- No default DoT dependency.
- No automatic `nameserver-policy` dependency in v0.1; resolver bootstrap remains independent of rule-provider startup.

## Integration binding contract

The Stable/Strict static artifacts bind to Hrules' `♻️ 自动选择 [系统]` group, and the generated adapters resolve the DNS egress group from the same final inventory used to build Hrules proxy groups.

Preferred binding order for the current edition topology:

1. `♻️ 自动选择 [系统]` when that Hrules-owned group exists.
2. `🌐 全部节点 [系统]` when auto-selection is absent.
3. If neither Hrules-owned group can be guaranteed, do not force proxied global DoH; fail open to the edition's compatibility behavior.

The binding must never target a source-profile group merely because it happens to be named `PROXY`. Hrules may consume airport profiles with arbitrary group names.

Standard deliberately has no proxied-DNS dependency. Stable/Strict use `#<resolved Hrules group>` for ordinary overseas DoH while `default-nameserver` and `proxy-server-nameserver` remain proxy-independent.

The `#group` suffix controls the DNS server connection's egress. It must not be confused with choosing which resolver answers a domain. Hrules therefore keeps resolver selection, node bootstrap, and DNS-server egress as separate concerns.

`respect-rules` remains disabled in v0.1 candidates. If evaluated later, it requires an explicit `proxy-server-nameserver` and must not be combined casually with HTTP/3 DNS. Explicit group binding is preferred when Hrules needs deterministic global-DoH egress.

## Release gate

The implementation is frozen for runtime acceptance. Release still requires the supported-node test matrix in `docs/dns-test-matrix-v0.1.md`; runtime failures are fixed as compatibility defects rather than by redesigning the ownership model.
