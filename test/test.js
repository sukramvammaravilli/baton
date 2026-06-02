const request = require('supertest');
const app = require('../server');

describe('Transfer API', () => {

    test('should transfer money successfully', async () => {

        const response = await request(app)
            .post('/api/transfer')
            .send({
                fromAccount: 'ACC1001',
                toAccount: 'ACC1002',
                amount: 100,
                currency: 'INR'
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.message)
            .toBe('Transfer successful');
    });

    test('should fail for insufficient balance', async () => {

        const response = await request(app)
            .post('/api/transfer')
            .send({
                fromAccount: 'ACC1001',
                toAccount: 'ACC1002',
                amount: 999999,
                currency: 'INR'
            });

        expect(response.statusCode).toBe(400);

        expect(response.body.error)
            .toBe('Insufficient balance');
    });

    test('should fail for invalid account', async () => {

        const response = await request(app)
            .post('/api/transfer')
            .send({
                fromAccount: 'INVALID',
                toAccount: 'ACC1002',
                amount: 100,
                currency: 'INR'
            });

        expect(response.statusCode).toBe(400);
    });
});