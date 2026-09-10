function json(body, status) {
  return new Response(JSON.stringify(body), {
    status: status || 200,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}

function validate(data) {
  if (!data || typeof data !== "object") return "Expected a JSON object.";
  if (!data.name || typeof data.name !== "string") return "Name is required.";
  if (!data.email || typeof data.email !== "string") return "Email is required.";
  if (!data.message || typeof data.message !== "string") return "Message is required.";
  return null;
}

function htmlFields(data) {
  return Object.entries(data)
    .map(function (entry) {
      return "<div><strong>" + entry[0] + ":</strong> " + String(entry[1]).replace(/</g, "&lt;") + "</div>";
    })
    .join("");
}

export async function onRequest(context) {
  const request = context.request;
  const env = context.env || {};

  if (request.method !== "POST") {
    return json({ success: false, message: "Method not allowed." }, 405);
  }

  let data;
  try {
    data = await request.json();
  } catch (_) {
    return json({ success: false, message: "Invalid JSON payload." }, 400);
  }

  const invalid = validate(data);
  if (invalid) {
    return json({ success: false, message: invalid }, 400);
  }

  const endpoint = env.FORMSPREE_ENDPOINT;

  if (endpoint) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        return json({ success: false, message: "Delivery service rejected the request." }, 502);
      }
      return json({ success: true, message: "Enquiry forwarded." });
    } catch (_) {
      return json({ success: false, message: "Delivery service unreachable." }, 502);
    }
  }

  return json({
    success: true,
    message:
      "Enquiry received. FORMSPREE_ENDPOINT is not configured, so the browser handles delivery (mailto fallback)."
  });
}