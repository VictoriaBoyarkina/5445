import { generateId } from "../../utils.js"

const defaultLikes = [
    {
        id: "ld1aha6q2w19vzz8cv8",
        owner: "ld1a61aosmk52r8ufl",
        card: "ld1a8lhx5bc0bgv2vik",
    },
    {
        id: "ld1aj808934c0pmtlrr",
        owner: "ld1a61aosmk52r8ufl",
        card: "ld1aj1b66tn1gdasv8y",
    },
    {
        id: "ld1ajpr7eyto3fh7yev",
        owner: "ld1a61aosmk52r8uf2",
        card: "ld1aj1b66tn1gdasv8y",
    },
]

export class LikesApi {
    constructor() {
        this.likes = [...defaultLikes]
    }

    #createLike(cardId, userId) {
        return {
            id: generateId(),
            owner: userId,
            card: cardId
        }
    }

    #deleteLike(cardId, userId) {
        const likes = this.likes.filter(el => !(el.owner === userId && el.card === cardId))

        const isDeleted = likes.length !== this.likes.length

        this.likes = likes

        return isDeleted
    }

    setLike(cardId, userId) {
        const isDeleted = this.#deleteLike(cardId, userId)

        if (isDeleted) return false

        const like = this.#createLike(cardId, userId)

        this.likes.push(like)

        return {
            cardId,
            likes: this.getLikesByCardId(cardId)
        }
    }

    getLikesByCardId(cardId) {
        return this.likes.filter(el => el.card === cardId)
    }
}