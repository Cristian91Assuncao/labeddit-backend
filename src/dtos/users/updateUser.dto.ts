import z from 'zod'


export interface UpdateUserInputDTO {
  idToEdit: string,
  newId: string,
  newNickname: string,
  newEmail: string,
  newPassword: string,
  // newRole: string
}

export interface UpdateUserOutputDTO {
  message: string,
  user: {
      id: string,
      nickname: string,
      email: string,
      password: string,
      // role: string,
      createdAt: string
  }
}
// código anterior dos DTOs aqui <<< (CreateUserInputDTO e CreateUserOutputDTO)

export const UpdateUserSchema = z.object({
  idToEdit: z.string().min(1),
  newId: z.string().min(1).optional(),
  newNickname: z.string().min(2).optional(),
  newEmail: z.string().email().optional(),
  newPassword: z.string().min(4).optional(),
  // newRole: z.string().min(4).optional()
}).transform(data => data as UpdateUserInputDTO)
