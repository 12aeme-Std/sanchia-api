import { PrismaClient } from "@prisma/client";

class UserService {
    private readonly prisma: PrismaClient;

    constructor () {
        this.prisma = new PrismaClient();
    }

    async signUp (data: Prisma.UserInp) {
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
    }
}