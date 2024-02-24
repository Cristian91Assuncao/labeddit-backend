import { CommentsBusiness } from "../../src/business/CommentsBusiness";
import { LikeOrDislikeCommentSchema } from "../../src/dtos/comments/likeOrDislikeComment.dto";
import { NotFoundError } from "../../src/errors/NotFoundError";
import { UnauthorizedError } from "../../src/errors/UnauthorizedError";
import { CommentsDatabaseMock } from "../mocks/CommentsDatabaseMock";
import { IdGeneratorMock } from "../mocks/IdGeneratorMock";
import { PostsDatabaseMock } from "../mocks/PostsDatabaseMock";
import { TokenManagerMock } from "../mocks/TokenManagerMock";
describe("likesDislikesMock", () => {  
  const commentsBusiness = new CommentsBusiness(
    new CommentsDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new PostsDatabaseMock()
  );

  // test("success", async () => {
  //   const input = LikeOrDislikeCommentSchema.parse({
  //     postId: "id-mock",
  //     token: "token-mock-fulano",
  //     like: true,
  //   });

  //   const output = await commentsBusiness.likeOrDislikeComment(input);

  //   expect(output).toEqual(undefined);
  // });

  test("error test: id not found", async () => {
    expect.assertions(2);
    try {
      const input = LikeOrDislikeCommentSchema.parse({
        postId: "id-mock-falha",
        token: "token-mock-fulano",
        like: true,
      });

      await commentsBusiness.likeOrDislikeComment(input);
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.message).toBe("Comment com esta 'id' não existe");
        expect(error.statusCode).toBe(404);
      }
    }
  });

  test("error test: login failed", async () => {
    expect.assertions(2);
    try {
      const input = LikeOrDislikeCommentSchema.parse({
        postId: "id-mock",
        token: "token-mock-falho",
        like: true,
      });

      await commentsBusiness.likeOrDislikeComment(input);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.message).toBe("Token inválido!");
        expect(error.statusCode).toBe(401);
      }
    }
  });
});