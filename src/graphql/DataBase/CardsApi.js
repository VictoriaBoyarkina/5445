import { GraphQLError } from "graphql";
import { generateId } from "../../utils.js";

const defaultCards = [
  {
    title: "First Card by user 'testName'",
    text: "Description for First Card. More More text",
    id: "ld1a8lhx5bc0bgv2vik",
    owner: "ld1a61aosmk52r8ufl",
    createDate: new Date().toUTCString(),
  },
  {
    title: "Second Card by user 'testName1'",
    text: "Description for First Card. More More text",
    id: "ld1aj1b66tn1gdasv8y",
    owner: "ld1a61aosmk52r8uf2",
    createDate: new Date().toUTCString(),
  },
];

export class CardsApi {
  constructor() {
    this.cards = [...defaultCards];
  }

  getCardIndexById(id) {
    return this.cards.findIndex((el) => el.id === id);
  }

  getCardById(id) {
    return this.cards.find((el) => el.id === id);
  }

  addCard(userId, { title, text }) {
    const card = {
      title,
      text,
      id: generateId(),
      owner: userId,
      createDate: new Date().toUTCString(),
    };

    this.cards.push(card);

    return card;
  }

  deleteCard(cardId, userId) {
    const index = this.getCardIndexById(cardId);

    if (index < 0)
      throw new GraphQLError("Card not found", {
        extensions: {
          code: "BADREQUEST",
          http: { status: 400 },
        },
      });

    const card = this.cards[index];

    if (card.owner !== userId)
      throw new GraphQLError("Can't delete someone else's card", {
        extensions: {
          code: "BADREQUEST",
          http: { status: 400 },
        },
      });

    this.cards.splice(index, 1);

    return true;
  }

  getCards() {
    return this.cards;
  }
}
