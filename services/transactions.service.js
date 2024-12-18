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


const topup = async (id, amount, description) => {
    const transaction = await transactionRepository.topup(id, amount, description);
    if(!transaction){
        throw new Error("transaction cannot be processed");
    }
    return transaction;
}

const transfer = async (id, amount, description, to) => {
    const transaction = await transactionRepository.transfer(id, amount, description, to);
    if(!transaction){
        throw new Error("transaction cannot be processed");
    }
    return transaction;
}

module.exports = { getTransactionById, topup, transfer };