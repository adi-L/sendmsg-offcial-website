import type { Endpoint } from "../types"
import { envelope, envelopeNotes } from "./_shared"

/**
 * Everything that puts a message in front of a subscriber.
 *
 * The blueprint documents "new", "past" and "draft" as three separate
 * sections per endpoint, each repeating the same prose and parameter tables.
 * They are modelled here as variants of one endpoint.
 */

const sendNotes = {
  ...envelopeNotes,
  "data.users": "array of user IDs the message went to",
  "data.message": "ID of the message",
}

const sendResponse = envelope({ data: { users: [43998], message: 2050763 } })

const emailMessage = {
  MessageContent: "this is the content of the message",
  MessageSubject: "hello world",
  MessageInnerName: "inner name",
  SenderEmailAddress: "office@comstar.co.il",
  SenderName: "comstar",
  MessageBackColor: "black",
  MessageDirection: 2,
  AddFacebook: true,
  AddForward: true,
  AddShowMessage: true,
}

const smsMessage = {
  MessageContent: "Hello World",
  SenderPhone: "0500000000",
  MessageInnerName: "inner name",
  MessageType: 1,
  TypeSms: 1,
}

export const sending: Endpoint[] = [
  {
    id: "add-users-and-send-email",
    group: "sending",
    title: "Add subscribers and send an email",
    method: "POST",
    path: "/AddUsersAndSend",
    auth: true,
    description:
      "Adds or updates subscribers and sends them an email in a single call. " +
      "The message may be composed inline, or taken from a past send or a draft.",
    notes: [
      "Square brackets in MessageContent name a field and are replaced at render time. Unmatched keys are removed.",
      "userSendFields values are referenced as [|[yourKey]|] and apply to this message only.",
    ],
    variants: [
      {
        id: "new",
        label: "New message",
        bodySchemas: ["user-by-email", "user-send-fields", "message-new-email"],
        requestExample: {
          users: [
            {
              EmailAddress: "example@comstar.com",
              userSendFields: [{ Key: "companyName", Value: "comstar" }],
            },
          ],
          Message: { ...emailMessage, MessageContent: "Your [|[companyName]|] Name" },
        },
        responseExample: sendResponse,
        responseNotes: sendNotes,
      },
      {
        id: "past",
        label: "Past message",
        bodySchemas: ["user-by-email", "message-past"],
        requestExample: {
          users: [{ EmailAddress: "comstar@comstar.com" }],
          Message: { MessageID: 2050763 },
        },
        responseExample: sendResponse,
        responseNotes: sendNotes,
      },
      {
        id: "draft",
        label: "Draft message",
        bodySchemas: ["user-by-email", "message-draft"],
        requestExample: {
          users: [{ EmailAddress: "comstar@comstar.com" }],
          Message: { UseDraftID: 2050763 },
        },
        responseExample: sendResponse,
        responseNotes: sendNotes,
      },
    ],
    sourceLines: [404, 700],
  },
  {
    id: "add-users-and-send-sms",
    group: "sending",
    title: "Add subscribers and send an SMS",
    method: "POST",
    path: "/AddUsersAndSendSMS",
    auth: true,
    description:
      "Adds or updates subscribers and sends them an SMS in a single call. " +
      "This has its own path, separate from the email send.",
    notes: [
      "SenderPhone strips special characters and spaces, trims words over 11 characters, and accepts English letters only.",
    ],
    variants: [
      {
        id: "new",
        label: "New message",
        bodySchemas: ["user-by-email", "message-new-sms"],
        requestExample: {
          users: [{ EmailAddress: "comstar@comstar.com", Cellphone: "0501234567" }],
          Message: smsMessage,
        },
        responseExample: sendResponse,
        responseNotes: sendNotes,
      },
      {
        id: "past",
        label: "Past message",
        bodySchemas: ["user-by-email", "message-past"],
        requestExample: {
          users: [{ Cellphone: "0501234567" }],
          Message: { MessageID: 2050763 },
        },
        responseExample: sendResponse,
        responseNotes: sendNotes,
      },
      {
        id: "draft",
        label: "Draft message",
        bodySchemas: ["user-by-email", "message-draft"],
        requestExample: {
          users: [{ Cellphone: "0501234567" }],
          Message: { UseDraftID: 2050763 },
        },
        responseExample: sendResponse,
        responseNotes: sendNotes,
      },
    ],
    sourceLines: [697, 896],
  },
  {
    id: "send-email-to-mailing-lists",
    group: "sending",
    title: "Send an email to mailing lists",
    method: "POST",
    path: "/SendEmailToMailingLists",
    auth: true,
    description:
      "Sends a message to every subscriber of the given mailing lists, " +
      "without adding anyone.",
    variants: [
      {
        id: "new",
        label: "New message",
        bodySchemas: ["message-new-email"],
        requestExample: { Message: emailMessage, MalingListIDs: [172595] },
        responseExample: sendResponse,
        responseNotes: sendNotes,
      },
      {
        id: "past",
        label: "Past message",
        bodySchemas: ["message-past"],
        requestExample: {
          Message: { MessageID: 2050763 },
          MalingListIDs: [172595],
        },
        responseExample: sendResponse,
        responseNotes: sendNotes,
      },
      {
        id: "draft",
        label: "Draft message",
        bodySchemas: ["message-draft"],
        requestExample: {
          Message: { UseDraftID: 2050763 },
          MalingListIDs: [172595],
        },
        responseExample: sendResponse,
        responseNotes: sendNotes,
      },
    ],
    notes: [
      "MalingListIDs is an array of mailing list IDs. The spelling is the API's own.",
    ],
    sourceLines: [898, 1109],
  },
  {
    id: "send-sms-to-mailing-lists",
    group: "sending",
    title: "Send an SMS to mailing lists",
    method: "POST",
    path: "/SendSmsToMailingLists",
    auth: true,
    description:
      "Sends an SMS to every subscriber of the given mailing lists. Unlike the " +
      "other send pairs, this has its own path rather than sharing the email one.",
    variants: [
      {
        id: "new",
        label: "New message",
        bodySchemas: ["message-new-sms"],
        requestExample: { Message: smsMessage, MalingListIDs: [172595] },
        responseExample: sendResponse,
        responseNotes: sendNotes,
      },
      {
        id: "past",
        label: "Past message",
        bodySchemas: ["message-past"],
        requestExample: {
          Message: { MessageID: 2050763 },
          MalingListIDs: [172595],
        },
        responseExample: sendResponse,
        responseNotes: sendNotes,
      },
      {
        id: "draft",
        label: "Draft message",
        bodySchemas: ["message-draft"],
        requestExample: {
          Message: { UseDraftID: 2050763 },
          MalingListIDs: [172595],
        },
        responseExample: sendResponse,
        responseNotes: sendNotes,
      },
    ],
    sourceLines: [1069, 1225],
  },
  {
    id: "create-message",
    group: "sending",
    title: "Create a message",
    method: "POST",
    path: "/CreateMessage",
    auth: true,
    description:
      "Creates a message in your account without sending it, and returns its ID. " +
      "Supports scheduling a future send.",
    variants: [
      {
        id: "default",
        label: "Create message",
        bodySchemas: ["message-new-email"],
        requestExample: {
          MessageContent: "the content of the message",
          MessageSubject: "subject",
          MessageInnerName: "inner name",
          SenderEmailAddress: "comstar@comstar.co.il",
          MessageBackColor: "black",
          MessageDirection: 1,
          AddFacebook: true,
          AddForward: true,
          AddShowMessage: true,
        },
        responseExample: envelope({ newMessageID: 2052217 }),
        responseNotes: {
          ...envelopeNotes,
          newMessageID: "ID of the message just created",
        },
      },
    ],
    notes: [
      "PostponeSendTime schedules the send for a future date, for example 2030-02-25. It defaults to sending now.",
    ],
    sourceLines: [1516, 1574],
  },
  {
    id: "delete-message",
    group: "sending",
    title: "Delete a past message",
    method: "GET",
    path: "/DelMessage",
    auth: true,
    description: "Deletes a message from your send history.",
    query: [
      {
        name: "MsgID",
        required: true,
        type: "number",
        description: "ID of the past message in your SendMsg account.",
        example: "2052217",
      },
    ],
    variants: [
      {
        id: "default",
        label: "Delete message",
        responseExample: envelope({ newMessageID: 2052217 }),
        responseNotes: {
          ...envelopeNotes,
          newMessageID: "ID of the deleted message",
        },
      },
    ],
    sourceLines: [1576, 1608],
  },
]
