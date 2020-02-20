exports.secretAdmin = function(req, res) {
  res.json({ message: "this message can only be seen by an admin user" });
};
exports.secretAllLoggedIn = function(req, res) {
  res.json({ message: "this message be seen by all logged in users" });
};
