import type { Endpoint } from "../types"

/**
 * Sending from a personal mobile number requires verifying that you own it.
 * Add the number in panel.sendmsg.co.il first, then complete the two-step
 * verification through these endpoints.
 */
export const smsVerification: Endpoint[] = [
  {
    id: "verification-by-sms",
    group: "sms-verification",
    title: "Request a verification code",
    method: "POST",
    path: "/VerificationOfSenderNumberBySMS",
    auth: true,
    description:
      "Sends a verification code by SMS to the sender number you want to use. " +
      "Add the number in panel.sendmsg.co.il before calling this.",
    gaps: ["The blueprint documents no response for this endpoint."],
    variants: [
      {
        id: "default",
        label: "Request code",
        requestExample: { SenderNumber: "0501231234" },
      },
    ],
    sourceLines: [1881, 1904],
  },
  {
    id: "authenticate-sender-number",
    group: "sms-verification",
    title: "Confirm a verification code",
    method: "POST",
    path: "/AuthenticateOfSenderNumberBySMS",
    auth: true,
    description: "Completes verification by submitting the code that was sent.",
    gaps: ["The blueprint documents no response for this endpoint."],
    variants: [
      {
        id: "default",
        label: "Confirm code",
        requestExample: { SenderNumber: "0501231234", Code: "111111" },
      },
    ],
    sourceLines: [1906, 1923],
  },
  {
    id: "is-allowed-sender-number",
    group: "sms-verification",
    title: "Check whether a number is verified",
    method: "POST",
    path: "/IsAllowedOfSenderNumberBySMS",
    auth: true,
    description: "Reports whether a sender number has completed verification.",
    gaps: ["The blueprint documents no response for this endpoint."],
    variants: [
      {
        id: "default",
        label: "Check number",
        requestExample: { SenderNumber: "0501231234" },
      },
    ],
    sourceLines: [1925, 1940],
  },
  {
    id: "checking-sms-balances",
    group: "sms-verification",
    title: "Check SMS balance",
    method: "GET",
    path: "/CheckingSmsBalances",
    auth: true,
    description: "Returns your remaining balance of short and long SMS messages.",
    notes: [
      "The counts arrive inside ResultMessage as text rather than as separate fields.",
    ],
    variants: [
      {
        id: "default",
        label: "Check balance",
        responseExample: {
          success: true,
          res: true,
          result: {
            ResultID: 200,
            ResultMessage: "SMS balances:\nShort amount = {num}\nLong amount = {num}",
            Tin: "",
          },
          data: null,
        },
      },
    ],
    sourceLines: [1942, 1966],
  },
]
