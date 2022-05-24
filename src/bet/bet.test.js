const request = require("supertest");
const app = require('../../app');
const mongoose = require('mongoose');
const Bet = require("./bet.schema");
const Option = require("./option.schema");

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

    test('Should be a manager to create a Bet', async () => {
        const response = await request(app)
            .post('/bet')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyODJlY2I5ZTEwYmJjYzg3ZjVmODZjMyIsImVtYWlsIjoiYW5kcmVAZ21haWwuY29tIiwidHlwZSI6Im1hbmFnZXIiLCJpYXQiOjE2NTMyNTkxMTJ9.UDNrdJnjF5gEK3xe4_7HibgevejOnfWzQ0WKkxhv65Y`)
            .send(mockBet);

        expect(response.statusCode).toBe(200);
    })

    test('Should close a Bet', async () => {
        const response = await request(app)
            .post('/bet')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyODJlY2I5ZTEwYmJjYzg3ZjVmODZjMyIsImVtYWlsIjoiYW5kcmVAZ21haWwuY29tIiwidHlwZSI6Im1hbmFnZXIiLCJpYXQiOjE2NTMyNTkxMTJ9.UDNrdJnjF5gEK3xe4_7HibgevejOnfWzQ0WKkxhv65Y`)
            .send(mockBet);

        const responseClosedBet = await request(app)
            .put(`/bet/${response.body.bet._id}`)
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyODJlY2I5ZTEwYmJjYzg3ZjVmODZjMyIsImVtYWlsIjoiYW5kcmVAZ21haWwuY29tIiwidHlwZSI6Im1hbmFnZXIiLCJpYXQiOjE2NTMyNTkxMTJ9.UDNrdJnjF5gEK3xe4_7HibgevejOnfWzQ0WKkxhv65Y`)
            .send({status: 'closed'});
        expect(responseClosedBet.statusCode).toBe(200);
    })

    test('Should not create a bet like a normal user', async () => {
        const response = await request(app)
            .post('/bet')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOGMyM2I0OTUwODBiYWJkMTI5ZTJmZiIsImVtYWlsIjoidGVzdGV1c2VyQGV4YW1wbGUuY29tIiwidHlwZSI6InVzZXIiLCJpYXQiOjE2NTMzNTEzNTl9.0XTFWUXmmqOQGvjHw7Hb9niSrz9cQl7ga7A4yaL5LPg`)
            .send(mockBet);

        expect(response.statusCode).toBe(403);
    })
})

afterAll(async () => {
    await mongoose.connection.close();
})