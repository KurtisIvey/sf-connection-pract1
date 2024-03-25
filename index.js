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

// info on api
app.get("/api-info", (req, res) => {
  const info = {
    "API limit": conn.limitInfo.apiUsage.limit,
    "API used": conn.limitInfo.apiUsage.used,
  };
  res.send(info);
});

// gen contact get all query
app.get("/get", (req, res) => {
  conn.query("SELECT Id, Name, Phone, Email FROM Contact", (err, result) => {
    if (err) {
      res.send(err);
    } else {
      const contacts = result.records;
      console.log("Total records: " + result.totalSize);
      console.log(contacts);
      res.json(contacts);
    }
  });
});

// creation of new contact in SF
app.get("/create", (req, res) => {
  // retrieve all contacts
  conn.query("Select Id, Name , Phone, Email FROM Contact", (err, result) => {
    if (err) {
      res.send(err);
    } else {
      // assign contacts to var
      const contacts = result.records;
      console.log("Total records: " + result.totalSize);
      console.log(contacts); // console.log to view var
      res.json(contacts);

      const newContact = {
        FirstName: "tester",
        LastName: "node",
        Phone: "(111) 111-1111",
        Email: "tester@gmail.com",
      };
      conn.sobject("Contact").create(newContact, function (err, ret) {
        if (err || !ret.success) {
          return console.error(err, ret);
        }
        console.log("created contact id: " + ret.id);
      });
    }
  });
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
