import {
  LikeDislikePostDB,
  POST_LIKES,
  PostDBWithCreatorNickname,
} from "../../src/models/Post";
import { BaseDatabase } from "../../src/database/BaseDatabase";

export interface PostDB {
  id: string;
  creator_id: string;
  content: string;
  likes: number;
  dislikes: number;
  comments: number;
  created_at: string;
  updated_at: string;
}

export interface postLikeOrDislikeDB {
  post_id: string;
  user_id: string;
  like: number;
}

const postsMock: PostDB[] = [
  {
    id: "id-mock",
    creator_id: "id-mock-fulano",
    content: "Este post é um mock para teste unitário",
    likes: 1,
    dislikes: 2,
    comments: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const postsMockWithCreatorNickname: PostDBWithCreatorNickname[] = [
  {
    id: "eadcdc2b-59bc-4794-8c57-21690a6cf040",
    creator_id: "id-mock-fulano",
    content: "Este post é um mock para teste unitário",
    likes: 1,
    dislikes: 2,
    comments: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    creator_nickname: "fulano",
  },
];

const likesDislikesMock: LikeDislikePostDB[] = [
  {
    post_id: "id-mock",
    user_id: "id-mock-fulano",
    like: 1,
  },
  {
    post_id: "id-mock-2",
    user_id: "id-mock-fulano",
    like: 0,
  },
];

export class PostsDatabaseMock extends BaseDatabase {
  public static TABLE_POSTS = "posts";
  public static TABLE_LIKES_DISLIKES_POSTS = "likes_dislikes_posts";

  public async insertPost(postDB: PostDB): Promise<void> {
    postsMock.push(postDB);
  }

  public async updateCommentNumber(postId: string): Promise<void> {
    const index = postsMock.findIndex((post) => post.id === postId);

    if (index !== -1) {
      postsMock[index].comments + 1;

      const updatePost = postsMock.splice(index, 1)[0];
      postsMock.splice(index, 0, updatePost);
    }
  }

  public async findLikeDislike(
    LikeDislikePostDB: LikeDislikePostDB
  ): Promise<POST_LIKES | undefined> {
    const [likeDislike] = likesDislikesMock.filter(
      (like) =>
        like.user_id === LikeDislikePostDB.user_id &&
        like.post_id === LikeDislikePostDB.post_id
    );

    if (likeDislike === undefined) {
      return undefined;
    } else if (likeDislike.like === 1) {
      return POST_LIKES.LIKED;
    } else {
      return POST_LIKES.DISLIKED;
    }
  }

  public async updatePost(postDB: PostDB): Promise<void> {
    const index = postsMock.findIndex((post) => post.id === postDB.id);
    if (index !== -1) {
      const updatePost = postsMock.splice(index, 1)[0];
      postsMock.splice(index, 0, updatePost);
    }
  }

  public async deletePostById(id: string): Promise<void> {
    const index = postsMock.findIndex((post) => post.id === id);
    if (index !== -1) {
      postsMock.splice(index, 1);
    }
  }

  public async findPostById(id: string): Promise<PostDB | undefined> {
    return postsMock.find((post) => post.id === id);
  }

  public getPostsWithCreatorNickname = async (): Promise<
    PostDBWithCreatorNickname[]
  > => {
    return postsMockWithCreatorNickname;
  };

  public async findPostWithCreatorNicknameById(
    id: string
  ): Promise<PostDBWithCreatorNickname | undefined> {
    const result = postsMockWithCreatorNickname.find((post) => post.id === id);
    return result;
  }

  public async removeLikeDislike(LikeDislikePostDB: LikeDislikePostDB): Promise<void> {
    const index = likesDislikesMock.findIndex(
      (like) =>
        like.user_id === LikeDislikePostDB.user_id &&
        like.post_id === LikeDislikePostDB.post_id
    );
    if (index !== -1) {
      likesDislikesMock.splice(index, 1);
    }
  }

  public async updateLikeDislike(LikeDislikePostDB: LikeDislikePostDB): Promise<void> {
    const index = likesDislikesMock.findIndex(
      (like) =>
        like.user_id === LikeDislikePostDB.user_id &&
        like.post_id === LikeDislikePostDB.post_id
    );
    if (index !== -1) {
      const updatePost = likesDislikesMock.splice(index, 1)[0];
      likesDislikesMock.splice(index, 0, updatePost);
    }
  }

  public async insertLikeDislike(LikeDislikePostDB: LikeDislikePostDB): Promise<void> {
    likesDislikesMock.push(LikeDislikePostDB);
  }
}