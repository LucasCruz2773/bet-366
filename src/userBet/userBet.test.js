const request = require("supertest");
const app = require('../../app');
const mongoose = require('mongoose');
const Bet = require("../bet/bet.schema");
const Option = require("../bet/option.schema");
const UserBet = require('./userBet.schema');
const Wallet = require('../wallet/wallet.schema');

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
    await Bet.deleteMany();
    await Option.deleteMany();
    await UserBet.deleteMany();
})

describe("Bet Use Case", () => {
    const mockBet = {
        title: 'Quantas maçãs tem saco?',
        options: [
            {
                name: '2 maçãs',
                odd: 1.3,
                correct: false
            },
            {
                name: '3 maçãs',
                odd: 1.2,
                correct: false
            },
            {
                name: '4 maçãs',
                odd: 1.5,
                correct: true
            },
            {
                name: '9 maçãs',
                odd: 3,
                correct: false
            }
        ]
    }

    test('Should be a user to bet', async () => {
        const response = await request(app)
            .post('/bet')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyODJlY2I5ZTEwYmJjYzg3ZjVmODZjMyIsImVtYWlsIjoiYW5kcmVAZ21haWwuY29tIiwidHlwZSI6Im1hbmFnZXIiLCJpYXQiOjE2NTMyNTkxMTJ9.UDNrdJnjF5gEK3xe4_7HibgevejOnfWzQ0WKkxhv65Y`)
            .send(mockBet);
        const responseBet = await request(app)
            .post('/user-bet')
            .send({
                id_option: response.body.options[0]._id,
                value: 10
            })

        expect(responseBet.statusCode).toBe(403);
    })

    test('Should make a bet if is an user', async () => {
        const response = await request(app)
            .post('/bet')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyODJlY2I5ZTEwYmJjYzg3ZjVmODZjMyIsImVtYWlsIjoiYW5kcmVAZ21haWwuY29tIiwidHlwZSI6Im1hbmFnZXIiLCJpYXQiOjE2NTMyNTkxMTJ9.UDNrdJnjF5gEK3xe4_7HibgevejOnfWzQ0WKkxhv65Y`)
            .send(mockBet);
        await request(app)
            .post('/wallet')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOGMyM2I0OTUwODBiYWJkMTI5ZTJmZiIsImVtYWlsIjoidGVzdGV1c2VyQGV4YW1wbGUuY29tIiwidHlwZSI6InVzZXIiLCJpYXQiOjE2NTMzNTEzNTl9.0XTFWUXmmqOQGvjHw7Hb9niSrz9cQl7ga7A4yaL5LPg`)
            .send()

        await request(app)
            .put('/wallet/transaction')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOGMyM2I0OTUwODBiYWJkMTI5ZTJmZiIsImVtYWlsIjoidGVzdGV1c2VyQGV4YW1wbGUuY29tIiwidHlwZSI6InVzZXIiLCJpYXQiOjE2NTMzNTEzNTl9.0XTFWUXmmqOQGvjHw7Hb9niSrz9cQl7ga7A4yaL5LPg`)
            .send({
                value: 40
            })
        const responseBet = await request(app)
            .post('/user-bet')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOGMyM2I0OTUwODBiYWJkMTI5ZTJmZiIsImVtYWlsIjoidGVzdGV1c2VyQGV4YW1wbGUuY29tIiwidHlwZSI6InVzZXIiLCJpYXQiOjE2NTMzNTEzNTl9.0XTFWUXmmqOQGvjHw7Hb9niSrz9cQl7ga7A4yaL5LPg`)
            .send({
                id_option: response.body.options[1]._id,
                value: 10
            })
        expect(responseBet.statusCode).toBe(200);
    })

    test('Should not make a bet with invalid value', async () => {
        const response = await request(app)
            .post('/bet')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyODJlY2I5ZTEwYmJjYzg3ZjVmODZjMyIsImVtYWlsIjoiYW5kcmVAZ21haWwuY29tIiwidHlwZSI6Im1hbmFnZXIiLCJpYXQiOjE2NTMyNTkxMTJ9.UDNrdJnjF5gEK3xe4_7HibgevejOnfWzQ0WKkxhv65Y`)
            .send(mockBet);
        const responseBet = await request(app)
            .post('/user-bet')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOGMyM2I0OTUwODBiYWJkMTI5ZTJmZiIsImVtYWlsIjoidGVzdGV1c2VyQGV4YW1wbGUuY29tIiwidHlwZSI6InVzZXIiLCJpYXQiOjE2NTMzNTEzNTl9.0XTFWUXmmqOQGvjHw7Hb9niSrz9cQl7ga7A4yaL5LPg`)
            .send({
                id_option: response.body.options[0]._id,
                value: -10
            })

        expect(responseBet.statusCode).toBe(400);
    })
})

afterAll(async () => {
    await mongoose.connection.close();
})