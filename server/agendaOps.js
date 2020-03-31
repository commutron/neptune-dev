import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time-ship';

import { batchTideTime } from './overviewMethods.js';

moment.updateLocale('en', {
  workinghours: {
      0: null,
      1: ['07:00:00', '16:30:00'],
      2: ['07:00:00', '16:30:00'],
      3: ['07:00:00', '16:30:00'],
      4: ['07:00:00', '16:30:00'],
      5: ['07:00:00', '12:00:00'],
      6: null
  },// including lunch breaks!
  shippinghours: {
      0: null,
      1: null,
      2: ['11:30:00', '11:30:00'],
      3: null,
      4: ['11:30:00', '11:30:00'],
      5: null,
      6: null
  }
  
  // holidays: [
  //       '2015-05-04'
  //   ]
});

function collectAgenda(privateKey, batchID, clientTZ, mockDay) {
  return new Promise(resolve => {
    let collection = false;
    const b = BatchDB.findOne({_id: batchID});
    const app = AppDB.findOne({orgKey: privateKey});
    const nonWorkDays = app.nonWorkDays;
    if( Array.isArray(nonWorkDays) ) {  
      moment.updateLocale('en', {
        holidays: nonWorkDays
      });
    }
    if(!b) {
      resolve(collection);
    }else{
      
      const qtBready = !b.quoteTimeBudget ? false : true;
      
      const now = moment().tz(clientTZ);
      const future = mockDay ? mockDay : b.end;
      const endDay = moment.tz(future, clientTZ);
      const lateLate = now.clone().isAfter(endDay);
      
      const shipTime = endDay.isShipDay() ? 
                        endDay.clone().nextShippingTime() : 
                        endDay.clone().lastShippingTime();
      
      if(qtBready) {
        const qtB = b.quoteTimeBudget.length > 0 ? 
                    b.quoteTimeBudget[0].timeAsMinutes : 0;
        
        const totalQuoteMinutes = qtB;
        if(totalQuoteMinutes) {
          const totalTideMinutes = batchTideTime(b.tide);
          
          const quote2tide = totalQuoteMinutes - totalTideMinutes;
          const overQuote = quote2tide < 0 ? true : false;
          const q2tNice = overQuote ? 0 : quote2tide;
          
          const estConclude = shipTime.clone().subtractWorkingTime(0, 'hours');
          const estCommence = estConclude.clone().subtractWorkingTime(q2tNice, 'minutes');
          
          const estSoonest = now.clone().addWorkingTime(q2tNice, 'minutes');
          
          const buffer = estCommence.workingDiff(now, 'minutes');
          
          const estEnd2fillBuffer = buffer || null;
          
          collection = {
            batch: b.batch,
            batchID: b._id,
            quote2tide: quote2tide,
            estSoonest: estSoonest.format(),
            commenceDT: estCommence.format(),
            concludeDT: estConclude.format(),
            estEnd2fillBuffer: estEnd2fillBuffer,
            shipTime: shipTime.format(),
            lateLate: lateLate
          };
        }
      }
      
      resolve(collection);
    }
  });
}


Meteor.methods({
  
  agendaOrder(batchID, clientTZ, serverAccessKey, mockDay) {
    async function bundlePriority() {
      const accessKey = serverAccessKey || Meteor.user().orgKey;
      try {
        bundle = await collectAgenda(accessKey, batchID, clientTZ, mockDay);
        return bundle;
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    return bundlePriority();
  },
  
  
  
  

  
});