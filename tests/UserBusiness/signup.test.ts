import { UserBusiness } from '../../src/business/UserBusiness'
import { UserDatabaseMock } from '../mocks/UserDatabaseMock'
import { HashManagerMock } from '../mocks/HashManagerMock'
import { IdGeneratorMock } from '../mocks/IdGeneratorMock'
import { TokenManagerMock } from '../mocks/TokenManagerMock'
import { SignupInputDTO } from '../../src/dtos/users/signup.dto'

describe("Testing Signup in UserBusiness", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  )

  test("deve retornar token ao se logar corretamente", async () => {
    const input: SignupInputDTO = {
      nickname: "Fulano",
      email: "fulano@email.com",
      password: "fulano123"
    }

    const output = await userBusiness.login(input)

    expect(output.token).toBe("token-mock-fulano")
  })
})