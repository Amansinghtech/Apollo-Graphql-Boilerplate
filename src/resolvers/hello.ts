import { Resolvers } from '@graphql'

export default {
	Query: {
		hello: () => 'Hello World!',
	},
} as Resolvers
