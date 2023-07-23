import { Connection } from "typeorm";
import request from "supertest";

import { app } from "@root/app";
import createConnection from "@database/index";

let connection: Connection;
describe("Authenticate User Controller tests", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should not auth user if email doesn't exists", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "dev@test.com",
      password: "123456",
    });

    expect(response.status).toBe(401);
  });

  it("should not auth user if password is wrong", async () => {
    await request(app).post("/api/v1/users").send({
      email: "dev@test.com",
      name: "Dev Test",
      password: "123456",
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "dev@test.com",
      password: "12345678",
    });

    expect(response.status).toBe(401);
  });

  it("should be able to auth user", async () => {
    await request(app).post("/api/v1/users").send({
      email: "dev@test.com",
      name: "Dev Test",
      password: "123456",
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "dev@test.com",
      password: "123456",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });
});
