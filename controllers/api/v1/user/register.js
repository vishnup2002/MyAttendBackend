const User = require("../../../../models/User");

module.exports.register = async (req, res) => {
  let resObj = {
    message: "Registering!!",
  };

  console.log(req.body);
  const { name, email, password } = req.body;

  const user = new User({ name, email, password });

  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
};
