import { merge } from 'lodash'
import { GraphQLScalarType, GraphQLError, Kind } from 'graphql'
import { Resolvers } from '../generated/graphql'
import HelloResolvers from './hello'
import { resolvers as GraphqlScalarResolvers } from 'graphql-scalars'

const EMAIL_ADDRESS_REGEX =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const validate = (value: string) => {
	if (typeof value !== 'string') {
		throw new GraphQLError(`Value is not string: ${value}`)
	}

	if (!EMAIL_ADDRESS_REGEX.test(value)) {
		throw new GraphQLError(`Value is not a valid email address: ${value}`)
	}
	return value
}

const EmailScalar = new GraphQLScalarType({
	name: 'Email',
	description: 'Email custom scalar type',
	serialize: validate,
	parseValue: validate,
	parseLiteral: (ast) => {
		if (ast.kind !== Kind.STRING) {
			throw new GraphQLError(
				`Query error: Can only parse strings as email addresses but got a: ${ast.kind}`
			)
		}

		return validate(ast.value)
	},
})

const FilterSkipScalar = new GraphQLScalarType({
	name: 'FilterSkip',
	description: 'Performs input checking in skip field',
	serialize: (value: number) => {
		if (typeof value !== 'number') {
			throw new GraphQLError(`Value is not a number: ${value}`)
		}
		if (value < 0) {
			throw new GraphQLError(`Value is not positive: ${value}`)
		}
		return value
	},
	parseValue: (value: number) => {
		if (typeof value !== 'number') {
			throw new GraphQLError(`Value is not a number: ${value}`)
		}
		if (value < 0) {
			throw new GraphQLError(`Value is not positive: ${value}`)
		}
		return value
	},
	parseLiteral: (ast) => {
		if (ast.kind !== Kind.INT) {
			throw new GraphQLError(
				`Query error: Can only parse integers as skip field but got a: ${ast.kind}`
			)
		}
		const value = parseInt(ast.value, 10)
		if (value < 0) {
			throw new GraphQLError(`Value is not positive: ${value}`)
		}
		return value
	},
})

const FilterLimitScalar = new GraphQLScalarType({
	name: 'FilterLimit',
	description: 'Performs input checking in limit field',
	serialize: (value: number) => {
		if (typeof value !== 'number') {
			throw new GraphQLError(`Value is not a number: ${value}`)
		}
		if (value <= 0) {
			throw new GraphQLError(`Value is not positive: ${value}`)
		}

		return value
	},
	parseValue: (value: number) => {
		if (typeof value !== 'number') {
			throw new GraphQLError(`Value is not a number: ${value}`)
		}
		if (value <= 0) {
			throw new GraphQLError(`Value is not positive: ${value}`)
		}
		if (value > 100) {
			throw new GraphQLError(`Value is greater than 100: ${value}`)
		}
		return value
	},
	parseLiteral: (ast) => {
		if (ast.kind !== Kind.INT) {
			throw new GraphQLError(
				`Query error: Can only parse integers as limit field but got a: ${ast.kind}`
			)
		}
		const value = parseInt(ast.value, 10)
		if (value <= 0) {
			throw new GraphQLError(`Value is not positive: ${value}`)
		}
		return value
	},
})

const resolvers: Resolvers = {
	Email: EmailScalar,
	FilterSkip: FilterSkipScalar,
	FilterLimit: FilterLimitScalar,
}

export default merge(resolvers, HelloResolvers, GraphqlScalarResolvers)
