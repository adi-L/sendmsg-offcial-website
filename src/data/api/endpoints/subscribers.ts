import type { Endpoint } from "../types"
import { envelope, envelopeNotes } from "./_shared"

export const subscribers: Endpoint[] = [
  {
    id: "add-users-only",
    group: "subscribers",
    title: "Add or update subscribers",
    method: "POST",
    path: "/AddUsersOnly",
    auth: true,
    description:
      "Adds subscribers to your account, or updates them if they already exist. " +
      "The body is an array of user objects.",
    notes: [
      "If UserID and EmailAddress are both present and populated, the email wins.",
      "To create a custom field before referencing it, use CreateField.",
    ],
    gaps: [
      "The blueprint also shows a wrapped { users: [...], Message: {...} } body " +
        "for this endpoint, which contradicts the array body in its own request " +
        "examples. The array form is documented here because that is what the " +
        "request examples send.",
    ],
    variants: [
      {
        id: "by-email",
        label: "By email",
        bodySchemas: ["user-by-email"],
        requestExample: [
          {
            EmailAddress: "comstar@comstar.com",
            Cellphone: "0501234567",
            FirstName: "Client First Name",
            LastName: "Client Last Name",
            userSystemFields: [
              { Key: "Custom Field Name In Sendmsg", Value: "Value" },
            ],
          },
        ],
        responseExample: envelope({ data: { users: 1, message: 0 } }),
        responseNotes: {
          ...envelopeNotes,
          "data.users": "user count",
          "data.message": "message ID",
        },
      },
      {
        id: "by-userid",
        label: "By UserID",
        bodySchemas: ["user-by-userid"],
        requestExample: [
          {
            UserID: 19407,
            Cellphone: "0501234567",
            userSystemFields: [
              { Key: "Custom Field Name In Sendmsg", Value: "Value" },
            ],
          },
        ],
        responseExample: envelope({ data: { users: 1, message: 0 } }),
        responseNotes: {
          ...envelopeNotes,
          "data.users": "user count",
          "data.message": "message ID",
        },
      },
    ],
    sourceLines: [111, 271],
  },
  {
    id: "get-user-details",
    group: "subscribers",
    title: "Get subscriber details",
    method: "GET",
    path: "/GetUserDetails",
    auth: true,
    description: "Returns every stored detail for one subscriber.",
    query: [
      {
        name: "userID",
        required: true,
        type: "number",
        description: "ID of the subscriber in your SendMsg account.",
        example: "43998",
      },
    ],
    variants: [
      {
        id: "default",
        label: "Get details",
        responseExample: envelope({
          user: {
            Cellphone: "0501234567",
            DeleteUser: false,
            EmailAddress: "comstar2@comstar2.com",
            IsUserSelfRemoved: false,
            UndeleteUserIfExists: false,
            UserID: 43998,
            UserSendFields: [
              { Key: "Custom Field for this message", Value: "Value" },
            ],
            UserSystemFields: [
              { Key: "Custom Field Name In Sendmsg", Value: "Value" },
            ],
          },
        }),
        responseNotes: envelopeNotes,
      },
    ],
    sourceLines: [1297, 1347],
  },
  {
    id: "get-system-users",
    group: "subscribers",
    title: "List users by request type",
    method: "POST",
    path: "/GetSystemUsers",
    auth: true,
    description:
      "Returns the subscribers who unsubscribed, were deleted, or were flagged " +
      "with a bad email address.",
    notes: [
      "requestType accepts SelfRemUsers (unsubscribed), DelUsers (deleted), or wrongMails (flagged as a wrong address).",
    ],
    variants: [
      {
        id: "default",
        label: "List users",
        requestExample: { requestType: "SelfRemUsers" },
        responseExample: envelope({
          users: [
            {
              Cellphone: "0501234567",
              DeleteUser: false,
              EmailAddress: "comstar2@comstar2.com",
              IsUserSelfRemoved: false,
              UndeleteUserIfExists: false,
              UserID: 43998,
              UserSendFields: [],
              UserSystemFields: [
                { Key: "Custom Field Name In Sendmsg", Value: "Value" },
              ],
            },
          ],
        }),
        responseNotes: envelopeNotes,
      },
    ],
    sourceLines: [1381, 1439],
  },
  {
    id: "change-update-status",
    group: "subscribers",
    title: "Change a subscriber's send status",
    method: "POST",
    path: "/ChangeUpdateStatus",
    auth: true,
    description: "Changes the send status of one subscriber in your account.",
    notes: [
      "StatusEmail accepts Active, Inactive, AskedRemoval, or BadEmail.",
      "If the subscriber is already set to AskedRemoval, updating their email status is restricted.",
    ],
    gaps: ["The blueprint documents no response for this endpoint."],
    variants: [
      {
        id: "by-email",
        label: "By email",
        requestExample: {
          EmailAddress: "comstar@comstar.com",
          StatusEmail: "Active",
        },
      },
      {
        id: "by-userid",
        label: "By UserID",
        requestExample: { UserID: "1773", StatusEmail: "Active" },
      },
    ],
    sourceLines: [2022, 2082],
  },
]
