const mysql = require("mysql2");

const db = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "0981234567",
    database: "queue_system"

});

db.connect((err)=>{

    if(err){

        console.log("Loi ket noi MySQL");
        console.log(err);

    }else{

        console.log("Da ket noi MySQL");

    }

});

module.exports = db;