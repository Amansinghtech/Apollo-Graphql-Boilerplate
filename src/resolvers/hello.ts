import { Resolvers } from '@graphql'

export default {
	Query: {
		hello: () => 'Hello World!',
		myDate: () => new Date(),
	},
} as Resolvers
