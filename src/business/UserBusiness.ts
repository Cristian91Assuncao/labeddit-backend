import { UserDatabase } from "../database/UserDatabase";
import { DeleteUserInputDTO } from "../dtos/users/deleteUser.dto";
import { GetUsersInputDTO, GetUsersOutputDTO } from "../dtos/users/getUsers.dto";
import { LoginInputDTO, LoginOutputDTO } from "../dtos/users/login.dto";
import { SignupInputDTO, SignupOutputDTO } from "../dtos/users/signup.dto";
import { UpdateUserInputDTO, UpdateUserOutputDTO } from "../dtos/users/updateUser.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import {  TokenPayload, User, UserDB, UserModel } from "../models/User";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class UserBusiness {
  constructor(
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager,
    private hashManager: HashManager
  ) { }

  public getUsers = async (input: GetUsersInputDTO): Promise<GetUsersOutputDTO> => {
    const { nicknameToSearch, token } = input

    const payload = this.tokenManager.getPayload(token)

    if (payload === null) {
      throw new BadRequestError("Token inválido")
    }

    // if (payload.role !== USER_ROLES.ADMIN) {
    //   throw new BadRequestError("Acesso inválido, acesso somente por ADMINS")
    // }

    const usersDB = await this.userDatabase.findUsers(nicknameToSearch)

    const users = usersDB.map(userDB => {
      const user = new User(
      userDB.id,
      userDB.nickname,
      userDB.email,
      userDB.password,
      // userDB.role as USER_ROLES,
      userDB.created_at
    )

    const UserModel: UserModel = {
      id: user.getId(),
      nickname: user.getNickname(),
      email: user.getEmail(),
      // role: user.getRole(),
      createdAt: user.getCreatedAt()
    }

  
    return user.toBusinessModel()
  })

  const output: GetUsersOutputDTO = users

    return output
  }

  public signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {

    const { nickname, email, password } = input
    
    const isEmailRegistered = await this.userDatabase.findUserByEmail(email)

    if (isEmailRegistered) {
      throw new BadRequestError("email já existe")
    }
    
    const id = this.idGenerator.generate()
    const hashedPassword = await this.hashManager.hash(password)

    const newUser = new User(
      id,
      nickname,
      email,
      hashedPassword,
      // USER_ROLES.ADMIN,
      new Date().toISOString()
    )

    const newUserDB = newUser.toDBModel()
    await this.userDatabase.insertUser(newUserDB)

    const payload: TokenPayload = {
      id: newUser.getId(),
      nickname: newUser.getNickname(),
      // role: newUser.getRole()
      // USER_ROLES.NORMAL,
      // new Date().toISOString()
    }  

    const token = this.tokenManager.createToken(payload)

    const output: SignupOutputDTO = {
      token
    }
    return output

  }

  public login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {

    const { email, password } = input

    const UserDB = await this.userDatabase.findUserByEmail(email)

    if (!UserDB) {
      throw new NotFoundError("Email não possui cadastro")
    }

    const user = new User(
      UserDB.id,
      UserDB.nickname,
      UserDB.email,
      UserDB.password,
      // UserDB.role,
      UserDB.created_at,
    )

    const hashedPassword = user.getPassword()
    const isPasswordCorrect = await this.hashManager.compare(password, hashedPassword)

    if (!isPasswordCorrect) {
      throw new BadRequestError("Senha incorreta")
    }

    const payload: TokenPayload = {
      id: user.getId(),
      nickname: user.getNickname(),
      // role: user.getRole()
    }

    const token = this.tokenManager.createToken(payload)

    const output: LoginOutputDTO = {
      message: "Login realizado com sucesso",
      token
    }

    return output
  }

  // public updateUser = async (input: UpdateUserInputDTO): Promise<UpdateUserOutputDTO> => {

  //   const {
  //     idToEdit,
  //     newId,
  //     newNickname,
  //     newEmail,
  //     newPassword,
  //     // newRole
  //   } = input

  //   const userDB = await this.userDatabase.findUserById(idToEdit)

  //   if (!userDB) {
  //     throw new NotFoundError("'id' não encontrado")
  //   }

  //   const user = new User(
  //     userDB.id,
  //     userDB.nickname,
  //     userDB.email,
  //     userDB.password,
  //     // // userDB.role as USER_ROLES,
  //     userDB.created_at
  //   )

  //   newId && user.setId(newId)
  //   newNickname && user.setNickname(newNickname)
  //   newEmail && user.setEmail(newEmail)
  //   newPassword && user.setPassword(newPassword)
  //   // // // // newRole && user.setRole(newRole as USER_ROLES)

  //   const newUserDB: UserDB = {
  //     id: user.getId(),
  //     nickname: user.getNickname(),
  //     email: user.getEmail(),
  //     password: user.getPassword(),
  //     // // role: user.getRole(),
  //     created_at: user.getCreatedAt()
  //   }

  //   await this.userDatabase.updateUser(idToEdit, newUserDB)

  //   const output: UpdateUserOutputDTO = {
  //     message: "Usuário atualizado",
  //     user: {
  //       id: user.getId(),
  //       nickname: user.getNickname(),
  //       email: user.getEmail(),
  //       password: user.getPassword(),
  //       // // role: user.getRole(),
  //       createdAt: user.getCreatedAt()
  //     }
  //   }
  //   return output

  // }

  // public deleteUser = async (input: DeleteUserInputDTO): Promise<User> => {
  //   const { idToDelete } = input

  //   if (idToDelete !== undefined) {
  //     if (typeof idToDelete !== "string") {
  //       throw new BadRequestError("'id' deve ser string")
  //     }
  //   }

  //   const userDB = await this.userDatabase.findUserById(idToDelete)

  //   if (!userDB) {
  //     throw new BadRequestError("'User' não encontrado")
  //   }

  //   await this.userDatabase.deleteUser(idToDelete)

  //   const user: User = new User(
  //     userDB.id,
  //     userDB.nickname,
  //     userDB.email,
  //     userDB.password,
  //     // // userDB.role as USER_ROLES,
  //     userDB.created_at
  //   );
  //   return user;
  // }
}