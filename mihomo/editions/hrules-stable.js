// Hrules Core edition contract artifact.
// Hrules Mihomo Stable / 稳定版
const HRULES_EDITION = "stable";
const HRULES_EDITION_SPEC = {"system_groups":[],"region_groups":true,"same_region_failover":false,"scene_groups":["sensitive_ai","crypto_account","us_banking_account","brokerage_account","financial_account","general_ai","youtube_media"],"sensitive_exit_policy":"manual_region_or_node"};

// Hrules Clash Verge Rev Global Adapter v0.1
// Paste this file into Clash Verge Rev -> Global Extension Script.
// Hrules owns routing topology and the validated DNS baseline. The active profile
// continues to own nodes, providers, TUN, ports, and credentials.

function main(config) {
  const HR = "Hrules";
  const edition = (typeof HRULES_EDITION !== "undefined") ? HRULES_EDITION : "strict";
  const editionSpec = (typeof HRULES_EDITION_SPEC !== "undefined") ? HRULES_EDITION_SPEC : {
    system_groups:[], region_groups:true,
    same_region_failover:false,
    scene_groups:["sensitive_ai","crypto_account","us_banking_account","brokerage_account","general_ai","youtube_media"],
    sensitive_exit_policy:"manual_region_or_node"
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
    "🏦 美国账户 [场景]","🔐 重要账户 [场景]","🏦 美国银行 [场景]","📈 美股 [场景]","💳 金融账户 [场景]","🏦 美国账户 [场景]","🏦 美国账户 [场景]","🏦 美国账户 [场景]","🤖 AI 服务 [场景]","📺 影音媒体 [场景]","📺 YouTube [场景]","💬 Telegram [场景]",
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

  // DNS egress is bound to an Hrules-owned group that exists for this edition.
  // Node-domain bootstrap remains independent from the proxy to avoid a loop.
  // proxy-server-nameserver uses direct DoH and must return real IPs, never Fake-IP.
  const dnsProxyGroup = null;

  const mk = (name, type, extra={}) => Object.assign({name,type}, source, extra);
  const sceneGroup = (name, list) => list.length
    ? {name,type:"select",proxies:list}
    : Object.assign({name,type:"select"}, source);
  // Preserve airport-owned proxy groups, but Hrules does not create global automatic
  // groups of its own. Scene egress stays explicit and auditable.

  const regions = [
    ["us","🇺🇸 美国 [地区]",/(美国|United States|Los Angeles|San Jose|Seattle|Dallas|New York|🇺🇸|(^|[^A-Za-z])US([^A-Za-z]|$)|(^|[^A-Za-z])USA([^A-Za-z]|$))/i],
    ["jp","🇯🇵 日本 [地区]",/(日本|Japan|Tokyo|Osaka|🇯🇵|(^|[^A-Za-z])JP([^A-Za-z]|$))/i],
    ["sg","🇸🇬 新加坡 [地区]",/(新加坡|Singapore|🇸🇬|(^|[^A-Za-z])SG([^A-Za-z]|$))/i],
    ["hk","🇭🇰 香港 [地区]",/(香港|Hong Kong|🇭🇰|(^|[^A-Za-z])HK([^A-Za-z]|$))/i],
    ["tw","🇹🇼 台湾 [地区]",/(台湾|台灣|Taiwan|🇹🇼|(^|[^A-Za-z])TW([^A-Za-z]|$))/i],
    ["kr","🇰🇷 韩国 [地区]",/(韩国|韓國|Korea|Seoul|🇰🇷|(^|[^A-Za-z])KR([^A-Za-z]|$))/i],
    ["gb","🇬🇧 英国 [地区]",/(英国|英國|United Kingdom|London|🇬🇧|(^|[^A-Za-z])UK([^A-Za-z]|$)|(^|[^A-Za-z])GB([^A-Za-z]|$))/i],
    ["de","🇩🇪 德国 [地区]",/(德国|德國|Germany|Frankfurt|🇩🇪|(^|[^A-Za-z])DE([^A-Za-z]|$))/i]
  ];

  const regionNames = [], matched = new Set();
  if (nodeNames.length && editionSpec.region_groups) {
    for (const [,name,re] of regions) {
      const members = nodeNames.filter(n => re.test(n));
      members.forEach(n => matched.add(n));
      if (!members.length) continue;
      regionNames.push(name);
      // Region is the only automatic boundary Hrules creates: url-test may switch
      // nodes inside this region, but can never drift to another region.
      groups.push({name,type:"url-test",proxies:members,...health,tolerance:50});
    }
    const other = nodeNames.filter(n => !matched.has(n));
    if (other.length) {
      regionNames.push("🌐 未分类 [地区]");
      groups.push({name:"🌐 未分类 [地区]",type:"select",proxies:other});
    }
  }
  // Provider-only profiles cannot be synchronously enumerated into safe regions.
  // In that case scenes expose the provider nodes directly and remain manual.

  const exact = nodeNames.slice();
  // Scene groups expose only two Hrules choices: a concrete region or a concrete node.
  // Choosing a region permits automatic switching only inside that region; choosing
  // a node pins the scene to that node. No Hrules global auto/fallback/all-nodes group
  // is inserted into a scene.
  const sceneCandidates = [...regionNames,...exact];
  if (hasScene("sensitive_ai")) groups.push(sceneGroup("🔐 Claude / OpenAI [场景]",sceneCandidates));
  if (hasScene("crypto_account")) groups.push(sceneGroup("💰 虚拟货币 [场景]",sceneCandidates));
  if (edition === "strict") {
    if (hasScene("us_banking_account")) groups.push(sceneGroup("🏦 美国银行 [场景]",sceneCandidates));
    if (hasScene("brokerage_account")) groups.push(sceneGroup("📈 美股 [场景]",sceneCandidates));
    if (hasScene("financial_account")) groups.push(sceneGroup("💳 金融账户 [场景]",sceneCandidates));
  } else {
    groups.push(sceneGroup("🏦 美国账户 [场景]",sceneCandidates));
  }
  if (hasScene("general_ai")) groups.push(sceneGroup("🤖 AI 服务 [场景]",sceneCandidates));
  if (hasScene("youtube_media")) groups.push(sceneGroup("📺 影音媒体 [场景]",sceneCandidates));
  groups.push(sceneGroup("💬 Telegram [场景]",sceneCandidates));
  groups.push(sceneGroup("🚀 漏网之鱼 [自选]",sceneCandidates.length ? sceneCandidates : exact));
  config["proxy-groups"] = groups;

  config["dns"] = {
    enable: true,
    ipv6: false,
    "enhanced-mode": "fake-ip",
    "fake-ip-range": "198.18.0.1/16",
    "fake-ip-filter-mode": "blacklist",
    "fake-ip-filter": ["+.lan","+.local","+.home.arpa","localhost.ptlogin2.qq.com","time.*.com","ntp.*.com","+.pool.ntp.org","+.msftconnecttest.com","+.msftncsi.com"],
    "default-nameserver": ["223.5.5.5","119.29.29.29"],
    "proxy-server-nameserver": ["https://223.5.5.5/dns-query","https://1.1.1.1/dns-query","https://8.8.8.8/dns-query"],
    "direct-nameserver": ["223.5.5.5","119.29.29.29"],
    "direct-nameserver-follow-policy": false,
    nameserver: dnsProxyGroup ? [
      "https://1.1.1.1/dns-query#" + dnsProxyGroup,
      "https://8.8.8.8/dns-query#" + dnsProxyGroup
    ] : ["https://1.1.1.1/dns-query","https://8.8.8.8/dns-query"]
  };

  const providers = Object.assign({}, config["rule-providers"] || {});
  const defs = [
    ["hrules-private-direct","private_direct"],
    ["hrules-network-test","network_test"],
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
  hrulesRules.push("RULE-SET,hrules-network-test,🔐 Claude / OpenAI [场景]");
  if (hasScene("sensitive_ai")) hrulesRules.push("RULE-SET,hrules-sensitive-ai,🔐 Claude / OpenAI [场景]");
  hrulesRules.push("RULE-SET,hrules-crypto-account,💰 虚拟货币 [场景]");
  hrulesRules.push("RULE-SET,hrules-us-banking-account,🏦 美国账户 [场景]");
  hrulesRules.push("RULE-SET,hrules-brokerage-account,🏦 美国账户 [场景]");
  hrulesRules.push("RULE-SET,hrules-financial-account,🏦 美国账户 [场景]");
  hrulesRules.push("RULE-SET,hrules-telegram,💬 Telegram [场景],no-resolve");
  if (hasScene("general_ai")) hrulesRules.push("RULE-SET,hrules-general-ai,🤖 AI 服务 [场景]");
  if (hasScene("youtube_media")) hrulesRules.push("RULE-SET,hrules-youtube-media,📺 影音媒体 [场景]");
  hrulesRules.push("RULE-SET,hrules-cn-direct,DIRECT");
  hrulesRules.push("RULE-SET,hrules-cn-domain,DIRECT");
  hrulesRules.push("RULE-SET,hrules-cn-ip,DIRECT,no-resolve");
  const hasMatch = originalRules.some(r => typeof r === "string" && /^(MATCH|FINAL),/i.test(r.trim()));
  if (!hasMatch) originalRules.push("MATCH,🚀 漏网之鱼 [自选]");
  config.rules = hrulesRules.concat(originalRules);
  config.mode = "rule";
  return config;
}
