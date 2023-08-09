import { PrismaClient, Prisma } from '@prisma/client';
import { UserDto } from '../user/dtos/user.dto';
import bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import jwt from 'jsonwebtoken';
import { HttpError } from '@common/http-error';

export class AuthService {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    private async validateCredentials(
        query: Prisma.UserWhereUniqueInput, // Query parameter to find user based on unique identifier
        password: string // Password input
    ): Promise<UserDto | null> {
        // Returns UserDto object or null
        // Find a user in the database using the provided query
        const user = await this.prisma.user.findUnique({
            where: query,
        });

        // Check if the user exists and the provided password matches the hashed password in the database
        const isValid = user
            ? await bcrypt.compare(password, user.password)
            : false;

        // If credentials are valid, return the user, otherwise return null
        return isValid ? user : null;
    }

    // Public method to perform user login
    async login({ email, password }: LoginDto) {
        // LoginDto contains email and password
        // Validate user credentials using the private method
        const user = await this.validateCredentials({ email }, password);

        // If user credentials are not valid, throw an Unauthorized error
        if (!user) throw new HttpError(401, 'Unauthorized');

        // Generate a JSON Web Token (JWT) with user's ID and role, using the JWT_SECRET from environment variables
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET!
        );

        // Update the user's accessToken in the database with the newly generated token
        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                accessToken: token,
            },
        });

        // Return the generated token
        return { token };
    }
}
