const showInternalError=(req, res, next)=>{
    
    const isAuthenticated=req.session?req.session.isAuthenticated?req.session.isAuthenticated:false:false
    
    res.render("500.ejs", {
        pageTitle:"Internal Error",
        isAuthenticated:isAuthenticated,
        //csrfToken:req.csrfToken()
    })
}

module.exports={showInternalError}