import mongoose from 'mongoose'


const Schema=mongoose.Schema;

const Transaction = new Schema({
    hash: {
      type: String
    },
    blockNumber: {
      type: String
    },
    timeStamp: {
      type: String
    },
    from: {
      type: String
    },
    to: {
      type: String
    },
    value: {
      type: String
    }
  })

export default mongoose.model('Transaction',Transaction,'transactions');