const mongodb=require("mongodb")
const {getDB}=require("../util/dbUtilities")

class Adminuser{

    constructor(empId, fname, sname, emailId, pwd){
        this.empId=empId
        this.fname=fname
        this.sname=sname
        this.emailId=emailId
        this.pwd=pwd
    }

    save(){

        const _db=getDB();
        const _coll=_db.collection("adminusers")

        return _coll.insertOne(this)

    }
    
    static findUser(emailId){

        const _db=getDB();
        const _coll=_db.collection("adminusers")

        return _coll.findOne({emailId:emailId})

    }

}

module.exports={Adminuser}