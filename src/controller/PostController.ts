import { Request, Response } from "express"
import { ZodError } from "zod"
import { BaseError } from "../errors/BaseError"
import { GetPostsSchema } from "../dtos/posts/getPosts.dto"
import { LikeOrDislikePostSchema } from "../dtos/posts/likeOrDislikePost.dto"
import { PostsBusiness } from "../business/PostsBusiness"
import { CreatePostsSchema } from "../dtos/posts/createPosts.dto"


export class PostController {
  constructor(
    private postBusiness: PostsBusiness
  ) { }

  public createPost = async (req: Request, res: Response) => {
    try {
      const input = CreatePostsSchema.parse({
        content: req.body.content,
        token: req.headers.authorization
      })

      const output = await this.postBusiness.createPost(input)
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

  public getPosts = async (req: Request, res: Response) => {
    try {
      const input = GetPostsSchema.parse({
        token: req.headers.authorization
      })

      const output = await this.postBusiness.getPosts(input)
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


  public likeOrDislikePost = async (req: Request, res: Response) => {
    try {
      const input = LikeOrDislikePostSchema.parse({
        like: req.body.like,
        token: req.headers.authorization,
        postId: req.params.post_id
      })

      const output = await this.postBusiness.likeOrDislikePost(input)
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