export class HttpError extends Error {
    private readonly statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }

    getStatusCode(): number {
        return this.statusCode;
    }
}
