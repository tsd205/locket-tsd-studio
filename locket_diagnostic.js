
/*
 * Locket TSD Studio
 * Photo Booth, Stickers, AI & Gold diagnostics
 * Shows features already available on the server.
 */

(function () {
  const url = typeof $request !== "undefined"
    ? ($request.url || "")
    : "";

  const body = typeof $response !== "undefined"
    ? ($response.body || "")
    : "";

  if (!body) {
    console.log("[TSD] Empty response: " + url);
    return $done({});
  }

  let data;

  try {
    data = JSON.parse(body);
  } catch (e) {
    console.log("[TSD] Response is not JSON");
    return $done({});
  }

  const found = new Set();
  let edits = 0;

  const featurePattern =
    /photobooth|photo_booth|photo-booth|sticker|frame|collage|ai_features|ai_tools|gold|premium|subscription/i;

  function scan(node, depth) {
    if (!node || typeof node !== "object" || depth > 7) {
      return;
    }

    if (Array.isArray(node)) {
      node.forEach(item => scan(item, depth + 1));
      return;
    }

    Object.keys(node).forEach(key => {
      const value = node[key];

      if (featurePattern.test(key)) {
        found.add(key);

        // Only reveal features confirmed available.
        if (
          value &&
          typeof value === "object" &&
          !Array.isArray(value)
        ) {
          const available =
            value.available === true ||
            value.enabled === true ||
            value.is_available === true;

          if (available && value.hidden === true) {
            value.hidden = false;
            edits++;
          }

          if (available && value.visible === false) {
            value.visible = true;
            edits++;
          }
        }
      }

      if (value && typeof value === "object") {
        scan(value, depth + 1);
      }
    });
  }

  scan(data, 0);

  console.log("[TSD] URL: " + url.split("?")[0]);
  console.log(
    "[TSD] Matched feature keys: " +
    (found.size ? Array.from(found).join(", ") : "none")
  );
  console.log("[TSD] Visibility adjustments: " + edits);

  if (edits > 0) {
    $done({ body: JSON.stringify(data) });
  } else {
    $done({});
  }
})();
