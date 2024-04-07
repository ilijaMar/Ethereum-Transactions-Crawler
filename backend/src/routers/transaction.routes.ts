import express from 'express';
import { TransactionController } from '../controllers/transaction.controler';


const TransactionRouter=express.Router();


TransactionRouter.route('/crawl').post(
    (req,res)=>new TransactionController().crawl(req,res)
)

TransactionRouter.route('/balance').post(
    (req,res)=>new TransactionController().balance(req,res)
)





















export default TransactionRouter;