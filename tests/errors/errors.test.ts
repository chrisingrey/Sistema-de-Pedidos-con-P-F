import { NotFoundError, ConflictError, UnAuthorizedError } from "../../src/errors/errors";

describe("Custom Errors", () => {
  it("should create NotFoundError with correct status and name", () => {
    const err = new NotFoundError("not found");
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(NotFoundError);
    expect(err.status).toBe(404);
    expect(err.name).toBe("NotFoundError");
    expect(err.message).toBe("not found");
  });

  it("should create ConflictError with correct status and name", () => {
    const err = new ConflictError("conflict");
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(ConflictError);
    expect(err.status).toBe(409);
    expect(err.name).toBe("ConflictError");
    expect(err.message).toBe("conflict");
  });

  it("should create UnAuthorizedError with correct status and name", () => {
    const err = new UnAuthorizedError("unauthorized");
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(UnAuthorizedError);
    expect(err.status).toBe(401);
    expect(err.name).toBe("UnAuthorizedError");
    expect(err.message).toBe("unauthorized");
  });
});
