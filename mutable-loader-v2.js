(() => {
  const PROBE_ID = "PREVIEW_TO_APPBLOCK_GESTURE_20261110_V1";
  const PROMPT = "CONTROLLED_PREVIEW_GESTURE_FOLLOWUP_CANARY_20261110";
  const title = "Controlled Preview gesture probe";
  let status = document.getElementById("status");

  if (!status) {
    status = document.createElement("p");
    status.id = "status";
    (document.body || document.documentElement).appendChild(status);
  }

  const record = (phase, detail = {}) => {
    const activation = navigator.userActivation
      ? {
          isActive: navigator.userActivation.isActive,
          hasBeenActive: navigator.userActivation.hasBeenActive,
        }
      : null;
    const result = { probe: PROBE_ID, phase, activation, ...detail };
    status.textContent = JSON.stringify(result);
    document.documentElement.dataset.previewGestureProbe = JSON.stringify(result);
  };

  const candidates = [];
  const seen = new Set();
  const add = (candidate, label) => {
    if (!candidate || seen.has(candidate)) return;
    seen.add(candidate);
    candidates.push({ candidate, label });
  };

  try {
    add(window, "self");
    add(parent, "parent");
    add(top, "top");

    for (let i = 0; i < top.frames.length; i += 1) {
      const outer = top.frames[i];
      add(outer, `top.frames[${i}]`);
      try {
        for (let j = 0; j < outer.frames.length; j += 1) {
          add(outer.frames[j], `top.frames[${i}].frames[${j}]`);
        }
      } catch (_) {
        // Cross-origin candidates are intentionally skipped below.
      }
    }
  } catch (_) {
    // Enumeration is best effort and never sends data off-page.
  }

  let callable = null;
  for (const entry of candidates) {
    try {
      if (
        entry.candidate.openai &&
        typeof entry.candidate.openai.sendFollowUpMessage === "function"
      ) {
        callable = entry;
        break;
      }
    } catch (_) {
      // Ignore cross-origin candidates.
    }
  }

  if (!callable) {
    record("no-callable-sibling", { candidateCount: candidates.length });
    return;
  }

  record("calling", { target: callable.label, candidateCount: candidates.length });
  try {
    Promise.resolve(
      callable.candidate.openai.sendFollowUpMessage({ prompt: PROMPT, title }),
    ).then(
      () => record("resolved", { target: callable.label }),
      (error) =>
        record("rejected", {
          target: callable.label,
          error: String(error && error.message ? error.message : error),
        }),
    );
  } catch (error) {
    record("threw", {
      target: callable.label,
      error: String(error && error.message ? error.message : error),
    });
  }
})();
