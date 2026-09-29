import type { Schema } from "./types"

/**
 * Object shapes shared across endpoints.
 *
 * The source blueprint repeats these tables inline at every endpoint that
 * uses them -- "user by email" appears four times, and the copies disagree
 * with each other ("the system will try to locate" vs "try to find", and one
 * copy carries a userSendFields row the others omit). Defining each shape
 * once removes that drift. Where two copies genuinely differ in content
 * rather than wording, they are kept as separate schemas.
 */

const personalFieldNote =
  "The system looks for a personal field of this name in your account. " +
  "If it finds one, the value is written there."

const userSystemFields = {
  name: "userSystemFields",
  required: false,
  type: "array<KeyValuePair>",
  description: "Custom account fields to store permanently against the subscriber.",
  example: '[{ "Key": "company name", "Value": "comstar" }]',
}

export const schemas: Schema[] = [
  {
    id: "user-by-email",
    title: "User object, identified by email",
    description:
      "Identifies a subscriber by email address. If both UserID and EmailAddress " +
      "are supplied and populated, the result is based on the email.",
    fields: [
      {
        name: "EmailAddress",
        required: true,
        type: "string",
        description: "Subscriber email address.",
        example: "comstar@comstar.com",
      },
      {
        name: "Cellphone",
        required: false,
        type: "string",
        description: "Subscriber mobile number.",
        example: "0500000000",
      },
      {
        name: "FirstName",
        required: false,
        type: "string",
        description: personalFieldNote,
        example: "Client First Name",
      },
      {
        name: "LastName",
        required: false,
        type: "string",
        description: personalFieldNote,
        example: "Client Last Name",
      },
      userSystemFields,
    ],
  },
  {
    id: "user-by-userid",
    title: "User object, identified by UserID",
    description: "Identifies an existing subscriber by their SendMsg UserID.",
    fields: [
      {
        name: "UserID",
        required: true,
        type: "number",
        description: "UserID from your SendMsg account.",
        example: "19407",
      },
      {
        name: "Cellphone",
        required: false,
        type: "string",
        description: "Subscriber mobile number.",
        example: "0500000000",
      },
      {
        name: "FirstName",
        required: false,
        type: "string",
        description: personalFieldNote,
        example: "Client First Name",
      },
      {
        name: "LastName",
        required: false,
        type: "string",
        description: personalFieldNote,
        example: "Client Last Name",
      },
      userSystemFields,
    ],
  },
  {
    id: "user-send-fields",
    title: "Per-message field values",
    description:
      "Values that apply to this message only, rather than being stored on the " +
      "subscriber. Referenced in message content as [|[yourKey]|].",
    fields: [
      {
        name: "userSendFields",
        required: false,
        type: "array<KeyValuePair>",
        description: "Field values scoped to this send.",
        example: '[{ "Key": "companyName", "Value": "comstar" }]',
        note: "Supports simple emoji (UTF-8 only, excluding utf8mb4).",
      },
    ],
  },
  {
    id: "message-new-email",
    title: "New email message",
    fields: [
      {
        name: "MessageContent",
        required: true,
        type: "string",
        description:
          "Body of the message. Text in square brackets is treated as a field " +
          "name and replaced at render time; unmatched keys are removed.",
        example: "Hello [companyName]",
      },
      {
        name: "MessageSubject",
        required: true,
        type: "string",
        description: "Subject line.",
        example: "HeadLine",
      },
      {
        name: "MessageInnerName",
        required: true,
        type: "string",
        description: "Name of the message inside your SendMsg account.",
        example: "MessageName",
      },
      {
        name: "SenderEmailAddress",
        required: false,
        type: "string",
        description: "From address.",
        example: "test@sendmsg.co.il",
        default: "comstar@sendmsg.co.il",
      },
      {
        name: "SenderName",
        required: false,
        type: "string",
        description: "Display name shown beside the from address.",
        example: "comstar",
        note:
          "The blueprint sends this in its worked examples but never lists it " +
          "in a parameter table, so its exact behaviour is undocumented.",
      },
      {
        name: "MessageBackColor",
        required: false,
        type: "string",
        description: "Background colour, as a hex value.",
        example: "#fcba03",
        default: "#ffffff",
        note:
          "The blueprint labels this default both 'Black' and 'White' in " +
          "different tables. The value itself is #ffffff.",
      },
      {
        name: "MessageDirection",
        required: true,
        type: "number",
        description: "Text direction. RTL = 1, LTR = 2.",
        example: "1",
      },
      {
        name: "AddFacebook",
        required: false,
        type: "boolean",
        description: "Add a link for sharing the message to Facebook.",
        example: "true",
        default: "false",
      },
      {
        name: "AddForward",
        required: false,
        type: "boolean",
        description: "Add a link for forwarding the message.",
        example: "true",
        default: "false",
      },
      {
        name: "AddShowMessage",
        required: false,
        type: "boolean",
        description: "Add a link for viewing the message in a browser.",
        example: "true",
        default: "false",
      },
    ],
  },
  {
    id: "message-new-sms",
    title: "New SMS message",
    fields: [
      {
        name: "MessageContent",
        required: true,
        type: "string",
        description: "Body of the message.",
        example: "Hello World",
      },
      {
        name: "SenderPhone",
        required: true,
        type: "string",
        description: "Sender number.",
        example: "0500000000",
        note:
          "Special characters and spaces are stripped. Words longer than 11 " +
          "characters are trimmed. Letters must be English.",
      },
      {
        name: "MessageInnerName",
        required: true,
        type: "string",
        description: "Name of the message inside your SendMsg account.",
        example: "MessageName",
      },
      {
        name: "MessageSubject",
        required: false,
        type: "string",
        description: "Not used for SMS.",
        default: "empty",
      },
      {
        name: "MessageType",
        required: true,
        type: "number",
        description: "Always 1.",
        example: "1",
      },
      {
        name: "TypeSms",
        required: true,
        type: "number",
        description: "1 for a short SMS, 2 for a long SMS.",
        example: "1",
      },
    ],
  },
  {
    id: "message-past",
    title: "Past message",
    description: "Re-sends a message already in your send history.",
    fields: [
      {
        name: "MessageID",
        required: true,
        type: "number",
        description: "ID of a message from your history of sent messages.",
        example: "2050763",
      },
    ],
  },
  {
    id: "message-draft",
    title: "Draft message",
    description: "Sends a message saved as a draft.",
    fields: [
      {
        name: "UseDraftID",
        required: true,
        type: "number",
        description: "ID of a message from your drafts.",
        example: "2050763",
      },
    ],
  },
  {
    id: "mailing-list-new",
    title: "New mailing list",
    fields: [
      {
        name: "IsNewList",
        required: true,
        type: "boolean",
        description: "Always true.",
        example: "true",
      },
      {
        name: "NewListName",
        required: true,
        type: "string",
        description: "Name of the list.",
        example: "Andromeda",
      },
      {
        name: "NewListDescription",
        required: false,
        type: "string",
        description: "Description of the list.",
        example: "List from Another Galaxy",
      },
    ],
  },
  {
    id: "mailing-list-existing",
    title: "Existing mailing list reference",
    fields: [
      {
        name: "ExistingListID",
        required: true,
        type: "number",
        description: "ID of a mailing list already in your account.",
        example: "5",
      },
    ],
  },
  {
    id: "envelope",
    title: "Standard response envelope",
    description:
      "Every endpoint wraps its result in this envelope. The endpoint-specific " +
      "payload sits alongside it under its own key.",
    fields: [
      {
        name: "success",
        required: true,
        type: "boolean",
        description: "Whether the call succeeded.",
      },
      {
        name: "res",
        required: true,
        type: "boolean",
        description: "Whether the call succeeded. Mirrors success.",
      },
      {
        name: "result.ResultID",
        required: true,
        type: "number",
        description: "Status code. See the status code reference.",
      },
      {
        name: "result.ResultMessage",
        required: true,
        type: "string",
        description: "Detail for the status code. Every code returns one.",
      },
      {
        name: "result.Tin",
        required: true,
        type: "string",
        description: "Deprecated. Always empty.",
      },
    ],
  },
]

export const schemaById = new Map(schemas.map((s) => [s.id, s]))
