import AppError from "../errors/AppError";
import {getRepository,getCustomRepository} from 'typeorm'
import CreateCategoryService from './CreateCategoryService'
import TransactionsRepository from '../repositories/TransactionsRepository'
import Transaction from "../models/Transaction";


interface RequestDTO {
  title:string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({title,value,type,category:categoryName}: RequestDTO): Promise<Transaction> {
    let transactionRepo = getRepository(Transaction)
    let transactionCustomRepo = getCustomRepository(TransactionsRepository)

    let categoryService = new CreateCategoryService()
    let category = await categoryService.execute(categoryName)

    let isOutcomeTransactionValid = !(type == 'outcome' && value > (await transactionCustomRepo.getBalance()).total)


    if(!isOutcomeTransactionValid)
    throw new AppError('Outcome transaction greater than Balance total',400)


    let transaction = await transactionRepo.create({title,value,type,category_id: category.id})
    await transactionRepo.save(transaction)

    return transaction

  }
}

export default CreateTransactionService;
