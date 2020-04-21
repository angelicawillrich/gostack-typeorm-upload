import csv from 'csvtojson';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';
import AppError from '../errors/AppError';

interface Request {
  fileContent: Buffer;
}

class ImportTransactionsService {
  async execute({ fileContent }: Request): Promise<Transaction[]> {
    try {
      const createTransaction = new CreateTransactionService();

      const csvString = fileContent.toString();

      const jsonArray = await csv().fromString(csvString);

      // need to run the await inside the for loop to insert the transactions on the correct order
      // otherwise, an outcome transaction could be the first to be added, and that would lead to error
      for (const transaction of jsonArray) {
        await createTransaction.execute(transaction);
      }

      return jsonArray;
    } catch (err) {
      throw new AppError(err, 400);
    }
  }
}

export default ImportTransactionsService;
