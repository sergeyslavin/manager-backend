import { Request, Response, NextFunction, Router } from "express";
import { User, UserModel } from "..//models/User";
import jwt from 'jsonwebtoken';

const signIn = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  User.findOne({ email, password })
    .then((user: UserModel) => {
      const token = jwt.sign(user, process.env.JWT_SECRET);
      res.json({ err: null, token });
    }).catch((e) => {
      res.status(401).json({
        token: null,
        err: e
      });
    })
}

const signUp = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const user = new User({ email, password });
  
  user.save({ validateBeforeSave: true })
    .then((user: UserModel) => {
      console.log(process.env.JWT_SECRET);
      console.log(user);
      const token = jwt.sign(user, process.env.JWT_SECRET);
      res.json({ err: null, token });
    }).catch((e) => {
      console.log(e);
      res.status(400).json({ token: null, err: e });
    })
}

const router = Router();
router.post('/sign_in', signIn)
router.post('/sign_up', signUp)

export default router;