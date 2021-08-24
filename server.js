'use strict';
const mongoose = require("mongoose");
const express = require('express')
const cors = require('cors');
require('dotenv').config();
const axios = require('axios'); 
const app = express()
app.use(cors())
app.use(express.json())
let PORT=process.env.PORT
mongoose.connect("mongodb://localhost:27017/flower", { useNewUrlParser: true });


app.get('/',(req,res)=>{
    res.send ('Hello World')
})

app.listen(PORT,()=>{
    console.log('iam listenting')
})


//----creat Aschema
const FlowerSchema = new mongoose.Schema({
    name: String,
    photo:String,
    instructions:String,

  });
  const UserSchema = new mongoose.Schema({
    email: String,
    flowers:[FlowerSchema],
    
  });


  const UserModel = mongoose.model('user', UserSchema);

//-------creat seed

function userSeed(){
    let bushra= new UserModel({
        email:'bushra.aljafari@gmail.com',
        flowers:[
            {
                name:'Azalea',
                photo:'https://www.miraclegro.com/sites/g/files/oydgjc111/files/styles/scotts_asset_image_720_440/public/asset_images/main_021417_MJB_IMG_2241_718x404.jpg?itok=pbCu-Pt3',
                instructions:'Large double. Good grower, heavy bloomer. Early to mid-season, acid loving plants. Plant in moist well drained soil with pH of 4.0-5.5.'

            },
            {
                name:'Tibouchina Semidecandra',
                photo:'https://upload.wikimedia.org/wikipedia/commons/b/bf/Flower_in_Horton_Plains_1.jpg',
                instructions:'Beautiful large royal purple flowers adorn attractive satiny green leaves that turn orange\\/red in cold weather. Grows to up to 18 feet, or prune annually to shorten.'

            }

        ]
    })

    let tamim= new UserModel({
        email:'tamim.hamoudi@gmail.com',
        flowers:[
            {
                name:'Bonsai Tree',
                photo:'https://www.bonsaiempire.com/images/02-Bougainvillea-bonsai-lorna-toledo.jpg',
                instructions:'They do not thrive indoors, where the light is too dim, and humidity too low, for them to grow properly.'

            }

        ]
    })
bushra.save();
tamim.save();

}
//userSeed()
///-------to get Api
class Flower{
    constructor(name,photo,instructions){
        this.name=name,
        this.photo=photo,
        this.instructions=instructions
    }
}

app.get('/allFlower', async(req,res)=>{
    let dataApi= await axios.get('https://flowers-api-13.herokuapp.com/getFlowers');
    let data=dataApi.data.map(flower=>{
        return new Flower (flower.name,flower.photo,flower.instructions);

    })
    res.status(200).send(data)
})


//-------CRUD for user by email

app.get('/getFlower/:email',getFlower)
app.post('/addFlower/:email',addFlower)
app.delete('/deleteFlower/:email',deleteFlower)
app.put('/updateFlower/:email',updateFlower)


//--get data
function getFlower(req,res){
    let userEmail=req.params.email;
    UserModel.find({email:userEmail},(err,data)=>{
        if(err){res.status(404).send(err)}
        else{ res.status(200).send(data[0].flowers)}
    })
}
// to creat anew flower
function addFlower(req,res){
    let userEmail=req.params.email;
    const{name,photo,instructions}=req.body;
    UserModel.find({email:userEmail},(err,data)=>{
        if(err){res.status(404).send(err)}
        else{ 
            data[0].flowers.push({
                name:name,
                photo:photo,
                instructions:instructions
            })
            data[0].save();
            
        }
    })
}
// to delete flower
function deleteFlower(req,res){
    let userEmail=req.params.email;
    let dataId=Number(req.query.id);
    UserModel.find({email:userEmail},(err,data)=>{
        if(err){res.status(404).send(err)}
        else{ 
         let filteredData=data[0].flowers.filter((flower,id)=>{
             if(id!==userEmail){return flower}
             
         })
           data[0].flowers =filteredData;
            data[0].save();
            res.status(200).send(data[0].flowers);
        }
    })
}
// to update flower
function updateFlower(req,res){
    let userEmail=req.params.email;
    let dataId=Number(req.query.id);
    UserModel.find({email:userEmail},(err,data)=>{
        if(err){res.status(404).send(err)}
        else{ 
            data[0].flowers.splice(dataId,1,{
                name:name,
                photo:photo,
                instructions:instructions
            })
            res.status(200).send(data[0].flowers);
        }
    })
}

