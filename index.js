require("dotenv").config();
const jsforce = require("jsforce");
const express = require("express");
const app = express();
const PORT = 3001;

const { SF_LOGIN_URL, SF_USERNAME, SF_PASSWORD, SF_TOKEN } = process.env;
const conn = new jsforce.Connection({
  loginUrl: SF_LOGIN_URL,
});

conn.login(SF_USERNAME, SF_PASSWORD + SF_TOKEN, (err, userInfo) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`user Id:` + userInfo.id);
    console.log("org id:" + userInfo.organizationId);
  }
});

// gen contact get all query
app.get("/get", (req, res) => {
  conn.query("Select Id, Name , Phone, Email FROM Contact", (err, result) => {
    if (err) {
      res.send(err);
    } else {
      console.log("Total records" + result.totalSize);
      res.json(result.records);
    }
  });
});

// creation of new contact in SF
app.get("/create", (req, res) => {
  conn.sobject("Contact").create(
    {
      FirstName: "tester",
      LastName: "node",
      Phone: "(111) 111-1111",
      Email: "tester@gmail.com",
    },
    function (err, ret) {
      if (err || !ret.success) {
        return console.error(err, ret);
      }
      console.log("created contact id: " + ret.id);
    }
  );
  conn.query("Select Id, Name , Phone, Email FROM Contact", (err, result) => {
    if (err) {
      res.send(err);
    } else {
      console.log("Total records" + result.totalSize);
      res.json(result.records);
    }
  });
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
