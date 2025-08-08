import cron from 'node-cron'
import {autoCompleteShifts} from './autoComplete.js'

cron.schedule('0 * * * *',()=>{
    autoCompleteShifts();
}) // happens every hour