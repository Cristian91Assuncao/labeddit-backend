import { BaseDatabase } from "../../src/database/BaseDatabase";
import {
  COMMENT_LIKES,
  CommentDB,
  CommentDBWithCreatorNickname,
  LikeDislikeCommentDB,
} from "../../src/models/Comment";

const commentsMock: CommentDB[] = [
  {
    id: "id-mock",
    post_id: "id-mock",
    creator_id: "id-mock",
    content: "Este comentário é um mock para teste unitário",
    likes: 1,
    dislikes: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

const commentsMockWithCreatorNickname: CommentDBWithCreatorNickname[] = [
  {
    id: "id-mock",
    post_id: "id-mock",
    creator_id: "id-mock",
    content: "Este comentário é outro mock para teste unitário",
    likes: 1,
    dislikes: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    creator_nickname: "user",
  }
];

const likesDislikesMock: LikeDislikeCommentDB[] = [
  {
    user_id: "id-mock",
    comment_id: "id-mock",
    like: 1,
  },
  {
    user_id: "user2",
    comment_id: "comment2",
    like: 0,
  },
];

export class CommentsDatabaseMock extends BaseDatabase {
  public static TABLE_COMMENTS = "comments";
  public static TABLE_LIKES_DISLIKES_COMMENTS = "likes_dislikes_comments";

  public insertComment = async (commentDB: CommentDB): Promise<void> => {
    commentsMock.push(commentDB);
  };

  public async findCommentsByPostId(id: string): Promise<any> {
    return commentsMock.filter((comment) => comment.post_id === id);
  }

  public async findCommentById(id: string): Promise<CommentDB | undefined> {
    return commentsMock.find((comment) => comment.id === id);
  }

  public updateComment = async (commentDB: CommentDB) => {
    const index = commentsMock.findIndex(
      (comment) => comment.id === commentDB.id
    );
    if (index !== -1) {
      const updateComment = commentsMock.splice(index, 1)[0];
      commentsMock.splice(index, 0, updateComment);
    }
  };

  public deleteCommentById = async (id: string): Promise<void> => {
    const index = commentsMock.findIndex((comment) => comment.id === id);
    if (index !== -1) {
      commentsMock.splice(index, 1);
    }
  };

  public findCommentWithCreatorNicknameById = async (
    id: string
  ): Promise<CommentDBWithCreatorNickname | undefined> => {
    const result = commentsMockWithCreatorNickname.find(
      (comment) => comment.id === id
    );
    return result;
  };

  public findLikeDislike = async (
    likeDislikeDB: LikeDislikeCommentDB
  ): Promise<COMMENT_LIKES | undefined> => {
    const [likeDislike] = likesDislikesMock.filter(
      (like) =>
        like.user_id === likeDislikeDB.user_id &&
        like.comment_id === likeDislikeDB.comment_id
    );

    if (likeDislike === undefined) {
      return undefined;
    } else if (likeDislike.like === 1) {
      return COMMENT_LIKES.LIKED;
    } else {
      return COMMENT_LIKES.DISLIKED;
    }
  };

  public removeLikeDislike = async (
    likeDislikeDB: LikeDislikeCommentDB
  ): Promise<void> => {
    const index = likesDislikesMock.findIndex(
      (like) =>
        like.user_id === likeDislikeDB.user_id &&
        like.comment_id === likeDislikeDB.comment_id
    );
    if (index !== -1) {
      likesDislikesMock.splice(index, 1);
    }
  };

  public updateLikeDislike = async (likeDislikeDB: LikeDislikeCommentDB) => {
    const index = likesDislikesMock.findIndex(
      (like) =>
        like.user_id === likeDislikeDB.user_id &&
        like.comment_id === likeDislikeDB.comment_id
    );
    if (index !== -1) {
      const updateComment = likesDislikesMock.splice(index, 1)[0];
      likesDislikesMock.splice(index, 0, updateComment);
    }
  };

  public insertLikeDislike = async (likeDislikeDB: LikeDislikeCommentDB) => {
    likesDislikesMock.push(likeDislikeDB);
  };
}