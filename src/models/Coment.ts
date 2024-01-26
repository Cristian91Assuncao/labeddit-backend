export interface ComentDB {
  id: string,
  creator_id: string,
  content: string,
  likes: number,
  dislikes: number,
  created_at: string,
  updated_at: string
}

export interface LikeDislikeDB {
  user_id: string,
  coment_id: string,
  like: number
}

export interface ComentModel {
  id: string,
  creatorId: string,
  content: string,
  likes: number,
  dislikes: number,
  createdAt: string,
  updatedAt: string

}

export class Coment {
  constructor(
      private id: string,
      private creatorId: string,
      private content: string,
      private likes: number,
      private dislikes: number,
      private createdAt: string,
      private updatedAt: string
  ) { }

  public getId(): string {
      return this.id
  }

  public setId(value: string): void {
      this.id = value
  }

  public getCreatorId(): string {
      return this.creatorId
  }

  public setCreatorId(value: string): void {
      this.creatorId = value
  }

  public getContent(): string {
      return this.content
  }

  public setContent(value: string): void {
      this.content = value
  }

  public getLikes(): number {
      return this.likes
  }

  public setLikes(value: number): void {
      this.likes = value
  }

  public getDislikes(): number {
      return this.dislikes
  }

  public setDislikes(value: number): void {
      this.dislikes = value
  }


  public getCreatedAt(): string {
      return this.createdAt
  }

  public setCreatedAt(value: string): void {
      this.createdAt = value
  }

  public getUpdatedAt(): string {
      return this.updatedAt
  }

  public setUpdatedAt(value: string): void {
      this.updatedAt = value
  }

  public addLike(): void {
      this.likes++
  }

  public removeLike(): void {
      this.likes--
  }

  public addDislike(): void {
      this.dislikes++
  }

  public removeDislike(): void {
      this.dislikes--
  }

}