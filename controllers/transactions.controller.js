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

const topup = async (req, res) => {
    const {id} = req.user;
    const {amount, description} = req.body;
    try { 
        const transaction = await transactionService.topup(Number(id), Number(amount), description);
        res.json({data : new TransactionResponse(transaction)});

    }catch(err){
        if(err.message === "transaction cannot be processed"){
            return res.status(400).json({error : err.message});
        }
        res.status(err.statusCode || 500).json({error : err.message});
    }
}

const transfer = async (req, res) => {
    const {id} = req.user;
    const {amount, description, to} = req.body;
    try{
        const transaction = await transactionService.transfer(Number(id), Number(amount), description, Number(to));
        res.json({data : new TransactionResponse(transaction)});
    }catch(err){
        if(err.message === "transaction cannot be processed"){
            return res.status(400).json({error : err.message});
        }
        res.status(err.statusCode || 500).json({error : err.message});
    }
}

module.exports = { getTransactionById, topup, transfer };
