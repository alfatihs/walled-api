const pool = require("../db/db");

const getTransactionById = async (id) => {
  try{
    const result = await pool.query("SELECT * FROM transactions WHERE user_id= $1", [id]);
    // console.log("id adalah", id )
    // console.log("result adalah", result.rows)
    return result.rows;
  }catch (error){
    console.log("error", error)
    throw new Error("something went wrong");
  }
}

const topup = async(id, amount, description) => {
  try{ //masih harus diperiksa lagi
    const result = await pool.query("INSERT INTO transactions (user_id, amount, description) VALUES ($1, $2, $3) RETURNING *", [id, amount, description]);
    return result.rows[0];

  }catch(error){
    console.log("error", error)
    throw new Error("transaction cannot be processed");
  }
}

module.exports = { getTransactionById, topup };