const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const client = require("@mailchimp/mailchimp_marketing");
const path = require("path");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
client.setConfig({ apiKey: "cd0d376b7edb6dc6740cf190c6866096-us13", server: "us13" });

app.get("/", function (req, res) { 
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;

  var subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
  };

  const run = async () => { 
    try {
      const response = await client.lists.addListMember("32f2472430", {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName
        }
      });
      console.log(response);
      res.sendFile(__dirname + "/success.html");
    } catch (err) {
      console.log(err.status);
      res.sendFile(__dirname + "/failure.html");
    }
  };
  run();
});

app.post("/failure", function (req, res) { 
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000");
});

//Mailchimp api key
// cd0d376b7edb6dc6740cf190c6866096-us13

// Audience ID or List ID or Unique ID
// 32f2472430