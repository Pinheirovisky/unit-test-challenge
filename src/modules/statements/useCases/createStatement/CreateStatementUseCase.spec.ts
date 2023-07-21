import { AppError } from "@shared/errors/AppError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "@modules/statements/entities/Statement";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let statementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;

const user = {
  email: "dev@test.com",
  name: "Dev Test",
  password: "123456",
};

describe("Create Statement use case tests", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementsRepository
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should not create a statement with user doesn't exists", async () => {
    expect(async () => {
      const statement: ICreateStatementDTO = {
        amount: 100,
        description: "Description",
        type: OperationType.WITHDRAW,
        user_id: "",
      };

      await createStatementUseCase.execute(statement);
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should create a DEPOSIT statement type", async () => {
    const { id } = await createUserUseCase.execute(user);

    const statement: ICreateStatementDTO = {
      amount: 100,
      description: "Description",
      type: OperationType.DEPOSIT,
      user_id: id || "",
    };

    const deposit = await createStatementUseCase.execute(statement);

    expect(deposit).toHaveProperty("id");
    expect(Object.keys(deposit).length).toBe(5);
    expect(deposit.amount).toBe(100);
  });

  it("should not create a WITHDRAW statement type with insufficient funds", async () => {
    expect(async () => {
      const { id } = await createUserUseCase.execute(user);

      const statement: ICreateStatementDTO = {
        amount: 100,
        description: "Description",
        type: OperationType.WITHDRAW,
        user_id: id || "",
      };

      await createStatementUseCase.execute(statement);
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should create a WITHDRAW statement type", async () => {
    const { id } = await createUserUseCase.execute(user);

    const deposit: ICreateStatementDTO = {
      amount: 100,
      description: "Description",
      type: OperationType.DEPOSIT,
      user_id: id || "",
    };

    await createStatementUseCase.execute(deposit);

    const withdraw: ICreateStatementDTO = {
      amount: 80,
      description: "Description",
      type: OperationType.WITHDRAW,
      user_id: id || "",
    };

    const statement = await createStatementUseCase.execute(withdraw);

    expect(statement).toHaveProperty("id");
    expect(Object.keys(statement).length).toBe(5);
    expect(statement.amount).toBe(80);
  });
});
