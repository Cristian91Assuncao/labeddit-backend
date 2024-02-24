import { PostsBusiness } from "../../src/business/PostsBusiness";
import { LikeOrDislikePostSchema } from "../../src/dtos/posts/likeOrDislikePost.dto";
import { BadRequestError } from "../../src/errors/BadRequestError";
import { NotFoundError } from "../../src/errors/NotFoundError";
import { UnauthorizedError } from "../../src/errors/UnauthorizedError";
import { IdGeneratorMock } from "../mocks/IdGeneratorMock";
import { PostsDatabaseMock } from "../mocks/PostsDatabaseMock";
import { TokenManagerMock } from "../mocks/TokenManagerMock";
describe("likesDislikesMock", () => {
  const postBusiness = new PostsBusiness(
    new PostsDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  // test("success", async () => {
  //   const input = LikeOrDislikePostSchema.parse({
  //     postId: "id-mock",
  //     token: "token-mock-fulano",
  //     like: true,
  //   });

  //   const output = await postBusiness.likeOrDislikePost(input);

  //   expect(output).toEqual(undefined);
  // });

  test("error test: id not found", async () => {
    expect.assertions(2);
    try {
      const input = LikeOrDislikePostSchema.parse({
        postId: "id-mock-falha",
        token: "token-mock-fulano",
        like: true,
      });

      await postBusiness.likeOrDislikePost(input);
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.message).toBe("Post com esta 'id' não existe");
        expect(error.statusCode).toBe(404);
      }
    }
  });

  test("error test: login failed", async () => {
    expect.assertions(2);
    try {
      const input = LikeOrDislikePostSchema.parse({
        postId: "id-mock",
        token: "token-mock-falho",
        like: true,
      });

      await postBusiness.likeOrDislikePost(input);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.message).toBe("Token inválido!");
        expect(error.statusCode).toBe(401);
      }
    }
  });
});