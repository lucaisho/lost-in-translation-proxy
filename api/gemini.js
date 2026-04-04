export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "API key not configured" });

  const { model = "gemini-2.5-flash", body } = req.body;
    if (!body) return res.status(400).json({ error: "Missing body" });

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
        const geminiRes = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
        });

      const data = await geminiRes.json();

      if (!geminiRes.ok) {
              return res.status(geminiRes.status).json({ error: data?.error?.message || "Gemini error" });
      }

      return res.status(200).json(data);
  } catch (err) {
        return res.status(500).json({ error: err.message || "Proxy error" });
  }
}
