export class HttpError extends Error {
    private readonly statusCode: number;

    // Constructor: Initializes the HttpError instance with a status code and error message
    constructor(statusCode: number, message: string) {
        // Call the base class constructor to set the error message
        super(message);
        // Assign the provided status code to the instance variable
        this.statusCode = statusCode;
    }

    // Method to get the HTTP status code associated with the error
    getStatusCode(): number {
        // Return the stored status code
        return this.statusCode;
    }
}
