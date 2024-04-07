import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient) { }


  crawl(walletId,startingBlock,endingBlock,flag){
    const data={
      walletId:walletId,
      startingBlock:startingBlock,
      endingBlock:endingBlock,
      flag:flag
    }
    return this.http.post('http://localhost:4000/trans/crawl',data);
  }

  balance(walletId,givenDate){
    const data={
      walletId:walletId,
      givenDate:givenDate,
      
    }
    return this.http.post('http://localhost:4000/trans/balance',data);
  }
}
