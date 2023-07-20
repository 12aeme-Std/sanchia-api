import { UserService } from '@user/user.service';
import passportJwt from 'passport-jwt';

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

export default function passportConfig() {
    const userService = new UserService();

    return new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        },
        async function (payload, done) {
            try {
                const user = await userService.findOne({
                    id: payload.id,
                });

                done(null, user!);
            } catch (error) {
                done(new Error('Something when wrong'), false);
            }
        }
    );
}
