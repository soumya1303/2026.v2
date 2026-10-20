const showNotFound=(req, res, next)=>{
    
    const isAuthenticated=req.session?req.session.isAuthenticated?req.session.isAuthenticated:false:false
    
    res.render("404.ejs", {
        pageTitle:"Page not found",
        isAuthenticated:isAuthenticated,
        //csrfToken:req.csrfToken()
    })
}

module.exports={showNotFound}