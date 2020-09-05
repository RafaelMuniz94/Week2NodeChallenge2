import { getRepository } from "typeorm";
import AppError from "../errors/AppError";

import Category from "../models/Category";

class CreateCategoryService {
  public async execute(categoria: string): Promise<Category> {
    let repo = getRepository(Category);

    if (!categoria)
      throw new AppError("Transaction must have a category!", 400);

    let category = await repo.findOne({
      where: { title: categoria },
    });

    if (category) return category;

    category = await repo.create({ title: categoria });
    await repo.save(category);
    return category;
  }
}

export default CreateCategoryService;
