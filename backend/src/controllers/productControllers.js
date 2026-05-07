import Product from "../models/Product";

export async function getProducts(req,res){
    try {
       const products = await Product.find({}) 

       if(!products){
        return res.status(404).json({message:"No products available"})
       }

       res.status(200).json(products)
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
        console.log("Error in get products controller")
    }
}