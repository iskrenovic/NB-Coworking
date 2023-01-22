const express = require('express');
const cors = require('cors');
const neo4j = require('./config/neo4j_config');
const redis = require('./config/ws.config')


const user = require('./routes/user');
const equipment = require('./routes/equipment');
const place = require('./routes/place');
const reservation = require('./routes/reservation');
const room = require('./routes/room');
const space = require('./routes/space');
const login = require('./routes/login');
const register = require('./routes/register')

neo4j.withDirectory(__dirname + '/models')

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cors());

app.use('/api/equipment',equipment);
app.use('/api/place',place);
app.use('/api/reservation',reservation);
app.use('/api/room',room);
app.use('/api/space',space);
app.use('/api/login',login); 
app.use('/api/register',register)
//app.use('/api/category',category)
app.use('/api/user',user);// da ne bi smo mogli da kreiramo praznog usera jer je on kao abstraktna klasa 



/*koristiti neku od ovih funkcija samo kad je potrebno izmeniti schemu, u ostalim situacijama nema potrebe*/
/*sluzi za instaliranje scheme definisane modelima na bazu u cloud-u*/
// neo4j.schema.install().then(() => console.log('Schema installed!'))

/*sluzi da ocisti celu bazu zajedno sa cvorovima, ne radi bas uvek*/
// neo4j.schema.drop().then(() => console.log('Schema dropped!'))


app.listen(5000,() => {
    console.log('Server is listening on port 5000...');
});