import type { Endpoint } from "../types"
import { envelope, envelopeNotes } from "./_shared"

const listDataNotes = {
  ...envelopeNotes,
  "data.users": "array of user IDs",
  "data.mailingLists": "array of mailing list IDs",
}

export const mailingLists: Endpoint[] = [
  {
    id: "create-mailing-list",
    group: "mailing-lists",
    title: "Create a mailing list",
    method: "POST",
    path: "/CreateMalingList",
    auth: true,
    description: "Creates a new, empty mailing list in your account.",
    variants: [
      {
        id: "default",
        label: "Create list",
        bodySchemas: ["mailing-list-new"],
        requestExample: {
          IsNewList: true,
          NewListName: "my new mailing list",
          NewListDescription: "this is the description of the mailing list",
        },
        responseExample: envelope({ data: { users: [], mailingLists: [172595] } }),
        responseNotes: listDataNotes,
      },
    ],
    sourceLines: [1441, 1490],
  },
  {
    id: "get-mailing-list-names",
    group: "mailing-lists",
    title: "List all mailing lists",
    method: "POST",
    path: "/GetMailingListNames",
    auth: true,
    description:
      "Returns every mailing list in your account with its ID, name, " +
      "description and subscriber counts. Takes no body.",
    variants: [
      {
        id: "default",
        label: "List all",
        responseExample: envelope({
          listNames: [
            {
              ActiveUserCount: 128,
              ExistingListID: 172595,
              IsNewList: false,
              NewListDescription: "List from Another Galaxy",
              NewListName: "Andromeda",
              UserCount: 140,
            },
          ],
        }),
        responseNotes: {
          ...envelopeNotes,
          "listNames.ActiveUserCount": "count of active users only",
          "listNames.ExistingListID": "list ID",
          "listNames.IsNewList": "new list flag",
          "listNames.UserCount": "count of all users in the list",
        },
      },
    ],
    sourceLines: [1227, 1264],
  },
  {
    id: "get-mailing-list-by-id",
    group: "mailing-lists",
    title: "Get a mailing list's subscribers",
    method: "GET",
    path: "/GetMailingListByID",
    auth: true,
    description: "Returns the subscribers of one mailing list, filtered by type.",
    query: [
      {
        name: "listID",
        required: true,
        type: "number",
        description: "ID of the mailing list in your SendMsg account.",
        example: "172595",
      },
      {
        name: "type",
        required: true,
        type: "number",
        description:
          "Which subscribers to return. 0 = all (deleted, wrong, active, " +
          "unsubscribed), 1 = deleted, 2 = unsubscribed, 3 = wrong emails, " +
          "4 = active.",
        example: "4",
      },
    ],
    gaps: ["The blueprint documents no response for this endpoint."],
    variants: [{ id: "default", label: "Get subscribers" }],
    sourceLines: [1349, 1379],
  },
  {
    id: "add-users-to-lists",
    group: "mailing-lists",
    title: "Add subscribers to mailing lists",
    method: "POST",
    path: "/AddUsersToLists",
    auth: true,
    description: "Adds existing subscribers to one or more existing mailing lists.",
    variants: [
      {
        id: "by-email",
        label: "By email",
        bodySchemas: ["mailing-list-existing"],
        requestExample: {
          users: [{ EmailAddress: "comstar@comstar.com" }],
          mailingLists: [{ ExistingListID: 5 }],
        },
        responseExample: envelope({
          data: { users: [43998], mailingLists: [5] },
        }),
        responseNotes: listDataNotes,
      },
      {
        id: "by-userid",
        label: "By UserID",
        bodySchemas: ["mailing-list-existing"],
        requestExample: {
          users: [{ UserID: 19407 }],
          mailingLists: [{ ExistingListID: 5 }],
        },
        responseExample: envelope({
          data: { users: [19407], mailingLists: [5] },
        }),
        responseNotes: listDataNotes,
      },
    ],
    sourceLines: [276, 402],
  },
  {
    id: "truncate-mailing-lists",
    group: "mailing-lists",
    title: "Empty mailing lists",
    method: "POST",
    path: "/TruncateMailingLists",
    auth: true,
    description:
      "Removes every subscriber from the given mailing lists. The body is a " +
      "plain array of list IDs.",
    variants: [
      {
        id: "default",
        label: "Empty lists",
        requestExample: [1, 2, 3, 4, 5],
        responseExample: envelope({ data: null }),
        responseNotes: envelopeNotes,
      },
    ],
    sourceLines: [1610, 1641],
  },
  {
    id: "remove-from-mailing-lists",
    group: "mailing-lists",
    title: "Remove subscribers from mailing lists",
    method: "POST",
    path: "/RemoveFromMailingLists/ManyToMany",
    auth: true,
    description:
      "Removes specific subscribers from specific mailing lists. Subscribers " +
      "may be identified by UserID, EmailAddress or Cellphone.",
    notes: [
      "Add only one mailing list per user. Any extra type is dismissed.",
      "Where several identifiers are supplied, the API always prefers UserID and ignores the rest.",
    ],
    variants: [
      {
        id: "by-userid",
        label: "By UserID",
        requestExample: {
          users: [{ UserID: "4" }, { UserID: "3" }, { UserID: "9" }],
          mailingLists: [
            { ExistingListID: 5 },
            { ExistingListID: 7 },
            { ExistingListID: 9 },
          ],
        },
        responseExample: envelope({ data: null }),
        responseNotes: envelopeNotes,
      },
      {
        id: "by-email",
        label: "By email",
        requestExample: {
          users: [{ EmailAddress: "comstar@comstar.com" }],
          mailingLists: [{ ExistingListID: 5 }],
        },
        responseExample: envelope({ data: null }),
        responseNotes: envelopeNotes,
      },
      {
        id: "by-cellphone",
        label: "By cellphone",
        requestExample: {
          users: [{ Cellphone: "0501234567" }],
          mailingLists: [{ ExistingListID: 5 }],
        },
        responseExample: envelope({ data: null }),
        responseNotes: envelopeNotes,
      },
    ],
    sourceLines: [1643, 1877],
  },
]
