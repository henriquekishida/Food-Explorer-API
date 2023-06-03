const knex = require("../database/knex")

class FavoritesController {
  async create(request, response) {
    const { title, category, description, price, imagem, user_id, dish_id } = request.body

    const [checkExist] = await knex("favorites")
      .where({ user_id })
      .where({ id: dish_id })

    const [dish] = await knex('dishes')
      .where({ id: dish_id })

    let currentValue = dish.favorited

    if (checkExist) {
      await knex("favorites")
        .where({ user_id })
        .where({ id: dish_id })
        .delete();

      await knex('dishes')
        .update('favorited', currentValue - 1)
        .where({ id: dish_id });

    } else {
      await knex("favorites").insert({
        title,
        imagem,
        category,
        description,
        price,
        id: dish_id,
        user_id
      });

      await knex('dishes')
        .update('favorited', currentValue + 1)
        .where({ id: dish_id })
    }

    response.status(200).json()
  }

  async index(request, response) {
    const { title } = request.query
    const user_id = request.params.user_id

    let favoriteDishes

    if (title) {
      favoriteDishes = await knex("favorites")
        .whereLike("favorites.title", `%${title}%`)
        .where({ user_id })
        .orderBy('title');
    } else {
      favoriteDishes = await knex("favorites")
        .where({ user_id })
        .orderBy('title');
    }


    return response.json(favoriteDishes);
  }

  async delete(request, response) {
    const id = request.params.id;
    const user_id = request.params.user_id;

    await knex("favorites")
      .where({ user_id })
      .where({ id })
      .delete();

    const [dish] = await knex('dishes')
      .where({ id });

    let currentValue = dish.favorited;

    await knex('dishes')
      .update('favorited', currentValue - 1)
      .where({ id });

    return response.json();

  }
}

module.exports = FavoritesController;