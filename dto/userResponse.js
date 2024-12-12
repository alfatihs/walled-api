//DTO for user response
const { use } = require("react");

class userResponse{
    constructor(user){
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.imgurl = user.imgurl;
        this.balance = user.balance
    }
}

module.exports = {userResponse};