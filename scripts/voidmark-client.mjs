// OpenAI-compatible Chat Completions client helpers for VOIDMARK.
// No Foundry globals. Never include the API key in a loggable dump.

const DEFAULT_BASE = "https://api.x.ai/v1";
const DEFAULT_MODEL = "grok-3";

export function normalizeBaseUrl(url) {
  const trimmed = String(url ?? "").trim().replace(/\/+$/, "");
  return trimmed || DEFAULT_BASE;
}

export function chatCompletionsUrl(baseUrl) {
  return `${normalizeBaseUrl(baseUrl)}/chat/completions`;
}

/**
 * @param {{
 *   baseUrl?: string,
 *   apiKey: string,
 *   model?: string,
 *   temperature?: number,
 *   maxTokens?: number,
 *   messages: Array<{ role: string, content: string }>,
 * }} spec
 */
export function buildChatRequest(spec) {
  const apiKey = String(spec.apiKey ?? "").trim();
  if (!apiKey) {
    const error = new Error("VOIDMARK_NO_KEY");
    error.code = "VOIDMARK_NO_KEY";
    throw error;
  }
  const temperature = Number(spec.temperature);
  const body = {
    model: String(spec.model ?? "").trim() || DEFAULT_MODEL,
    messages: spec.messages,
    temperature: Number.isFinite(temperature) ? temperature : 0.7,
  };
  const maxTokens = Number(spec.maxTokens);
  if (Number.isFinite(maxTokens) && maxTokens > 0) body.max_tokens = Math.floor(maxTokens);

  return {
    url: chatCompletionsUrl(spec.baseUrl),
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    },
    body,
  };
}

/** Redact secrets before any console or notification path. */
export function redactSecrets(text) {
  return String(text ?? "")
    .replace(/Bearer\s+\S+/gi, "Bearer [redacted]")
    .replace(/("apiKey"\s*:\s*")[^"]+"/gi, "$1[redacted]\"")
    .replace(/(xai-[A-Za-z0-9_-]+)/g, "[redacted]");
}

export function serializeRequestForLog(request) {
  return {
    url: request.url,
    method: request.options?.method ?? "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer [redacted]" },
    model: request.body?.model,
    temperature: request.body?.temperature,
    max_tokens: request.body?.max_tokens,
    messageRoles: (request.body?.messages ?? []).map(m => m.role),
  };
}

export function extractAssistantText(payload) {
  const choice = payload?.choices?.[0];
  const text = choice?.message?.content ?? choice?.text ?? "";
  return String(text).trim();
}

/**
 * @param {typeof fetch} fetchImpl
 * @param {ReturnType<typeof buildChatRequest>} request
 */
export async function sendChatRequest(fetchImpl, request) {
  const response = await fetchImpl(request.url, request.options);
  const raw = await response.text();
  let payload = null;
  try { payload = raw ? JSON.parse(raw) : null; } catch {
    payload = null;
  }
  if (!response.ok) {
    const detail = payload?.error?.message ?? payload?.error ?? raw.slice(0, 280);
    const error = new Error(redactSecrets(`VOIDMARK_HTTP_${response.status}: ${detail}`));
    error.code = "VOIDMARK_HTTP";
    error.status = response.status;
    throw error;
  }
  const content = extractAssistantText(payload);
  if (!content) {
    const error = new Error("VOIDMARK_EMPTY");
    error.code = "VOIDMARK_EMPTY";
    throw error;
  }
  return { content, payload };
}
