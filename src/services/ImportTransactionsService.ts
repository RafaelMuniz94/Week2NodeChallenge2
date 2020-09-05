import Transaction from "../models/Transaction";
import CreateTransactionService from "../services/CreateTransactionService";
import ReadCSV from "../services/ReadCSV";

interface RequestDTO {
  id: string;
  title: string;
  value: number;
  type: "income" | "outcome";
  category: string;
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    let readService = new ReadCSV(filePath);
    let repo = new CreateTransactionService();

    let transactions = await readService.excecute();
    let returnTransactions: Array<Transaction>;
    returnTransactions = [];

    // const promises = transactions.map(async (transaction) => {
    //   let tran = await repo.execute({
    //     title: transaction[0],
    //     type: transaction[1],
    //     value: transaction[2],
    //     category: transaction[3],
    //   });
    //   returnTransactions.push(tran);
    // });

    for (let i = 0; i < transactions.length; i++) {
      let transaction = transactions[i];
      let tran = await repo.execute({
        title: transaction[0],
        type: transaction[1],
        value: transaction[2],
        category: transaction[3],
      });
      returnTransactions.push(tran);
    }

    //await Promise.all(promises);
    return returnTransactions;
  }
}

export default ImportTransactionsService;
