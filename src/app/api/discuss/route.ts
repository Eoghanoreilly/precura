import Anthropic from "@anthropic-ai/sdk";
import { buildAnnaSystemPrompt } from "@/lib/discuss/system-prompt";

export const runtime = "nodejs";

// ============================================================================
// POST /api/discuss
//
// Streams a Claude response to the browser as Server-Sent Events. The full
// patient file is injected as a cached system prompt so every turn reads
// Anna's complete record without re-paying for the tokens.
//
// Model: claude-opus-4-6 with adaptive thinking.
// Caching: cache_control on the system prompt (one breakpoint).
// ============================================================================

interface Turn {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  messages: Turn[];
}

const client = new Anthropic();

export async function POST(req: Request) {
  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return new Response(
      JSON.stringify({ error: "messages array is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Map turns to Anthropic's MessageParam shape. Drop any empty assistant
  // placeholders the client might send while it's building up the thread.
  const apiMessages: Anthropic.MessageParam[] = body.messages
    .filter((m) => m.content && m.content.trim().length > 0)
    .map((m) => ({
      role: m.role,
      content: m.content,
    }));

  if (apiMessages.length === 0) {
    return new Response(
      JSON.stringify({ error: "messages array has no non-empty content" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (apiMessages[0].role !== "user") {
    return new Response(
      JSON.stringify({ error: "first message must be from the user" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const encoder = new TextEncoder();

  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      function emit(kind: string, payload: Record<string, unknown> = {}) {
        const data = JSON.stringify({ kind, ...payload });
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      }

      try {
        const stream = client.messages.stream({
          model: "claude-opus-4-6",
          max_tokens: 4096,
          thinking: { type: "adaptive" },
          system: [
            {
              type: "text",
              text: buildAnnaSystemPrompt(),
              cache_control: { type: "ephemeral" },
            },
          ],
          messages: apiMessages,
        });

        // Stream text deltas to the client
        stream.on("text", (textDelta) => {
          emit("delta", { text: textDelta });
        });

        // Collect the final message so we can report usage + stop_reason
        const final = await stream.finalMessage();

        emit("done", {
          stop_reason: final.stop_reason,
          usage: {
            input_tokens: final.usage.input_tokens,
            output_tokens: final.usage.output_tokens,
            cache_read_input_tokens: final.usage.cache_read_input_tokens,
            cache_creation_input_tokens:
              final.usage.cache_creation_input_tokens,
          },
        });

        controller.close();
      } catch (err) {
        console.error("[api/discuss] error", err);

        let message = "The model couldn't be reached. Try again in a moment.";
        let status = 500;

        if (err instanceof Anthropic.RateLimitError) {
          message = "Too many requests right now. Try again in a moment.";
          status = 429;
        } else if (err instanceof Anthropic.AuthenticationError) {
          message = "The server is missing its API key.";
          status = 500;
        } else if (err instanceof Anthropic.APIError) {
          message = `Model error (${err.status}): ${err.message}`;
          status = err.status ?? 500;
        }

        emit("error", { message, status });
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
