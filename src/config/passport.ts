import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import passport from 'passport';
import { Strategy } from 'passport-local';
import { User } from '../models/User';

const opts = {} as StrategyOptions;
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(new Strategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
}, (email, password, done) => {
    User.findOne({ email }, (err, user) => {
        if (err) {
            return done(err);
        }

        if (!user) {
            return done(undefined, false, { message: `Email ${email} not found.` });
        }

        user.comparePassword(password, (err: Error, isMatch: boolean) => {
            if (err) { return done(err); }
            if (isMatch) {
                return done(undefined, user);
            }
            return done(undefined, false, { message: 'Invalid email or password.' });
        });
    });
}));

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.sub}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));