const path=require("path")
const {log:Log}=require("node:console")
const fs=require("node:fs")
const express=require("express")
const morgan=require("morgan")
const flash=require("connect-flash")
const session=require("express-session")
const MongoSessionStore=require("connect-mongodb-session")(session)
//const csrf=require("csurf")
const multer=require("multer")
const {conn2mongodb}=require("./util/dbUtilities")
const {rootDirPath}=require("./util/utilities")
const {authRouter}=require("./routes/authRoutes")
const {adminRouter}=require("./routes/adminRoutes")
const {notFoundRouter}=require("./routes/notFoundRoutes")
const {internalErrorRouter}=require("./routes/internalErrorRoutes")
const { env } = require("node:process")
const helmet=require("helmet")
const compression=require("compression")

const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(rootDirPath, "public")))
app.use(express.static(path.join(rootDirPath, "images")))

app.use(flash())
app.use(helmet())
app.use(compression())
app.use(morgan("combined", {stream:fs.createWriteStream(path.join(rootDirPath, "log", "server.log"), {flags:"a"})}))

const sessionStore=new MongoSessionStore({uri:process.env.MONGODB_URI, databaseName:process.env.MONGODB_SCHEMA})

app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:3600000
    },
    store:sessionStore
}))
//app.use(csrf())

app.use(multer({
    storage:multer.diskStorage({
        destination:(req, file, cb)=>{
            cb(null, "images")
        },
        filename:(req, file, cb)=>{
            cb(null, file.originalname)
        }
    })
}).single("imageF"))

app.set("view engine", "ejs")

app.use("/", authRouter)

app.use("/", adminRouter)

app.use("/", internalErrorRouter)

app.use("/", notFoundRouter)

app.use((error, req, res, next)=>{
    Log(error)
    return res.redirect("/internalError")
})

app.listen(process.env.PORT || process.env.CUSTOM_PORT, (err)=>{
    if (err){
        Log("Error in starting server. Exiting...")
    }
    conn2mongodb()
})