const request = require('supertest');
const app = require('../index'); 
const User = require('../src/models/User');
const UserToken = require('../src/models/UserToken');
const mongoose = require('mongoose');
const encryptDecrypt = require('../src/helpers/encryptDecrypt');
require('dotenv').config()

beforeAll(async () => {
   await mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));
});

afterAll(async () => {
    // await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

describe('Authentication Tests', () => {
    it('should register a new user', async () => {
        const encryptePayload = {    
            email: "test19@gmail.com",
            name: "Test",
            password: "abcd"}; // Provide encrypted test data
            const encryptedData = encryptDecrypt.encrypt(encryptePayload);

        const response = await request(app)
            .post('/api/auth/register')
            .send({ data: encryptedData });

        expect(response.statusCode).toBe(201);
    });

    it('should login an existing user', async () => {
        const encryptePayload = {    
            email: "test@gmail.com",
            name: "Test",
            password: "abcd"
        }; // Provide encrypted test data

            const encryptedData = encryptDecrypt.encrypt(encryptePayload);

        const response = await request(app)
            .post('/api/auth/login')
            .send({ data: encryptedData });
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
    });

    it('should fail to login with invalid credentials', async () => {
        const encryptePayload = {    
            email: "test@gmail.com",
            name: "Test",
            password: "abxcd"}; // Provide encrypted test data
            const encryptedData = encryptDecrypt.encrypt(encryptePayload);

            const response = await request(app)
            .post('/api/auth/login')
            .send({ data: encryptedData });

        expect(response.status).toBe(400);
    });
});
