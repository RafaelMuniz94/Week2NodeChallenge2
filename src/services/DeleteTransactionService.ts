import AppError from '../errors/AppError';
import {getRepository} from 'typeorm'
import Transactions from '../models/Transaction'

class DeleteTransactionService {
  public async execute(id:string): Promise<void> {
    let repositorio = getRepository(Transactions)
    
    let transaction = await repositorio.findOne({
      where:{
        id
      }
    })

    if(!transaction) throw new AppError("Transaction not found!",404)

    await repositorio.remove(transaction)
  }
}

export default DeleteTransactionService;
