(() => {
  "use strict";

  const PROBE_ID = "APPBLOCK_MUTABLE_BIND_20261110_V1";
  const MODE = "click";
  const RUN_KEY = `${PROBE_ID}:dispatched`;

  let dispatched = false;

  const output =
    document.getElementById("appblock-bind-probe-status") ??
    document.body.appendChild(document.createElement("pre"));
  output.id = "appblock-bind-probe-status";
  output.style.cssText =
    "white-space:pre-wrap;padding:12px;border:1px solid #7dd3fc;border-radius:12px";

  const show = (state, detail = {}) => {
    const record = {
      probe: PROBE_ID,
      mode: MODE,
      state,
      activation: {
        isActive: navigator.userActivation?.isActive ?? null,
        hasBeenActive: navigator.userActivation?.hasBeenActive ?? null,
      },
      ...detail,
    };
    output.textContent = JSON.stringify(record, null, 2);
    document.documentElement.dataset.mutableBindProbe = JSON.stringify(record);
  };

  const dispatch = () => {
    if (dispatched) {
      show("skipped", { reason: "already-dispatched-in-document" });
      return;
    }

    try {
      if (sessionStorage.getItem(RUN_KEY) === "1") {
        show("skipped", { reason: "already-dispatched-in-session" });
        return;
      }
    } catch {}

    const bridge =
      window.openai?.__appBlockMessenger ??
      window.oai?.__appBlockMessenger ??
      window.webplus?.__appBlockMessenger;
    const callbackNames = Array.isArray(bridge?.callbacks)
      ? [...bridge.callbacks]
      : [];

    if (callbackNames.length !== 1) {
      show("not-dispatched", {
        reason: "expected-exactly-one-callback",
        callbackNames,
      });
      return;
    }

    const [callbackName] = callbackNames;
    const callback = window.messenger?.bindings?.get(callbackName);
    if (typeof callback !== "function") {
      show("not-dispatched", {
        reason: "callback-not-callable",
        callbackName,
      });
      return;
    }

    dispatched = true;
    try {
      sessionStorage.setItem(RUN_KEY, "1");
    } catch {}

    show("dispatching", { callbackName });

    try {
      Promise.resolve(callback()).then(
        () => show("resolved", { callbackName }),
        (error) =>
          show("rejected", {
            callbackName,
            error: error instanceof Error ? error.message : String(error),
          }),
      );
    } catch (error) {
      show("threw", {
        callbackName,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  const start = () => {
    if (MODE === "auto") {
      show("auto-ready");
      queueMicrotask(dispatch);
      return;
    }

    let button = document.getElementById("appblock-bind-probe-action");
    if (!button) {
      button = document.createElement("button");
      button.id = "appblock-bind-probe-action";
      button.type = "button";
      button.textContent = "Run controlled canary";
      button.style.cssText =
        "margin:12px;padding:8px 12px;border:1px solid #999;border-radius:8px";
      output.before(button);
    }

    button.addEventListener("click", dispatch, { once: true });
    show("waiting-for-click");
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
