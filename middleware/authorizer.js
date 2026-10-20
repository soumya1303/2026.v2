const authorizerFn=(req, res, next)=>{

    if (!req.session){
        return res.redirect("/login")
    }
    if (!req.session.isAuthenticated){
        return res.redirect("/login")
    }
    next()
}

module.exports={authorizerFn}