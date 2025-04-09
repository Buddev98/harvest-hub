import { Request, Response } from "express";
import userModel from "../models/userModel";
import Product from "../models/ProductModel";
import { JwtPayload } from "jsonwebtoken";

const productController = {
  getproduct: async (req: Request, res: Response) => {

        const produce = await Product.find();
        res.json(produce);
  },
  postproduct: async (req: Request, res: Response) => {
    const usercheck = req.user as JwtPayload;
        const farmerId:string = usercheck.id;
    const newProduce = new Product({ ...req.body, farmerId: farmerId });
    await newProduce.save();
    res.status(201).json(newProduce);
},
deleteproduct: async (req: Request, res: Response) => {
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).end();
},

getallformerproducts: async (req: Request, res: Response) => {
    try {
        const usercheck = req.user as JwtPayload;
        const farmerId:string = usercheck.id;
        // const farmerId = req.user.id as JwtPayload;
          console.log("sant",farmerId)
            // Get produce added by this farmer
            const produceList = await Product.find({ farmerId: farmerId });
            console.log("santoshsan",produceList)
         
            // const produceIds = produceList.map(p => p._id);
         
            // // Get orders related to those produce
            // const orders = await Order.find({ produce: { $in: produceIds } }).populate("produce").populate("buyer");
         
            res.json(produceList);
          } catch (err) {
            res.status(500).json({ message: "Error fetching orders" });
          }
},
  
};


export const { getproduct, postproduct, deleteproduct,getallformerproducts } = productController;
export default productController;
