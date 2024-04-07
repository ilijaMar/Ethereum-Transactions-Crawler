
import * as express from 'express'
import Transaction from '../models/transaction'
import Web3 from 'web3';
interface RawTransaction {
    hash: string;
    blockNumber: string;
    timeStamp: string;
    from: string;
    to: string;
    value: string;
}
export class TransactionController{
    crawl=async (req:express.Request,res:express.Response)=>{
        let walletId=req.body.walletId;
        let startingBlock=req.body.startingBlock;
        let endingBlock=req.body.endingBlock;
        let flag=req.body.flag;
        
        let isAddress=Web3.utils.isAddress(walletId);
        if(!isAddress){
            console.log("Invalid wallet id");
            return res.status(500).json({ message: 'Invalid wallted id' });
        }

        let apiUrl='';
        if(flag==0)
            apiUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${walletId}&startblock=${startingBlock}&endblock=99999999&page=1&offset=10&sort=desc&apikey=E5DU441VDRSFPQ8XUQRY1ARSA5ZGWMZMGI`;
        else
            apiUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${walletId}&startblock=${startingBlock}&endblock=${endingBlock}&page=1&offset=10&sort=desc&apikey=E5DU441VDRSFPQ8XUQRY1ARSA5ZGWMZMGI`;
        
        // Fetch transactions from the API
        const response = await fetch(apiUrl);
        const data = await response.json();
       
        let transactions = data.result;
        transactions = transactions.map((transaction: RawTransaction) => new Transaction({
            hash: transaction.hash,
            blockNumber: transaction.blockNumber,
            timeStamp: new Date(parseInt((transaction.timeStamp), 10) * 1000).toLocaleString(),
            from: transaction.from,
            to: transaction.to,
            value: transaction.value
        }));
        
        
        return res.json(transactions);
        
    }

    balance=async (req:express.Request,res:express.Response)=>{
        let walletId=req.body.walletId;
        let isAddress=Web3.utils.isAddress(walletId);
        let givenDate=new Date(req.body.givenDate);
        let timeStamp = Math.floor(givenDate.getTime() / 1000);

        if(!isAddress){
            console.log("Invalid wallet id");
            return res.status(500).json({ message: 'Invalid wallted id' });
        }
        let apiUrl = `https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=${timeStamp}&closest=before&apikey=E5DU441VDRSFPQ8XUQRY1ARSA5ZGWMZMGI`;

        const response = await fetch(apiUrl);
        const blockResponse  = await response.json();
        const blockNumber = blockResponse.result;
        
        const web3 = new Web3('https://mainnet.infura.io/v3/029d8d9530224e278e5e190f935cb6f0');
            
        let balance = await web3.eth.getBalance(walletId, blockNumber);
        let balanceToWei=Web3.utils.fromWei(balance, "ether");
       
        return res.json(balanceToWei);
    }

}