import { getCustomRepository } from 'typeorm';
import { isUuid } from 'uuidv4';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    if (!isUuid(id)) {
      throw new AppError('ID is not a valued Uuid.', 400);
    }
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const transactionsExists = await transactionRepository.findOne({
      where: { id },
    });

    if (!transactionsExists) {
      throw new AppError('ID invalid.', 400);
    }

    const { affected } = await transactionRepository.delete(id);

    if (!affected) {
      throw new AppError('Fail to delete.', 400);
    }
  }
}

export default DeleteTransactionService;
