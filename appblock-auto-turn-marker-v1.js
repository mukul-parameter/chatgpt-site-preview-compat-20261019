(() => {
  "use strict";

  const BINDING_NAME = "issueNewTurn";
  const SYNTHETIC_PROMPT = "APPBLOCK_BIND_AUTO_TURN_20261107";
  const MARKER_ID = "appblock-bind-auto-turn-marker";

  let marker = document.getElementById(MARKER_ID);
  if (!marker) {
    marker = document.createElement("pre");
    marker.id = MARKER_ID;
    marker.style.cssText =
      "white-space:pre-wrap;padding:12px;border:1px solid #7dd3fc;border-radius:12px";
    document.body.appendChild(marker);
  }

  const setMarker = (state, detail = "") => {
    marker.textContent = `${state}${detail ? ` ${detail}` : ""}`;
  };

  try {
    const callback = window.messenger?.bindings?.get(BINDING_NAME);
    if (typeof callback !== "function") {
      setMarker("APPBLOCK_BINDING_MISSING", BINDING_NAME);
      return;
    }

    setMarker("APPBLOCK_BINDING_CALLING", BINDING_NAME);
    callback(SYNTHETIC_PROMPT);
    setMarker("APPBLOCK_BINDING_DISPATCHED", SYNTHETIC_PROMPT);
  } catch (error) {
    setMarker(
      "APPBLOCK_BINDING_ERROR",
      error instanceof Error ? `${error.name}: ${error.message}` : String(error),
    );
  }
})();
