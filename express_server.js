const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

/////   random 6 character alfanumerical string   //////////
function generaterRandomString() {
  return Math.random().toString(36).slice(2, 8);
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2example.com",
    password: "dishwasher-funk"
  }
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouse.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Ahoy-hoy!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
})

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n")
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.cookies["username"]
  }
  res.render("urls_new", templateVars);
});

//////  ASSIGNING RANDOM NUMBER TO URL, STORING AND REDIRECTING      ////////////////////////
app.post("/urls", (req, res) => {
  let shortURL = generaterRandomString();
  console.log("shortURL");
  console.log(shortURL);
  let longURL = req.body.longURL;
  console.log(urlDatabase);
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

/////////////  POSTS     //////////////////
//////    EDITING URLS     //////////////////
app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect(`/urls`); 
});

////  DELETES URL  /////////
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect(`/urls/`);
});

//////////  COOKIES  ///////////////
app.post("/login", (req, res) => {
  // console.log(req.body);
  res.cookie('username', req.body.username)
  res.redirect(`/urls/`);
});

///////////    LOGOUT USER   ////////////////
app.post("/logout", (req, res) => {
  res.clearCookie('username')
  res.redirect("/urls");
});

/////// REGISTRATION HANDLER ///// ******************
app.post("/register", (req ,res) => {
  const userid = generaterRandomString();
  for (let user in users) {
    if (req.body.email === '' || req.body.password === '') {
      res.send("400 status code. Please enter valid email and password");
    } else if (req.body.email === users[user].email) {
      res.send("400 status code. Email already taken.")
    } else {
    users[userid] = {id: userid, email: req.body.email, password: req.body.password};
    }
  }

  res.cookie("user_id", userid)
  res.redirect("/urls");
});

// sending urls inside an object so that we can use the key (urls) to access the data within our template  ///

///////////    GO TO REGISTRATION PAGE   ///////////////
app.get("/register", (req, res) => {
  let templateVars = {
    username: req.cookies["username"], 
    urls: urlDatabase
  };
  res.render("registration", templateVars)
})

app.get("/urls", (req, res) => {
  let templateVars = {
    username: req.cookies["username"], 
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"]
  };
  res.render("urls_show", templateVars);
})

app.get("/u/:shortURL", (req, res) => {
  let templateVars = {
    username: req.cookies["username"]
  }
  let long = urlDatabase[req.params.shortURL];
  res.render(templateVars);
  res.redirect(long);
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

generaterRandomString();
