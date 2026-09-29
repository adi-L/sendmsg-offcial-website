/**
 * Content model for the SendMsg API reference.
 *
 * Every artifact the docs produce -- the page, the five code-sample
 * languages, the search index, llms.txt, llms-full.txt and openapi.json --
 * is derived from the data described by these types. One source, many
 * consumers, so nothing can drift out of sync.
 *
 * The original API Blueprint repeats itself heavily: the "user by email"
 * parameter table appears four times with drifting wording. Schemas exist
 * so each such object is defined exactly once and referenced by id.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json }

export interface Field {
  name: string
  required: boolean
  /** Left out where the blueprint never states a type. */
  type?: string
  description: string
  example?: string
  /** Value the API uses when the field is omitted. */
  default?: string
  /** Caveat worth calling out beside the row, e.g. the emoji/UTF-8 limit. */
  note?: string
}

/** A reusable object shape referenced by endpoints via its id. */
export interface Schema {
  id: string
  title: string
  description?: string
  fields: Field[]
}

/**
 * One way of calling an endpoint.
 *
 * Several blueprint endpoints are documented as two or three near-identical
 * sections -- "send new" / "send past" / "send draft", or "by email" /
 * "by userID". Those are variants of one endpoint, not separate endpoints,
 * and render as a tab switcher rather than repeated prose.
 */
export interface Variant {
  id: string
  label: string
  description?: string
  /** Schema ids describing the request body. */
  bodySchemas?: string[]
  requestExample?: Json
  responseExample?: Json
  /**
   * Annotations for response fields whose blueprint value is a placeholder
   * rather than real JSON (`"ResultID": Status-Code`). Keyed by dotted path,
   * rendered beside the line so the copied JSON still parses.
   */
  responseNotes?: Record<string, string>
}

export type Method = "GET" | "POST"

export interface Endpoint {
  /** Stable anchor slug; changing one breaks inbound links. */
  id: string
  group: string
  title: string
  method: Method
  /** Path relative to the API base, e.g. "/AddUsersOnly". */
  path: string
  description?: string
  /** False only for /token, which is how you obtain the credential. */
  auth: boolean
  query?: Field[]
  variants: Variant[]
  notes?: string[]
  /**
   * Something the original documentation does not specify. Recorded rather
   * than invented -- several endpoints genuinely ship with no response
   * example at all.
   */
  gaps?: string[]
  /** Line range in the source blueprint, so the port stays auditable. */
  sourceLines: [number, number]
}

export interface Group {
  id: string
  title: string
  description?: string
}
