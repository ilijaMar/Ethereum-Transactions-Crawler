import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from '../services/transaction.service';
import { Transaction } from '../modules/transaction';
@Component({
  selector: 'app-input-data',
  templateUrl: './input-data.component.html',
  styleUrls: ['./input-data.component.css']
})
export class InputDataComponent {

  constructor(private http: HttpClient, private TransactionService:TransactionService) { }

  //#region members
  walletId:string='';
  transactions: Transaction[] = [];
  startingBlock:string;
  flag:number=0;
  endingBlock:string;
  givenDate:string;
  walletBalance:string;
  //#endregion
  //#region validation
  validationStartingBlock(){
    if (this.startingBlock || this.startingBlock=='0') {
      let startingBlockString;
      let startingBlockNumber;
      startingBlockString = this.startingBlock.toString().trim();
      startingBlockNumber = parseInt(startingBlockString, 10);
      if (isNaN(startingBlockNumber) || startingBlockNumber < 0) {
          alert('Starting block is invalid. Please enter a valid number without leading or trailing white spaces.');
          return false; 
      }
    }
    else if(!this.startingBlock){
      alert('You need to enter a starting block');
      return false; 
    }
    return true;
  }
  validationDate(){
    if (this.givenDate) {
      const selectedDate = new Date(this.givenDate);
      const today = new Date();
      if (selectedDate > today) {
          alert('Please select a date before today.');
          return false; 
      }
    }
    else if(!this.givenDate){
      alert('You need to enter a date'); return false;
    }
    return true;
  }
  //#endregion
  //#region logic

  transactionsByWalletAndBlokc(){
    if (this.transactions.length > 0) {
      const maxBlockNumber = Math.min(...this.transactions.map(transaction => parseInt(transaction.blockNumber, 10)));
      this.endingBlock = (maxBlockNumber - 1).toString();
    }
    this.TransactionService.crawl(this.walletId, this.startingBlock,this.endingBlock,this.flag).subscribe(
      (data: Transaction[]) => {
        
        if (this.transactions.length == 0) {
          this.transactions = data;
        } else {
          this.transactions = this.transactions.concat(data);
        }
        console.log(this.transactions);
      },
      (error) => {
        if (error.status === 500) {
          alert('Invalid wallet id');
        } else {
            console.error(error); 
        }
      }
      
    );
  }

  walledBalanceOnDate(){
    this.TransactionService.balance(this.walletId, this.givenDate).subscribe(
      (data: string) => {
        this.walletBalance=data;
        console.log(this.transactions);
      },
      (error) => {
        if (error.status === 500) {
          alert('Invalid wallet id');
        } else {
            console.error(error); 
        }
      }
      
    );
  }
  //#endregion
  
  
  loadTransactions(){
    let valid=this.validationStartingBlock();
    if(!valid) return;
    this.transactionsByWalletAndBlokc();
    this.flag=1;
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }, 900);
  }

  loadBalance(){
    let valid=this.validationDate();
    if(!valid) return;
    this.walledBalanceOnDate();
  }
  
 
  
}
