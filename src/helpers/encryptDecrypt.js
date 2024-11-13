const crypto = require('crypto');
require('dotenv').config()
const encKey = process.env.ENCRYPTION_KEY
const ivKey = process.env.IV_KEY

const decrypt = (encryptedData) => {
    const algorithm = 'aes-256-cbc'; // AES encryption algorithm
    const key = Buffer.from(encKey, 'hex'); // Convert the secret key from hex to a buffer
    const ivBuffer = Buffer.from(ivKey, ivKey.startsWith('base64') ? 'base64' : 'hex'); // Decode IV from base64 or hex
    if (key.length !== 32) {
        throw new Error('Invalid key length. Key must be 32 bytes for aes-256-cbc.');
    }
    const decipher = crypto.createDecipheriv(algorithm, key, ivBuffer);
    let decrypted = decipher.update(encryptedData, 'base64', 'utf8'); 
    decrypted += decipher.final('utf8'); // Finalize the decryption
    return decrypted; // Return the decrypted string (which should be a JSON string containing email, password, name)
};

const encrypt = (text) => {
    const key = Buffer.from(encKey, 'hex'); // Convert key to Buffer
    const iv = Buffer.from(ivKey, 'hex'); // Convert IV to Buffer

    // Ensure the input is a string
    if (typeof text !== 'string') {
        text = JSON.stringify(text); // Serialize object to JSON string
    }

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv); // Create cipher
    let encrypted = cipher.update(text, 'utf8', 'base64'); // Encrypt
    encrypted += cipher.final('base64'); // Finalize encryption

    return encrypted; // Return encrypted string
};

module.exports = {
    encrypt,
    decrypt
};