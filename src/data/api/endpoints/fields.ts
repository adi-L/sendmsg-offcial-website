import type { Endpoint } from "../types"
import { envelope, envelopeNotes } from "./_shared"

export const fields: Endpoint[] = [
  {
    id: "get-all-fields",
    group: "fields",
    title: "List all fields",
    method: "POST",
    path: "/GetAllFields",
    auth: true,
    description:
      "Returns every field in your account as key/value pairs. Built-in fields " +
      "are keyed by name; custom fields are keyed by their numeric ID.",
    variants: [
      {
        id: "default",
        label: "List fields",
        responseExample: envelope({
          AllFields: {
            eMail: "email",
            cellPhone: "cell Phone",
            "2": "שם משפחה",
          },
        }),
        responseNotes: {
          ...envelopeNotes,
          AllFields: "custom fields appear as a key/value pair keyed by field ID",
        },
      },
    ],
    sourceLines: [1266, 1295],
  },
  {
    id: "create-field",
    group: "fields",
    title: "Create a field",
    method: "POST",
    path: "/CreateField",
    auth: true,
    description: "Creates a new custom field in your account.",
    notes: [
      "FieldUserType accepts 1 (text), 2 (yes/no), 3 (dropdown), 4 (date), 7 (long text) or 8 (number).",
      "A dropdown field requires OptionToDDR listing its options.",
    ],
    gaps: [
      "The source table places the 'OptionToDDR is required' note on the Number " +
        "row rather than the Dropdown row, which contradicts the worked example " +
        "beneath it. The note belongs to Dropdown.",
    ],
    variants: [
      {
        id: "simple",
        label: "Text field",
        requestExample: { FieldUserName: "Field Name", FieldUserType: 1 },
        responseExample: { FieldName: "Field Name", FieldType: 1 },
      },
      {
        id: "dropdown",
        label: "Dropdown field",
        requestExample: {
          FieldUserName: "Field Name",
          FieldUserType: 3,
          OptionToDDR: ["item 1", "item 2", "item 3"],
        },
        responseExample: { FieldName: "Field Name", FieldType: 3 },
      },
    ],
    sourceLines: [2084, 2132],
  },
]
