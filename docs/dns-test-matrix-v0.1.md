# Hrules DNS v0.1 Test Matrix

Status: **implementation promoted; final runtime release acceptance pending**

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
Must pass Standard gates plus observation that global DoH actually exits through the generated Hrules automatic group after a clean start.

### Strict
Must pass Stable gates plus rule-provider cold-start tests. `nameserver-policy` remains intentionally disabled in v0.1.

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

DNS v0.1 implementation is now promoted in all Clash Verge Rev editions. Final release acceptance still requires the following runtime resolver-path gates:
1. clean cold start and cache reset;
2. domain-form proxy-server bootstrap observation;
3. DIRECT mainland-domain/CDN observation;
4. Stable/Strict global DoH egress observation;
5. restart and node-switch repetition;
6. subscription/provider refresh;
7. EdgeTunnel preferred-IP preservation;
8. classify the observed MATCH/Telegram/Google/IPv6 warnings before promotion.


## Staged promotion record — 2026-09-22

- Standard Clash Verge Rev adapter now generates the conservative DNS baseline automatically; manual subscription YAML editing is no longer part of the intended UX.
- Standard keeps node bootstrap independent from proxy establishment through `proxy-server-nameserver` using the China-reachable bootstrap pair.
- Stable / Strict now generate their DNS baseline. Their global DoH is explicitly bound to the Hrules automatic group while bootstrap/node DNS remains proxy-independent; clean-start egress still requires runtime acceptance.
- Feature-branch adapters and 3X-UI artifacts are pinned to the same feature-branch Scene inventory during acceptance, preventing mixed `branch JS → main Scene` tests.
- Core audit also removed `198.18.0.0/15` from `private_direct`: Mihomo Fake-IP uses the 198.18/15 benchmarking space, so forcing that range DIRECT would defeat rule evaluation for Fake-IP destinations.


## Standard concentrated traffic acceptance — 2026-09-22

The automatically generated Standard DNS block and expanded Core coverage were exercised together on Clash Verge Rev / macOS with the real node inventory.

Observed routing evidence:
- Wise: `wise.com`, `sst.wise.com` → `🔐 重要账户 [场景]` → `DMIT-reality`.
- PayPal: `paypal.com`, `i.paypal.com`, `www.paypalobjects.com` → `🔐 重要账户 [场景]` → `DMIT-reality`.
- Chase: `page-format.chase.com` and shared risk endpoints `online-metrix.net` → `🔐 重要账户 [场景]` → `DMIT-reality`.
- Grok: `grok.com` and observed xAI/OAI user-content endpoint → `🤖 AI 服务 [场景]` → `DMIT-hysteria2`.
- Gemini session-critical endpoints: `gemini.gstatic.com`, `accounts.google.com`, `www.google.com` → `🤖 AI 服务 [场景]` → `DMIT-hysteria2`.
- Claude: `claude.ai`, `a.claude.ai`, `s-cdn.anthropic.com`, `assets-proxy.anthropic.com` → `🤖 AI 服务 [场景]` → `DMIT-hysteria2`.
- OpenAI: `api.oaistatsig.com`, `cdn.openai.com` → `🤖 AI 服务 [场景]` → `DMIT-hysteria2`.
- Telegram: web domains, `t.me`, `telegram.me`, and IP `149.154.167.91` → `💬 Telegram [场景]` → `♻️ 自动选择 [系统]`.
- YouTube: `googlevideo.com`, `i.ytimg.com` → `📺 YouTube [场景]` → `♻️ 自动选择 [系统]`.
- Mainland traffic samples including `kwai-pro.com` / `ap4r.com` were observed as `DIRECT`.

Shared infrastructure remained outside account/AI scenes as designed (for example Stripe, generic analytics/CDN/WAF endpoints), preventing overmatching.

Result: **Standard generated DNS + representative Core routing integration PASS** for this concentrated runtime sample.

One diagnostic remains intentionally open: HSBC first-party domains are covered by `financial_account`, while observed generic/shared dependencies such as `hsbc.edge.sdk.awswaf.com`, Tealium, LivePerson and analytics endpoints correctly remained on host MATCH/PROXY. This is not classified as a Core miss unless a first-party HSBC endpoint itself is observed falling through.


## Stable concentrated runtime acceptance — Clash Verge Rev / macOS — 2026-09-22

Environment: Stable Global Extension Script, real mixed node inventory containing both IP-form and domain-form Reality/Hysteria2 nodes, TUN enabled.

Observed evidence:
- Generated DNS block is present exactly as designed: Fake-IP, mainland bootstrap pair, independent `proxy-server-nameserver`, mainland `direct-nameserver`, and Cloudflare/Google DoH bound to `♻️ 自动选择 [系统]`.
- Domain-form node `3xui.hcloudlab.cc.cd` was usable for both Reality and Hysteria2 traffic immediately after restart. This is runtime evidence that proxy-server bootstrap did not deadlock on the proxied DoH path.
- Mainland traffic such as Baidu/BCE endpoints was observed as `DIRECT`.
- YouTube domains / Googlevideo / ytimg matched `📺 YouTube [场景]` and used the Hrules automatic group.
- ChatGPT / OpenAI and Claude matched `🔐 Claude / OpenAI [场景]`.
- Gemini/Google AI session-critical `www.google.com` matched `🤖 AI 服务 [场景]`.
- Telegram official IPs matched `💬 Telegram [场景]` and used the Hrules automatic group.
- HSBC first-party `www.us.hsbc.com` matched `🔐 重要账户 [场景]`. This resolves the earlier HSBC runtime uncertainty: the first-party domain is correctly classified while generic AWS WAF / Tealium / LivePerson / analytics dependencies remain outside the financial scene.
- No DNS loop or bootstrap failure was visible in this concentrated run.

Assessment:
- Stable routing + generated DNS integration: **PASS** for this concentrated real-device sample.
- HSBC first-party routing: **PASS**.
- Domain-form node bootstrap: **PASS** at functional level.
- DIRECT mainland routing: **PASS**.
- Overseas DoH configuration binding: **CONFIG PASS**; packet/log-level proof of the DoH socket egress is still a release-evidence item.
- EdgeTunnel preferred-IP preservation and node-switch/restart repetition remain the final compatibility checks before release.
