import moment from 'moment';
import 'moment-timezone';

import { countNewBatch } from './rateStatsOps.js';
import { countDoneBatch } from './rateStatsOps.js';
import { countNewItem } from './rateStatsOps.js';
import { countDoneItem } from './rateStatsOps.js';
import { countNewNC } from './rateStatsOps.js';
import { countNewSH } from './rateStatsOps.js';
import { countScrap } from './rateStatsOps.js';
import { itemsWithPromise } from './statOps.js';
import { countNewGroup } from './rateStatsOps.js';
import { countNewWidget } from './rateStatsOps.js';
import { countNewVariant } from './rateStatsOps.js';
import { countNewUser } from './rateStatsOps.js';
import { totalTideTimePromise } from './statOps.js';


const promiser = (counter, accessKey, rangeStart, rangeEnd)=> {
  return new Promise(function(resolve) {
    const fetch = counter(accessKey, rangeStart, rangeEnd);
    resolve(fetch);
  });
};


Meteor.methods({
  
  
  reportOnMonth(clientTZ, dateString) {
    const accessKey = Meteor.user().orgKey;
    const requestLocal = moment.tz(dateString, clientTZ);
      
    const rangeStart = requestLocal.clone().startOf('month').toISOString();
    const rangeEnd = requestLocal.clone().endOf('month').toISOString();
      
      // console.log(requestLocal);
      
    async function analyzeMonth() {
      try {
        newBatch = await promiser(countNewBatch, accessKey, rangeStart, rangeEnd);
        doneBatches = await promiser(countDoneBatch, accessKey, rangeStart, rangeEnd);
        let doneBatchOnTime = doneBatches[0];
        let doneBatchLate = doneBatches[1];
        newItem = await promiser(countNewItem, accessKey, rangeStart, rangeEnd);
        doneItem = await promiser(countDoneItem, accessKey, rangeStart, rangeEnd);
        noncon = await promiser(countNewNC, accessKey, rangeStart, rangeEnd);
        shortfall = await promiser(countNewSH, accessKey, rangeStart, rangeEnd);
        scrap = await promiser(countScrap, accessKey, rangeStart, rangeEnd);
        
        itemTestPass = await itemsWithPromise(accessKey, rangeStart, rangeEnd, 'test');
        newGroup = await promiser(countNewGroup, accessKey, rangeStart, rangeEnd);
        newWidget = await promiser(countNewWidget, accessKey, rangeStart, rangeEnd);
        newVariant = await promiser(countNewVariant, accessKey, rangeStart, rangeEnd);
        newUser = await promiser(countNewUser, accessKey, rangeStart, rangeEnd);
        
        totalTideTime = await totalTideTimePromise(accessKey, rangeStart, rangeEnd);
        let tttMinutes = Math.round(totalTideTime);
        let tttHours = moment.duration(totalTideTime, "minutes").asHours().toFixed(2, 10);
          
          
        return {
          newBatch, doneBatchOnTime, doneBatchLate,
          newItem, doneItem, 
          noncon, shortfall, scrap, itemTestPass,
          newGroup, newWidget, newVariant, newUser,
          tttMinutes, tttHours
        };
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    return analyzeMonth();

  }
  
  
  
  
  
})