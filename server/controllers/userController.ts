import { Request, Response } from "express";
import userModel from "../models/userModel";

const UserController = {
  getUsers: async (req: Request, res: Response) => {
    try {
      const users = await userModel.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
  getpatients:async (req: Request, res: Response) => {
    try {
      const patient = await userModel.find({ role: 'patient' });
      res.status(200).json(patient);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  updateUser: async (req: Request, res: Response) => {
    try {
      const user = await userModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }, 

  deleteUser: async (req: Request, res: Response) => {
    try { 
      await userModel.findByIdAndDelete(req.params.id);
      res.status(200).json("User deleted");
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
  
};


export const { getUsers, updateUser, deleteUser,getpatients } = UserController;
export default UserController;
