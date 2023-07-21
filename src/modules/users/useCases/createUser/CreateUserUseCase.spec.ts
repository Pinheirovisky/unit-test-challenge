import { hash } from "bcryptjs";

import { CreateUserUseCase } from "./CreateUserUseCase";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AppError } from "@shared/errors/AppError";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User use case tests", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should create an user", async () => {
    const user = await createUserUseCase.execute({
      email: "dev@test.com",
      name: "Dev Test",
      password: await hash("123456", 8),
    });

    expect(user).toHaveProperty("id");
  });

  it("should nout create an user with the email already exists", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        email: "dev@test.com",
        name: "Dev Test",
        password: await hash("123456", 8),
      });

      await createUserUseCase.execute({
        email: "dev@test.com",
        name: "Dev Test 2",
        password: await hash("123456", 8),
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
