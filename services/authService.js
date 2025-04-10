const connection = require('../config/bdd');

async function getUserByEmail(email) {
    const response = await connection.promise().query('SELECT * FROM client WHERE email = ?', [email]);
    return response[0][0];
}

async function saveResetToken(userId, token, expires) {
    // Vérifier si un token existe déjà pour cet utilisateur
    const [existingTokens] = await connection.promise().query(
        'SELECT * FROM password_resets WHERE id_client = ?',
        [userId]
    );
    
    // Si un token existe déjà, on le met à jour
    if (existingTokens.length > 0) {
        await connection.promise().query(
            'UPDATE password_resets SET token = ?, expires = ? WHERE id_client = ?',
            [token, new Date(expires), userId]
        );
    } else {
        // Sinon, on en crée un nouveau
        await connection.promise().query(
            'INSERT INTO password_resets (id_client, token, expires) VALUES (?, ?, ?)',
            [userId, token, new Date(expires)]
        );
    }
    
    return true;
}

async function findResetToken(token) {
    const [tokens] = await connection.promise().query(
        'SELECT id_client, expires FROM password_resets WHERE token = ?',
        [token]
    );
    
    return tokens.length > 0 ? tokens[0] : null;
}

async function deleteResetToken(token) {
    await connection.promise().query(
        'DELETE FROM password_resets WHERE token = ?',
        [token]
    );
    
    return true;
}

async function updatePassword(userId, hashedPassword) {
    await connection.promise().query(
        'UPDATE client SET password = ? WHERE id_client = ?',
        [hashedPassword, userId]
    );
    
    return true;
}

module.exports = {
    getUserByEmail,
    saveResetToken,
    findResetToken,
    deleteResetToken,
    updatePassword
};