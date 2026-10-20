const {log:Log}=require("node:console")
const {validationResult}=require("express-validator")
const {Product}=require("../model/product")

const showHome=async (req, res, next)=>{

    const isAuthenticated=req.session?req.session.isAuthenticated?req.session.isAuthenticated:false:false

    try {
        const prodArr=await Product.find()
        
        res.status(200)
        res.render("home", {
            isAuthenticated:isAuthenticated,
            pageTitle:"Admin Home",
            prods:prodArr,
            errMsg:""
            //csrfToken:req.csrfToken()
        })
    } catch (error) {
        const err=new Error(error)
        err.httpStatusCode=500
        err.httpStatusMsg=err.message
        next(err)
    }
    


    /*
    Product.find()
    .then((prodArr)=>{
        res.status(200)
        res.render("home", {
            isAuthenticated:isAuthenticated,
            pageTitle:"Admin Home",
            prods:prodArr,
            errMsg:""
            //csrfToken:req.csrfToken()
        })
    })
    .catch((err)=>{
        Log(err.message)
        return res.redirect("/internalError")
    })
    */
}

const showAddProduct=(req, res, next)=>{

    const isAuthenticated=req.session?req.session.isAuthenticated?req.session.isAuthenticated:false:false

    res.status(200)
    res.render("addProduct", {
        pageTitle:"Add a product",
        isAuthenticated:isAuthenticated,
        prods:[],
        errMsg:""
        //csrfToken:req.csrfToken()
    })
}

const addProduct=(req, res, next)=>{
    
    try {

        const errObj=validationResult(req)

        if (!errObj.isEmpty()) 
        {
            vError=errObj.array()
            Log(vError)
            res.status(400)
            return res.render("addProduct", {
                pageTitle:"Add a product",
                isAuthenticated:true,
                prods:[],
                errMsg:vError[0].msg
                //csrfToken:req.csrfToken()
            })
        }

        const {title, price, desc}=req.body;

        const file=req.file;

        const imageURL=file.originalname

        const createdBy=req.session.user._id.toString()

        const product=new Product(title, "/"+imageURL, +price, desc, createdBy)

        product.save()
        .then((resp)=>{
            Log(resp)
            res.redirect("/")
        })
        .catch((err)=>{
            Log(err.message)
            throw new Error("Error in save")
        }) 
    } catch (error) {
        Log(error.message)
        const err=new Error(error)
        err.httpErrorCode=500
        err.httpErrorDesc=err.message
        next(err)
    }
    
    
}

const viewProduct=(req, res, next)=>{

    const isAuthenticated=req.session?req.session.isAuthenticated?req.session.isAuthenticated:false:false

    const {pid}=req.params

    Product.findOne(pid).then((prod)=>{

        res.status(200).render("view-product", {
            pageTitle:"View product",
            isAuthenticated:isAuthenticated,
            prod:prod
        })
    })
    .catch((err)=>{
        Log(err.message)
        return res.redirect("/internalError")
    })
        
}

const viewEditProduct=(req, res, next)=>{

    const isAuthenticated=req.session?req.session.isAuthenticated?req.session.isAuthenticated:false:false

    const {pid}=req.params

    Product.findOne(pid).then((prod)=>{
        
        res.status(200).render("view-edit-product", {
            pageTitle:"Edit product",
            isAuthenticated:isAuthenticated,
            prod:prod,
            errMsg:""
            //csrfToken:req.csrfToken()
        })
    })
    .catch((err)=>{
        Log(err.message)
        return res.redirect("/internalError")
    })

}

const saveEditProduct=(req, res, next)=>{

    const {pid}=req.params

    const vErr=validationResult(req)

    if (!vErr.isEmpty()){
        errArr=vErr.array()
        Log(errArr)
        errMsg=errArr[0].msg     
        Product.findOne(pid)
        .then((prod)=>{
            res.status(400).render("view-edit-product", {
                pageTitle:"Edit product",
                isAuthenticated:true,
                prod:prod,
                errMsg:errMsg
                
            })
            
        })
        .catch((error)=>{
            const err=new Error(error)
            err.httpStatusCode=500
            err.httpStatusMsg="Internal error"
            next(err)
        })
        return
    }

    const {title, price, desc}=req.body

    const {file}=req

    const imageURL=file.originalname

    const updProd={id:pid, title:title, imageURL:"/"+imageURL, price:price, desc:desc}
    
    Product.updataOne(updProd)
    .then((dbresp)=>{
        Log(dbresp)
        res.redirect("/")
    })
    .catch((err)=>{
        Log(err.message)
        return res.redirect("/internalError")
    })
    
}

const deleteProduct=async (req, res, next)=>{
    
    const {id}=req.body;
    try {
        const resp=await Product.deleteOne(id)
        Log(resp)
        res.redirect("/")        
    } catch (error) {
        const err=new Error(error)
        err.httpStatusCode=500
        err.httpStatusMsg=err.message
        next(err)
    }

    /*
    Product.deleteOne(id).then((resp)=>{
        Log(resp)
        res.redirect("/")
    })
    .catch((err)=>{
        Log(err.message)
        return res.redirect("/internalError")
    })
    */
}

module.exports={showAddProduct, showHome, addProduct, viewProduct, viewEditProduct, saveEditProduct, deleteProduct}