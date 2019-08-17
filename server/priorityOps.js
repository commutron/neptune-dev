import moment from 'moment';
import 'moment-business-time';
import 'moment-timezone';

moment.updateLocale('en', {
  workinghours: {
      0: null,
      1: ['09:30:00', '17:00:00'],
      2: ['09:30:00', '17:00:00'],
      3: ['09:30:00', '13:00:00'],
      4: ['09:30:00', '17:00:00'],
      5: ['09:30:00', '20:00:00'],
      6: null
  }
});

function unitTotalCount(items) {
  let totalUnits = 0;
  for(let i of items) {
    totalUnits += i.units;
  }
  return totalUnits;
}

function versionQuoteTime(version, totalUnits) {
  
  const qtReady = version.quoteTimeBasline && version.quoteTimeScale;
  
  if(!qtReady) {
    return undefined;
  }else{
    const tU = !totalUnits ? 0 : totalUnits;
  
    const qTB = version.quoteTimeBasline.length > 0 ? 
                version.quoteTimeBasline[0].timeAsMinutes : 0;
    const qTS = version.quoteTimeScale.length > 0 ? 
                version.quoteTimeScale[0].timeAsMinutes : 0;
    const qTBS = qTB + ( qTS * tU );
    if( !qTBS || typeof qTBS !== 'number' || qTBS === 0 ) {
      return false;
    }else{
      return qTBS;
    }
  }
}

function batchTideTime(batchTide) {
    
  if(!batchTide) {
    return undefined;
  }else{
    let tideTime = 0;
    for(let bl of batchTide) {
      const mStart = moment(bl.startTime);
      const mStop = !bl.stopTime ? moment() : moment(bl.stopTime);
      const block = moment.duration(mStop.diff(mStart)).asMinutes();
      tideTime = tideTime + block;
    }
    //console.log(tideTime);
    if( !tideTime || typeof tideTime !== 'number' ) {
      return false;
    }else{
      return tideTime.toFixed(2, 10);
    }
  }
}


Meteor.methods({
  
  getDistanceFromFulfill(batchNum, clientTZ) {
    // try{
      // const app = AppDB.findOne({ orgKey: Meteor.user().orgKey});
      const nowClient = moment().tz(clientTZ);
      const nCnice = nowClient.format();
      const nCworking = nowClient.isWorkingTime();
      
      const nowServer = moment();
      const nSnice = nowServer.format();
      const nSworking = nowServer.isWorkingTime();
      
      const batch = batchNum && BatchDB.findOne({ orgKey: Meteor.user().orgKey, batch: batchNum });
      const widget = batch && WidgetDB.findOne({ orgKey: Meteor.user().orgKey, _id: batch.widgetId});
      const version = widget && widget.versions.find( x => x.versionKey === batch.versionKey );
      
      if( !batch || !widget || !version ) {
        return false;
      }else{
        const totalUnits = unitTotalCount(batch.items);
        
        const totalQuoteMinutes = versionQuoteTime(version, totalUnits);
        
        const totalTideMinutes = batchTideTime(batch.tide);
        
        const remainingQuoteTime = totalQuoteMinutes - totalTideMinutes;
        
        //const bufferNice = Math.abs(quote2tide);
        
        /*
        console.log({
          totalQuoteMinutes,
          totalTideMinutes,
          remainingQuoteTime
        });
        */
        
        const fulfillC = moment(batch.end).tz(clientTZ); //minus ship days correct
        const workTimeToShipC = fulfillC.workingDiff(nowClient, 'minutes');
        
        const fulfillS = moment(batch.end); //minus ship days correct
        const workTimeToShipS = fulfillS.workingDiff(nowServer, 'minutes');

    
    
        return { 
          remainingQuoteTime, 
          nCnice, 
          nCworking, 
          nSnice, 
          nSworking,
          workTimeToShipC,
          workTimeToShipS
        };
      }
      
    // }catch(err) {
    //   throw new Meteor.Error(err);
    // }
  }
  
});
  
  
  