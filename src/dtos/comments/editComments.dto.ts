import z from "zod";

export interface EditCommentsInputDTO {
    idToEdit: string
    newContent: string,
    token: string,
}

export type EditCommentsOutputDTO = undefined

export const EditCommentsSchema = z.object({
    idToEdit: z.string().min(1),
    newContent: z.string().min(1).max(280),
    token: z.string()
}).transform(data => data as EditCommentsInputDTO)