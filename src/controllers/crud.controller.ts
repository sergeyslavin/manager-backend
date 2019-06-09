import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const index = <T extends mongoose.Document>(Model: mongoose.Model<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Model.find().then((items: T[]) => {
      res.json(items);
    }).catch((e: Error) => {
      next(e);
    });
  };
}

export const show = <T extends mongoose.Document>(Model: mongoose.Model<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Model.findById(req.params.id).then((item: T) => {
      if (!item) {
        res.status(404).json({ message: "record not found" });
        return;
      }
  
      res.json(item);
    }).catch(e => {
      e.statusCode = 422;
      next(e);
    });
  };
}

export const destroy = <T extends mongoose.Document>(Model: mongoose.Model<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Model.findByIdAndRemove(req.params.id).then((item: T) => {
      if (!item) {
        res.status(404).json({ message: "record not found" });
        return;
      }
      res.json(item);
    }).catch(e => {
      next(e);
    });
  };
}

export const update = <T extends mongoose.Document>(Model: mongoose.Model<T>, updateHandler: (body: any) => any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Model.findByIdAndUpdate(req.params.id, updateHandler(req.body), { new: true }).then((item: T) => {
      if (!item) {
        res.status(404).json({ message: "record not found" });
        return;
      }
      res.json(item);
    }).catch(e => {
      e.statusCode = 422;
      next(e);
    });
  };
}

export const create = <T extends mongoose.Document>(
    Model: mongoose.Model<T>,
    createHandler: (body: any) => any
  ) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const item = new Model(createHandler(req.body));
  
    item.save().then((result: T) => {
      res.json(result);
    }).catch(e => {
      e.statusCode = 422;
      next(e);
    });
  };
}
