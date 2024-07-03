import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";

const secret = "secret";

export class AuthApi {
  static generateToken(id) {
    // 1h
    const token = jwt.sign({ id }, secret, { expiresIn: 60 * 60 });

    return token;
  }

  static validToken(headerValue) {
    try {
      const token = headerValue.replace("Bearer ", "");
      const decoded = jwt.verify(token, secret);

      return {
        isAuth: true,
        id: decoded.id,
      };
    } catch {
      throw new GraphQLError("User is not authenticated", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
        },
      });
    }
  }
}
