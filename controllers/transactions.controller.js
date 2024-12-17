const transactionService = require('../services/transactions.service')
const {TransactionResponse} = require('../dto/transactionResponse')

const getTransactionById = async (req, res) => {
    const { id } = req.user;
    try {
        const transactions = await transactionService.getTransactionById(Number(id));
        const transactionResponses = transactions.map(tx => new TransactionResponse(tx));
        console.log(transactionResponses)
        res.json({data : transactionResponses});
    } catch (error) {
        if(error.message === "transaction not found"){
            return res.status(404).json({error : error.message});
        }
        res.status(error.statusCode || 500).json({error : error.message});
    }
}

module.exports = { getTransactionById };
