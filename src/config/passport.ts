import { UserService } from '@user/user.service';
import passportJwt from 'passport-jwt';

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

export default function passportConfig() {
    const userService = new UserService();

    return new JwtStrategy(
        {
            // Extract JWT token from the Authorization header
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // JWT secret key
            secretOrKey: process.env.JWT_SECRET,
        },
        async function (payload, done) {
            try {
                // Retrieve user data from the database using the UserService
                const user = await userService.findOne({
                    // Extracted user ID from the JWT payload
                    id: payload.id,
                });

                // Return the user data to Passport
                done(null, user!);
            } catch (error) {
                // Return an error to Passport
                done(new Error('Something went wrong'), false);
            }
        }
    );
}
