const getUserByEmail = function(email, database) {
  for (const user in database) {
    if (database[user].email === email) {
      return database[user];
    }
  }
  return null;
}

/////   random 6 character alfanumerical string   //////////
function generaterRandomString() {
  return Math.random().toString(36).slice(2, 8);
};

module.exports = { 
  getUserByEmail,
  generaterRandomString
};