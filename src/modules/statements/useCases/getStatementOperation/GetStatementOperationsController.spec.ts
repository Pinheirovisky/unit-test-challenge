import { Connection } from "typeorm";
import request from "supertest";

import { app } from "@root/app";
import createConnection from "@database/index";

let connection: Connection;
describe("Get Statement Operation Controller tests", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should not be able to get a statement ops without token", async () => {
    const response = await request(app).post("/api/v1/statements").send();

    expect(response.status).toBe(401);
  });

  it("should not be able to get a non-existant statment ops", async () => {
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
      .post("/api/v1/statements/21321323")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(404);
  });

  it("should be able to get a statment ops", async () => {
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

    const {
      body: { id: statement_id },
    } = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 60,
        description: "Deposit description",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .get(`/api/v1/statements/${statement_id}`)
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("user_id");
    expect(response.body).toHaveProperty("amount");
    expect(response.body.type).toBe("deposit");
  });
});
