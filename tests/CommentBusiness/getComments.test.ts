import { IdGeneratorMock } from '../mocks/IdGeneratorMock'
import { TokenManagerMock } from '../mocks/TokenManagerMock'
import { CommentsBusiness } from '../../src/business/CommentsBusiness'
import { CommentsDatabaseMock } from '../mocks/CommentsDatabaseMock'
import { PostsDatabaseMock } from '../mocks/PostsDatabaseMock'
import { GetCommentsSchema } from '../../src/dtos/comments/getComments.dto'
import { BadRequestError } from '../../src/errors/BadRequestError'

describe("Testing getUsers in UserBusiness", () => {  
  const commentsBusiness = new CommentsBusiness(
    new CommentsDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new PostsDatabaseMock()
  );

  test("Success test: deve retornar comentários de um post com id fornecido", async () => {
    const input = GetCommentsSchema.parse({
      postId: "id-mock",
      token: "token-mock-fulano",
    });

    await commentsBusiness.getComments(input);
  });

  test("Error test: deve não poder ver comentarios devido a token inválido", async () => {
    try {
      const input = GetCommentsSchema.parse({
        postId: "id-mock",
        token: "token-mock-invalido",
      });

      await commentsBusiness.getComments(input);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("Token inválido");
        expect(error.statusCode).toBe(400);
      }
    }
  });
});