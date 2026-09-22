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


## Runtime record — Clash Verge Rev / macOS — 2026-09-22

Environment: Clash Verge Rev on macOS, rule mode, real 3X-UI node inventory. This record covers the routing-inheritance acceptance performed before continuing DNS v0.1 runtime validation.

### Edition inheritance acceptance

| Edition | Observed result | Status |
| --- | --- | --- |
| Standard | `sensitive_ai` traffic from ChatGPT and Claude collapsed into `🤖 AI 服务 [场景]`; Gemini also used `🤖 AI 服务 [场景]`; `🔐 重要账户 [场景]` was present. | PASS |
| Stable | ChatGPT/Claude used `🔐 Claude / OpenAI [场景]`; Gemini used `🤖 AI 服务 [场景]`; `🔐 重要账户 [场景]` was present. | PASS |
| Strict | `🔐 重要账户 [场景]` was removed; separate `💰 虚拟货币`, `🏦 美国银行`, and `📈 美股` groups were present. Chase traffic was observed using `🏦 美国银行 [场景]`. ChatGPT/Claude used `🔐 Claude / OpenAI [场景]`. | PASS |

Observed log evidence included:
- `ws.chatgpt.com:443 match RuleSet(hrules-sensitive-ai) using 🤖 AI 服务 [场景][DMIT-reality]` under Standard.
- `ws.chatgpt.com:443 match RuleSet(hrules-sensitive-ai) using 🔐 Claude / OpenAI [场景][DMIT-reality]` under Strict.
- Chase domains such as `sites.chase.com`, `static.chasecdn.com`, `reco.chase.com`, and `analytics.chase.com` used `🏦 美国银行 [场景]` under Strict.

Result: the runtime evidence supports the repository invariant `Strict ⊃ Stable ⊃ Standard` for the tested Clash Verge Rev integration.

### DNS baseline observations

During the same session, the manually inserted Standard DNS candidate did not prevent the tested Reality/Hysteria2 inventory from loading and being selectable, and ChatGPT/Claude/Gemini traffic remained reachable through the selected Hrules scene groups. This is a **baseline connectivity observation only**, not a DNS runtime PASS.

Warnings were also observed for traffic falling through host `MATCH → PROXY`, including Telegram IP `149.154.167.91`, Google IPv4 timeouts, and IPv6 `no route to host`. These are retained as DNS/routing diagnostics and must not be treated as proof that the DNS candidate caused them.

### Remaining DNS release gates

DNS v0.1 remains **NOT production-ready**. Continue with the existing resolver-path gates:
1. clean cold start and cache reset;
2. domain-form proxy-server bootstrap observation;
3. DIRECT mainland-domain/CDN observation;
4. Stable/Strict global DoH egress observation;
5. restart and node-switch repetition;
6. subscription/provider refresh;
7. EdgeTunnel preferred-IP preservation;
8. classify the observed MATCH/Telegram/Google/IPv6 warnings before promotion.
