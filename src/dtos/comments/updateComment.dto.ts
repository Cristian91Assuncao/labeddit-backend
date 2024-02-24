import z from "zod";

export interface EditCommentInputDTO {
    idToEdit: string
    newContent: string,
    token: string,
}

export type EditCommentOutputDTO = undefined

export const EditCommentSchema = z.object({
    idToEdit: z.string().min(1),
    newContent: z.string().min(1).max(280),
    token: z.string()
}).transform(data => data as EditCommentInputDTO)