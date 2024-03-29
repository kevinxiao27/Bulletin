import supertest from "supertest"
import createServer from "../utils/server"
import mongoose from "mongoose"
import { MongoMemoryReplSet } from "mongodb-memory-server"

const app = createServer()
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))
let mongoServer

var ORG_TOKEN = ""
var USER_TOKEN = ""
var BULLETIN_ID = ""

describe("users", () => {
  beforeAll(async () => {
    await mongoose.disconnect()
    mongoServer = await MongoMemoryReplSet.create({ replSet: { count: 4 } })
    await mongoose.connect(mongoServer.getUri())
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoose.connection.close()
    await mongoServer.stop()
  })

  describe("Get Bulletin Route", () => {
    describe("Get All Bulletins", () => {
      it("Should return a 200", async () => {
        await supertest(app).get(`/bulletin`).expect(200)
      })
    })
    describe("Creation of Bulletin", () => {
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
        ORG_TOKEN = response.body.token
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
        const response = await supertest(app)
          .post(`/bulletin/add`)
          .send(payload3)
          .set("Authorization", `Bearer ${ORG_TOKEN}`)
          .expect(200)

        BULLETIN_ID = response.body.bulletin._id
        // console.log(BULLETIN_ID)
      })
    })
    describe("Registration for a Bulletin", () => {
      it("Create User, return status 201", async () => {
        const payload = {
          username: "uniquesdf",
          email: "uniuqetest@gmail.com",
          password: "niceabcdef",
        }
        await supertest(app).post(`/user/sign-up`).send(payload).expect(201)
      })
      it("Login User", async () => {
        const payload = {
          username: "uniquesdf",
          //   email: "test@gmail.com",
          password: "niceabcdef",
        }
        const response = await supertest(app)
          .post(`/user/login`)
          .send(payload)
          .expect(200)
        USER_TOKEN = response.body.token
        // console.log(USERTOKEN)
      })
      it("Register user for event", async () => {
        await supertest(app)
          .put(`/bulletin/register/${BULLETIN_ID}`)
          .set("Authorization", `Bearer ${USER_TOKEN}`)
          .expect(200)
        // console.log(USERTOKEN)
      })
      it("Register user for event", async () => {
        await supertest(app)
          .put(`/bulletin/register/${BULLETIN_ID}`)
          .set("Authorization", `Bearer ${USER_TOKEN}`)
          .expect(401)
        // console.log(USERTOKEN)
      })
      it("Update Bulletin Date for Event", async () => {
        const payload3 = {
          title: "Test Bulletin!",
          description: "test description: this event happening at 3 pm?",
          date: "2024-01-03",
          posterUrl:
            "https://www.wikihow.com/images/thumb/d/db/Get-the-URL-for-Pictures-Step-2-Version-6.jpg/v4-460px-Get-the-URL-for-Pictures-Step-2-Version-6.jpg",
          featured: true,
        }
        await supertest(app)
          .put(`/bulletin/${BULLETIN_ID}`)
          .send(payload3)
          .set("Authorization", `Bearer ${ORG_TOKEN}`)
          .expect(200)
        // console.log(USERTOKEN)
      })
      it("Check that date has been properly updated", async () => {
        const response = await supertest(app)
          .get(`/bulletin/${BULLETIN_ID}`)
          .expect(200)
        // console.log(USERTOKEN)
        expect(response.body.bulletin.date).toEqual("2024-01-03")
      })
    })
  })
})
