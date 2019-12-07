const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');

const app = express();
const uri = "mongodb+srv://deepak:test123@gql-ninja-l5jmm.mongodb.net/test?retryWrites=true&w=majority";
const serverOptions = {
    poolSize: 100,
    socketOptions: {
      socketTimeoutMS: 6000000
    }
  };


const options = {
    // https://mongoosejs.com/docs/deprecations.html
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // reconnectTries: 30,
    // reconnectInterval: 500, // in ms
}

mongoose.Promise = global.Promise;

mongoose.connect(uri, options);
mongoose.connection.once('open', ()=>{
    console.log('connected to database');
})


// const MongoClient = require('mongodb').MongoClient;
// const client = new MongoClient(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     server: serverOptions,
// });

// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   console.log(err);
//   // perform actions on the collection object
//   client.close();
// });

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}));

app.listen(4000, ()=>{
    console.log('now listening for requests on port 4000');
});