import supertest from "supertest"
import createServer from "../utils/server"
import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"

const app = createServer()
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))
let mongoServer

describe("users", () => {
  beforeAll(async () => {
    await mongoose.disconnect()
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())
  })

  afterAll(async () => {
    await mongoose.disconnect(/*force*/ true)
    await mongoose.connection.close(/*force*/ true)
    mongoServer.stop()
  })

  describe("get user route", () => {
    describe("get all users", () => {
      it("should return a 200", async () => {
        await supertest(app).get(`/user`).expect(200)
      })
    })
    describe("create user", () => {
      it("missing username field, should return 422", async () => {
        const payload = { email: "xyz@sadfjak.com", password: "2342388" }
        await supertest(app).post(`/user/sign-up`).send(payload).expect(422)
      })
      it("missing email field, should return 422", async () => {
        const payload = { username: "sdf", password: "2342388" }
        await supertest(app).post(`/user/sign-up`).send(payload).expect(422)
      })
      it("missing password field, should return 422", async () => {
        const payload = { username: "sdf", email: "test@gmail.com" }
        await supertest(app).post(`/user/sign-up`).send(payload).expect(422)
      })
      it("missing all fields, should return 422", async () => {
        const payload = {}
        await supertest(app).post(`/user/sign-up`).send(payload).expect(422)
      })
      it("successfully create a user, return status 201", async () => {
        const payload = {
          username: "sdf",
          email: "test@gmail.com",
          password: "niceabcdef",
        }
        await supertest(app).post(`/user/sign-up`).send(payload).expect(201)
      })
      it("try to create user with an email that already exists", async () => {
        const payload2 = {
          username: "sdff34",
          email: "test@gmail.com",
          password: "niceabcdef",
        }
        await supertest(app).post(`/user/sign-up`).send(payload2).expect(400)
      })
      it("try to create user with a username that already exists", async () => {
        const payload2 = {
          username: "sdf",
          email: "tnicet@gmail.com",
          password: "niceabcdef",
        }
        await supertest(app).post(`/user/sign-up`).send(payload2).expect(400)
      })
    })
  })
})
