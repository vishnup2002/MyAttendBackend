/*

    **** Module to test API calls ****

*/

module.exports.test = (req, res) => {
  let resObj = {
    message: "API hit!!",
  };
  return res.status(200).json(resObj);
};
