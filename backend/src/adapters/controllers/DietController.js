const { CreateDiet } = require('../../use-cases/CreateDiet')
const { ListDiets } = require('../../use-cases/ListDiets')
const { GetDietById } = require('../../use-cases/GetDietById')
const { UpdateDiet } = require('../../use-cases/UpdateDiet')
const { DeleteDiet } = require('../../use-cases/DeleteDiet')
const { DietMongoRepository } = require('../../external/repositories/DietMongoRepository')

module.exports = class DietController {

  static async create(req, res) {
    const { name, pet, dailyCalories, type, mealsPerDay } = req.body

    const repository = new DietMongoRepository()
    const createDiet = new CreateDiet(repository)

    try {
      const diet = await createDiet.execute({ name, pet, dailyCalories, type, mealsPerDay })
      return res.status(201).json({
        message: 'Dieta cadastrada com sucesso!',
        diet,
      })
    } catch (error) {
      return res.status(422).json({ message: error.message })
    }
  }

  static async getAll(req, res) {
    const repository = new DietMongoRepository()
    const listDiets = new ListDiets(repository)

    try {
      const diets = await listDiets.execute()
      return res.status(200).json({ diets })
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao listar dietas.' })
    }
  }

  static async getById(req, res) {
    const { id } = req.params
    const repository = new DietMongoRepository()
    const getDietById = new GetDietById(repository)

    try {
      const diet = await getDietById.execute(id)
      if (!diet) {
        return res.status(404).json({ message: 'Dieta não encontrada!' })
      }
      return res.status(200).json({ diet })
    } catch (error) {
      return res.status(422).json({ message: error.message })
    }
  }

  static async update(req, res) {
    const { id } = req.params
    const { name, pet, dailyCalories, type, mealsPerDay } = req.body

    const repository = new DietMongoRepository()
    const updateDiet = new UpdateDiet(repository)

    try {
      const diet = await updateDiet.execute(id, { name, pet, dailyCalories, type, mealsPerDay })
      if (!diet) {
        return res.status(404).json({ message: 'Dieta não encontrada!' })
      }
      return res.status(200).json({
        message: 'Dieta atualizada com sucesso!',
        diet,
      })
    } catch (error) {
      return res.status(422).json({ message: error.message })
    }
  }

  static async remove(req, res) {
    const { id } = req.params
    const repository = new DietMongoRepository()
    const deleteDiet = new DeleteDiet(repository)

    try {
      const diet = await deleteDiet.execute(id)
      if (!diet) {
        return res.status(404).json({ message: 'Dieta não encontrada!' })
      }
      return res.status(200).json({ message: 'Dieta removida com sucesso!' })
    } catch (error) {
      return res.status(422).json({ message: error.message })
    }
  }
}