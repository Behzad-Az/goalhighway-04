const checkUsernameAvailability = (req, res, knex, user_id) => {

  const username = req.body.username.trim().toLowerCase();

  const validateInputs = () => new Promise((resolve, reject) => {
    if (
      username.length >= 3 && username.length <= 30 &&
      username.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) == -1
    ) {
      resolve();
    } else {
      reject('Invalid form entries');
    }
  });

  const checkUsername = () => knex('users')
    .where('username', username)
    .count('username as taken');

  validateInputs()
  .then(() => checkUsername())
  .then(result => parseInt(result[0].taken) ? res.send(false) : res.send(true))
  .catch(err => {
    console.error('Error inside checkUsernameAvailability.js: ', err);
    res.send(false);
  });

};

module.exports = checkUsernameAvailability;
