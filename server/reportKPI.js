import moment from 'moment';
import 'moment-timezone';
import Config from '/server/hardConfig.js';

import { 
  countNewBatch, 
  countDoneBatch,
  countNewItem,
  countDoneItem,
  countNewGroup,
  countNewWidget,
  countNewVariant,
  countNewUser
  
} from './rateStatsOps.js';

import { totalTideTimePromise } from './statOps.js';


const promiser = (counter, accessKey, rangeStart, rangeEnd)=> {
  return new Promise(function(resolve) {
    const fetch = counter(accessKey, rangeStart, rangeEnd);
    resolve(fetch);
  });
};


Meteor.methods({
  
  
  reportOnMonth(startDay, endDay) {
    const accessKey = Meteor.user().orgKey;
    
    const rangeStart = moment(startDay).tz(Config.clientTZ).startOf('day').toISOString();
    const rangeEnd = moment(endDay).tz(Config.clientTZ).endOf('day').toISOString();
    
    async function analyzeMonth() {
      try {
        newBatch = await promiser(countNewBatch, accessKey, rangeStart, rangeEnd);
        doneBatches = await promiser(countDoneBatch, accessKey, rangeStart, rangeEnd);
        let doneBatchOnTime = doneBatches[0];
        let doneBatchLate = doneBatches[1];
        newItem = await promiser(countNewItem, accessKey, rangeStart, rangeEnd);
        doneItem = await promiser(countDoneItem, accessKey, rangeStart, rangeEnd);
        newGroup = await promiser(countNewGroup, accessKey, rangeStart, rangeEnd);
        newWidget = await promiser(countNewWidget, accessKey, rangeStart, rangeEnd);
        newVariant = await promiser(countNewVariant, accessKey, rangeStart, rangeEnd);
        newUser = await promiser(countNewUser, accessKey, rangeStart, rangeEnd);
        
        totalTideTime = await totalTideTimePromise(accessKey, rangeStart, rangeEnd);
        let tttMinutes = Math.round(totalTideTime);
        let tttHours = moment.duration(totalTideTime, "minutes").asHours().toFixed(2, 10);
          
          
        return JSON.stringify({
          newBatch, doneBatchOnTime, doneBatchLate,
          newItem, doneItem, 
          newGroup, newWidget, newVariant, newUser,
          tttMinutes, tttHours
        });
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    return analyzeMonth();

  }
  
})