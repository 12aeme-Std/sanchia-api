import { User } from '@prisma/client';

export type UserDto = Omit<
    User,
    'password' | 'createdAt' | 'updatedAt' | 'accessToken'
>;
