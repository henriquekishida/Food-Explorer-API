const knex = require("../database/knex")
const sqliteConnection = require("../database/sqlite")
const AppError = require("../utils/AppError")
const DiskStorage = require("../providers/DiskStorage")

class DishesController {
  async create(request, response) {
    const data = request.body.data

    const { title, description, category, ingredients, price } = JSON.parse(data)
    const user_id = request.user.id
    const imagem = request.file.filename

    const diskStorage = new DiskStorage()
    const filename = await diskStorage.saveFile(imagem)

    const [dish_id] = await knex("dishes").insert({
      title,
      imagem: filename,
      description,
      category,
      price,
      user_id,
      ingredients
    });

    const ingredientsInsert = ingredients.map(name => {
      return {
        dish_id,
        name,
        user_id
      }
    });

    await knex("ingredients").insert(ingredientsInsert)

    return response.json().status(200)
  }

  async show(request, response) {
    const { id } = request.params

    const dish = await knex("dishes").where({ id }).orderBy("title").first();
    const ingredients = await knex("ingredients").where({ dish_id: id }).orderBy("name")

    return response.json({
      dish: dish,
      ingredients: ingredients,
    });
  }

  async delete(request, response) {
    const { id } = request.params
    const diskStorage = new DiskStorage()

    const dish = await knex("dishes")
      .where({ id }).first();

    if (dish.imagem) {
      await diskStorage.deleteFile(dish.imagem)
    }
    await knex("dishes").where({ id }).delete()
    await knex("favorites").where({ id }).delete()

    return response.json()
  }

  async index(request, response) {
    const { title } = request.query

    let dishes

    if (title) {
      dishes = await knex("dishes")
        .where("dishes.title", "like", `%${title}%`)
        .orWhereExists(function () {
          this.select("*")
            .from("ingredients")
            .whereRaw("ingredients.dish_id = dishes.id")
            .andWhere("ingredients.name", "like", `%${title}%`);
        })
        .orderBy('title')
    } else {
      dishes = await knex('dishes').orderBy('favorited')
    }

    return response.json(dishes.reverse());
  }

  async update(request, response) {
    const dish_id = request.params.id
    const { title, description, category, price, ingredients } = request.body;

    const database = await sqliteConnection();
    const dish = await database.get("SELECT * FROM dishes WHERE id = (?)", [dish_id])

    const [saveId] = await knex('favorites')
      .where({ id: dish_id });

    if (saveId) {
      await knex('favorites')
        .where({ id: dish_id }).delete();

      await knex('favorites')
        .insert({
          id: dish_id,
          title,
          category,
          description,
          price,
          user_id: saveId.user_id
        });
    };

    if (!dish) {
      throw new AppError("Prato não encontrado")
    };

    dish.title = title ?? dish.title
    dish.description = description ?? dish.description
    dish.category = category ?? dish.category
    dish.price = price ?? dish.price
    dish.ingredients = ingredients ?? dish.ingredients

    await database.run(`
            UPDATE dishes SET
            title = ?,
            description = ?,
            category = ?,
            price = ?,
            ingredients = ?
            WHERE id = ?`,
      [
        dish.title,
        dish.description,
        dish.category,
        dish.price,
        dish.ingredients,
        dish_id
      ]
    );

    return response.status(200).json()
  }
}

module.exports = DishesController
