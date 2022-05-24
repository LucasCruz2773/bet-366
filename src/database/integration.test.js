const request = require("supertest");
const app = require('../../app');
const mongoose = require('mongoose');
const User = require("../user/user.schema");
describe("Database Integration", () => {
    test('Should connect to database', async () => {
        const connection = await mongoose.connect(process.env.MONGO_URL,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        await mongoose.connection.close();
        expect(connection.connections.length).toBeGreaterThan(0);
    });
    test('Should create a collection with a route', async () => {
        await mongoose.connect(process.env.MONGO_URL,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }).then(async () => {
                await User.deleteMany();
                const response = await request(app)
                    .post('/user')
                    .send({
                        name: "André Gabriel",
                        cpf: "1234-19",
                        address: "Rua das neves - 123",
                        phone: "12346",
                        type: "manager",
                        email: "teste2@example.com", 
                        password: "123123"
                    });
                await mongoose.connection.close();
                expect(response.statusCode).toBe(200);
            }).catch(
                err => console.log("Error while connecting with database: " + err)
            )
    });
})