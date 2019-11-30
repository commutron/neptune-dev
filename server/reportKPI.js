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
import { newGroupPromise } from './statOps.js';
import { newWidgetPromise } from './statOps.js';
import { newVersionPromise } from './statOps.js';
import { newUserPromise } from './statOps.js';
import { totalTideTimePromise } from './statOps.js';

const newBatchPromise = (accessKey, rangeStart, rangeEnd)=> {
  return new Promise(function(resolve, reject) {
    const fetch = countNewBatch(accessKey, rangeStart, rangeEnd);
    resolve(fetch);
  });
};

const doneBatchPromise = (accessKey, rangeStart, rangeEnd)=> {
  return new Promise(function(resolve, reject) {
    const fetch = countDoneBatch(accessKey, rangeStart, rangeEnd);
    resolve(fetch);
  });
};

const newItemPromise = (accessKey, rangeStart, rangeEnd)=> {
  return new Promise(function(resolve, reject) {
    const fetch = countNewItem(accessKey, rangeStart, rangeEnd);
    resolve(fetch);
  });
};

const doneItemPromise = (accessKey, rangeStart, rangeEnd)=> {
  return new Promise(function(resolve, reject) {
    const fetch = countDoneItem(accessKey, rangeStart, rangeEnd);
    resolve(fetch);
  });
};

const nonconPromise = (accessKey, rangeStart, rangeEnd)=> {
  return new Promise(function(resolve, reject) {
    const fetch = countNewNC(accessKey, rangeStart, rangeEnd);
    resolve(fetch);
  });
};

const shortfallPromise = (accessKey, rangeStart, rangeEnd)=> {
  return new Promise(function(resolve, reject) {
    const fetch = countNewSH(accessKey, rangeStart, rangeEnd);
    resolve(fetch);
  });
};


const scrapPromise = (accessKey, rangeStart, rangeEnd)=> {
  return new Promise(function(resolve, reject) {
    const fetch = countScrap(accessKey, rangeStart, rangeEnd);
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
      // try {
        newBatch = await newBatchPromise(accessKey, rangeStart, rangeEnd);
        doneBatches = await doneBatchPromise(accessKey, rangeStart, rangeEnd);
        let doneBatchOnTime = doneBatches[0];
        let doneBatchLate = doneBatches[1];
        newItem = await newItemPromise(accessKey, rangeStart, rangeEnd);
        doneItem = await doneItemPromise(accessKey, rangeStart, rangeEnd);
        noncon = await nonconPromise(accessKey, rangeStart, rangeEnd);
        shortfall = await shortfallPromise(accessKey, rangeStart, rangeEnd);
        scrap = await scrapPromise(accessKey, rangeStart, rangeEnd);
        
        itemTestPass = await itemsWithPromise(accessKey, rangeStart, rangeEnd, 'test');
        newGroup = await newGroupPromise(accessKey, rangeStart, rangeEnd);
        newWidget = await newWidgetPromise(accessKey, rangeStart, rangeEnd);
        newVersion = await newVersionPromise(accessKey, rangeStart, rangeEnd);
        newUser = await newUserPromise(accessKey, rangeStart, rangeEnd);
        
        totalTideTime = await totalTideTimePromise(accessKey, rangeStart, rangeEnd);
        let tttMinutes = Math.round(totalTideTime);
        let tttHours = moment.duration(totalTideTime, "minutes").asHours().toFixed(2, 10);
          
          
        return {
          newBatch, doneBatchOnTime, doneBatchLate,
          newItem, doneItem, 
          noncon, shortfall, scrap, itemTestPass,
          newGroup, newWidget, newVersion, newUser,
          tttMinutes, tttHours
        };
      // }catch (err) {
      //   throw new Meteor.Error(err);
      // }
    }
    return analyzeMonth();

  }
  
  
  
  
  
})