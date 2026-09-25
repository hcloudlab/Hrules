// GENERATED from Hrules Core edition contract. Do not edit directly.
// Hrules Mihomo Standard / 标准版
const HRULES_EDITION = "standard";
const HRULES_EDITION_SPEC = {"system_groups":[],"region_groups":true,"same_region_failover":false,"scene_groups":["mainstream_proxy","streaming_media","general_ai","financial_service","apple_global"],"scene_granularity":"standard","sensitive_exit_policy":"manual_region_or_node"};

// Hrules Clash Verge Rev Subscription Adapter v0.2
// Hrules owns its routing topology and terminal catch-all. The active profile
// continues to own nodes, providers, TUN, ports and credentials.

function main(config) {
  const edition = (typeof HRULES_EDITION !== "undefined") ? HRULES_EDITION : "strict";
  const editionSpec = (typeof HRULES_EDITION_SPEC !== "undefined") ? HRULES_EDITION_SPEC : {
    system_groups: [], region_groups: true, same_region_failover: false,
    scene_groups: ["sensitive_ai","crypto_account","us_banking_account","brokerage_account","financial_account","general_ai","youtube_media","mainstream_proxy","apple_global"],
    scene_granularity: "fine", sensitive_exit_policy: "manual_region_or_node"
  };
  const fine = editionSpec.scene_granularity === "fine" || edition === "strict";
  const providerBase = "https://raw.githubusercontent.com/hcloudlab/Hrules/main/mihomo/scenes";

  const rawNodeNames = Array.isArray(config.proxies)
    ? config.proxies.map(p => p && p.name).filter(n => typeof n === "string" && n.length)
    : [];
  const metadataNode = /(剩余流量|流量剩余|套餐到期|到期时间|有效期|官网|官方|(?:^|[\s:：|｜_-])(traffic|remaining|expire|expiry|expires|quota|bandwidth|website|homepage)(?=[\s:：|｜_-]|$))/i;
  const nodeNames = rawNodeNames.filter(n => !metadataNode.test(n));
  const providerNames = config["proxy-providers"] && typeof config["proxy-providers"] === "object"
    ? Object.keys(config["proxy-providers"]) : [];
  if (!nodeNames.length && !providerNames.length) return config;

  const hrulesRulePrefix = "RULE-SET,hrules-";
  const originalRules = Array.isArray(config.rules)
    ? config.rules.filter(r => !(typeof r === "string" && r.startsWith(hrulesRulePrefix)))
    : [];
  const nonTerminalHostRules = originalRules.filter(r =>
    !(typeof r === "string" && /^(MATCH|FINAL),/i.test(r.trim()))
  );

  const existingGroups = Array.isArray(config["proxy-groups"]) ? config["proxy-groups"] : [];
  const owned = new Set([
    "🌐 全部节点 [系统]","♻️ 自动选择 [系统]","🛡️ 故障转移 [系统]","⚖️ 负载均衡 [系统]","🌍 地区 [系统]",
    "🇺🇸 美国 [地区]","🇯🇵 日本 [地区]","🇸🇬 新加坡 [地区]","🇭🇰 香港 [地区]","🇹🇼 台湾 [地区]","🇰🇷 韩国 [地区]","🇬🇧 英国 [地区]","🇩🇪 德国 [地区]","🌐 未分类 [地区]",
    "🔐 Claude / OpenAI [场景]","💰 虚拟货币 [场景]","🏦 美国账户 [场景]","🔐 重要账户 [场景]","🏦 美国银行 [场景]","📈 美股 [场景]","💳 金融账户 [场景]","📺 影音媒体 [场景]","📺 YouTube [场景]","💬 Telegram [场景]","🌐 国际服务 [场景]",
    "🌐 海外应用 [场景]","📺 流媒体 [场景]","🤖 AI 服务 [场景]","🍎 Apple / iCloud [场景]","🏦 银行服务 [场景]","📈 证券 / 券商 [场景]","💳 支付 / 跨境金融 [场景]","💳 金融服务 [场景]","🚀 漏网之鱼 [自选]","🛰️ Hrules 基础设施 [系统]"
  ]);
  const groups = existingGroups.filter(g => !(g && owned.has(g.name)));

  const source = {};
  if (nodeNames.length) source.proxies = nodeNames;
  if (providerNames.length) {
    source.use = providerNames;
    source["exclude-filter"] = "剩余|到期|有效期|官网|官方|traffic|remaining|expire|expiry|quota|bandwidth|website|homepage";
  }
  const health = {url:"https://www.gstatic.com/generate_204",interval:300};
  const infraGroup = "🛰️ Hrules 基础设施 [系统]";
  // Hidden/non-scene transport group: provider downloads may use it, user scenes may not.
  const infraCandidates = nodeNames.length ? nodeNames : [];
  if (infraCandidates.length) groups.push({name:infraGroup,type:"select",proxies:infraCandidates});
  const sceneGroup = (name, list) => list.length ? {name,type:"select",proxies:list} : Object.assign({name,type:"select"},source);

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

  const regionMembers = new Map(regions.map(([,name]) => [name, []]));
  const unclassified = [];
  if (nodeNames.length && editionSpec.region_groups) {
    for (const node of nodeNames) {
      const matches = regions.filter(([, , re]) => re.test(node));
      if (matches.length === 1) regionMembers.get(matches[0][1]).push(node);
      else unclassified.push(node);
    }
  }

  const regionNames = [];
  for (const [,name] of regions) {
    const members = regionMembers.get(name) || [];
    if (!members.length) continue;
    regionNames.push(name);
    groups.push({name,type:"url-test",proxies:members,...health,tolerance:50});
  }
  if (unclassified.length) {
    regionNames.push("🌐 未分类 [地区]");
    groups.push({name:"🌐 未分类 [地区]",type:"select",proxies:unclassified});
  }

  const exact = nodeNames.slice();
  const sceneCandidates = [...regionNames,...exact];

  if (fine) {
    groups.push(sceneGroup("🌐 海外应用 [场景]",sceneCandidates));
    groups.push(sceneGroup("📺 流媒体 [场景]",sceneCandidates));
    groups.push(sceneGroup("🤖 AI 服务 [场景]",sceneCandidates));
    groups.push(sceneGroup("🍎 Apple / iCloud [场景]",sceneCandidates));
    groups.push(sceneGroup("🏦 银行服务 [场景]",sceneCandidates));
    groups.push(sceneGroup("📈 证券 / 券商 [场景]",sceneCandidates));
    groups.push(sceneGroup("💳 支付 / 跨境金融 [场景]",sceneCandidates));
    groups.push(sceneGroup("💰 虚拟货币 [场景]",sceneCandidates));
  } else {
    groups.push(sceneGroup("🌐 海外应用 [场景]",sceneCandidates));
    groups.push(sceneGroup("📺 流媒体 [场景]",sceneCandidates));
    groups.push(sceneGroup("🤖 AI 服务 [场景]",sceneCandidates));
    groups.push(sceneGroup("💳 金融服务 [场景]",sceneCandidates));
  }
  groups.push(sceneGroup("🚀 漏网之鱼 [自选]",sceneCandidates.length ? sceneCandidates : exact));
  config["proxy-groups"] = groups;

  config["dns"] = fine ? {
    enable:true,ipv6:false,"enhanced-mode":"fake-ip","fake-ip-range":"198.18.0.1/16",
    "fake-ip-filter-mode":"blacklist",
    "fake-ip-filter":["+.lan","+.local","+.home.arpa","localhost.ptlogin2.qq.com","time.*.com","ntp.*.com","+.pool.ntp.org","+.msftconnecttest.com","+.msftncsi.com"],
    "default-nameserver":["223.5.5.5","119.29.29.29"],
    "proxy-server-nameserver":["https://223.5.5.5/dns-query","https://1.1.1.1/dns-query","https://8.8.8.8/dns-query"],
    "direct-nameserver":["223.5.5.5","119.29.29.29"],
    "direct-nameserver-follow-policy":false,
    nameserver:["https://1.1.1.1/dns-query","https://8.8.8.8/dns-query"]
  } : {
    enable:true,ipv6:false,"enhanced-mode":"fake-ip","fake-ip-range":"198.18.0.1/16",
    "fake-ip-filter-mode":"blacklist",
    "fake-ip-filter":["+.lan","+.local","+.home.arpa","localhost.ptlogin2.qq.com","time.*.com","ntp.*.com","+.pool.ntp.org","+.msftconnecttest.com","+.msftncsi.com"],
    "default-nameserver":["223.5.5.5","119.29.29.29"],
    "proxy-server-nameserver":["https://223.5.5.5/dns-query","https://1.1.1.1/dns-query","https://8.8.8.8/dns-query"],
    nameserver:["223.5.5.5","119.29.29.29"]
  };

  const providers = Object.assign({}, config["rule-providers"] || {});
  const defs = [
    ["hrules-private-direct","private_direct"],["hrules-network-test","network_test"],
    ["hrules-sensitive-ai","sensitive_ai"],["hrules-crypto-account","crypto_account"],
    ["hrules-us-banking-account","us_banking_account"],["hrules-brokerage-account","brokerage_account"],
    ["hrules-financial-account","financial_account"],["hrules-telegram","telegram"],
    ["hrules-general-ai","general_ai"],["hrules-youtube-media","youtube_media"],
    ["hrules-streaming-media","streaming_media"],["hrules-mainstream-proxy","mainstream_proxy"],
    ["hrules-apple-global","apple_global"],["hrules-apple-intelligence-route","apple_intelligence_route"],
    ["hrules-apple-private-relay-route","apple_private_relay_route"],["hrules-cn-direct","cn_direct"]
  ];
  for (const [key,id] of defs) {
    providers[key]={type:"http",behavior:"classical",format:"yaml",url:providerBase+"/"+id+".yaml",path:"./providers/"+id+".yaml",interval:21600,proxy:infraGroup};
  }
  providers["hrules-cn-domain"]={type:"http",behavior:"domain",format:"mrs",url:"https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/cn.mrs",path:"./providers/hrules-cn-domain.mrs",interval:21600,proxy:infraGroup};
  providers["hrules-cn-ip"]={type:"http",behavior:"ipcidr",format:"mrs",url:"https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/cn.mrs",path:"./providers/hrules-cn-ip.mrs",interval:21600,proxy:infraGroup};
  config["rule-providers"]=providers;

  // Sniff only to recover destination metadata; never rewrite the destination.
  config["sniffer"]={
    enable:true,
    "force-dns-mapping":true,
    "parse-pure-ip":true,
    "override-destination":false,
    sniff:{HTTP:{ports:[80,"8080-8880"]},TLS:{ports:[443,8443]},QUIC:{ports:[443,8443]}}
  };

  // Minimal offline anchor: first-party/service-core only. Shared third-party
  // infrastructure must remain in reviewed providers, never in this seed.
  config.hosts=Object.assign({},config.hosts||{},{
    "hrules-seed.invalid":"127.0.0.1"
  });
  const r=["RULE-SET,hrules-private-direct,DIRECT,no-resolve","RULE-SET,hrules-cn-direct,DIRECT"];
  r.push("RULE-SET,hrules-network-test,🤖 AI 服务 [场景]");
  r.push("RULE-SET,hrules-sensitive-ai,🤖 AI 服务 [场景]");
  r.push("RULE-SET,hrules-general-ai,🤖 AI 服务 [场景]");
  r.push("RULE-SET,hrules-apple-intelligence-route,🤖 AI 服务 [场景]");
  if (fine) {
    r.push("RULE-SET,hrules-crypto-account,💰 虚拟货币 [场景]");
    r.push("RULE-SET,hrules-us-banking-account,🏦 银行服务 [场景]");
    r.push("RULE-SET,hrules-brokerage-account,📈 证券 / 券商 [场景]");
    r.push("RULE-SET,hrules-financial-account,💳 支付 / 跨境金融 [场景]");
  } else {
    r.push("RULE-SET,hrules-crypto-account,💳 金融服务 [场景]");
    r.push("RULE-SET,hrules-us-banking-account,💳 金融服务 [场景]");
    r.push("RULE-SET,hrules-brokerage-account,💳 金融服务 [场景]");
    r.push("RULE-SET,hrules-financial-account,💳 金融服务 [场景]");
  }
  r.push("RULE-SET,hrules-streaming-media,📺 流媒体 [场景]");
  r.push("RULE-SET,hrules-youtube-media,🌐 海外应用 [场景]");
  r.push("RULE-SET,hrules-telegram,🌐 海外应用 [场景],no-resolve");
  r.push("RULE-SET,hrules-apple-private-relay-route,"+(fine ? "🍎 Apple / iCloud [场景]" : "🌐 海外应用 [场景]"));
  r.push("RULE-SET,hrules-apple-global,"+(fine ? "🍎 Apple / iCloud [场景]" : "🌐 海外应用 [场景]"));
  r.push("RULE-SET,hrules-mainstream-proxy,🌐 海外应用 [场景]");
  r.push("RULE-SET,hrules-cn-domain,DIRECT");
  r.push("RULE-SET,hrules-cn-ip,DIRECT,no-resolve");

  config.rules=r.concat(nonTerminalHostRules,["MATCH,🚀 漏网之鱼 [自选]"]);
  config.mode="rule";
  return config;
}
