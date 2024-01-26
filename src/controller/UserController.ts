import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { ZodError } from "zod";
import { BaseError } from "../errors/BaseError";
import { GetUsersInputDTO, GetUsersSchema } from "../dtos/users/getUsers.dto";
import { DeleteUserInputDTO, DeleteUserInputSchema } from "../dtos/users/deleteUser.dto";
import { UpdateUserSchema } from "../dtos/users/updateUser.dto";
import { LoginSchema } from "../dtos/users/login.dto";
import { SignupSchema } from "../dtos/users/signup.dto";

export class UserController {
  constructor(
    private userBusiness: UserBusiness
  ) {}

  public getUsers = async (req: Request, res: Response) => {
    try {
      const input: GetUsersInputDTO = GetUsersSchema.parse({
        nicknameToSearch: req.query.nickname as string | undefined,
        token: req.headers.authorization
      })

      // const userBusinness = new UserBusiness()
      const output = await this.userBusiness.getUsers(input)

      res.status(200).send(output)
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }

  

  public signup = async (req: Request, res: Response) => {
    try {

      const input = SignupSchema.parse({
        // id: req.body.id,
        nickname: req.body.nickname,
        email: req.body.email,
        password: req.body.password,
        // role: req.body.role
      })

      console.log(input)

      // const userBusiness = new UserBusiness()
      const output = await this.userBusiness.signup(input)


      res.status(201).send({ output })
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }

  public login = async (req: Request, res: Response) => {
    try {
      const input = LoginSchema.parse({
        email: req.body.email,
        password: req.body.password
      })

      const output = await this.userBusiness.login(input)

      res.status(200).send(output)
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }

  public updateUser = async (req: Request, res: Response) => {
    try {

      const input = UpdateUserSchema.parse({
        idToEdit: req.params.id,
        newId: req.body.id,
        newNickname: req.body.nickname,
        newEmail: req.body.email,
        newPassword: req.body.password,
        // // newRole: req.body.role
      })

      const output = await this.userBusiness.updateUser(input)

      res.status(200).send(output)
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
    
  }

  public deleteUser = async (req: Request, res: Response) => {
    try {

      const input: DeleteUserInputDTO = DeleteUserInputSchema.parse({
        idToDelete: req.params.id
      })

      const response = await this.userBusiness.deleteUser(input)

      res.status(200).send({ message: 'User deletado com sucesso', response })
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }

} 