const express=require("express")
const adminRouter=express.Router()
const {log:Log}=require("node:console")
const {check}=require("express-validator")
const {authorizerFn}=require("../middleware/authorizer")
const {
        showHome, 
        showAddProduct, 
        viewProduct, 
        viewEditProduct,
        addProduct, 
        deleteProduct,  
        saveEditProduct
    }=require("./../controller/adminController")

const inputChecker=[
    check("title")
    .not().isEmpty().withMessage("Title is missing")
    .isLength({min:4}).withMessage("Title too short"),
    check("price")
    .not().isEmpty().withMessage("Pricing is missing")
    .isDecimal().withMessage("Pricing format should be decimal"),
    check("desc")
    .not().isEmpty().withMessage("Description is missing")
]


adminRouter.get("/", showHome)

adminRouter.get("/add-product", showAddProduct)

adminRouter.get("/view-product/:pid", viewProduct)

adminRouter.get("/view-edit-product/:pid", authorizerFn, viewEditProduct)

adminRouter.post("/add-product", authorizerFn, inputChecker, addProduct)

adminRouter.post("/delete-product", authorizerFn, deleteProduct)

adminRouter.post("/save-edit-product/:pid", authorizerFn, inputChecker, saveEditProduct)

module.exports={adminRouter}