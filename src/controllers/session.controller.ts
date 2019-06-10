import { Request, Response, NextFunction, Router } from 'express';
import { body, validationResult } from 'express-validator/check';
import { User, UserModel } from '..//models/User';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const signIn = (req: Request, res: Response, next: NextFunction) => {
  try {
    validationResult(req).throw();
      passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                error: info || 'Something is not right',
                user,
                token: null
            });
        }
      req.login(user, {session: false}, (error) => {
          if (error) {
              res.status(422).send({ error, user: null, token: null });
          }
          const token = jwt.sign({id: user.id}, process.env.JWT_SECRET);
          return res.json({ user, token, error: null });
        });
    })(req, res, next);
  } catch(error) {
    res.status(422).json({ error, token: null, user: null });
  }
};

const signUp = (req: Request, res: Response, next: NextFunction) => {
  try {
    validationResult(req).throw();
    const { email, password } = req.body;
    const user = new User({ email, password });

    user.save({ validateBeforeSave: true })
      .then((user: UserModel) => {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ error: null, token, user });
      }).catch((e) => {
        res.status(400).json({ token: null, error: e.message });
      });
  } catch(err) {
    res.status(422).json({ error: err.mapped(), token: null });
  }
};

const router = Router();

const validationRules = [
  body('email', 'Email is required').exists(),
  body('email', 'Email is invalid').isEmail(),
  body('password', 'Password is required').exists(),
  body('password', 'Password is not valid').isLength({ min: 3, max: 8 })
];

router.post('/sign_in', validationRules, signIn);
router.post('/sign_up', validationRules, signUp);

export default router;