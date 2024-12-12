const pool = require("../db/db");

const getTransactionById = async (id) => {
  try{
    const result = await pool.query("SELECT * FROM transactions WHERE user_id= $1", [id]);
    console.log("id adalah", id )
    console.log("result adalah", result.rows)
    return result.rows;
  }catch (error){
    console.log("error", error)
    throw new Error("something went wrong");
  }
}

module.exports = { getTransactionById };