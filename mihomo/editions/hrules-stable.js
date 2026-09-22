// Hrules Core edition contract artifact.
// Hrules Mihomo Stable / 稳定版
const HRULES_EDITION = "stable";
const HRULES_EDITION_SPEC = {"system_groups":["all","auto","fallback"],"region_groups":true,"same_region_failover":true,"scene_groups":["sensitive_ai","crypto_account","us_banking_account","brokerage_account","financial_account","general_ai","youtube_media"],"sensitive_exit_policy":"same_region_preferred"};

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
  const metadataNode = /(剩余流量|流量剩余|套餐到期|到期时间|有效期|官网|官方|(?:^|[\\s:：|｜_-])(traffic|remaining|expire|expiry|expires|quota|bandwidth|website|homepage)(?=[\\s:：|｜_-]|$))/i;
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
    "🏦 美国银行 [场景]","📈 美股 [场景]","💳 金融账户 [场景]","🔐 重要账户 [场景]","🤖 AI 服务 [场景]","📺 YouTube [场景]","💬 Telegram [场景]",
    "🚀 漏网之鱼 [自选]"
  ]);
  const groups = existingGroups.filter(g => !(g && owned.has(g.name)));

  const source = {};
  if (nodeNames.length) source.proxies = nodeNames;
  if (providerNames.length) source.use = providerNames;
  const health = { url: "https://www.gstatic.com/generate_204", interval: 300 };

  // DNS egress is bound to an Hrules-owned group that exists for this edition.
  // Node-domain bootstrap remains independent from the proxy to avoid a loop.
  const dnsProxyGroup = hasSystem("auto") ? "♻️ 自动选择 [系统]"
    : hasSystem("all") ? "🌐 全部节点 [系统]" : null;

  const mk = (name, type, extra={}) => Object.assign({name,type}, source, extra);
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
  // Strict sensitive scenes intentionally exclude global all/auto/fallback/load-balance.
  // Stable prefers same-region fallback but still permits explicit region/node selection.
  const sensitiveCandidates = editionSpec.sensitive_exit_policy === "restricted"
    ? [...sensitiveNames,...regionParent,...exact]
    : [...sensitiveNames,...regionParent,...available(["🌐 全部节点 [系统]"]),...exact];

  if (hasScene("sensitive_ai")) groups.push({name:"🔐 Claude / OpenAI [场景]",type:"select",proxies:sensitiveCandidates});
  groups.push({name:"🔐 重要账户 [场景]",type:"select",proxies:sensitiveCandidates});
  if (hasScene("general_ai")) groups.push({name:"🤖 AI 服务 [场景]",type:"select",proxies:normalCandidates});
  if (hasScene("youtube_media")) groups.push({name:"📺 YouTube [场景]",type:"select",proxies:mediaCandidates});
  groups.push({name:"💬 Telegram [场景]",type:"select",proxies:normalCandidates});
  groups.push({name:"🚀 漏网之鱼 [自选]",type:"select",proxies:mediaCandidates.length ? mediaCandidates : exact});
  config["proxy-groups"] = groups;

  config["dns"] = {
    enable: true,
    ipv6: false,
    "enhanced-mode": "fake-ip",
    "fake-ip-range": "198.18.0.1/16",
    "fake-ip-filter-mode": "blacklist",
    "fake-ip-filter": ["*.lan","*.local"],
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
      url:providerBase+"/"+id+".yaml",path:"./providers/"+id+".yaml",interval:21600};
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
  const hrulesRules = ["RULE-SET,hrules-private-direct,DIRECT"];
  if (hasScene("sensitive_ai")) hrulesRules.push("RULE-SET,hrules-sensitive-ai,🔐 Claude / OpenAI [场景]");
  hrulesRules.push("RULE-SET,hrules-crypto-account,🔐 重要账户 [场景]");
  hrulesRules.push("RULE-SET,hrules-us-banking-account,🔐 重要账户 [场景]");
  hrulesRules.push("RULE-SET,hrules-brokerage-account,🔐 重要账户 [场景]");
  hrulesRules.push("RULE-SET,hrules-financial-account,🔐 重要账户 [场景]");
  hrulesRules.push("RULE-SET,hrules-telegram,💬 Telegram [场景]");
  if (hasScene("general_ai")) hrulesRules.push("RULE-SET,hrules-general-ai,🤖 AI 服务 [场景]");
  if (hasScene("youtube_media")) hrulesRules.push("RULE-SET,hrules-youtube-media,📺 YouTube [场景]");
  hrulesRules.push("RULE-SET,hrules-cn-direct,DIRECT");
  hrulesRules.push("RULE-SET,hrules-cn-domain,DIRECT");
  hrulesRules.push("RULE-SET,hrules-cn-ip,DIRECT,no-resolve");
  config.rules = hrulesRules.concat(originalRules);
  config.mode = "rule";
  return config;
}
