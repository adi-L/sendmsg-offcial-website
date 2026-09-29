import type { Endpoint } from "../types"

export const reports: Endpoint[] = [
  {
    id: "get-msg-full-statistics",
    group: "reports",
    title: "Get message statistics",
    method: "GET",
    path: "/GetMsgFullStatistics",
    auth: true,
    description: "Returns the full statistics for one past message.",
    query: [
      {
        name: "messageID",
        required: true,
        type: "number",
        description: "ID of the past message in your SendMsg account.",
        example: "2050763",
      },
    ],
    gaps: [
      "The blueprint's response body for this endpoint is empty. The response " +
        "shape is undocumented at source and has not been invented here.",
    ],
    variants: [{ id: "default", label: "Get statistics" }],
    sourceLines: [1492, 1514],
  },
  {
    id: "get-number-of-joiners",
    group: "reports",
    title: "Count subscribers by timeline",
    method: "POST",
    path: "/GetNumberOfJoinersToSystem",
    auth: true,
    description:
      "Returns how many subscribers joined within each of the date ranges you " +
      "supply. The body is an array of ranges.",
    variants: [
      {
        id: "default",
        label: "Count joiners",
        requestExample: [
          { From: "2023-07-22 18:03:33", Until: "2023-08-11 18:03:33" },
          { From: "2023-07-02 18:03:34", Until: "2023-07-22 18:03:34" },
        ],
        responseExample: {
          success: true,
          res: true,
          result: { ResultID: 200, ResultMessage: "Passed OK", Tin: "" },
          SendMsgJoinersDate: [
            { From: "2023-07-22T18:03:33", Sum: 2, Until: "2023-08-11T18:03:33" },
            { From: "2023-07-02T18:03:34", Sum: 1, Until: "2023-07-22T18:03:34" },
          ],
        },
      },
    ],
    notes: [
      "Request dates use a space separator; response dates come back in ISO form with a T.",
    ],
    sourceLines: [1968, 2020],
  },
]
