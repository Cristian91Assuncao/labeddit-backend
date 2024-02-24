import { UserDB } from "../models/User";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
    public static TABLE_USERS = "users"

    public async findUsers(nicknameToSearch?: string): Promise<UserDB[]> {
        let usersDB

        if (nicknameToSearch) {
            const result: UserDB[] = await BaseDatabase
                .connection(UserDatabase.TABLE_USERS)
                .where("nickname", "LIKE", `%${nicknameToSearch}%`)
            usersDB = result
        } else {
            const result: UserDB[] = await BaseDatabase
                .connection(UserDatabase.TABLE_USERS)
            usersDB = result
        }
        return usersDB
    }


    public async findUserById(id: string): Promise<UserDB | undefined> {
        const [ userDB ]: UserDB[] | undefined[] = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .where({ id })

        return userDB
    }

    public async findUserByEmail(email: string): Promise<UserDB | undefined> {
      const [userDB]: UserDB[] | undefined[] = await BaseDatabase
        .connection(UserDatabase.TABLE_USERS)
        .select()
        .where({ email })
  
      return userDB as UserDB | undefined
    }

    
    public async insertUser(userDB: UserDB): Promise<void> {
      await BaseDatabase
          .connection(UserDatabase.TABLE_USERS)
          .insert(userDB)
  }

    // public async updateUser(idToEdit: string, newUserDB: UserDB): Promise<void> {
    //   await BaseDatabase
    //     .connection(UserDatabase.TABLE_USERS)
    //     .where({ id: idToEdit })
    //     .update(newUserDB)
    // }

    // public async deleteUser(idToDelete: string): Promise< void> {
    //     await BaseDatabase
    //     .connection(UserDatabase.TABLE_USERS)
    //     .where({id: idToDelete})
    //     .delete()
    // }
}

