const knex = require('../database')

module.exports = {
    async index(req, res, next) {
        try {

            const { user_id, page = 1 } = req.query

            const countObj = knex('projects').count()
            const query = knex('projects')
                .limit(5)
                .offset((page - 1) * 5)

            if (user_id) {
                query
                    .where({ user_id })
                    .join('users', 'users.id', '=', 'projects.user_id')
                    .select('projects.*', 'users.username')
                    .where('deleted_at', null)

                countObj
                    .where({ user_id })
            }

            const [count] = await countObj
            const results = await query

            res.header('X-Total-Count', count["count"])
            return res.json(results)

        } catch (error) {
            next(error)
        }
    },
    async create(req, res, next) {
        try {
            const { title, user_id } = req.body
            await knex('projects')
                .insert({
                    title,
                    user_id
                })
            return res.status(201).send()
        } catch (error) {
            next(error)
        }
    }
}