const request = require('supertest');
const app = require('../index'); 

describe('CORS Configuration Tests', () => {
    it('should allow requests from api.example.com', async () => {
        const response = await request(app)
            .get('/api/user/673496cb22497da17e51099e')
            .set('Origin', 'https://api.example.com');
        expect(response.statusCode).not.toBe(403); // Should not reject
    });

    it('should reject requests from unauthorized origins', async () => {
        const response = await request(app)
            .get('/api/user/673496cb22497da17e51099e')
            .set('Origin', 'https://unauthorized.com');

        expect(response.statusCode).toBe(403);
    });

    it('should allow Dart user-agent to access public route', async () => {
        const response = await request(app)
            .get('/api/user/673496cb22497da17e51099e')
            .set('User-Agent', 'Dart/2.12.0');

        expect(response.statusCode).not.toBe(403);
    });

    it('should restrict Dart user-agent on /api/users/:id without token', async () => {
        const response = await request(app)
            .get('/api/user/673496cb22497da17e51099e')
            .set('User-Agent', 'Dart/2.12.0');

        expect(response.statusCode).toBe(401); // Unauthorized
    });
});
