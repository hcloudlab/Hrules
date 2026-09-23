// Hrules Core edition contract artifact.
// Hrules Mihomo Strict / 严格版
const HRULES_EDITION = "strict";
const HRULES_EDITION_SPEC = {"system_groups":["all","auto","fallback","load-balance"],"region_groups":true,"same_region_failover":true,"scene_groups":["sensitive_ai","crypto_account","us_banking_account","brokerage_account","financial_account","general_ai","youtube_media"],"sensitive_exit_policy":"restricted"};

// Hrules Clash Verge Rev Global Adapter v0.1
// Paste this file into Clash Verge Rev -> Global Extension Script.
// Hrules owns routing topology and the validated DNS baseline. The active profile
// continues to own nodes, providers, TUN, ports, and credentials.

function main(config) {
  const HR = "Hrules";
  const edition = (typeof HRULES_EDITION !== "undefined") ? HRULES_EDITION : "strict";
  const editionSpec = (typeof HRULES_EDITION_SPEC !== "undefined") ? HRULES_EDITION_SPEC : {
    system_groups:["all","auto","fallback","load-balance"], region_groups:true,
    same_region_failover:true,
    scene_groups:["sensitive_ai","crypto_account","us_banking_account","brokerage_account","general_ai","youtube_media"],
    sensitive_exit_policy:"restricted"
  };
  const hasSystem = id => editionSpec.system_groups.includes(id);
  const hasScene = id => editionSpec.scene_groups.includes(id);
  const providerBase = "https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/scenes";
  const rawNodeNames = Array.isArray(config.proxies)
    ? config.proxies.map(p => p && p.name).filter(n => typeof n === "string" && n.length)
    : [];

  // Some airport subscriptions encode quota/expiry/homepage status as syntactically
  // valid proxies. They are profile metadata, not user egress choices. Excluding them
  // here also prevents tokens such as "236.29 GB" from becoming a false UK region.
  const metadataNode = /(剩余流量|流量剩余|套餐到期|到期时间|有效期|官网|官方|(?:^|[\s:：|｜_-])(traffic|remaining|expire|expiry|expires|quota|bandwidth|website|homepage)(?=[\s:：|｜_-]|$))/i;
  const nodeNames = rawNodeNames.filter(n => !metadataNode.test(n));
  const providerNames = config["proxy-providers"] && typeof config["proxy-providers"] === "object"
    ? Object.keys(config["proxy-providers"]) : [];

  // Fail open: if the active profile exposes no usable node source, leave it untouched.
  if (!nodeNames.length && !providerNames.length) return config;

  const hrulesRulePrefix = "RULE-SET,hrules-";
  const originalRules = Array.isArray(config.rules)
    ? config.rules.filter(r => !(typeof r === "string" && r.startsWith(hrulesRulePrefix)))
    : [];
  const existingGroups = Array.isArray(config["proxy-groups"]) ? config["proxy-groups"] : [];
  const owned = new Set([
    "🌐 全部节点 [系统]","♻️ 自动选择 [系统]","🛡️ 故障转移 [系统]","⚖️ 负载均衡 [系统]",
    "🌍 地区 [系统]","🇺🇸 美国 [地区]","🇯🇵 日本 [地区]","🇸🇬 新加坡 [地区]",
    "🇭🇰 香港 [地区]","🇹🇼 台湾 [地区]","🇰🇷 韩国 [地区]","🇬🇧 英国 [地区]",
    "🇩🇪 德国 [地区]","🌐 未分类 [地区]","🛡️ 美国故障转移 [敏感]",
    "🛡️ 日本故障转移 [敏感]","🛡️ 新加坡故障转移 [敏感]","🛡️ 香港故障转移 [敏感]",
    "🛡️ 台湾故障转移 [敏感]","🛡️ 韩国故障转移 [敏感]","🛡️ 英国故障转移 [敏感]",
    "🛡️ 德国故障转移 [敏感]","🔐 Claude / OpenAI [场景]","💰 虚拟货币 [场景]",
    "🏦 美国账户 [场景]","🏦 美国账户 [场景]","🏦 美国账户 [场景]","🏦 美国账户 [场景]","🤖 AI 服务 [场景]","📺 YouTube [场景]","💬 Telegram [场景]",
    "🚀 漏网之鱼 [自选]"
  ]);
  const groups = existingGroups.filter(g => !(g && owned.has(g.name)));

  const source = {};
  if (nodeNames.length) source.proxies = nodeNames;
  if (providerNames.length) {
    source.use = providerNames;
    // Filter common quota/expiry/homepage pseudo-nodes exposed by providers.
    source["exclude-filter"] = "剩余|到期|有效期|官网|官方|traffic|remaining|expire|expiry|quota|bandwidth|website|homepage";
  }
  const health = { url: "https://www.gstatic.com/generate_204", interval: 300 };

  const dnsProxyGroup = hasSystem("auto") ? "♻️ 自动选择 [系统]"
    : hasSystem("all") ? "🌐 全部节点 [系统]" : null;

  const mk = (name, type, extra={}) => Object.assign({name,type}, source, extra);
  const sceneGroup = (name, list) => list.length
    ? {name,type:"select",proxies:list}
    : {name,type:"select",use:providerNames};
  if (hasSystem("all")) groups.push(mk("🌐 全部节点 [系统]","select"));
  if (hasSystem("auto")) groups.push(mk("♻️ 自动选择 [系统]","url-test",Object.assign({},health,{tolerance:50})));
  if (hasSystem("fallback")) groups.push(mk("🛡️ 故障转移 [系统]","fallback",health));
  if (hasSystem("load-balance")) groups.push(mk("⚖️ 负载均衡 [系统]","load-balance",Object.assign({},health,{strategy:"consistent-hashing"})));

  const regions = [
    ["us","🇺🇸 美国 [地区]","🛡️ 美国故障转移 [敏感]",/(美国|United States|Los Angeles|San Jose|Seattle|Dallas|New York|🇺🇸|(^|[^A-Za-z])US([^A-Za-z]|$)|(^|[^A-Za-z])USA([^A-Za-z]|$))/i],
    ["jp","🇯🇵 日本 [地区]","🛡️ 日本故障转移 [敏感]",/(日本|Japan|Tokyo|Osaka|🇯🇵|(^|[^A-Za-z])JP([^A-Za-z]|$))/i],
    ["sg","🇸🇬 新加坡 [地区]","🛡️ 新加坡故障转移 [敏感]",/(新加坡|Singapore|🇸🇬|(^|[^A-Za-z])SG([^A-Za-z]|$))/i],
    ["hk","🇭🇰 香港 [地区]","🛡️ 香港故障转移 [敏感]",/(香港|Hong Kong|🇭🇰|(^|[^A-Za-z])HK([^A-Za-z]|$))/i],
    ["tw","🇹🇼 台湾 [地区]","🛡️ 台湾故障转移 [敏感]",/(台湾|台灣|Taiwan|🇹🇼|(^|[^A-Za-z])TW([^A-Za-z]|$))/i],
    ["kr","🇰🇷 韩国 [地区]","🛡️ 韩国故障转移 [敏感]",/(韩国|韓國|Korea|Seoul|🇰🇷|(^|[^A-Za-z])KR([^A-Za-z]|$))/i],
    ["gb","🇬🇧 英国 [地区]","🛡️ 英国故障转移 [敏感]",/(英国|英國|United Kingdom|London|🇬🇧|(^|[^A-Za-z])UK([^A-Za-z]|$)|(^|[^A-Za-z])GB([^A-Za-z]|$))/i],
    ["de","🇩🇪 德国 [地区]","🛡️ 德国故障转移 [敏感]",/(德国|德國|Germany|Frankfurt|🇩🇪|(^|[^A-Za-z])DE([^A-Za-z]|$))/i]
  ];

  const regionNames = [], sensitiveNames = [], matched = new Set();
  if (nodeNames.length && editionSpec.region_groups) {
    for (const [,name,sensitive,re] of regions) {
      const members = nodeNames.filter(n => re.test(n));
      members.forEach(n => matched.add(n));
      if (!members.length) continue;
      regionNames.push(name);
      groups.push({name,type:"select",proxies:members});
      if (editionSpec.same_region_failover) {
        sensitiveNames.push(sensitive);
        groups.push({name:sensitive,type:"fallback",proxies:members,...health});
      }
    }
    const other = nodeNames.filter(n => !matched.has(n));
    if (other.length) {
      regionNames.push("🌐 未分类 [地区]");
      groups.push({name:"🌐 未分类 [地区]",type:"select",proxies:other});
    }
    if (regionNames.length) groups.push({name:"🌍 地区 [系统]",type:"select",proxies:regionNames});
  }
  // Provider-only profiles cannot be safely enumerated by a synchronous CVR script.
  // They still receive safe Hrules system/scene groups through Mihomo 'use', but no
  // guessed region or sensitive same-region fallback groups.

  const exact = nodeNames.slice();
  const regionParent = regionNames.length ? ["🌍 地区 [系统]"] : [];
  const available = names => names.filter(n => groups.some(g => g.name === n));
  const normalCandidates = [...available(["♻️ 自动选择 [系统]","🛡️ 故障转移 [系统]"]),...regionParent,...available(["🌐 全部节点 [系统]"]),...exact];
  const mediaCandidates = [...available(["♻️ 自动选择 [系统]","🛡️ 故障转移 [系统]","⚖️ 负载均衡 [系统]"]),...regionParent,...available(["🌐 全部节点 [系统]"]),...exact];
  const sensitiveByKey = {};
  for (const [key,,sensitive] of regions) if (groups.some(g => g.name === sensitive)) sensitiveByKey[key] = sensitive;
  const sceneCandidates = (preferKeys, denyKeys=[]) => {
    const deny = new Set(denyKeys.map(k => sensitiveByKey[k]).filter(Boolean));
    const first = preferKeys.map(k => sensitiveByKey[k]).filter(Boolean);
    const rest = sensitiveNames.filter(n => !first.includes(n) && !deny.has(n));
    const tail = editionSpec.sensitive_exit_policy === "restricted" ? [] : available(["🌐 全部节点 [系统]"]);
    return [...first,...rest,...regionParent,...tail,...exact];
  };
  const aiCandidates = sceneCandidates(["us","jp","sg","tw","kr","gb","de"],["hk"]);
  const cryptoCandidates = sceneCandidates(["jp","sg","hk","tw","kr"],["us"]);
  const usCandidates = sceneCandidates(["us"]);
  if (hasScene("sensitive_ai")) groups.push(sceneGroup("🔐 Claude / OpenAI [场景]",aiCandidates));
  if (hasScene("crypto_account")) groups.push(sceneGroup("💰 虚拟货币 [场景]",cryptoCandidates));
  groups.push(sceneGroup("🏦 美国账户 [场景]",usCandidates));
  if (hasScene("general_ai")) groups.push(sceneGroup("🤖 AI 服务 [场景]",normalCandidates));
  if (hasScene("youtube_media")) groups.push(sceneGroup("📺 YouTube [场景]",mediaCandidates));
  groups.push(sceneGroup("💬 Telegram [场景]",normalCandidates));
  groups.push(sceneGroup("🚀 漏网之鱼 [自选]",mediaCandidates.length ? mediaCandidates : exact));
  config["proxy-groups"] = groups;

  // Keep bootstrap/node DNS independent from the proxy. Ordinary proxied DNS uses
  // encrypted overseas resolvers through Hrules' automatic group; DIRECT traffic
  // is re-resolved by mainland resolvers for domestic CDN/locality compatibility.
  config["dns"] = {
    enable: true,
    ipv6: false,
    "enhanced-mode": "fake-ip",
    "fake-ip-range": "198.18.0.1/16",
    "fake-ip-filter-mode": "blacklist",
    "fake-ip-filter": ["+.lan","+.local","+.home.arpa","localhost.ptlogin2.qq.com","time.*.com","ntp.*.com","+.pool.ntp.org","+.msftconnecttest.com","+.msftncsi.com"],
    "default-nameserver": ["223.5.5.5","119.29.29.29"],
    "proxy-server-nameserver": ["223.5.5.5","119.29.29.29"],
    "direct-nameserver": ["223.5.5.5","119.29.29.29"],
    "direct-nameserver-follow-policy": false,
    nameserver: [
      "https://1.1.1.1/dns-query#" + dnsProxyGroup,
      "https://8.8.8.8/dns-query#" + dnsProxyGroup
    ]
  };

  const providers = Object.assign({}, config["rule-providers"] || {});
  const defs = [
    ["hrules-private-direct","private_direct"],
    ["hrules-sensitive-ai","sensitive_ai"],
    ["hrules-crypto-account","crypto_account"],
    ["hrules-us-banking-account","us_banking_account"],
    ["hrules-brokerage-account","brokerage_account"],
    ["hrules-financial-account","financial_account"],
    ["hrules-telegram","telegram"],
    ["hrules-general-ai","general_ai"],
    ["hrules-youtube-media","youtube_media"],
    ["hrules-cn-direct","cn_direct"]
  ];
  for (const [key,id] of defs) {
    providers[key] = {type:"http",behavior:"classical",format:"yaml",
      url:providerBase+"/"+id+".yaml",path:"./providers/"+id+".yaml",interval:21600,proxy:dnsProxyGroup || undefined};
  }
  providers["hrules-cn-domain"] = {type:"http",behavior:"domain",format:"mrs",
    url:"https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/cn.mrs",
    path:"./providers/hrules-cn-domain.mrs",interval:21600};
  providers["hrules-cn-ip"] = {type:"http",behavior:"ipcidr",format:"mrs",
    url:"https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/cn.mrs",
    path:"./providers/hrules-cn-ip.mrs",interval:21600};
  config["rule-providers"] = providers;

  // Hrules is an overlay. Do not add its MATCH here: the host profile keeps
  // ownership of its existing fallback/MATCH semantics.
  const hrulesRules = ["RULE-SET,hrules-private-direct,DIRECT,no-resolve"];
  if (hasScene("sensitive_ai")) hrulesRules.push("RULE-SET,hrules-sensitive-ai,🔐 Claude / OpenAI [场景]");
  if (hasScene("crypto_account")) hrulesRules.push("RULE-SET,hrules-crypto-account,💰 虚拟货币 [场景]");
  if (hasScene("us_banking_account")) hrulesRules.push("RULE-SET,hrules-us-banking-account,🏦 美国账户 [场景]");
  if (hasScene("brokerage_account")) hrulesRules.push("RULE-SET,hrules-brokerage-account,🏦 美国账户 [场景]");
  if (hasScene("financial_account")) hrulesRules.push("RULE-SET,hrules-financial-account,🏦 美国账户 [场景]");
  hrulesRules.push("RULE-SET,hrules-telegram,💬 Telegram [场景],no-resolve");
  if (hasScene("general_ai")) hrulesRules.push("RULE-SET,hrules-general-ai,🤖 AI 服务 [场景]");
  if (hasScene("youtube_media")) hrulesRules.push("RULE-SET,hrules-youtube-media,📺 YouTube [场景]");
  hrulesRules.push("RULE-SET,hrules-cn-direct,DIRECT");
  hrulesRules.push("RULE-SET,hrules-cn-domain,DIRECT");
  hrulesRules.push("RULE-SET,hrules-cn-ip,DIRECT,no-resolve");
  const hasMatch = originalRules.some(r => typeof r === "string" && /^(MATCH|FINAL),/i.test(r.trim()));
  if (!hasMatch) originalRules.push("MATCH,🚀 漏网之鱼 [自选]");
  config.rules = hrulesRules.concat(originalRules);
  config.mode = "rule";
  return config;
}
