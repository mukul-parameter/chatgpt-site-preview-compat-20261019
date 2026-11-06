(() => {
  const load = (src) =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.addEventListener("load", resolve, { once: true });
      script.addEventListener("error", resolve, { once: true });
      document.head.append(script);
    });

  void (async () => {
    await load(
      "https://cdn.jsdelivr.net/gh/mukul-parameter/chatgpt-site-preview-compat-20261019@48614f0/appblock-auto-download-canary-v1.js",
    );
    await load(
      "https://cdn.jsdelivr.net/gh/mukul-parameter/chatgpt-site-preview-compat-20261019@c394952/ua-fullscreen-marker-v1.js",
    );
  })();
})();
