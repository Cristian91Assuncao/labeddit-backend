import z from "zod";

export interface CreatePostInputDTO {
  id: string;
  creatorId: string;
  content: string;
  likes: number;
  dislikes: number;
}

export interface CreatePostOutputDTO {
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

export const CreatePostSchema = z
  .object({
    id: z.string().min(1),
    creatorId: z.string().min(1),
    content: z.string().min(2),
    likes: z.number(),
    dislikes: z.number(),
  })
  .transform((data) => data as CreatePostInputDTO);