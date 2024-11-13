const encryptDecrypt = require('../src/helpers/encryptDecrypt');

describe('Encryption/Decryption Tests', () => {
    const testData = { email: 'test@example.com', password: 'password123' };

    it('should encrypt data correctly', () => {
        const encryptedData = encryptDecrypt.encrypt(testData);
        expect(encryptedData).toBeDefined();
        expect(typeof encryptedData).toBe('string');
    });

    it('should decrypt data correctly', () => {
        const encryptedData = encryptDecrypt.encrypt(testData);
        const decryptedData = encryptDecrypt.decrypt(encryptedData);

        expect(decryptedData).toBeDefined();
        expect(JSON.parse(decryptedData)).toEqual(testData);
    });
});
