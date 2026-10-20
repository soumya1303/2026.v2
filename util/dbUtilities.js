const {log:Log}=require("node:console")
const mongodb=require("mongodb")

const MONGODB_URI="mongodb+srv://db-user:password0@cluster0.9sys7.mongodb.net/?appName=Cluster0"
const MONGODB_SCHEMA="schema_2026"

const mongoClient=new mongodb.MongoClient(MONGODB_URI)

var db

const conn2mongodb=async ()=>{
    try 
    {
        const conn=await mongoClient.connect()

        if (!conn){
            Log("Failed to conencted to db...")
            process.exit(0)
        }
        Log("Connected to mongoDB")
        db=conn.db(MONGODB_SCHEMA)
        return true
    } catch (error) {
        Log(error.message)
        Log("MongoDB connection refused. Exiting application")
        process.exit(0)
    }

}

const getDB=()=>{
    if (db){
        return db
    }
}

module.exports={conn2mongodb, getDB}