import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchemaSync } from '@graphql-tools/load'
import { makeExecutableSchema } from '@graphql-tools/schema'
import Resolvers from './resolvers/index'
import { typeDefs as ScalarTypeDefs } from 'graphql-scalars'
import mongoose from 'mongoose'
import { vars } from './env'
import { networkInterfaces } from 'os'

const typeDefs = loadSchemaSync('src/schema/**/*.gql', {
	loaders: [new GraphQLFileLoader()],
})

mongoose.set('strictQuery', true)

let mods = makeExecutableSchema({
	typeDefs: [typeDefs, ScalarTypeDefs],
	resolvers: Resolvers,
})

async function main() {
	console.log('Starting server...')

	const server = new ApolloServer({
		schema: mods,
	})

	mongoose
		.connect(vars.MONOGO_URI)
		.then(async () => {
			console.log('Connected to MongoDB ✅')

			const { url } = await startStandaloneServer(server, {
				context: async ({ req }) => {
					return {
						req,
					}
				},
				listen: {
					port: vars.PORT,
				},
			})

			// get all ip addresess
			const nets = networkInterfaces()
			const results = Object.create(null) // Or just '{}', an empty object
			const ips = []
			for (const name of Object.keys(nets)) {
				for (const net of nets[name]) {
					// Skip over non-IPv4 and internal (i.e.)
					if (net.family === 'IPv4' && !net.internal) {
						if (!results[name]) {
							results[name] = []
						}
						results[name].push(net.address)
						ips.push(net.address)
					}
				}
			}

			console.log(`🚀 Server ready at ${url}`)
			for (const ip of ips) {
				console.log(`[🏃] http://${ip}:${vars.PORT}/graphql`)
			}
		})

		.catch((err) => {
			console.log('Failed to connect to MongoDB ❌')
			console.log(err)
		})
}

main()
