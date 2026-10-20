const express=require("express")

const notFoundRouter=express.Router()

const {showNotFound}=require("../controller/notFoundController")

notFoundRouter.use("/", showNotFound)

module.exports={notFoundRouter}