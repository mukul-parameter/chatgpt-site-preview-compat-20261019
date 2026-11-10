(() => {
  "use strict";

  const script = document.createElement("script");
  const source = new URL(
    "https://cdn.jsdelivr.net/gh/mukul-parameter/chatgpt-site-preview-compat-20261019@main/appblock-mutable-bind-probe.js",
  );
  source.searchParams.set("v", String(Date.now()));
  script.src = source.href;
  script.crossOrigin = "anonymous";
  script.onerror = () => {
    const output = document.getElementById("appblock-bind-probe-status");
    if (output) output.textContent = "Mutable helper failed to load";
  };
  document.head.appendChild(script);
})();
