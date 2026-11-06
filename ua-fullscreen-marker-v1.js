(async () => {
  const marker = document.getElementById("ua-host-marker");
  const outerNavigator = parent.navigator;
  const previous = Object.getOwnPropertyDescriptor(
    outerNavigator,
    "userActivation",
  );

  try {
    Object.defineProperty(outerNavigator, "userActivation", {
      configurable: true,
      value: { hasBeenActive: true, isActive: true },
    });

    const result = await window.openai.requestDisplayMode({
      mode: "fullscreen",
    });
    document.body.dataset.uaFullscreenResult = JSON.stringify(result);
    if (marker) {
      marker.textContent =
        "APP_BLOCK_PARENT_UA_FULLSCREEN_ACTIVE_20261107 " +
        JSON.stringify(result);
    }
  } catch (error) {
    document.body.dataset.uaFullscreenError = String(error);
    if (marker) {
      marker.textContent =
        "APP_BLOCK_PARENT_UA_FULLSCREEN_ERROR_20261107 " + String(error);
    }
  } finally {
    if (previous) {
      Object.defineProperty(outerNavigator, "userActivation", previous);
    } else {
      delete outerNavigator.userActivation;
    }
  }
})();
