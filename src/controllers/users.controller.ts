import { User, UserModel } from "../models/User";
import { Router} from "express";

import * as CRUD from './crud.controller';

const index = CRUD.index<UserModel>(User);
const show = CRUD.show<UserModel>(User);
const destroy = CRUD.destroy<UserModel>(User);

const update = CRUD.update<UserModel>(User, params => ({
  email: params.title,
  password: params.description
}));

const create = CRUD.create<UserModel>(User, params => ({
  email: params.title,
  password: params.description,
}));


const router = Router();

router.get('/', index);
router.get('/:id', show);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', destroy);

export default router;