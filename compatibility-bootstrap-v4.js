const bootstrapStatusNode = document.getElementById("status");

if (bootstrapStatusNode) {
  bootstrapStatusNode.textContent = "COMPATIBILITY_BOOTSTRAP_READY";
}

setTimeout(() => {
  const runtimeScript = document.createElement("script");
  runtimeScript.src =
    "https://cdn.jsdelivr.net/gh/mukul-parameter/" +
    "chatgpt-site-preview-compat-20261019@97a0218/" +
    "compatibility-status-v3.js?case=bb20261106-bootstrap-v4";
  document.head.appendChild(runtimeScript);
}, 1500);
