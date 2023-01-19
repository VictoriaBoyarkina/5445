import { GraphQLError } from "graphql";
import { generateId, randomColor } from "../../utils.js";

const defaultUsers = [
  {
    id: "ld1a61aosmk52r8ufl",
    login: "test",
    password: "test",
    username: "testName",
    color: "#4664de",
  },
  {
    id: "ld1a61aosmk52r8uf2",
    login: "test1",
    password: "test1",
    username: "testName1",
    color: "#fefb56",
  },
];

export class UsersApi {
  constructor() {
    this.users = [...defaultUsers];
  }

  #createUser({ login, password }) {
    const defaultValues = {
      id: "",
      login: "",
      password: "",
      username: "",
      color: randomColor(),
    };

    return {
      ...defaultValues,
      id: generateId(),
      username: login,
      login,
      password,
    };
  }

  getUsers() {
    return this.users.map((el) => {
      return this.getPublicUserInfo(el);
    });
  }

  changeInfo(id, payload) {
    const user = this.getUserById(id);

    if (!user)
      throw new GraphQLError("User not found", {
        extensions: {
          code: "BAD_REQUEST",
          http: { status: 400 },
        },
      });

    const result = {
      ...user,
      ...payload,
    };

    this.users.forEach((el, index) => {
      if (el.id === id) {
        this.users[index] = result;
      }
    });

    return result;
  }

  getPublicUserInfo(user) {
    return {
      id: user.id,
      login: user.login,
      username: user.username,
      color: user.color,
    };
  }

  add(user) {
    const newUser = this.#createUser(user);
    const foundUser = this.getUserByLogin(newUser.login);

    if (foundUser) {
      throw new Error("user exists");
    }

    this.users.push(newUser);

    return true;
  }

  getUserById(id) {
    return this.users.find((el) => el.id === id);
  }

  getUserByLogin(login) {
    return this.users.find((el) => el.login === login);
  }

  checkPassword(login, password) {
    const user = this.getUserByLogin(login);

    if (!user) return false;

    if (user.password !== password) return false;

    return true;
  }
}
