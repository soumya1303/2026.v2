const express=require("express")

const internalErrorRouter=express.Router()

const {showInternalError}=require("../controller/internalErrorController")

internalErrorRouter.get("/internalError", showInternalError)

module.exports={internalErrorRouter}