import { Task, TaskModel } from "../models/Task";
import { Router} from "express";

import * as CRUD from './crud.controller';

const index = CRUD.index<TaskModel>(Task);
const show = CRUD.show<TaskModel>(Task);
const destroy = CRUD.destroy<TaskModel>(Task);

const update = CRUD.update<TaskModel>(Task, params => ({
  title: params.title,
  description: params.description
}));

const create = CRUD.create<TaskModel>(Task, params => ({
  title: params.title,
  description: params.description
}));


const router = Router();

router.get('/', index);
router.get('/:id', show);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', destroy);

export default router;