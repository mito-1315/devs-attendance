import express from "express";
import loginRoutes from "./loginRoutes.js";

const router = express.Router();

router.use("/login", loginRoutes);
router.get("/health",(req,res)=>{
    console.log("/health is called")
    res.json({
        success:true,
        status:"server is running"
    })
})




export default router;
