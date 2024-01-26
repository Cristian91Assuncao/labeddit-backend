import z from "zod";
import { PostModel } from "../../models/Post";

export interface GetPostsInputDTO {
}

export type GetPostsOutputDTO = PostModel[]

export const GetPostsSchema = z.object({}).transform((data) => data as GetPostsInputDTO);