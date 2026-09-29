import type { Endpoint, Group } from "./types"
import { gettingStarted } from "./endpoints/getting-started"
import { subscribers } from "./endpoints/subscribers"
import { mailingLists } from "./endpoints/mailing-lists"
import { sending } from "./endpoints/sending"
import { fields } from "./endpoints/fields"
import { smsVerification } from "./endpoints/sms-verification"
import { reports } from "./endpoints/reports"

export * from "./types"
export { schemas, schemaById } from "./schemas"

export const API_BASE = "https://gconvertrest.sendmsg.co.il/api/Sendmsg"
export const API_VERSION = "4.0"
export const SUPPORT_EMAIL = "send.help@comstar.co.il"
export const SUPPORT_TEMPLATE_URL =
  "https://gconvertrest.sendmsg.co.il/views/apisupport.html"

export const groups: Group[] = [
  {
    id: "getting-started",
    title: "Getting started",
    description:
      "Obtain a token and confirm it works. Every other endpoint needs one.",
  },
  {
    id: "subscribers",
    title: "Subscribers",
    description: "Add, update, inspect and change the status of the people you send to.",
  },
  {
    id: "mailing-lists",
    title: "Mailing lists",
    description: "Create lists, read their members, and move subscribers in and out.",
  },
  {
    id: "sending",
    title: "Sending",
    description:
      "Send email and SMS, either to subscribers you supply inline or to whole " +
      "mailing lists. Messages can be composed inline, reused from history, or " +
      "taken from a draft.",
  },
  {
    id: "fields",
    title: "Fields",
    description: "Read and create the custom fields you can reference in message content.",
  },
  {
    id: "sms-verification",
    title: "SMS sender verification",
    description:
      "Verify ownership of a sender number before sending from it, and check " +
      "your SMS balance.",
  },
  {
    id: "reports",
    title: "Reports",
    description: "Message statistics and subscriber growth over time.",
  },
]

export const endpoints: Endpoint[] = [
  ...gettingStarted,
  ...subscribers,
  ...mailingLists,
  ...sending,
  ...fields,
  ...smsVerification,
  ...reports,
]

export const endpointsByGroup = groups.map((group) => ({
  group,
  endpoints: endpoints.filter((e) => e.group === group.id),
}))

export interface StatusCode {
  code: string
  meaning: string
  kind: "success" | "partial" | "client" | "server"
}

export const statusCodes: StatusCode[] = [
  { code: "200 or 10000", meaning: "Success.", kind: "success" },
  {
    code: "201–299",
    meaning: "Success, with a message in the result.",
    kind: "partial",
  },
  { code: "410", meaning: "Did not find what you were looking for.", kind: "client" },
  { code: "500", meaning: "An error occurred.", kind: "server" },
  { code: "530", meaning: "Try again later.", kind: "server" },
  {
    code: "531",
    meaning: "The data was inserted, but the message was not sent.",
    kind: "partial",
  },
  {
    code: "550",
    meaning: "An error occurred during data extraction. Try again later.",
    kind: "server",
  },
]

/** Rules that apply to every request, called out separately in the blueprint. */
export const conventions = [
  {
    title: "Encode as UTF-8",
    body: "Send strings as UTF-8. This is required for Hebrew to survive the round trip.",
  },
  {
    title: "PHP requires Content-Length",
    body: "PHP clients must set Content-Length to the byte length of the JSON body.",
  },
  {
    title: "Tokens last 12 hours",
    body: "Renew well before expiry rather than waiting for a call to fail.",
  },
  {
    title: "Every code carries detail",
    body: "Whatever the status, result.ResultMessage explains it.",
  },
]

/** Endpoints that send to real people or destroy data; the console confirms these. */
export const DESTRUCTIVE_ENDPOINT_IDS = new Set([
  "add-users-and-send-email",
  "add-users-and-send-sms",
  "send-email-to-mailing-lists",
  "send-sms-to-mailing-lists",
  "truncate-mailing-lists",
  "remove-from-mailing-lists",
  "delete-message",
])
