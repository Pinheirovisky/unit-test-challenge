import { AppError } from "@shared/errors/AppError";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Show User Profile use case tests", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      usersRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should shows the user profile", async () => {
    const { id, email } = await createUserUseCase.execute({
      email: "dev@test.com",
      name: "Dev Test",
      password: "123456",
    });

    const userProfile = await showUserProfileUseCase.execute(id || "");

    expect(Object.keys(userProfile).length).toBe(4);
    expect(userProfile.email).toBe(email);
  });

  it("should not show a non-existant user profile", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("1234");
    }).rejects.toBeInstanceOf(AppError);
  });
});
