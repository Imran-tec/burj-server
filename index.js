const express = require('express')
const port = 5000
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()



var admin = require("firebase-admin");

var serviceAccount = require("./burj-al-arab-aa1e1-firebase-adminsdk-u33op-68ff6c21c8.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://burj-al-arab-aa1e1.firebaseio.com"
});


const app = express()

app.use(bodyParser.json())
app.use(cors())







app.get('/',(req,res) => {
    res.send('hello world')
})




const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.0jhuw.mongodb.net/burjAlArab?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true,  useUnifiedTopology: true });

client.connect(err => {
  const collection = client.db("burjAlArab").collection("booking");
console.log('db connection success')
  
app.post('/addBooking', (req,res) => {
    const newBooking = req.body;
  collection.insertOne(newBooking)
  .then(result => {
      res.send(result.insertedCount > 0) 
  })
});

app.get('/booking', (req,res) => {
const bearer = req.headers.authorization;
    if(bearer && bearer.startsWith('Bearer')){
        const idToken = bearer.split(' ')[1];
        console.log({idToken})
        admin.auth().verifyIdToken(idToken)
        .then(function(decodedToken) {
          const tokenEmail = decodedToken.email;
          const queryEmail = req.query.email;
          
          if(tokenEmail == queryEmail){
            collection.find({email: queryEmail})
            .toArray((err, documents) => {
                res.send(documents);
            })
          }
       
        }).catch(function(error) {
          // Handle error
        });
    }
    else{
      res.status().res.send('unauthorization')
    }
    
   


   
   
})


});





app.listen(process.env.PORT || port)