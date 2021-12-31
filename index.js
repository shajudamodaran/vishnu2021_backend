const express = require('express')
const app = express()
const port = process.env.PORT || 3000
app.use(express.json());

const {MongoClient} = require('mongodb');

const uri = 'mongodb+srv://ShajuMongodbClient:rec123@cluster0.hgqm9.mongodb.net/vishnu2021?retryWrites=true&w=majority'
const client = new MongoClient(uri);



async function main(){

  try {
      // Connect to the MongoDB cluster
      await client.connect();

      // Make the appropriate DB calls
      await  listDatabases(client);

      await  getMasterData(client);

  } catch (e) {
      console.error(e);
  } finally {
      await client.close();
  }
}

main().catch(console.error);


app.get('/invoices', (req, res) => {

    getMasterData(client).then((result)=>{
 
     if(result)
     {
       res.send(result)
     }
     else{
 
     }
     res.send(`No listings found `);
 
    })
  
 
 })
 



async function listDatabases(client)
{
  databasesList = await client.db().admin().listDatabases();
  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};


async function getMasterData(client) {

    await client.connect();
    
    const result = await client.db("vishnu2021").collection("invoices").find({}).toArray()
    if (result) 
    {

        console.log(result[0]);
       return(result[0])



    } else 
    {
        console.log(`No listings found `);
    }
  }
  





app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
  

