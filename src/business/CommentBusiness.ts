// import { CommentsDatabase } from "../database/CommentDatabase";
// import { PostDatabase } from "../database/PostDatabase";
// import { CreateCommentInputDTO, CreateCommentOutputDTO } from "../dtos/comments/createComment.dto";
// import {
//   GetCommentsInputDTO,
//   GetCommentsOutputDTO,
// } from "../dtos/comments/getComments.dto";
// import { LikeOrDislikeCommentInputDTO, LikeOrDislikeCommentOutputDTO } from "../dtos/comments/likeOrDislikeComment.dto";
// import { BadRequestError } from "../errors/BadRequestError";
// import { NotFoundError } from "../errors/NotFoundError";
// import { UnauthorizedError } from "../errors/UnauthorizedError";
// import { COMMENT_LIKES, Comment, LikeDislikeCommentDB } from "../models/Comment";
// import { IdGenerator } from "../services/IdGenerator";
// import { TokenManager } from "../services/TokenManager";

// export class CommentsBusiness {
//   constructor(
//     private commentDatabase: CommentsDatabase,
//     private idGenerator: IdGenerator,
//     private tokenManager: TokenManager,
//     private postDatabase: PostDatabase
//   ) {}

//   // regras de negocio
//   public createComment = async (
//     input: CreateCommentInputDTO
//   ): Promise<void> => {
//     const { content, token, postId } = input;

//     const payload = this.tokenManager.getPayload(token);

//     if (!payload) {
//       throw new UnauthorizedError("Token inválido!");
//     }

//     const id = this.idGenerator.generate();

//     const comment = new Comment(
//       id,
//       postId,
//       content,
//       0,
//       0,
//       new Date().toISOString(),
//       new Date().toISOString(),
//       payload.id,
//       payload.nickname
//     );

//     const commentDB = comment.toDBModel();
//     await this.commentDatabase.insertComment(commentDB);

//     await this.postDatabase.updateCommentNumber(postId)
//   };

//   public getComments = async (
//     input: GetCommentsInputDTO
//   ): Promise<GetCommentsOutputDTO> => {
//     const { token, postId } = input;

//     const payload = this.tokenManager.getPayload(token);

//     if (!payload) {
//       throw new UnauthorizedError("Token inválido");
//     }

//     const commentsDB = await this.commentDatabase.findCommentsByPostId(postId);

//     const commentsModel = commentsDB.map((commentDB: any) => {
//       const comment = new Comment(
//         commentDB.id,
//         commentDB.post_id,
//         commentDB.content,
//         commentDB.likes,
//         commentDB.dislikes,
//         commentDB.created_at,
//         commentDB.updated_at,
//         commentDB.created_at,
//         commentDB.creator_name
//       );

//       return comment.toBusinessModel()
//     });

//     const response: GetCommentsOutputDTO = commentsModel;

//     return response;
//   };

//   public likeOrDislikeComment = async (
//     input: LikeOrDislikeCommentInputDTO
//   ): Promise<LikeOrDislikeCommentOutputDTO> => {
//     const { token, commentId, like } = input;

//     const payload = this.tokenManager.getPayload(token);

//     if (!payload) {
//       throw new UnauthorizedError("Token inválido!");
//     }

//     const commentDbWithCreatorNickname =
//       await this.commentDatabase.findCommentWithCreatorNameById(commentId);

//     if (!commentDbWithCreatorNickname) {
//       throw new NotFoundError("Comment com esta 'id' não existe");
//     }

//     const comment = new Comment(
//         commentDbWithCreatorNickname.id,
//         commentDbWithCreatorNickname.post_id,
//         commentDbWithCreatorNickname.content,
//         commentDbWithCreatorNickname.likes,
//         commentDbWithCreatorNickname.dislikes,
//         commentDbWithCreatorNickname.created_at,
//         commentDbWithCreatorNickname.updated_at,
//         commentDbWithCreatorNickname.creator_id,
//         commentDbWithCreatorNickname.creator_nickname,
//     );

//     const likeSqlite = like ? 1 : 0;

//     const likeDislikeDB: LikeDislikeCommentDB = {
//       user_id: payload.id,
//       comment_id: commentId,
//       like: likeSqlite,
//     };   

//     const likeDislikeExists = await this.commentDatabase.findLikeDislike(
//       likeDislikeDB
//     );

//     if (likeDislikeExists === COMMENT_LIKES.LIKED) {
//       if (like === true) {
//         await this.commentDatabase.removeLikeDislike(likeDislikeDB);
//         comment.removeLike();
//       } else {
//         await this.commentDatabase.updateLikeDislike(likeDislikeDB);
//         comment.removeLike();
//         comment.addDislike();
//       }
//     } else if (likeDislikeExists === COMMENT_LIKES.DISLIKED) {
//       if (like === false) {
//         await this.commentDatabase.removeLikeDislike(likeDislikeDB);
//         comment.removeDislike();
//       } else {
//         await this.commentDatabase.updateLikeDislike(likeDislikeDB);
//         comment.removeDislike();
//         comment.addLike();
//       }
//     } else {
//       await this.commentDatabase.insertLikeDislike(likeDislikeDB);
//       like ? comment.addLike() : comment.addDislike();
//     }

//     const updatedPostDB = comment.toDBModel();
//     await this.commentDatabase.updateComment(updatedPostDB);

//     const output: LikeOrDislikeCommentOutputDTO = undefined;
//     return output;
//   };
// }