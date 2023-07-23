import { AppError } from "@shared/errors/AppError";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";

let usersRepositoryInMemory: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User use case tests", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should not auth user if email doesn't exists", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "dev@test.com",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not auth user if password is wrong", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        email: "dev@test.com",
        name: "Dev Test",
        password: "123456",
      });

      await authenticateUserUseCase.execute({
        email: "dev@test.com",
        password: "12345678",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to auth user", async () => {
    const user = {
      email: "dev@test.com",
      name: "Dev Test",
      password: "123456",
    };

    await createUserUseCase.execute({
      email: user.email,
      name: user.name,
      password: user.password,
    });

    const authUser = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(authUser).toHaveProperty("token");
  });
});
