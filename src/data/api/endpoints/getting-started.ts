import type { Endpoint } from "../types"
import { envelope, envelopeNotes, SAMPLE_TOKEN } from "./_shared"

export const gettingStarted: Endpoint[] = [
  {
    id: "token",
    group: "getting-started",
    title: "Get a token",
    method: "POST",
    path: "/token",
    auth: false,
    description:
      "Exchange your account SiteID and API password for a bearer token. " +
      "SiteID is your SendMsg account number. The API password comes from " +
      "the support team. Send the token as the Authorization header on every " +
      "other call.",
    notes: [
      "The token is valid for 12 hours. Renewing it well before expiry is recommended.",
      "Append ?full=true to receive the token metadata, such as its timestamp and expiry date.",
    ],
    variants: [
      {
        id: "default",
        label: "Request a token",
        requestExample: { siteID: 1687, password: "0123456789" },
        responseExample: { Token: SAMPLE_TOKEN },
      },
    ],
    sourceLines: [49, 90],
  },
  {
    id: "ping",
    group: "getting-started",
    title: "Test authentication",
    method: "POST",
    path: "/ping",
    auth: true,
    description:
      "Confirms that your token is valid. Useful as a first call when wiring " +
      "up an integration.",
    variants: [
      {
        id: "default",
        label: "Ping",
        responseExample: {
          isSuccess: true,
          msg: "hello user: 11111 test works! you are now validated..",
        },
      },
    ],
    sourceLines: [92, 109],
  },
]

export const gettingStartedNotes = { envelope, envelopeNotes }
