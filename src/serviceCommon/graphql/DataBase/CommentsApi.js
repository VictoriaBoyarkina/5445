import { generateId } from "../../../utils.js";

const defaultComments = [
  {
    id: "ld1akq0ao94ubpyr2wd",
    owner: "ld1a61aosmk52r8ufl",
    card: "ld1a8lhx5bc0bgv2vik",
    text: "Comment for card111111",
  },
  {
    id: "ld1amovge2rf97j8l9a",
    owner: "ld1a61aosmk52r8ufl",
    card: "ld1a8lhx5bc0bgv2vik",
    text: "Comment for card122222",
  },
  {
    id: "ld1amymcpc018qlpgc",
    owner: "ld1a61aosmk52r8uf2",
    card: "ld1aj1b66tn1gdasv8y",
    text: "Comment for card1214121251252",
  },
  {
    id: "ld1anjpi8luge9y95jn",
    owner: "ld1a61aosmk52r8ufl",
    card: "ld1aj1b66tn1gdasv8y",
    text: "Comment for card1214121251252",
  },
];

export class CommentsApi {
  constructor() {
    this.comments = [...defaultComments];
  }

  addCommentByCardId(cardId, userId, text) {
    const comment = {
      id: generateId(),
      card: cardId,
      owner: userId,
      text,
    };

    this.comments.push(comment);

    return comment;
  }

  getCommentsByCardId(cardId) {
    return this.comments.filter((el) => el.card === cardId);
  }
}
