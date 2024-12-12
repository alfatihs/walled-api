// const Joi = require('joi');
const transactionService = require('../services/transactions.service')
const {TransactionResponse} = require('../dto/transactionResponse')

const getTransactionById = async (req, res) => {
    const { id } = req.user;
    try {
        const transaction =await  transactionService.getTransactionById(Number(id));
        res.status(200).json({data : new TransactionResponse(transaction)});
    } catch (error) {
        if(error.message === "transaction not found"){
            return res.status(404).json({error : error.message});
        }
        res.status(error.statusCode || 500).json({error : error.message});
    }
}

module.exports = { getTransactionById };
