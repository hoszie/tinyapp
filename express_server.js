const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

/////   random 6 character alfanumerical string   //////////
function generaterRandomString() {
  return Math.random().toString(36).slice(2, 8);
};

function urlsForUser(id) {
  let obj = {};
  for (let key in urlDatabase) {
    if (urlDatabase[key].userID === id) {
      obj[key] = urlDatabase[key];
    }
  }
  return obj;
}

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "1234"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2example.com",
    password: "dishwasher-funk"
  }
}

const urlDatabase = {
  "b2xVn2": { longURL: "https://www.tsn.ca", userID: "userRandomID" },
  "9sm5xK": { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

app.get("/urls/new", (req, res) => {
  const oneUser = req.cookies.user_id;
  let templateVars = {
    user: users[oneUser]
  };
  if (!users[oneUser]) {
    return res.redirect("/login");
  } 
  res.render("urls_new", templateVars);
  
});

///// LOGIN PAGE  /////////////
app.get("/login", (req, res) => {
  res.render("login")
});



//////  ASSIGNING RANDOM NUMBER TO URL, STORING AND REDIRECTING      ////////////////////////
app.post("/urls", (req, res) => {
  let shortURL = generaterRandomString();
  let longURL = req.body.longURL;
  urlDatabase[shortURL] = { longURL, userID: req.cookies.user_id };
  console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);
});

/////////////  POSTS     //////////////////
//////    EDITING URLS     //////////////////
app.post("/urls/:id", (req, res) => {
  let userID = req.cookies.user_id;
  let urlObj = urlDatabase[req.params.id];
  if (userID === urlObj.userID) {
    urlDatabase[req.params.id].longURL = req.body.longURL;
  } 
  res.redirect(`/urls`);
});

////  DELETES URL  /////////
app.post("/urls/:shortURL/delete", (req, res) => {
  let userID = req.cookies.user_id;
  let urlObj = urlDatabase[req.params.shortURL];
  if (userID === urlObj.userID) {
    delete urlDatabase[req.params.shortURL]
  }
  res.redirect(`/urls/`);
});

//////////  COOKIES  ///////////////
app.post("/login", (req, res) => {
  for (let user in users) {
    if (users[user].email === req.body.email) {
      if(bcrypt.compareSync(req.body.password, users[user].password)) {
        res.cookie("user_id", user)
        res.redirect("/urls"); 
        return;
      } else {
        res.status(403).send("Incorrect password");
        return;
      }
    }
  }
  res.status(403).send("No user found");
});

///////////    LOGOUT USER   ////////////////
app.post("/logout", (req, res) => {
  res.clearCookie('user_id')
  res.redirect("/urls");
});

/////// REGISTRATION HANDLER ///// 
app.post("/register", (req ,res) => {
  const userid = generaterRandomString();
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  for (let user in users) {
    if (req.body.email === '' || req.body.password === '') {
      res.send("400 status code. Please enter valid email and password");
    } else if (req.body.email === users[user].email) {
      res.send("400 status code. Email already taken.")
    } else {
      users[userid] = {id: userid, email: req.body.email, password: hashedPassword};
      console.log(hashedPassword);
    }
  }
  res.cookie("user_id", userid)
  res.redirect("/urls");
});

// sending urls inside an object so that we can use the key (urls) to access the data within our template  ///



///////////    GO TO REGISTRATION PAGE   ///////////////
app.get("/register", (req, res) => {
  const oneUser = req.cookies.user_id;
  let templateVars = {
    user: users[oneUser], 
    urls: urlDatabase
  };
  res.render("registration", templateVars)
})

app.get("/urls", (req, res) => {
  const oneUser = req.cookies.user_id;
  let templateVars = {
    user: users[oneUser], 
    urls: urlsForUser(oneUser)
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const oneUser = req.cookies.user_id;
  let templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[oneUser]
  };
  res.render("urls_show", templateVars);
})

app.get("/u/:shortURL", (req, res) => {
  let long = urlDatabase[req.params.shortURL].longURL;
  res.redirect(long);
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

generaterRandomString();
