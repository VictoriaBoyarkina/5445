import { GraphQLError  } from 'graphql'

export const authGuard = (cb) => {
    return (parent, values, context, ...args) => {
        const { db, req } = context

        const authHeader = req.headers['authorization']
        const auth = db.auth.validToken(authHeader)

        const user = db.users.getUserById(auth.id)

        if (!user) throw new GraphQLError('User is not authenticated', {
            extensions: {
                code: 'UNAUTHENTICATED',
                http: { status: 401 },
            }
        })

        const newContext = {
            ...context,
            auth
        }

        return cb(parent, values, newContext, ...args)
    }
}