const {log:Log}=require("node:console")
const bcrypt=require("bcryptjs")
const {validationResult}=require("express-validator")
const {Adminuser}=require("../model/adminuser")

const showLogin=(req, res, next)=>{

    res.render("login", {        
        pageTitle:"Admin Login",
        isAuthenticated:false,
        errMsg:"",
        //csrfToken:req.csrfToken()       
    })

}

const showSignup=(req, res, next)=>{

    res.render("signup", {        
        pageTitle:"Admin Signup",
        isAuthenticated:false,
        errMsg:"",
        //csrfToken:req.csrfToken()
    })

}

const signupUser=(req, res, next)=>{

    const vErrorResp=validationResult(req)

    if (!vErrorResp.isEmpty()){
        const vErrorArr=vErrorResp.array()
        Log(vErrorArr)
        return res.render("signup", {        
                    pageTitle:"Admin Signup",
                    isAuthenticated:false,
                    errMsg:vErrorArr[0].msg,
                    //csrfToken:req.csrfToken()
                })
    }

    const {empId, fname, sname, emailId, pwd, cnfPwd}=req.body;

    bcrypt.hash(pwd,12).then((encPwd)=>{

        const adminUser =new Adminuser(empId, fname, sname, emailId, encPwd)

        adminUser.save().then((resp)=>{
            Log(resp)
            return res.redirect("/login")
            
        }).catch((err)=>{
            Log(err.message)
            return res.redirect("/internalError")
        })

    }).catch((err)=>{
        Log(err.message)
        const error=new Error(err)
        error.httpStatusCode=500
        error.httpStatusMsg=err.message
        next(error)
    })

}

const authenticateUser=(req, res, next)=>{

    try 
    {
        
        vError=validationResult(req)

        if (!vError.isEmpty()){
            const errArr=vError.array()
            Log(errArr)
            
            return res.render("login", {
                pageTitle:"Admin Login",
                isAuthenticated:false,
                errMsg:errArr[0].msg,
                //csrfToken:req.csrfToken()
            })
            
        }

        const {emailId, pwd}=req.body

        Adminuser.findUser(emailId)
        .then((user)=>{
            req.session.isAuthenticated=true
            req.session.user=user
            return res.redirect("/")
        })
        .catch((err)=>{
            Log(err.message)
            const error=new Error(err)
            error.httpStatusCode=500
            error.httpStatusMsg=err.message
            next(error)
        })
        
    } catch (err) {
        Log(err.message)
        const error=new Error(err)
        error.httpStatusCode=500
        error.httpStatusMsg=err.message
        next(error)
    }    

}

const logoutUser=(req, res, next)=>{

    if (req.session){
        req.session.destroy()
        return res.redirect("/")
    }

}


module.exports={showLogin, showSignup, signupUser, authenticateUser, logoutUser}