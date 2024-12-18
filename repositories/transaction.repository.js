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


const topup = async (id, amount, description) => {

  const client = await pool.connect();

  try{
   await client.query("BEGIN");
   
   await client.query(
      "UPDATE users SET balance = balance + $1 WHERE id = $2",
      [amount, id]
   )

   const result = await client.query(`INSERT INTO transactions (datetime, type, description, amount, fromto, user_id)
      VALUES (now(), 'DEBIT', $1, $2, $3, $3)
      RETURNING *`,
      [description, amount, id]
   );

   await client.query("COMMIT");

   return result.rows[0];

  }catch(error){
      await client.query("ROLLBACK");
      throw new Error("transaction cannot be processed");
  }finally{
      client.release();
  }
}

const transfer = async (id, amount, description, to) => {
  const client = await pool.connect();

  try{
    await client.query("BEGIN");

    await client.query(
      "UPDATE users SET balance = balance - $1 WHERE id = $2",
      [amount, id]
    );

    await client.query(
      "UPDATE users SET balance = balance + $1 WHERE id = $2",
      [amount, to]
    );

    const result = await client.query(
      `INSERT INTO transactions (datetime, type, description, amount, fromto, user_id)
      VALUES (now(), 'CREDIT', $1, $2, $3, $4)
      RETURNING *`,
      [description, amount, to, id]
    );

    await client.query(
      `INSERT INTO transactions (datetime, type, description, amount, fromto, user_id)
      VALUES (now(), 'DEBIT', $1, $2, $3, $4)
      RETURNING *`,
      [description, amount, id, to]
    );

    await client.query("COMMIT");

    return result.rows[0];

  }catch(error){
    await client.query("ROLLBACK");
    throw new Error("transaction cannot be processed");
  }finally{
    client.release();
  }
}


module.exports = { getTransactionById, topup, transfer };