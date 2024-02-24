import express from 'express'
import { IdGenerator } from '../services/IdGenerator'
import { TokenManager } from '../services/TokenManager'
import { PostController } from '../controller/PostController'
import { PostsBusiness } from '../business/PostsBusiness'
import { PostsDatabase } from '../database/PostsDatabase'
import { CommentsController } from '../controller/CommentController'
import { CommentsBusiness } from '../business/CommentsBusiness'
import { CommentsDatabase } from '../database/CommentsDatabase'

export const postRouter = express.Router()

const postController = new PostController(
  new PostsBusiness(
    new PostsDatabase(),
    new IdGenerator(),
    new TokenManager()
  )
)

const commentsController = new CommentsController(
    new CommentsBusiness(
        new CommentsDatabase(),
        new IdGenerator(),
        new TokenManager(),
        new PostsDatabase()
    )
)

postRouter.get("/", postController.getPosts)
postRouter.post("/", postController.createPost)
postRouter.post("/:post_id/comments", commentsController.createComment)
postRouter.put("/:post_id/like", postController.likeOrDislikePost)