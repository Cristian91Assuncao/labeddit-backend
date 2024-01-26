export class LikeDislike {    
  constructor(
      private userId: string,
      private postId: string,
      private like: boolean
  ) {}

  public getUserId(): string {
      return this.userId
  }
  
  public setUserId(value: string): void {
      this.userId = value
  }

  public getPostId(): string {
      return this.postId
  }

  public setPostId(value: string): void {
      this.postId = value
  }

  public getLike(): boolean {
      return this.like
  }

  public setLike(value: boolean): void {
      this.like = value
  }
}