import { AppError } from "@shared/errors/AppError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;
let statementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;

describe("Get Balance use case tests", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepository,
      usersRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should not get balance with user doesn't exists", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "" });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should get balance", async () => {
    const user = {
      email: "dev@test.com",
      name: "Dev Test",
      password: "123456",
    };

    const { id } = await createUserUseCase.execute(user);

    const balance = await getBalanceUseCase.execute({ user_id: id || "" });

    expect(balance).toHaveProperty("statement");
    expect(balance).toHaveProperty("balance");
  });
});
