import { PostsDatabase } from "../database/PostsDatabase";
import { CreatePostsInputDTO, CreatePostsOutputDTO } from "../dtos/posts/createPosts.dto";
import { DeletePostsInputDTO, DeletePostsOutputDTO } from "../dtos/posts/deletePosts.dto";
import { EditPostsInputDTO, EditPostsOutputDTO } from "../dtos/posts/editPosts.dto";
import { GetPostsInputDTO, GetPostsOutputDTO } from "../dtos/posts/getPosts.dto";
import { LikeOrDislikePostInputDTO, LikeOrDislikePostOutputDTO } from "../dtos/posts/likeOrDislikePost.dto";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError"; 
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { LikeDislikePostDB, POST_LIKES, Post } from "../models/Post";
// import { USER_ROLES } from "../models/User";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class PostsBusiness {
    constructor(
        private postsDatabase: PostsDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) { }

    // regras de negocio
    public createPost = async (
        input: CreatePostsInputDTO
    ): Promise<CreatePostsOutputDTO> => {
        const { content, token } = input

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError("Token inválido!")
        }

        const id = this.idGenerator.generate()

        const post = new Post(
            id,
            content,
            0,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString(),
            payload.id,
            payload.nickname
        )

        const postDB = post.toDBModel()
        await this.postsDatabase.insertPost(postDB)
    }

    public getPosts = async (
        input: GetPostsInputDTO
    ): Promise<GetPostsOutputDTO> => {
        const { token } = input

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError("Token inválido!")
        }

        const postsWithCreatorNickname = await this.postsDatabase.getPostsWithCreatorNickname()

        const posts = postsWithCreatorNickname
            .map((postsWithCreatorNickname) => {
                const post = new Post(
                    postsWithCreatorNickname.id,
                    postsWithCreatorNickname.content,
                    postsWithCreatorNickname.likes,
                    postsWithCreatorNickname.dislikes,
                    postsWithCreatorNickname.comments,
                    postsWithCreatorNickname.created_at,
                    postsWithCreatorNickname.updated_at,
                    postsWithCreatorNickname.creator_id,
                    postsWithCreatorNickname.creator_nickname
                )

                return post.toBusinessModel()
            })

        const output: GetPostsOutputDTO = posts
        return output
    }

    public editPost = async (
        input: EditPostsInputDTO
    ): Promise<EditPostsOutputDTO> => {
        const { content, token, idToEdit } = input

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError("Token inválido!")
        }

        const postDB = await this.postsDatabase.findPostById(idToEdit)

        if (!postDB) {
            throw new NotFoundError("Post com esta id não existe")
        }

        if (payload.id !== postDB.creator_id) {
            throw new ForbiddenError("Somente o criador do post pode editá-lo")
        }

        const post = new Post(
            postDB.id,
            postDB.content,
            postDB.likes,
            postDB.dislikes,
            postDB.comments,
            postDB.created_at,
            postDB.updated_at,
            payload.id,
            payload.nickname
        )

        post.setContent(content)

        const updatedPostDB = post.toDBModel()
        await this.postsDatabase.updatePost(updatedPostDB)

        const output: EditPostsOutputDTO = undefined
        return output
    }

    public deletePost = async (
        input: DeletePostsInputDTO
    ): Promise<DeletePostsOutputDTO> => {
        const { token, idToEdit } = input

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError("Token inválido!")
        }

        const postDB = await this.postsDatabase.findPostById(idToEdit)

        if (!postDB) {
            throw new NotFoundError("Post com esta id não existe")
        }

        // if (payload.role !== USER_ROLES.ADMIN) {

        //     if (payload.id !== postDB.creator_id) {
        //         throw new ForbiddenError("Somente o criador do post pode deletá-lo")
        //     }
        // }

        await this.postsDatabase.deletePostById(idToEdit)

        const output: EditPostsOutputDTO = undefined
        return output
    }

    public likeOrDislikePost = async (
        input: LikeOrDislikePostInputDTO
    ): Promise<LikeOrDislikePostOutputDTO> => {
        const { token, postId, like } = input

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError("Token inválido!")
        }

        const postsWithCreatorNickname = await this.postsDatabase.findPostWithCreatorNicknameById(postId)

        if(!postsWithCreatorNickname){
            throw new NotFoundError("Post com esta 'id' não existe")
        }

        const post = new Post(
            postsWithCreatorNickname.id,
            postsWithCreatorNickname.content,
            postsWithCreatorNickname.likes,
            postsWithCreatorNickname.dislikes,
            postsWithCreatorNickname.comments,
            postsWithCreatorNickname.created_at,
            postsWithCreatorNickname.updated_at,
            postsWithCreatorNickname.creator_id,
            postsWithCreatorNickname.creator_nickname
        )

        const likeSqlite = like ? 1 : 0

        const LikeDislikePostDB: LikeDislikePostDB = {
            user_id: payload.id,
            post_id: postId,
            like: likeSqlite
        }

        const likeDislikeExists = await this.postsDatabase.findLikeDislike(LikeDislikePostDB)

        if(likeDislikeExists === POST_LIKES.LIKED){
            if(like === true){
                await this.postsDatabase.removeLikeDislike(LikeDislikePostDB)
                post.removeLike()
            } else {
                await this.postsDatabase.updateLikeDislike(LikeDislikePostDB)
                post.removeLike()
                post.addDislike()
            }
        } else if (likeDislikeExists === POST_LIKES.DISLIKED) {
            if(like === false){
                await this.postsDatabase.removeLikeDislike(LikeDislikePostDB)
                post.removeDislike()
            } else {
                await this.postsDatabase.updateLikeDislike(LikeDislikePostDB)
                post.removeDislike()
                post.addLike()
            }
        } else {
            await this.postsDatabase.insertLikeDislike(LikeDislikePostDB)
            like ? post.addLike() : post.addDislike()
        }

        const updatedPostDB = post.toDBModel()
        await this.postsDatabase.updatePost(updatedPostDB)

        const output: LikeOrDislikePostOutputDTO = undefined
        return output
    }
}