const bcrypt = require("bcrypt");
const userRepository = require("../repositories/users.repository");
const { generateAccessToken } = require("../utils/auth.util");

const createUser = async (userData) => {
  let user = await userRepository.findUserByEmail(userData.email);
  if (user.rows.length>0) {
    throw new Error("user already exist");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);
  const newUser = { ...userData, password: hashedPassword };
  user = await userRepository.createUser(newUser);
//   user = await userRepository.createUser(userData);

  return user;
};

const getUserById = async (id) => {
    const user = await userRepository.getUserById(id);
    if(!user){
        throw new Error("User not found");
    }
    return user;
}

const login = async(user) => {
    const { email, password } = user;
    const validUser = await userRepository.findUserByEmail(email);
    if(validUser.rows.length === 0){
        throw new Error(404);
    }
    const isPasswordMatched = await bcrypt.compare(password, validUser.rows[0].password);
    if(!isPasswordMatched){
        throw new Error(401);
    }

    const token = generateAccessToken({email: email});
    return token;    
}


module.exports = { createUser, getUserById, login };