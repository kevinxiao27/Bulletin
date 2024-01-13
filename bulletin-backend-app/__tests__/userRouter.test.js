import supertest from "supertest"
import { app } from "../app"

describe("users", () => {
  describe("get user route", () => {
    describe("get all users", () => {
      it("should return a 200", async () => {
        await supertest(app).get(`/user`).expect(200)
      })
    })
  })
})
