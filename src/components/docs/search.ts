import { endpoints, schemas, groups, type Endpoint } from "../../data/api"

/**
 * Search index over everything the page documents.
 *
 * Built from the same data as the page itself, so a new endpoint or field is
 * searchable the moment it is added. Small enough that a linear scan beats
 * pulling in a search dependency.
 */

export interface SearchEntry {
  id: string
  /** Anchor to jump to. */
  anchor: string
  title: string
  subtitle: string
  kind: "endpoint" | "field" | "group"
  /** Lowercased haystack, prepared once at module load. */
  haystack: string
}

const groupTitle = (id: string) => groups.find((g) => g.id === id)?.title ?? id

function endpointEntry(endpoint: Endpoint): SearchEntry {
  const fieldNames = endpoint.variants
    .flatMap((v) => v.bodySchemas ?? [])
    .flatMap((id) => schemas.find((s) => s.id === id)?.fields ?? [])
    .map((f) => f.name)
  const query = endpoint.query?.map((q) => q.name) ?? []
  return {
    id: `endpoint:${endpoint.id}`,
    anchor: endpoint.id,
    title: endpoint.title,
    subtitle: `${endpoint.method} ${endpoint.path}`,
    kind: "endpoint",
    haystack: [
      endpoint.title,
      endpoint.path,
      endpoint.method,
      endpoint.description ?? "",
      groupTitle(endpoint.group),
      ...fieldNames,
      ...query,
    ]
      .join(" ")
      .toLowerCase(),
  }
}

export const searchIndex: SearchEntry[] = [
  ...groups.map((g) => ({
    id: `group:${g.id}`,
    anchor: g.id,
    title: g.title,
    subtitle: "Section",
    kind: "group" as const,
    haystack: `${g.title} ${g.description ?? ""}`.toLowerCase(),
  })),
  ...endpoints.map(endpointEntry),
  ...schemas.flatMap((schema) =>
    schema.fields.map((field) => ({
      id: `field:${schema.id}:${field.name}`,
      anchor: schema.id,
      title: field.name,
      subtitle: `${schema.title} · field`,
      kind: "field" as const,
      haystack: `${field.name} ${field.description} ${schema.title}`.toLowerCase(),
    }))
  ),
]

/**
 * Ranks by where the match lands: a title hit beats a body hit, and a prefix
 * beats a substring. Enough to put the obvious answer first without the
 * weight of a fuzzy-matching library.
 */
export function search(query: string, limit = 12): SearchEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const scored: Array<{ entry: SearchEntry; score: number }> = []
  for (const entry of searchIndex) {
    const title = entry.title.toLowerCase()
    let score = 0
    if (title === q) score = 100
    else if (title.startsWith(q)) score = 80
    else if (title.includes(q)) score = 60
    else if (entry.subtitle.toLowerCase().includes(q)) score = 40
    else if (entry.haystack.includes(q)) score = 20
    if (!score) continue
    // Endpoints are what people come here for; fields break ties downward.
    if (entry.kind === "endpoint") score += 8
    if (entry.kind === "field") score -= 4
    scored.push({ entry, score })
  }

  return scored
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .slice(0, limit)
    .map((s) => s.entry)
}
