# Hrules DNS v0.1 Test Matrix

Status: **required before production DNS ownership**

## Node classes

| Case | Server form | Required |
| --- | --- | --- |
| Airport subscription | IP | yes |
| Airport subscription | domain | yes |
| Self-hosted Reality | IP | yes |
| Self-hosted Reality | domain | yes |
| Self-hosted Hysteria2 | IP | yes |
| Self-hosted Hysteria2 | domain | yes |
| EdgeTunnel / Cloudflare preferred IP | IP + SNI/Host domain | yes |
| CDN/Cloudflare entry | domain | yes |
| dialer-proxy / chained proxy | IP/domain | experimental |

## Runtime checks

For each supported case verify:

1. Clean cold start with empty DNS/cache state.
2. Proxy health check succeeds.
3. Mainland DIRECT site resolves and connects.
4. Mainland CDN result is reasonable for mainland access.
5. Google/YouTube resolve and connect.
6. ChatGPT/Claude resolve and connect when routing rules select a usable exit.
7. Observe which resolver handles the proxy `server` domain.
8. Restart Mihomo and repeat without manual node priming.
9. Switch proxy nodes and repeat.
10. No DNS loop, repeated timeout, or `context deadline exceeded`.
11. Subscription/provider refresh still succeeds.
12. EdgeTunnel preferred IP remains the configured connection address; DNS must not replace its transport semantics.

## Platforms

- Clash Verge Rev / macOS
- Clash Verge Rev / Windows (when test host is available)
- bare Mihomo desktop/server
- OpenClash
- bare Mihomo Linux router

## Resolver-path evidence

Runtime acceptance must capture enough evidence to distinguish configuration success from accidental cache/system-DNS success:

- start from a clean Mihomo process and cleared relevant DNS/cache state;
- run with debug DNS logging while exercising the test domain;
- record the resolver selected for a domain-form proxy `server`;
- for Stable/Strict, record the network path used by the global DoH TCP/443 connection;
- repeat after restart and node switch;
- do not accept a browser DNS-provider test page alone as proof of resolver egress.

A syntax/static PASS is necessary but not sufficient. Runtime evidence is the release gate.

## Edition gates

### Standard
Must pass all required node classes before release.

### Stable
Must pass Standard gates plus global DoH egress observation. The final implementation must prove whether global DoH is DIRECT or bound to the generated Hrules proxy group; no assumption is accepted.

### Strict
Must pass Stable gates plus rule-provider cold-start tests before enabling `nameserver-policy`.

## Failure classification

- BOOTSTRAP: proxy server cannot be resolved before proxy establishment
- LOOP: DNS request recursively depends on itself/proxy establishment
- CDN: DIRECT domain receives unsuitable resolution path/result
- POLICY: DNS policy not loaded or not matched as intended
- IPV6: unexpected AAAA/IPv6 path changes reachability
- HOST: host integration overwrites or conflicts with source-profile DNS
- CHAIN: dialer-proxy/chained proxy introduces DNS dependency cycle
