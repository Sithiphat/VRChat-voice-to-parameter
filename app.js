const character =require ('./hexReaper.js')
const express= require ('express')
const app = express()
const port = 3000;
const osc= require('osc');
const cors = require('cors');
const bodyParser = require('body-parser')
const open = require('open');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

let vrchatOSC = new osc.UDPPort({
    remoteAddress:"localhost",
    remotePort:9000,
    metadat:true
});

vrchatOSC.open();
open('index.html');

let wordMap =character;

app.get('/word/:word',(req,res)=>{
    
    let str = req.params.word.split(" ");
    for ( word of str){
        word = word.toLowerCase() ;

        if(wordMap.hasOwnProperty(word)){

            console.log('change paramiters '+wordMap[word].path+ ' to '+wordMap[word].value);
            console.log({
                address: "/avatar/parameters/"+wordMap[word].path ,
                args:
                    {
                        type:  wordMap[word].type,
                        value: wordMap[word].value
                    }

            })

            vrchatOSC.send({
                address: "/avatar/parameters/"+wordMap[word].path ,
                args:
                    {
                        type:  wordMap[word].type,
                        value: wordMap[word].value
                    }

            })

        }

    }

    res.status(200).send(str);
})

app.listen(port,()=>{
    console.log('Server started');
})