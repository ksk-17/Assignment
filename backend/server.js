const express= require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const mysql = require("mysql");

dotenv.config();

const app=express();

app.use(bodyParser.json());

const conn=mysql.createConnection({
    host:'localhost',
    user:'root',
    password: process.env.password,
    database: process.env.database
});

conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected with App...');
});

app.get('/api/questions',(req, res) => {
  let sqlQuery = "SELECT * FROM questions";
  
  let query = conn.query(sqlQuery, (err, results) => {
    if(err){
      res.status(400);
      throw new Error('Error in retriving the question');
    }
    else res.status(200).send(results);
  });
});

app.post('/api/questions',(req, res) => {
  let data = {title: req.body.title, docs: req.body.docs,required: req.body.required};
  
  let sqlQuery = "INSERT INTO questions SET ?";
  
  let query = conn.query(sqlQuery, data,(err, results) => {
    if(err){
      res.status(400);
      throw new Error('Error in creating the question');
    }
    else res.status(200).send("Created the question successfully");
  });
});


app.delete('/api/question/:id',(req, res) => {
  let sqlQuery = "DELETE FROM questions WHERE id="+req.params.id+"";
    
  let query = conn.query(sqlQuery, (err, results) => {
    if(err){
      res.status(400);
      throw new Error('Error in deleting the question');
    }
    else res.status(200).send("Deleted the question successfully");
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT,console.log(`server started on port ${PORT}`));
