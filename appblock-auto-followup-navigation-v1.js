(() => {
  "use strict";

  const PROBE_ID = "APPBLOCK_AUTO_FOLLOWUP_NAVIGATION_20261110_V1";
  const PROMPT = "CONTROLLED_AUTO_FOLLOWUP_NAVIGATION_CANARY_20261110";

  const status = document.createElement("pre");
  status.id = "appblock-auto-followup-navigation-status";
  status.style.cssText =
    "white-space:pre-wrap;padding:12px;border:1px solid #7dd3fc;border-radius:12px";
  (document.body || document.documentElement).appendChild(status);

  const show = (state, detail = {}) => {
    document.documentElement.dataset.autoFollowupProbe = PROBE_ID;
    document.documentElement.dataset.autoFollowupState = state;
    status.textContent = JSON.stringify(
      {
        probe: PROBE_ID,
        state,
        userActivation: {
          isActive: navigator.userActivation?.isActive ?? null,
          hasBeenActive: navigator.userActivation?.hasBeenActive ?? null,
        },
        ...detail,
      },
      null,
      2,
    );
  };

  const run = () => {
    const send = window.openai?.sendFollowUpMessage;
    if (typeof send !== "function") {
      show("unavailable");
      return;
    }

    show("pending");
    void send({
      prompt: PROMPT,
      isVisible: false,
      title: "Controlled navigation-gesture probe",
    }).then(
      () => show("resolved"),
      (error) =>
        show("rejected", {
          error:
            error instanceof Error
              ? `${error.name}: ${error.message}`
              : String(error),
        }),
    );
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    queueMicrotask(run);
  }
})();
