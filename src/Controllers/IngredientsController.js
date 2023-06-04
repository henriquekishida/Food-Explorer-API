const knex = require("../database/knex")

class IngredientsController {
  async index(request, response) {
    const { name } = request.query;
  
    const ingredients = await knex("ingredients")
      .select("dish_id")
      .where("name", "like", `%${name}%`);
  
    return response.json(ingredients);
  }

  async show(request, response) {
    const dish_id = request.params

    const ingredients = await knex("ingredients").where({ dish_id: dish_id.id })

    return response.json(ingredients)
  }

  async update(request, response) {
    const user_id = request.user.id

    const dish_id = request.params.id
    const { ingredients } = request.body

    await knex('ingredients').where({ dish_id }).delete()

    const insertIngredients = ingredients.map(name => {
      return {
        name,
        dish_id,
        user_id
      }
    });

    await knex('ingredients').insert(insertIngredients)

    return response.status(200).json()
  }
}

module.exports = IngredientsController