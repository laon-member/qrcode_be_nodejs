const express = require("express");
const path = require("path");
const fs = require("fs");
const mysql = require("mysql");
const multer = require("multer");
const bodyparser = require("body-parser");
const qrDecode = require("qr-decode/server");
const bcrypt = require("bcryptjs");
const env = process.env.NODE_ENV || "development";
const conf = require(path.join(__dirname, ".", "config", "db.json"));
const cors = require("cors");
const upload = multer();

let corsOption = {
  origin: "http://localhost:8080",
  credentials: true,
};

const app = express();
app.use(cors(corsOption));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());
app.use(upload.array());
const port = 7000;

const connection = mysql.createConnection({
  host: "hong4383.r-e.kr",
  user: "piction",
  password: "Laonpp00..L",
  port: "3306",
  database: "newQR",
});

function handleDisconnect() {
  connection.connect((err) => {
    if (err) {
      console.log("Err when connecting to SQL Database Server: ", err);
      setTimeout(handleDisconnect, 2000);
    }

    connection.on("error", (err) => {
      console.log("DB Err: ", err);
      if (err.code == "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR") {
        return handleDisconnect();
      } else {
        throw err;
      }
    });
  });
}
handleDisconnect();

app.post("/login", (req, res) => {
  try {
    let qrdata = req.body.qrdata;
    console.log(qrdata);

    const query = connection.query(
      `SELECT * FROM User_info WHERE QRdata='${qrdata}'`,
      (err, result1) => {
        if (err) {
          console.log(err);
          res.json({ err });
        } else {
          res.json({ result1 });
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.post("/sign_up", (req, res) => {
  try {
    let qrdata = req.body.qrdata;
    let name = req.body.name;
    let age = req.body.age;
    let email = req.body.email;
    console.log(qrdata);
    console.log(name);
    console.log(age);
    console.log(email);

    const query = connection.query(
      `UPDATE User_info SET name='${name}', age='${age}', email='${email}' WHERE QRdata='${qrdata}'`,
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          res.json(result);
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, (err) => {
  console.log("We are Using this port:", port);
  if (err) {
    return console.log("this Port Listening or Real Error", err);
  }
});
