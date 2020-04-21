import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const incomeTransactions = await this.find({
      where: {
        type: 'income',
      },
    });

    const outcomeTransactions = await this.find({
      where: {
        type: 'outcome',
      },
    });

    const income = incomeTransactions.reduce(
      (a: number, { value }: Transaction) => {
        return a + Number(value);
      },
      0,
    );

    const outcome = outcomeTransactions.reduce(
      (a: number, { value }: Transaction) => {
        return a + Number(value);
      },
      0,
    );

    const total = income - outcome;

    const balance: Balance = { income, outcome, total };

    return balance;
  }
}

export default TransactionsRepository;
