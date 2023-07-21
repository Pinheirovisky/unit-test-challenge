import { AppError } from "@shared/errors/AppError";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "@modules/statements/entities/Statement";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

const user = {
  email: "dev@test.com",
  name: "Dev Test",
  password: "123456",
};

describe("Get Statement Operation use case tests", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should not get a statement ops with user doesn't exists", async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "",
        statement_id: "",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not get a non-existant statement ops", async () => {
    expect(async () => {
      const { id } = await createUserUseCase.execute(user);

      await getStatementOperationUseCase.execute({
        statement_id: "",
        user_id: id || "",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should get a statement ops", async () => {
    const { id } = await createUserUseCase.execute(user);

    await createStatementUseCase.execute({
      amount: 100,
      description: "Description",
      type: OperationType.DEPOSIT,
      user_id: id || "",
    });

    const { id: stat_id, user_id } = await createStatementUseCase.execute({
      amount: 80,
      description: "Description",
      type: OperationType.WITHDRAW,
      user_id: id || "",
    });

    const ops = await getStatementOperationUseCase.execute({
      statement_id: stat_id || "",
      user_id,
    });

    expect(ops).toHaveProperty("id");
    expect(Object.keys(ops).length).toBe(5);
    expect(ops.amount).toBe(80);
  });
});
