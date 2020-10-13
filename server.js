
// libs 
const express= require("express")
const JWT= require("jsonwebtoken")
const Cors= require("cors")
const joi= require("@hapi/joi")
const wordCount = require("word-character-count");
const path = require('path')
require('dotenv').config();
const Justify = require("./index")
var fs = require('fs')
const app = express()

const port = process.env.PORT || 3000

const pivateRouter  =  express.Router()
const publicRouter  =  express.Router()



const SECRET = process.env.SECRET
let limitword = 80000 ;
let count_words_per_token= new Map()

//midlewares
app.use(Cors())
app.use( express.json(), express.text())
const JWT_midleware = (req,res,next)=>{     
    

    let token = req.query.token

    const schema = joi.object({ //validate token's schema
        token  : joi.string().required()
    })
    if(!schema.validate({token}).error){
        console.log(token)
       JWT.verify(token,SECRET,async (err, verifiedJwt) => {  //verify to validity for the api security
            if(err)
                res.status(400).send("Bad Request!!")//bad Request for inverified token 
            if(!count_words_per_token.has(token))
                count_words_per_token.set(token,0) //initialize number of word for the new token
            req.token= token //pas the token to next midleware
            next()
        })
        
        
    }else res.status(401).send("unauthorized !!!") //unauthorized route for invalide token schema
}
//midleware to for a valide content type
const content_type_midleware =(req,res,next)=>{
    if(req.headers["content-type"] !== "text/plain") //content-type must be text/plain
        res.status(400).send("Bad Request!!")
    next()
}
//midleware to check for the number of word is passed the limit for a given token
const limit_word_midleware = async(req,res,next)=>{
    let result = await wordCount.WordCount(req.body)
    let BodyWordCount = result.WordCount  //count the number of word
    const token = req.token 
    req.countWord= BodyWordCount //passe number of word for the next midleware
    if(limitword-count_words_per_token.get(token) >= BodyWordCount) // check weither the number of word is passed the limit for a given token
        next()
    else res.status(402).send("Payment Required!!!")
}
//justify text
pivateRouter.post('/api/Justify',content_type_midleware,JWT_midleware,limit_word_midleware, async (req, res)=>{
    
    
    const justifiedText = Justify(req.body) //justify
    const token = req.token
    const wordCount = req.countWord
    count_words_per_token.set(token ,count_words_per_token.get(token)+wordCount)
    
    fs.writeFile(token+".txt", justifiedText, function(err) { //put theresult into a file
        if(err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
    
    res.sendFile(path.resolve(token+".txt"))
    //res.send(justifiedText)  //send the justified text
})
publicRouter.route('/api/token').post( async (req, res)=>{
    
    const email = req.body.email
    const scheme = joi.object({
        email:joi.string().email().required()
    })
    if(scheme.validate({email}).error)
        res.status(400 ).send("Bad Request!!")
    console.log(SECRET)
    const token = JWT.sign( {email},process.env.SECRET)
    if(!count_words_per_token.has(token))
        count_words_per_token.set(token,0)
    res.json({token}) 
})
app.use(pivateRouter)
app.use(publicRouter)
app.get('/',(req,res)=>{
    res.send("api lives!!")
})
app.listen(port,()=>{
    console.log('connected to port '+port)
})
