import { HttpError } from '@common/http-error';
import joi from 'joi';

export default function validateSchema<T>(data: T, schema: joi.ObjectSchema) {
    // Validate the provided data against the provided schema
    const { error } = schema.validate(data);

    // If validation error exists, throw a 400 Bad Request error with the error message
    if (error) {
        throw new HttpError(400, error.message);
    }
}
