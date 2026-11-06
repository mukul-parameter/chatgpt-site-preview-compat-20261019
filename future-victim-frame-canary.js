const statusNode = document.getElementById("status");
const ownOuterFrame = window.parent;
const victimOnlyCanary = "VICTIM_PRIVATE_PREVIEW_20261106";

function checkFutureVictimPreview() {
  let visible = false;

  for (let index = 0; index < window.top.length; index += 1) {
    try {
      const siblingOuterFrame = window.top.frames[index];

      if (siblingOuterFrame === ownOuterFrame || siblingOuterFrame.length < 1) {
        continue;
      }

      const siblingText =
        siblingOuterFrame.frames[0].document.body?.innerText ?? "";

      if (siblingText.includes(victimOnlyCanary)) {
        visible = true;
        break;
      }
    } catch {
      // Different-origin frames are expected and are intentionally ignored.
    }
  }

  if (statusNode) {
    statusNode.textContent = visible
      ? "VICTIM_PRIVATE_PREVIEW_VISIBLE"
      : "VICTIM_PRIVATE_PREVIEW_NOT_FOUND";
  }
}

checkFutureVictimPreview();
setInterval(checkFutureVictimPreview, 500);
