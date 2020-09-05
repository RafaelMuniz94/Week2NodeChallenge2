import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
   let transactionRepo =  getRepository(Transaction)
   let transactions = await transactionRepo.find();

   let {income,outcome} =transactions.reduce((previous,atual) => {
      switch(atual.type){
        case "income":
          previous.income += atual.value
          break
          case "outcome":
            previous.outcome += atual.value
            break
      }
      return previous
   },{
     income : 0,
     outcome : 0,
     total : 0
   })

   return {income,outcome, total: income-outcome}
  }
}

export default TransactionsRepository;
