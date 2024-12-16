const bcrypt = require("bcrypt");
const transactionRepository = require('../repositories/transaction.repository');

const getTransactionById = async (id) => {
    const transaction = await transactionRepository.getTransactionById(id);
    if(!transaction){
        throw new Error("transaction not found");
    }
    // console.log('repository', transaction);
    return transaction;
}

module.exports = { getTransactionById };