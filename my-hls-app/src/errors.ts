export class MissingPaywordHeaderError extends Error {
  constructor() {
    super("Missing payword header");
    this.name = "MissingPaywordHeaderError";
  }
}

export class InvalidPaywordHeaderError extends Error {
  constructor() {
    super("Invalid payword header");
    this.name = "InvalidPaywordHeaderError";
  }
}

export class UserNotAuthenticatedError extends Error {
  constructor() {
    super("User not authenticated");
    this.name = "UserNotAuthenticatedError";
  }
}

export class UserNotFoundError extends Error {
  constructor() {
    super("User not found");
    this.name = "UserNotFoundError";
  }
}

export class InvalidUserHashChainError extends Error {
  constructor() {
    super("Invalid user hash chain");
    this.name = "InvalidUserHashChainError";
  }
}

export class InvalidHashIndexError extends Error {
  constructor() {
    super("Position number cannot be the most recent hash index");
    this.name = "InvalidHashIndexError";
  }
}

export class InvalidHashPositionError extends Error {
  constructor() {
    super("Position number cannot be the most recent hash index");
    this.name = "InvalidHashPositionError";
  }
}

export class NegativeHashIndexError extends Error {
  constructor() {
    super("Hash indices must be non-negative");
    this.name = "NegativeHashIndexError";
  }
}

export class InvalidHashFormatError extends Error {
  constructor() {
    super("Hashes must be in 0x-prefixed hex format");
    this.name = "InvalidHashFormatError";
  }
}

export class HashChainVerificationError extends Error {
  constructor(message: string) {
    super(`Error during hash chain verification: ${message}`);
    this.name = "HashChainVerificationError";
  }
}

export class WrongToAddresError extends Error {
  constructor(message: string) {
    super(`Error during hash chain verification: ${message}`);
    this.name = "WrongToAddresError";
  }
}
