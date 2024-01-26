import z from "zod";
import { UserModel } from "../../models/User";

export interface GetUsersInputDTO {
  nicknameToSearch?: string;
  token: string;
}

export type GetUsersOutputDTO = UserModel[]

export const GetUsersSchema = z.object({
    nicknameToSearch: z.string().min(1).optional(),
    token: z.string(
      {
        required_error: "Token é obrigatório",
        invalid_type_error: "Token deve ser uma string"
      }
    ).min(1)
  }).transform((data) => data as GetUsersInputDTO);