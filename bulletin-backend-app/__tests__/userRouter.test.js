import { getAllUsers, createUser } from "../controllers/user-controller"
import { MongoMemoryServer } from "mongodb-memory-server"
import jest from "jest-mock"

const request = {
  body: {
    username: "fake_username",
    email: "fake_email@gmail.com",
    password: "fakepassword",
  },
}

const response = {
  status: jest.fn((x) => x),
}

describe("Single MongoMemoryServer", () => {
  let con
  let mongoServer

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    process.env.MONGODB_URL = mongoServer.getUri()
  })

  afterAll(async () => {
    if (con) {
      await con.close()
    }
    if (mongoServer) {
      await mongoServer.stop()
    }
  })

  it("DBManager connection", async () => {
    let DBManager
    await DBManager.start()
    const db = DBManager.connection.db()

    it("should send status code of 400 when user exists", async () => {
      await createUser(request, response)
    })
  })
})
