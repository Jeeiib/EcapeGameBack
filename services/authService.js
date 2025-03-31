const connection = require ('../config/bdd')

async function getUserByEmail(email) {
    const response = await connection.promise().query('SELECT * FROM client WHERE email = ?', [email]);
    return response[0][0];
}

module.exports = {
    getUserByEmail,

};