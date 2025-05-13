import { z } from "zod";

export const CreateGroupSchema = z.object({
    Name: z.string(),
    Description: z.string(),
    GroupRules: z.array(
        z.object({
            _id: z.string({ message: "A rule's id must not be empty" }),
            RuleName: z.string({ message: "A rule's name must not be empty" }),
            RuleDescription: z.string({ message: "A rule's description must not be empty "})
        }),
    { message: "Group rules must not be empty" }).min(1, { message: "Group rules must not be empty" }),
    Tags: z.array(
        z.object({
            _id: z.string({ message: "A tag's id must not be empty" }),
            TagName: z.string({ message: "A tag's name must not be empty" })
        }),
    { message: "Tags must not be empty" }).min(1, { message: "Tags must not be empty" }),
    GroupField: z.object({
        _id: z.string({ message: "A field's id must not be empty" }),
        FieldName: z.string({ message: "A field's name must not be empty" })
    }, { message: "Group field must not be empty"} ),
    coverImage: z.any({ message: "Cover image must not be empty" }),

})