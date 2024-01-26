import z from "zod";

export interface UpdatePostInputDTO {
  idToEdit: string,
  newId: string;
  newCreatorId: string;
  newContent: string;
  newLikes: number;
  newDislikes: number;
}

export interface UpdatePostOutputDTO {
  message: string;
  posts: {
    id: string;
    creatorId: string;
    content: string;
    likes: number;
    dislikes: number;
    createdAt: string;
    updatedAt: string;
  };
}

export const UpdatePostSchema = z
  .object({
    idToEdit: z.string().min(1),
    newId: z.string().min(1).optional(),
    newCreatorId: z.string().min(5).optional(),
    newContent: z.string().min(2).optional(),
    newLikes: z.number().optional(),
    newDislikes: z.number().optional(),
  })
  .transform((data) => data as UpdatePostInputDTO);