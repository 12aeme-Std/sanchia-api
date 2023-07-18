declare global {
    namespace Express {
        export interface Request {
            user?: PayloadDto;
        }
    }
}

export {};