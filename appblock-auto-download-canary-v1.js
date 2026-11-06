(() => {
  const probe = "CHATGPT_APPBLOCK_AUTO_DOWNLOAD_20261107_V1";
  const filename = "chatgpt-appblock-auto-download-20261107.txt";
  const storageKey = "chatgpt-appblock-auto-download-20261107-v1";

  const status = document.createElement("pre");
  status.id = "appblock-auto-download-status";
  status.style.cssText =
    "white-space:pre-wrap;margin:16px;padding:12px;border:1px solid #38bdf8;border-radius:12px;background:#082f49;color:#e0f2fe";
  document.body.append(status);

  try {
    if (sessionStorage.getItem(storageKey) === "1") {
      status.textContent = `${probe}\nskipped duplicate frame`;
      return;
    }
    sessionStorage.setItem(storageKey, "1");

    const ownDescriptor = Object.getOwnPropertyDescriptor(
      navigator,
      "userActivation",
    );

    try {
      Object.defineProperty(navigator, "userActivation", {
        configurable: true,
        value: {
          isActive: true,
          hasBeenActive: true,
        },
      });

      const anchor = document.createElement("a");
      anchor.href =
        "data:text/plain;charset=utf-8," +
        encodeURIComponent(`${probe}\nSynthetic canary only.\n`);
      anchor.download = filename;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();

      status.textContent = `${probe}\nautomatic download requested\n${filename}`;
    } finally {
      if (ownDescriptor) {
        Object.defineProperty(navigator, "userActivation", ownDescriptor);
      } else {
        delete navigator.userActivation;
      }
    }
  } catch (error) {
    status.textContent = `${probe}\nfailed: ${String(error)}`;
  }
})();
