const pool = require("../db/db");

const findUserByEmail = async (email) => {
  try {
    const result = await pool.query("SELECT * FROM users where email = $1", [
      email,
    ]);
    return result;
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

const imgExample = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png';

const createUser = async (user) => {
  const { name, email, password } = user;

  try {
    const result = await pool.query(
      "INSERT INTO users (email, password, name, imgurl, balance) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [email, password, name, imgExample, 0]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Database error occurred while creating the user.");
  }
};


const getUserById = async (id) => {
    try {
        const result = await pool.query("SELECT * FROM users where id = $1", [id]);
        return result.rows[0];
    } catch (error) {
        throw new Error("Something went wrong");
    }
}

module.exports = { createUser, findUserByEmail, getUserById };