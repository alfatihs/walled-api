const bcrypt = require("bcrypt");
const userRepository = require("../repositories/users.repository");

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
    return user;
}


module.exports = { createUser, getUserById };