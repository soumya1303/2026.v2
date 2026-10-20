const mongodb=require("mongodb")
const fs=require("fs")
const path=require("node:path")
const {rootDirPath}=require("../util/utilities")
const {log:Log}=require("node:console")

const {getDB}=require("../util/dbUtilities")

class Product{
    constructor(title, imageURL, price, desc, createdBy){
        this.title=title
        this.imageURL=imageURL
        this.price=price
        this.desc=desc
        this.createdBy=createdBy
    }

    static updataOne(prod){

        const db=getDB()

        const coll=db.collection("ww2books")

        return coll.updateOne({_id:new mongodb.ObjectId(prod.id)}, {$set:{title:prod.title, imageURL:prod.imageURL, price:prod.price, desc:prod.desc}})
        
    }

    save(){

        const db=getDB()

        const coll=db.collection("ww2books")

        return coll.insertOne(this)

    }
    static find(cb)
    {
        const db=getDB()

        const coll=db.collection("ww2books")

        return coll.find({}).toArray()

    }
    static findOne(id){

        const db=getDB()

        const coll=db.collection("ww2books")

        return coll.findOne({_id:new mongodb.ObjectId(id)})
        
    }

    static deleteOne(id)
    {
        const db=getDB()

        const coll=db.collection("ww2books")

        return coll.deleteOne({_id:new mongodb.ObjectId(id)})

    }
}

module.exports={Product}