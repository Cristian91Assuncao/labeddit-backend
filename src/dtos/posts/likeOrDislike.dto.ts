import { z } from "zod";

export interface LikeOrDislikeInputDTO {
  postId: string,
  like: boolean,
  token: string
}

export type LikeOrDislikeOutputDTO = undefined

export const LikeOrDislikeSchema = z.object({  
  postId: z.string(),
  like: z.boolean(),
  token: z.string()
}).transform((data) => data as LikeOrDislikeInputDTO);