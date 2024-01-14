import supertest from "supertest"
import createServer from "../utils/server"
import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"

const app = createServer()
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))
let mongoServer

var TOKEN = ""

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

  describe("Get Bulletin Route", () => {
    describe("Get All Bulletins", () => {
      it("Should return a 200", async () => {
        await supertest(app).get(`/bulletin`).expect(200)
      })
    })
    describe("Creating an org", () => {
      it("Create an org, return status 201", async () => {
        const payload = {
          username: "uniquesdf",
          email: "uniuqetest@gmail.com",
          password: "niceabcdef",
        }
        await supertest(app).post(`/org/sign-up`).send(payload).expect(201)
      })
      it("Login test organization", async () => {
        const payload2 = {
          username: "uniquesdf",
          //   email: "test@gmail.com",
          password: "niceabcdef",
        }
        const response = await supertest(app)
          .post(`/org/login`)
          .send(payload2)
          .expect(200)
        TOKEN = response.body.token
      })
      it("Create Bulletin belonging to test organization", async () => {
        const payload3 = {
          title: "Test Bulletin!",
          description: "test description: this event happening at 3 pm?",
          date: "2019-10-09",
          posterUrl:
            "https://www.wikihow.com/images/thumb/d/db/Get-the-URL-for-Pictures-Step-2-Version-6.jpg/v4-460px-Get-the-URL-for-Pictures-Step-2-Version-6.jpg",
          featured: true,
        }
        await supertest(app)
          .post(`/bulletin/add`)
          .send(payload3)
          .set("Authorization", `Bearer ${TOKEN}`)
          .expect(200)
      })
    })
  })
})
