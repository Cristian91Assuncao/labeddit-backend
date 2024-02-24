import { UserBusiness } from '../../src/business/UserBusiness'
import { UserDatabaseMock } from '../../tests/mocks/UserDatabaseMock'
import { HashManagerMock } from '../../tests/mocks/HashManagerMock'
import { IdGeneratorMock } from '../../tests/mocks/IdGeneratorMock'
import { TokenManagerMock } from '../../tests/mocks/TokenManagerMock'
import { UserModel } from '../../src/models/User'
import { GetUsersInputDTO } from '../../src/dtos/users/getUsers.dto'

describe("Testing getUsers in UserBusiness", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  )

  test("deve retornar lista mockada", async () => {
    const input: GetUsersInputDTO = {
      nicknameToSearch: "",
      token: "token-mock-astrodev"
    }

    const output = await userBusiness.getUsers(input)
    const astrodev: UserModel = {
      id: "id-mock-astrodev",
      nickname: "Astrodev",
      email: "astrodev@email.com",
      createdAt: expect.any(String)

    }

    expect(output).toHaveLength(2)
    expect(output).toContainEqual(astrodev)

  })
})