const express = require('express')
const app = express()
const port = process.env.PORT || 3000
app.use(express.json());

const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://ShajuMongodbClient:rec123@cluster0.hgqm9.mongodb.net/vishnu2021?retryWrites=true&w=majority'
const Mainclient = new MongoClient(uri);



async function main() {

  try {
    // Connect to the MongoDB cluster
    await Mainclient.connect();

    // Make the appropriate DB calls
    await listDatabases(Mainclient);

    // await  getMasterData(client);

  } catch (e) {
    console.error(e);
  } finally {
    await Mainclient.close();
  }
}

main().catch(console.error);

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});


app.get('/invoices', (req, res) => {

  getMasterData(Mainclient).then((result) => {

    if (result) {
      res.send(result)
    }
    else {

    }
    res.send(`No listings found `);

  })


})

app.post('/addInvoice', (req, res) => {

  let { id, client, isPayd, date, total, items, discounts, tax } = req.body

  if (!client) {
    res.send("Error. Client is missing")
  }
  else if (items.length == 0) {
    res.send("Error. No items in the invoice")
  }
  else {

    addInvoice(Mainclient, req.body).then((respo) => {

      res.send(respo)

    })



  }

})


app.post('/clients', (req, res) => {

  let { name, address } = req.body

  if (name && address) {

    addClient(Mainclient, req.body).then((response) => {

      res.send(response)
    })

  }
  else {
    res.send("Missing name or address")
  }


})

app.get('/clients', (req, res) => {

  listClients(Mainclient).then((response) => {

    res.send(response)

  })

})







async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();
  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};


async function getMasterData(client) {

  await client.connect();

  const result = await client.db("vishnu2021").collection("invoices").find({}).toArray()
  if (result) {

    console.log(result);
    return (result)



  } else {
    console.log(`No listings found `);
  }
}

async function addInvoice(client, data) {

  await client.connect();

  let dbo = client.db("vishnu2021")

  let result = await dbo.collection("invoices").insertOne(data, function (err, respo) {
    if (err) throw err;
    console.log("1 document inserted");

    return respo

  });

  return result

}

async function addClient(client, data) {

  await client.connect();
  let dbo = client.db("vishnu2021")

  let result = await dbo.collection("clients").insertOne(data, function (err, respo) {
    if (err) throw err;

    console.log("1 client added");

    return respo

  });

  return result

}

let listClients = async (client) => {

  await client.connect();

  const result = await client.db("vishnu2021").collection("clients").find({}).toArray()
  if (result) {

    console.log(result);
    return (result)

  } else {
    console.log(`No listings found `);
  }

}






app.listen(process.env.PORT || 3000, function () {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});


