import { Connection } from "typeorm";
import request from "supertest";

import { app } from "@root/app";
import createConnection from "@database/index";

let connection: Connection;
describe("Create Statement Controller tests", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should not create a DEPOSIT statement without token", async () => {
    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Deposit description",
      });

    expect(response.status).toBe(401);
  });

  it("should not create a WITHDRAW statement without token", async () => {
    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 100,
        description: "Withdraw description",
      });

    expect(response.status).toBe(401);
  });

  it("should be able to create a DEPOSIT statement type", async () => {
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
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Deposit description",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.type).toBe("deposit");
  });

  it("should be able to not create a WITHDRAW statement type with insufficient funds", async () => {
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
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 500,
        description: "Withdraw description",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Insufficient funds");
  });

  it("should be able to create a WITHDRAW statement type", async () => {
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
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 60,
        description: "Withdraw description",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.type).toBe("withdraw");
  });
});
