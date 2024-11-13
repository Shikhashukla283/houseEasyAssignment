const request = require('supertest');
const app = require('../index'); 
const User = require('../src/models/User');

describe('Profile Retrieval Tests', () => {
    it('should return user profile for a valid token', async () => {
        const validToken = '74BVRVgax9Ik4DFU73FrnOyTKpnoTBe5uAxtH5YZXhKvdHV23QwKTG2bmQ+xwkQBruusDvp2uUk1UpkhWYc6/QDAfwf4I8iQ8bMMsocoy/wQEPYdD3WVfjBnrSbBnnijS4WtOvrXn6g3AgPhhgMVmHgG8e1mglLtCORd/rAe9xCTuCuD9vnLyH2hLXm0H9q2Y+SyBIiiPsf5azSDgcwMrLJSHrAL98DUo5NQOiojgic='; // Provide a valid JWT
        const response = await request(app)
            .get('api/auth/profile')
            .set('Authorization', `Bearer ${validToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
    });

    it('should return 401 for an invalid token', async () => {
        const invalidToken = 'invalid_token';
        const response = await request(app)
            .get('api/auth/profile')
            .set('Authorization', `Bearer ${invalidToken}`);

        expect(response.statusCode).toBe(401);
    });
});
