import axios from "axios";

export const phishing = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Email text is required" });
  }

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          {
            parts: [
              {
                text: `Analyze the following email and answer in the following strict JSON format only, without any markdown, explanation, or commentary:

{
  "score": "Low" | "Medium" | "High",
  "label": "Safe" | "Suspicious" | "Phishing",
  "explanation": "A full sentence explaining why this label and score were given."
}

Email:
"""${text}"""`,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.API_KEY,
        },
      }
    );

    let rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    console.log("Raw Gemini Response:", rawText);

    // Remove markdown formatting if any
    rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (parseError) {
      console.error("Parsing Error:", parseError);
      return res.status(500).json({
        error: "Invalid response format from Gemini",
        rawText,
      });
    }

    // Ensure required fields are present
    const { score, label, explanation } = parsed;

    if (!score || !label || !explanation) {
      return res.status(500).json({
        error: "Incomplete response from Gemini",
        rawText,
      });
    }

    res.json({ score, label, explanation });
  } catch (err) {
    console.error("Gemini API Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to analyze text" });
  }
};
