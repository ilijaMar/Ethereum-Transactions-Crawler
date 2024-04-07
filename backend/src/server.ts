import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import bodyParser from 'body-parser'
import TransactionRouter from './routers/transaction.routes';

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/tracelabs');
const connection=mongoose.connection;
connection.once('open',()=>{
    console.log('db connection ok');
})


const router =express.Router();
app.use('/trans',TransactionRouter);
app.use('/',router);
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(4000, () => console.log(`Express server running on port 4000`));