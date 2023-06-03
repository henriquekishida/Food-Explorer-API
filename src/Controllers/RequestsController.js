const knex = require("../database/knex")

class RequestsContoller {
  async create(request, response) {
    const { title, description, price, category, amount, dish_id, user_id } = request.body

    const [checkIfExist] = await knex("requests")
      .where({ dish_id })
      .where({ user_id })

    const [dish] = await knex("dishes")
      .where({ id: dish_id })

    if (checkIfExist) {
      await knex("requests")
        .where({ dish_id })
        .update({ amount: amount })
    } else {
      await knex("requests")
        .insert({
          title,
          description,
          price,
          category,
          amount,
          dish_id,
          user_id,
          imagem: dish.imagem
        });
    };

    return response.status(201).json()
  }
  async show(request, response) {
    const user_id = request.params.id
    const requests = await knex("requests").where({ user_id })

    return response.json(requests)
  }
  async delete(request, response) {
    const user_id = request.params.user_id
    const dish_id = request.params.dish_id

    if (dish_id == 0) {
      await knex("requests")
        .where({ user_id })
        .delete()

    } else {
      await knex("requests")
        .where({ dish_id })
        .where({ user_id })
        .delete()
    };

    return response.json()
  }
}

module.exports = RequestsContoller