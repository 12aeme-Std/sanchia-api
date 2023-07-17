import { type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { compare, encrypt, tokenKey } from './../utilities/helpers';

class UserController {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    signUp = async (req: Request, res: Response) => {
        try {
            const { name, email, password, role } = req.body;
            const passwordHash = await encrypt(password);
            const registerUser = await this.prisma.user.create({
                data: { name, email, password: passwordHash, role },
            });
            const tokenSession = await tokenKey(registerUser?.id);
            const userWithToken = await this.prisma.user.update({
                where: { id: registerUser.id },
                data: { accessToken: tokenSession },
            });
            return res.status(200).send({ userWithToken });
        } catch (err) {
            return res.status(500).send({ message: 'ups, server error', err });
        }
    };

    signIn = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        try {
            const user = await this.prisma.user.findFirst({
                where: { email },
            });
            if (user == null) {
                res.status(404).json({ message: 'user not found' });
            }

            const checkpass = await compare(password, String(user?.password));
            const tokenSession = await tokenKey(user?.id);
            const userUpdate = await this.prisma.user.update({
                where: { id: user?.id },
                data: { accessToken: tokenSession },
            });

            if (!checkpass) {
                return res.status(404).json({ message: 'incorrect password' });
            }

            if (checkpass) return res.status(200).send({ userUpdate });
        } catch (err) {
            return res.status(500).send({ message: 'ups, server error', err });
        }
    };

    signOut = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            if (!userId) {
                return res.status(400).send({ message: 'Missing param: id' });
            }
            await this.prisma.user.update({
                where: { id: Number(userId) },
                data: { accessToken: '' },
            });
            return res
                .status(200)
                .send({ message: 'AccessToken was destroyed' });
        } catch (err) {
            return res.status(500).send({ message: 'ups, server error', err });
        }
    };

    getUsers = async (req: Request, res: Response) => {
        try {
            const users = await this.prisma.user.findMany();
            return res.status(200).send({ users });
        } catch (err) {
            return res.status(500).send({ message: 'ups, server error', err });
        }
    };

    updateUser = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const { name, email, password, role } = req.body;
            const passwordHash = await encrypt(password);
            const userUpdate = await this.prisma.user.update({
                where: { id: Number(userId) },
                data: { name, email, password: passwordHash, role },
            });
            return res
                .status(200)
                .send({ message: 'user updated successfully', userUpdate });
        } catch (err) {
            return res.status(500).send({ message: 'ups, server error', err });
        }
    };

    deleteUser = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            await this.prisma.user.delete({
                where: { id: Number(userId) },
            });
            return res
                .status(200)
                .send({ message: 'user deleted successfully' });
        } catch (err) {
            return res.status(500).send({ message: 'ups, server error', err });
        }
    };
}

const userController = new UserController();
export default userController;
