import mongoose from "mongoose";
import "dotenv/config";
import request from "supertest";
import app from "../app.js";
import User from "../models/User.js";

const { TEST_DB_HOST, PORT = 3000 } = process.env;

describe("test login controller", () => {
  let server = null;
  beforeAll(async () => {
    await mongoose.connect(TEST_DB_HOST);
    server = app.listen(PORT);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  beforeEach(async () => {
    const signupData = {
      email: "vasya@mail.com",
      password: "1234567",
    };
    await request(app).post("/api/users/register").send(signupData);
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  test("get correct login data", async () => {
    const signinData = {
      email: "vasya@mail.com",
      password: "1234567",
    };
    const { statusCode, body } = await request(app)
      .post("/api/users/login")
      .send(signinData);
   
    expect(statusCode).toBe(200);
    expect(typeof body.user.subscription).toBe("string");
    expect(typeof body.user.email).toBe("string");
    expect(body.token).toBeTruthy();
  });
});
