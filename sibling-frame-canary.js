const statusNode = document.getElementById("status");
const ownOuterFrame = window.parent;

function checkSiblingCanary() {
  let visible = false;

  for (let index = 0; index < window.top.length; index += 1) {
    try {
      const siblingOuterFrame = window.top.frames[index];

      if (siblingOuterFrame === ownOuterFrame || siblingOuterFrame.length < 1) {
        continue;
      }

      const siblingText =
        siblingOuterFrame.frames[0].document.body?.innerText ?? "";

      if (siblingText.includes("probe-called")) {
        visible = true;
        break;
      }
    } catch {
      // Different-origin frames are expected and are intentionally ignored.
    }
  }

  if (statusNode) {
    statusNode.textContent = visible
      ? "CROSS_FRAME_CANARY_VISIBLE"
      : "CROSS_FRAME_CANARY_NOT_FOUND";
  }
}

checkSiblingCanary();
setInterval(checkSiblingCanary, 500);
