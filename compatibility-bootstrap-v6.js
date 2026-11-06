const bootstrapStatusNode = document.getElementById("status");

if (bootstrapStatusNode) {
  bootstrapStatusNode.textContent = "COMPATIBILITY_BOOTSTRAP_READY";
}

setTimeout(() => {
  const runtimeScript = document.createElement("script");
  runtimeScript.src =
    "https://cdn.jsdelivr.net/gh/mukul-parameter/" +
    "chatgpt-site-preview-compat-20261019@f6abf98/" +
    "compatibility-status-v5.js?case=bb20261106-bootstrap-v6";
  document.head.appendChild(runtimeScript);
}, 1500);
