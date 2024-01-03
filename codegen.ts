import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
	overwrite: true,
	schema: './src/schema/**/*.gql',
	generates: {
		'src/generated/graphql.ts': {
			plugins: [
				'typescript',
				'typescript-resolvers',
				'typescript-document-nodes',
			],
		},
		'./graphql.schema.json': {
			plugins: ['introspection'],
		},
	},
}

export default config
