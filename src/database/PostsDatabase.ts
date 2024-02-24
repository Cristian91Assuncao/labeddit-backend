import { LikeDislikePostDB, POST_LIKES, PostDB, PostDBWithCreatorNickname } from "../models/Post";
import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from "./UserDatabase";

export class PostsDatabase extends BaseDatabase {
  public static TABLE_POSTS = "posts"
  public static TABLE_LIKES_DISLIKES_POSTS = "likes_dislikes_posts"


  public insertPost = async (postDB: PostDB): Promise<void> => {
    await BaseDatabase
      .connection(PostsDatabase.TABLE_POSTS)
      .insert(postDB)
  }

  public updateCommentNumber = async (postId:string): Promise<void> => {
    const [postDB]: PostDB[] = await BaseDatabase
      .connection(PostsDatabase.TABLE_POSTS)
      .where({ id: postId })

      await BaseDatabase
      .connection(PostsDatabase.TABLE_POSTS)
      .update({
        comments: postDB.comments + 1
      })
      .where({ id: postId }) 
  }

  public getPostsWithCreatorNickname = async (): Promise<PostDBWithCreatorNickname[]> => {
    const postsDB = await BaseDatabase
      .connection(PostsDatabase.TABLE_POSTS)
      .select(
        `${PostsDatabase.TABLE_POSTS}.id`,
        `${PostsDatabase.TABLE_POSTS}.creator_id`,
        `${PostsDatabase.TABLE_POSTS}.content`,
        `${PostsDatabase.TABLE_POSTS}.likes`,
        `${PostsDatabase.TABLE_POSTS}.dislikes`,
        `${PostsDatabase.TABLE_POSTS}.comments`,
        `${PostsDatabase.TABLE_POSTS}.created_at`,
        `${PostsDatabase.TABLE_POSTS}.updated_at`,
        `${UserDatabase.TABLE_USERS}.nickname as creator_nickname`
      ).join(
        `${UserDatabase.TABLE_USERS}`,
        `${PostsDatabase.TABLE_POSTS}.creator_id`,
        "=",
        `${UserDatabase.TABLE_USERS}.id`)

    return postsDB as PostDBWithCreatorNickname[]
  }

  public findPostById = async (id: string): Promise<PostDB | undefined> => {
    const [result] = await BaseDatabase
      .connection(PostsDatabase.TABLE_POSTS)
      .select()
      .where({ id })

    return result as PostDB | undefined
  }

  public updatePost = async (postDB: PostDB) => {
    await BaseDatabase
      .connection(PostsDatabase.TABLE_POSTS)
      .update(postDB)
      .where({ id: postDB.id })
  }

  public deletePostById = async (id: string): Promise<void> => {
    await BaseDatabase
      .connection(PostsDatabase.TABLE_POSTS)
      .delete()
      .where({ id })
  }

  public findPostWithCreatorNicknameById = async (id: string): Promise<PostDBWithCreatorNickname | undefined> => {
    const [postsDB] = await BaseDatabase
      .connection(PostsDatabase.TABLE_POSTS)
      .select(
        `${PostsDatabase.TABLE_POSTS}.id`,
        `${PostsDatabase.TABLE_POSTS}.creator_id`,
        `${PostsDatabase.TABLE_POSTS}.content`,
        `${PostsDatabase.TABLE_POSTS}.likes`,
        `${PostsDatabase.TABLE_POSTS}.dislikes`,
        `${PostsDatabase.TABLE_POSTS}.created_at`,
        `${PostsDatabase.TABLE_POSTS}.updated_at`,
        `${UserDatabase.TABLE_USERS}.nickname as creator_nickname`
      ).join(
        `${UserDatabase.TABLE_USERS}`,
        `${PostsDatabase.TABLE_POSTS}.creator_id`,
        "=",
        `${UserDatabase.TABLE_USERS}.id`)
      .where({ [`${PostsDatabase.TABLE_POSTS}.id`]: id })


    return postsDB as PostDBWithCreatorNickname | undefined
  }

  public findLikeDislike = async (LikeDislikePostDB: LikeDislikePostDB): Promise<POST_LIKES | undefined> => {
    const [result] = await BaseDatabase
      .connection(PostsDatabase.TABLE_LIKES_DISLIKES_POSTS)
      .select()
      .where({
        user_id: LikeDislikePostDB.user_id,
        post_id: LikeDislikePostDB.post_id
      })

    if(result === undefined){
      return undefined
    } else if(result.like === 1) {
      return POST_LIKES.LIKED
    } else {
      return POST_LIKES.DISLIKED
    }
  }

  public removeLikeDislike = async (LikeDislikePostDB: LikeDislikePostDB): Promise<void> => {
    await BaseDatabase
      .connection(PostsDatabase.TABLE_LIKES_DISLIKES_POSTS)
      .delete()
      .where({
        user_id: LikeDislikePostDB.user_id,
        post_id: LikeDislikePostDB.post_id
      })

  }

  public updateLikeDislike = async (LikeDislikePostDB: LikeDislikePostDB) => {
    await BaseDatabase
      .connection(PostsDatabase.TABLE_LIKES_DISLIKES_POSTS)
      .update(LikeDislikePostDB)
      .where({
        user_id: LikeDislikePostDB.user_id,
        post_id: LikeDislikePostDB.post_id
      })
  }

  public insertLikeDislike = async (LikeDislikePostDB: LikeDislikePostDB) => {
    await BaseDatabase
      .connection(PostsDatabase.TABLE_LIKES_DISLIKES_POSTS)
      .insert(LikeDislikePostDB)
  }

}