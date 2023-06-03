const UserCreationService = require("../services/UserCreationService")
const UserRepository = require("../repositories/UserRepository")

class UserController {
  async create(request, response) {
    const { name, email, password } = request.body

    const userRepository = new UserRepository()
    const userCreationService = new UserCreationService(userRepository)
    await userCreationService.execute({ name, email, password })

    return response.status(200).json()
  }
}

module.exports = UserController