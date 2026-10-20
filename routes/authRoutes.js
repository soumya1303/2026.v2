const express=require("express")
const authRouter=express.Router()
const {check}=require("express-validator")
const {compare}=require("bcryptjs")
const {Adminuser}=require("../model/adminuser")

const {
    showLogin, 
    showSignup, 
    signupUser, 
    authenticateUser, 
    logoutUser
    }=require("./../controller/authController")



const validateLogin=[
    check("emailId")
    .not().isEmpty().withMessage("EmailId cannot be empty")
    .isEmail().withMessage("Please provide valid email")
    .custom(async (v, {req})=>{
        return Adminuser.findUser(v)
        .then((user)=>{
            if (!user){
                return Promise.reject("Invalid email")
            }
        })
    }),
    check("pwd")
    .not().isEmpty().withMessage("Password cannot be empty")
    .custom(async (v, {req})=>{
        const {emailId}=req.body

        return Adminuser.findUser(emailId)
        .then(async (user)=>{
            const {pwd}=user
            return compare(v, pwd).then((isMatch)=>{
                if (!isMatch){
                    return Promise.reject("Invalid password")
                }
            })
        })
    })
]

const validateSignUp=[
    check("empId").not().isEmpty().withMessage("Emp Id cannot be empty"),
    check("fname").not().isEmpty().withMessage("First name is mandatory"),
    check("sname").not().isEmpty().withMessage("Last name is mandatory"),
    check("emailId")
    .not().isEmpty().withMessage("Email cannot be empty")
    .isEmail().withMessage("Provide valid email id")
    .custom(async (emailId, {req})=>{
        return Adminuser.findUser(emailId)
        .then((user)=>{
            if (user){
                return Promise.reject("This emailIs is taken. Please use another emailId")
            }
        })
        
    }),
    check("pwd")
    .not().isEmpty().withMessage("Password cannot be empty")
    .isLength({min:8, max:12}).withMessage("Password must be between 8-12 charecters long")
    .isAlphanumeric().withMessage("Password must be alpha-numeric")
    .custom( (pwd, {req})=>{
        const {cnfPwd}=req.body
        if (pwd!==cnfPwd){
            throw new Error("Password and Confirm Password donot match")
        }
    }),
    
]

authRouter.get("/login", showLogin)

authRouter.get("/signup", showSignup)

authRouter.post("/login", validateLogin, authenticateUser)

authRouter.post("/signup", validateSignUp, signupUser)

authRouter.post("/logout", logoutUser)

module.exports={authRouter}