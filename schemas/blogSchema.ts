import { z } from "zod";

export const CreateBlogSchema = z.object({
    Group: z.object({
        Name: z.string(),
        _id: z.string()
    }, { message: "Group must not be empty" }),
    Tags: z.array(
        z.object({
            _id: z.string({ message: "A tag's id must not be empty" }),
            TagName: z.string({ message: "A tag's name must not be empty" })
        }),
    { message: "Tags must not be empty" }).min(1, { message: "Tags must not be empty" }),
    thumbnail: z.any({ message: "Thumbnail must not be empty" }),
    Title: z.string().min(10, { message: "Title must be 10 characters long" }),
    Description: z.string().min(10, { message: "Description must be 10 characters long" }),
    Content: z.string().min(10, { message: "Content must be 10 characters long" })
})