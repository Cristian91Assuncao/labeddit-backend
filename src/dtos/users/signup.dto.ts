import z from 'zod'


export interface SignupInputDTO {
  // id: string,
  nickname: string,
  email: string,
  password: string,
  role: string
}

export interface SignupOutputDTO {
  message: string;
  token: string
  }

export const SignupSchema = z.object({
  // id: z.string().min(1),
  nickname: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(4),
  role: z.string().min(2)
}).transform(data => data as SignupInputDTO)
