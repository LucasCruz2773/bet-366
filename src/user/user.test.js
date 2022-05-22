// const request = require("supertest");
// const app = require('../../app');
// const mongoose = require('mongoose');
// const User = require("./user.schema");

// beforeAll(async () => {
//     await mongoose.connect(process.env.MONGO_URL,
//         {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         }).then(
//             () => console.log("Database connected successfully."),
//         ).catch(
//             err => console.log("Error while connecting with database: " + err)
//         )
// })

// beforeEach(async () => {
//     await User.deleteMany();
// })

// describe("User Use Case", () => {
//     const mockUser = {
//         name: "André Gabriel",
//         email: "andreg@gmail.com",
//         password: "123123"
//     }
//     test('Should register a new user', async () => {
//         const response = await request(app)
//             .post('/user')
//             .send(mockUser);

//         expect(response.statusCode).toBe(200);
//         expect(response.body.user._id).not.toBe(null);
//     });
//     test('Should login a valid user', async () => {
//         const response = await request(app)
//             .post('/user')
//             .send(mockUser);
//         const responseLogin = await request(app)
//             .post('/user/login')
//             .send({ email: mockUser.email, password: mockUser.password });
//         expect(responseLogin.statusCode).toBe(200);
//         expect(responseLogin.body.user._id).not.toBe(null);
//     });
//     test('Should block user with invalid credentials', async () => {
//         const response = await request(app)
//             .post('/user')
//             .send(mockUser);
//         const responseLogin = await request(app)
//             .post('/user/login')
//             .send({ email: mockUser.email, password: "1234" });
//         expect(responseLogin.statusCode).toBe(400);
//     });
//     test('Sould not allow a new user with an already registered email', async () => {
//         const response = await request(app)
//             .post('/user')
//             .send(mockUser);
//         const responseLogin = await request(app)
//             .post('/user')
//             .send(mockUser);

//         expect(responseLogin.statusCode).toBe(400);
//     });
// })

// afterAll(async () => {
//     await mongoose.connection.close();
// })