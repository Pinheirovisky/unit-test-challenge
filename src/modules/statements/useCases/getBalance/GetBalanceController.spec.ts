import { Connection } from "typeorm";
import request from "supertest";

import { app } from "@root/app";
import createConnection from "@database/index";

let connection: Connection;
describe("Get Balance Controller tests", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should not get balance without token", async () => {
    const response = await request(app)
      .get("/api/v1/statements/balance")
      .send();

    expect(response.status).toBe(401);
  });

  it("should be able to get balance", async () => {
    await request(app).post("/api/v1/users").send({
      email: "dev@test.com",
      name: "Dev Test",
      password: "123456",
    });

    const {
      body: { token },
    } = await request(app).post("/api/v1/sessions").send({
      email: "dev@test.com",
      password: "123456",
    });

    const response = await request(app)
      .get("/api/v1/statements/balance")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("balance");
    expect(response.body).toHaveProperty("statement");
  });
});
