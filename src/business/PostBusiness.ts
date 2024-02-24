// import { PostDatabase } from "../database/PostDatabase";
// import { CreatePostInputDTO, CreatePostOutputDTO } from "../dtos/posts/createPost.dto";
// import { DeletePostInputDTO, DeletePostOutputDTO } from "../dtos/posts/deletePost.dto";
// import { UpdatePostInputDTO, UpdatePostOutputDTO } from "../dtos/posts/updatePost.dto";
// import { GetPostsInputDTO, GetPostsOutputDTO } from "../dtos/posts/getPosts.dto";
// import { LikeOrDislikePostInputDTO, LikeOrDislikePostOutputDTO } from "../dtos/posts/likeOrDislikePost.dto";
// import { ForbiddenError } from "../errors/ForbiddenError";
// import { NotFoundError } from "../errors/NotFoundError"; 
// import { UnauthorizedError } from "../errors/UnauthorizedError";
// import { LikeDislikePostDB, POST_LIKES, Post } from "../models/Post";
// import { IdGenerator } from "../services/IdGenerator";
// import { TokenManager } from "../services/TokenManager";

// export class PostBusiness {
//     constructor(
//         private postDatabase: PostDatabase,
//         private idGenerator: IdGenerator,
//         private tokenManager: TokenManager
//     ) { }


//     public createPost = async (
//         input: CreatePostInputDTO
//     ): Promise<void> => {
//         const { content, token } = input

//         const payload = this.tokenManager.getPayload(token)

//         if (!payload) {
//             throw new UnauthorizedError("Token inválido!")
//         }

//         const id = this.idGenerator.generate()

//         const post = new Post(
//             id,
//             payload.id,
//             content,
//             0,
//             0,
//             0,
//             new Date().toISOString(),
//             new Date().toISOString(),
//             payload.nickname
//         )

//         const postDB = post.toDBModel()
//         await this.postDatabase.insertPost(postDB)
//     }

//     public getPosts = async (
//         input: GetPostsInputDTO
//     ): Promise<GetPostsOutputDTO> => {
//         const { token } = input

//         const payload = this.tokenManager.getPayload(token)

//         if (!payload) {
//             throw new UnauthorizedError("Token inválido!")
//         }

//         const postsWithCreatorNickname = await this.postDatabase.getPostsWithCreatorNickname()

//         const posts = postsWithCreatorNickname
//             .map((postsWithCreatorNickname) => {
//                 const post = new Post(
//                     postsWithCreatorNickname.id,
//                     postsWithCreatorNickname.creator_id,
//                     postsWithCreatorNickname.content,
//                     postsWithCreatorNickname.likes,
//                     postsWithCreatorNickname.dislikes,
//                     postsWithCreatorNickname.comments,
//                     postsWithCreatorNickname.created_at,
//                     postsWithCreatorNickname.updated_at,
//                     postsWithCreatorNickname.creator_nickname
//                 )

//                 return post.toBusinessModel()
//             })

//         const output: GetPostsOutputDTO = posts
//         return output
//     }

//     public UpdatePost = async (
//         input: UpdatePostInputDTO
//     ): Promise<UpdatePostOutputDTO> => {
//         const { idToEdit, newContent, token } = input

//         const payload = this.tokenManager.getPayload(token)

//         if (!payload) {
//             throw new UnauthorizedError("Token inválido!")
//         }

//         const postDB = await this.postDatabase.findPostById(idToEdit)

//         if (!postDB) {
//             throw new NotFoundError("Post com esta id não existe")
//         }

//         if (payload.id !== postDB.creator_id) {
//             throw new ForbiddenError("Somente o criador do post pode editá-lo")
//         }

//         const post = new Post(
//             postDB.id,
//             payload.id,
//             postDB.content,
//             postDB.likes,
//             postDB.dislikes,
//             postDB.comments,
//             postDB.created_at,
//             postDB.updated_at,
//             payload.nickname
//         )

//         post.setContent(newContent)

//         const updatedPostDB = post.toDBModel()
//         await this.postDatabase.updatePost(updatedPostDB)

//         const output: UpdatePostOutputDTO = undefined
//         return output
//     }

//     public deletePost = async (
//         input: DeletePostInputDTO
//     ): Promise<DeletePostOutputDTO> => {
//         const { token, idToEdit } = input

//         const payload = this.tokenManager.getPayload(token)

//         if (!payload) {
//             throw new UnauthorizedError("Token inválido!")
//         }

//         const postDB = await this.postDatabase.findPostById(idToEdit)

//         if (!postDB) {
//             throw new NotFoundError("Post com esta id não existe")
//         }

//         // if (payload.role !== USER_ROLES.ADMIN) {

//         //     if (payload.id !== postDB.creator_id) {
//         //         throw new ForbiddenError("Somente o criador do post pode deletá-lo")
//         //     }
//         // }

//         await this.postDatabase.deletePostById(idToEdit)

//         const output: UpdatePostOutputDTO = undefined
//         return output
//     }

//     public likeOrDislikePost = async (
//         input: LikeOrDislikePostInputDTO
//     ): Promise<LikeOrDislikePostOutputDTO> => {
//         const { token, postId, like } = input

//         const payload = this.tokenManager.getPayload(token)

//         if (!payload) {
//             throw new UnauthorizedError("Token inválido!")
//         }

//         const postsWithCreatorName = await this.postDatabase.findPostWithCreatorNameById(postId)

//         if(!postsWithCreatorName){
//             throw new NotFoundError("Post com esta 'id' não existe")
//         }

//         const post = new Post(
//             postsWithCreatorName.id,
//             postsWithCreatorName.creator_id,
//             postsWithCreatorName.content,
//             postsWithCreatorName.likes,
//             postsWithCreatorName.dislikes,
//             postsWithCreatorName.comments,
//             postsWithCreatorName.created_at,
//             postsWithCreatorName.updated_at,
//             postsWithCreatorName.creator_nickname
//         )

//         const likeSqlite = like ? 1 : 0

//         const LikeDislikePostDB: LikeDislikePostDB = {
//             user_id: payload.id,
//             post_id: postId,
//             like: likeSqlite
//         }

//         const likeDislikeExists = await this.postDatabase.findLikeDislike(LikeDislikePostDB)

//         if(likeDislikeExists === POST_LIKES.LIKED){
//             if(like === true){
//                 await this.postDatabase.removeLikeDislike(LikeDislikePostDB)
//                 post.removeLike()
//             } else {
//                 await this.postDatabase.updateLikeDislike(LikeDislikePostDB)
//                 post.removeLike()
//                 post.addDislike()
//             }
//         } else if (likeDislikeExists === POST_LIKES.DISLIKED) {
//             if(like === false){
//                 await this.postDatabase.removeLikeDislike(LikeDislikePostDB)
//                 post.removeDislike()
//             } else {
//                 await this.postDatabase.updateLikeDislike(LikeDislikePostDB)
//                 post.removeDislike()
//                 post.addLike()
//             }
//         } else {
//             await this.postDatabase.insertLikeDislike(LikeDislikePostDB)
//             like ? post.addLike() : post.addDislike()
//         }

//         const updatedPostDB = post.toDBModel()
//         await this.postDatabase.updatePost(updatedPostDB)

//         const output: LikeOrDislikePostOutputDTO = undefined
//         return output
//     }
// }