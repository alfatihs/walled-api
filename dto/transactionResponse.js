class TransactionResponse{
    constructor(transaction){
        this.id = transaction.id;
        this.amount = transaction.amount;
        this.type = transaction.type;
        this.description = transaction.description;
        this.fromto = transaction.fromto;
        this.datetime = transaction.datetime;
        this.user_id = transaction.user;
    }
}

module.exports = {TransactionResponse};