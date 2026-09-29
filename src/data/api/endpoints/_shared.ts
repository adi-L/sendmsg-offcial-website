import type { Json } from "../types"

/**
 * The blueprint prints response examples with placeholder words where real
 * values belong -- `"ResultID": Status-Code`, `"Tin": deprecated-always-empty`.
 * That does not parse, so anyone copying it gets broken JSON.
 *
 * We emit valid JSON and carry the placeholder meanings separately in
 * `responseNotes`, which the page renders beside the relevant line.
 */
export const envelope = (payload: Record<string, Json> = {}): Json => ({
  success: true,
  res: true,
  result: {
    ResultID: 200,
    ResultMessage: "Passed OK",
    Tin: "",
  },
  ...payload,
})

export const envelopeNotes: Record<string, string> = {
  success: "true or false",
  res: "true or false",
  "result.ResultID": "status code",
  "result.ResultMessage": "SendMsg result message",
  "result.Tin": "deprecated, always empty",
}

/** Placeholder token shown in examples until the reader supplies their own. */
export const SAMPLE_TOKEN = "34234-34234234-fsdgdfg-34r5t343f334f"
