const request = require("supertest");
const app = require('../../app');
const mongoose = require('mongoose');
const Wallet = require("./wallet.schema");

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(
            () => console.log("Database connected successfully."),
        ).catch(
            err => console.log("Error while connecting with database: " + err)
        )
})

beforeEach(async () => {
    await Wallet.deleteMany();
})

describe("Wallet Use Case", () => {
    test('Should be logged to create a wallet', async () => {
        const response = await request(app)
            .post('/wallet')
            .send();

        expect(response.statusCode).toBe(403);
    });
    test('Should create a wallet', async () => {
        const response = await request(app)
            .post('/wallet')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyODJlY2I5ZTEwYmJjYzg3ZjVmODZjMyIsImVtYWlsIjoiYW5kcmVAZ21haWwuY29tIiwidHlwZSI6Im1hbmFnZXIiLCJpYXQiOjE2NTMyNTkxMTJ9.UDNrdJnjF5gEK3xe4_7HibgevejOnfWzQ0WKkxhv65Y`)
            .send();
        expect(response.statusCode).toBe(200);
        expect(response.body.wallet._id).not.toBe(null);
    });
    test('Should not do a transaction without value', async () => {
        const response = await request(app)
            .put('/wallet/transaction')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyODJlY2I5ZTEwYmJjYzg3ZjVmODZjMyIsImVtYWlsIjoiYW5kcmVAZ21haWwuY29tIiwidHlwZSI6Im1hbmFnZXIiLCJpYXQiOjE2NTMyNTkxMTJ9.UDNrdJnjF5gEK3xe4_7HibgevejOnfWzQ0WKkxhv65Y`)
            .send();
        expect(response.statusCode).toBe(400);
    });
    test('Should do a transaction', async () => {
        await request(app)
            .post('/wallet')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyODJlY2I5ZTEwYmJjYzg3ZjVmODZjMyIsImVtYWlsIjoiYW5kcmVAZ21haWwuY29tIiwidHlwZSI6Im1hbmFnZXIiLCJpYXQiOjE2NTMyNTkxMTJ9.UDNrdJnjF5gEK3xe4_7HibgevejOnfWzQ0WKkxhv65Y`)
            .send();

        const response = await request(app)
            .put('/wallet/transaction')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyODJlY2I5ZTEwYmJjYzg3ZjVmODZjMyIsImVtYWlsIjoiYW5kcmVAZ21haWwuY29tIiwidHlwZSI6Im1hbmFnZXIiLCJpYXQiOjE2NTMyNTkxMTJ9.UDNrdJnjF5gEK3xe4_7HibgevejOnfWzQ0WKkxhv65Y`)
            .send({value: 20});
        expect(response.statusCode).toBe(200);
    });
    test('Should delete a wallet', async () => {
        await request(app)
            .post('/wallet')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyODJlY2I5ZTEwYmJjYzg3ZjVmODZjMyIsImVtYWlsIjoiYW5kcmVAZ21haWwuY29tIiwidHlwZSI6Im1hbmFnZXIiLCJpYXQiOjE2NTMyNTkxMTJ9.UDNrdJnjF5gEK3xe4_7HibgevejOnfWzQ0WKkxhv65Y`)
            .send();

        const response = await request(app)
            .delete('/wallet')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyODJlY2I5ZTEwYmJjYzg3ZjVmODZjMyIsImVtYWlsIjoiYW5kcmVAZ21haWwuY29tIiwidHlwZSI6Im1hbmFnZXIiLCJpYXQiOjE2NTMyNTkxMTJ9.UDNrdJnjF5gEK3xe4_7HibgevejOnfWzQ0WKkxhv65Y`)
            .send();
        expect(response.statusCode).toBe(200);
    });
})

afterAll(async () => {
    await mongoose.connection.close();
})