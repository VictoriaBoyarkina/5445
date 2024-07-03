import { AuthApi } from "./AuthApi.js";
import { CardsApi } from "./CardsApi.js";
import { UsersApi } from "./UsersApi.js";
import { CommentsApi } from "./CommentsApi.js";
import { LikesApi } from "./LikesApi.js";

export class DataBase {
  constructor() {
    this.users = new UsersApi();
    this.cards = new CardsApi();
    this.comments = new CommentsApi();
    this.likes = new LikesApi();
    this.auth = AuthApi;
  }

  getCards() {
    const cards = this.cards.getCards();

    return cards.map((el) => {
      const likes = this.likes.getLikesByCardId(el.id);
      const comments = this.comments.getCommentsByCardId(el.id);
      // console.log();
      const owner = this.users.getUserById(el.owner);

      return {
        ...el,
        likes,
        owner,
        comments,
      };
    });
  }

  getCardById(id) {
    const card = this.cards.getCardById(id);
    const likes = this.likes.getLikesByCardId(id);

    return {
      ...card,
      likes,
    };
  }
}
