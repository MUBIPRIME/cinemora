import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { catalog } from "@/data/catalog";

export type Pick = { id: string; reason: string };
export type RecommendResult = { picks: Pick[]; note: string };

const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    picks: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string", description: "id of a title from the provided list" },
          reason: { type: "string", description: "one short sentence on why it matches" },
        },
        required: ["id", "reason"],
      },
    },
    note: { type: "string", description: "one friendly sentence summarising the mood of these picks" },
  },
  required: ["picks", "note"],
};

export const recommendTitles = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ prompt: z.string().min(2).max(500) }).parse(data))
  .handler(async ({ data }): Promise<RecommendResult> => {
    const key = process.env['LOVABLE_API_KEY'];
    if (!key) throw new Error("Recommendations are unavailable right now.");

    const library = catalog.map(m => `${m.id} | ${m.title} (${m.year}, ${m.type}) | ${m.genres.join('/')} | rated ${m.rating} | ${m.description.slice(0, 160)}`).join("\n");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "fetch" },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        stream: true,
        reasoning: { effort: "low", summary: "auto" },
        include: ["reasoning.encrypted_content"],
        input: [
          { role: "developer", content: [{ type: "input_text", text: "You are CINEMORA's film concierge. Choose 3 to 6 titles ONLY from the library list below that best match the viewer's request. Use the exact id values. Never invent titles.\n\nLIBRARY:\n" + library }] },
          { role: "user", content: [{ type: "input_text", text: data.prompt }] },
        ],
        text: { format: { type: "json_schema", name: "recommendations", strict: true, schema } },
      }),
    });

    if (!res.ok || !res.body) {
      if (res.status === 429) throw new Error("Too many requests right now — please try again in a moment.");
      if (res.status === 402 || res.status === 403) throw new Error("AI recommendations are temporarily unavailable on this workspace.");
      throw new Error("Could not generate recommendations. Please try again.");
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "", text = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const evt = JSON.parse(payload) as { type?: string; delta?: string; response?: { output_text?: string } };
          if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") text += evt.delta;
          else if (evt.type === "response.completed" && evt.response?.output_text) text = evt.response.output_text;
        } catch { /* ignore keep-alives */ }
      }
    }

    let parsed: RecommendResult;
    try { parsed = JSON.parse(text) as RecommendResult } catch { throw new Error("Could not read the recommendations. Please try again.") }
    const ids = new Set(catalog.map(m => m.id));
    const picks = (parsed.picks ?? []).filter(p => ids.has(p.id)).slice(0, 6);
    if (picks.length === 0) throw new Error("No matching stories found for that request. Try describing a mood or genre.");
    return { picks, note: parsed.note ?? "" };
  });
