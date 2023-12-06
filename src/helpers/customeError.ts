export class CustomError extends Error {
  status: number;

  constructor(message: string, name: string, status: number) {
    super(message);
    this.status = status;
    this.name = name ?? 'CustomError'; // Set the error name
    Object.setPrototypeOf(this, CustomError.prototype); // Ensure correct prototype chain
  }
}
