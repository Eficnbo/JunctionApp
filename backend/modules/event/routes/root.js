const { Auth } = require('@hackjunction/shared')
const status = require('http-status')
const EventController = require('../controller')

module.exports = async fastify => {
    fastify.authenticatedRoute([Auth.Permissions.MANAGE_EVENT], {
        method: 'GET',
        url: '/',
        handler: async (request, reply) => {
            const events = await EventController.getEventsByOrganiser(
                request.user
            )
            return reply.code(status.OK).send(events)
        },
        schema: {
            summary: 'Get own events',
            description: 'Get all events which you are organising',
            tags: ['Events'],
            response: {
                [status.OK]: fastify.responseArray(
                    status.OK,
                    fastify.refs.Event
                ),
            },
        },
    })

    fastify.authenticatedRoute([Auth.Permissions.MANAGE_EVENT], {
        method: 'POST',
        url: '/',
        handler: async (request, reply) => {
            const event = await EventController.createEvent(
                request.body,
                request.user
            )
            return reply.code(status.CREATED).send(event)
        },
        schema: {
            summary: 'Create a new event',
            description:
                'Creates a new event, with the current user as the owner.',
            tags: ['Events'],
            body: fastify.requestParams(
                {
                    name: {
                        type: 'string',
                        minLength: 3,
                        maxLength: 100,
                    },
                },
                ['name']
            ),
            response: {
                [status.CREATED]: fastify.responseObject(
                    status.CREATED,
                    fastify.refs.Event
                ),
            },
        },
    })
}