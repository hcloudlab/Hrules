# Strict Catch-All Architecture

## Goal

Strict must satisfy two independent guarantees:

1. Recognized Hrules traffic is routed by Hrules scene rules.
2. Traffic not recognized by either Hrules or the host profile still terminates at an Hrules-controlled group.

## 3X-UI

The Strict Remote Routing artifact owns the full rule list and ends with:

`MATCH,🚀 漏网之鱼 [自选]`

Therefore unknown traffic is explicitly controlled by Hrules.

## Clash Verge Rev / Mihomo script

The Strict script applies the chain in this order:

1. Hrules scene/direct rules.
2. Existing host rules, excluding any host `MATCH` or `FINAL`.
3. One terminal rule: `MATCH,🚀 漏网之鱼 [自选]`.

This preserves useful airport rules without allowing an airport terminal rule to bypass Hrules' final policy.

## Invariant

A Strict output must have exactly one effective terminal decision and it must target `🚀 漏网之鱼 [自选]`.

This is the second safety layer: rules should recognize sensitive traffic whenever possible, but unknown traffic still has a visible, user-selectable final exit.
