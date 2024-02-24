import { CommentsBusiness } from "../../src/business/CommentsBusiness";
import { IdGeneratorMock } from "../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../mocks/TokenManagerMock";
import { CommentsDatabaseMock } from "../mocks/CommentsDatabaseMock";
import { BadRequestError } from "../../src/errors/BadRequestError";
import { PostsDatabaseMock } from "../mocks/PostsDatabaseMock";
import { CreateCommentsSchema } from "../../src/dtos/comments/createComments.dto";
import { UnauthorizedError } from "../../src/errors/UnauthorizedError";

describe("Testando create Comment", () => {  
  const commentsBusiness = new CommentsBusiness(
    new CommentsDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new PostsDatabaseMock()
  );

  test("Success test: cria um comentário em um post existente", async () => {
    const input = CreateCommentsSchema.parse({
      content: "teste de criação de comentário em post",
      postId: "id-mock",
      token: "token-mock-fulano",
    });

    await commentsBusiness.createComment(input);
  });

  test("Error test: não pode criar comentario devido a token inválido", async () => {
    try {
      const input = CreateCommentsSchema.parse({
        content: "teste de criação de comentário em post",
        postId: "id-mock",
        token: "token-mock-invalido",
      });

      await commentsBusiness.createComment(input);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.message).toBe("Token inválido!");
        expect(error.statusCode).toBe(401);
      }
    }
  });
});