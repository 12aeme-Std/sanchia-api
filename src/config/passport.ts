import passportJwt from 'passport-jwt';
import { UserService } from '../user/user.service';

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
                    id: payload.sub,
                });

                return done(null, user!);
            } catch (error) {
                return done(new Error('Something when wrong'), false);
            }
        }
    );
}
