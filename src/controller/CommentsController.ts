import { Request, Response } from "express"
import { CommentsBusiness } from "../business/CommentsBusiness"
import { ZodError } from "zod"
import { BaseError } from "../errors/BaseError"
import { CreateCommentsSchema } from "../dtos/comments/createComments.dto"
import { GetCommentsInputDTO, GetCommentsSchema } from "../dtos/comments/getComments.dto"
import { LikeOrDislikeCommentSchema } from "../dtos/comments/likeOrDislikeComment.dto"

export class CommentsController {
  constructor(
    private commentsBusiness: CommentsBusiness
  ) { }

  //endpoints requisiçao
  public createComment = async (req: Request, res: Response) => {
    try {
      const input = CreateCommentsSchema.parse({
        content: req.body.content,
        postId: req.params.post_id,
        token: req.headers.authorization
      })

      const output = await this.commentsBusiness.createComment(input)
      res.status(201).send(output)

    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado!")
      }
    }
  }

  public getComments = async (req: Request, res: Response) => {
    try {
      const input: GetCommentsInputDTO = GetCommentsSchema.parse({
        token: req.headers.authorization,
        postId: req.params.post_id
      });

      const response = await this.commentsBusiness.getComments(input);

      res.status(200).send(response);
    } catch (error) {
      console.log(error);

      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  public likeOrDislikeComment = async (req: Request, res: Response) => {
    try {
      const input = LikeOrDislikeCommentSchema.parse({
        like: req.body.like,
        token: req.headers.authorization,
        commentId: req.params.comment_id
      })

      const output = await this.commentsBusiness.likeOrDislikeComment(input)
      res.status(200).send(output)

    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado!")
      }
    }
  }
}