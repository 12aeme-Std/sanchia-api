interface PayloadDto {
    id: number;
    name: string;
    lastname: string;
    email: string;
    role: string;
}

declare global {
    namespace Express {
        export interface Request {
            user: PayloadDto;
        }
    }
}

export {};
