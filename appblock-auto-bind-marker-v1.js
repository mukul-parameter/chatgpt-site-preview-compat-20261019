(() => {
  "use strict";

  const PROBE_ID = "APPBLOCK_BIND_AUTO_20261107_V1";

  function showStatus(message, details = {}) {
    document.documentElement.dataset.appBlockBindProbe = PROBE_ID;
    document.documentElement.dataset.appBlockBindStatus = message;

    let output = document.getElementById("appblock-bind-probe-status");
    if (!output) {
      output = document.createElement("pre");
      output.id = "appblock-bind-probe-status";
      output.style.cssText = [
        "box-sizing:border-box",
        "margin:12px",
        "padding:12px",
        "border:1px solid #999",
        "border-radius:8px",
        "white-space:pre-wrap",
        "font:13px/1.4 ui-monospace,monospace",
      ].join(";");
      (document.body || document.documentElement).appendChild(output);
    }

    output.textContent = JSON.stringify(
      { probe: PROBE_ID, status: message, ...details },
      null,
      2,
    );
  }

  function run() {
    const bridge =
      window.openai?.__appBlockMessenger ??
      window.oai?.__appBlockMessenger ??
      window.webplus?.__appBlockMessenger;
    const callbackNames = Array.isArray(bridge?.callbacks)
      ? [...bridge.callbacks]
      : [];

    if (callbackNames.length !== 1) {
      showStatus("not-invoked", {
        reason: "expected-exactly-one-callback",
        callbackNames,
      });
      return;
    }

    const [name] = callbackNames;
    const callback = window.messenger?.bindings?.get(name);
    if (typeof callback !== "function") {
      showStatus("not-invoked", {
        reason: "callback-not-callable",
        callbackNames,
      });
      return;
    }

    showStatus("dispatching", { callbackName: name });
    callback();
    showStatus("dispatched", { callbackName: name });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    queueMicrotask(run);
  }
})();
