import { Connection } from "typeorm";
import request from "supertest";

import { app } from "@root/app";
import createConnection from "@database/index";

let connection: Connection;
describe("Create User Controller tests", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create an user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      email: "dev@test.com",
      name: "Dev Test",
      password: "123456",
    });

    expect(response.status).toBe(201);
  });

  it("should not be able to create an existant user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      email: "dev@test.com",
      name: "Dev Test",
      password: "123456",
    });

    expect(response.status).toBe(400);
  });
});
