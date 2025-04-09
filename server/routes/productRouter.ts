import { Router } from "express";
import { deleteproduct, getallformerproducts, getproduct, postproduct } from "../controllers/productController";
import authMiddleware from "../middleware/authMiddleware";

const productRouter = Router();
productRouter.use(authMiddleware);
productRouter.route('/product').get(getproduct).post(postproduct);  
productRouter.route('/product/:id').delete(deleteproduct);
productRouter.route('/allproductsfarm').get(getallformerproducts);
export default productRouter;