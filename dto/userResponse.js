
class UserResponse{
    constructor(user){
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.imgurl = user.imgurl;
        this.balance = user.balance;
        this.noaccount = user.noaccount;
    }
}

module.exports = {UserResponse};