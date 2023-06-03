const { hash } = require("bcryptjs")
const AppError = require("../utils/AppError")

class UserCreationService {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute({ name, email, password }) {

    const checkuserExists = await this.userRepository.findByEmail(email)

    if (checkuserExists.length > 0) {
      throw new AppError(`Este email já está em uso pelo usuário ${name}`, 401)
    }

    const hashedPassword = await hash(password, 8)

    await this.userRepository.create({ name, email, password: hashedPassword })
  }
}

module.exports = UserCreationService