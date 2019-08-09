import moment from 'moment';
//import timezone from 'moment-timezone';
//import business from 'moment-business';

Meteor.methods({
  
  phaseBestGuess(uID, batchNum, tideStart, tideStop) {
    // try{
      const tStop = tideStop ? tideStop : new Date();
      const batch = BatchDB.findOne({ orgKey: Meteor.user().orgKey, batch: batchNum });
      const app = AppDB.findOne({ orgKey: Meteor.user().orgKey});
      
      const itemHistory = Array.from( batch.items, 
                              x => x.history.filter( y =>
                                y.time > tideStart && y.time < tStop &&
                                ( y.who === uID || 
                                ( y.type === 'first' && y.info.builder.includes(uID) ) ) ) );
      const historyFlat = [].concat(...itemHistory);
      const cronoHistory = historyFlat.sort((x1, x2)=> {
                            if (x1.time < x2.time) { return 1 }
                            if (x1.time > x2.time) { return -1 }
                            return 0;
                          });
      const latestKey = cronoHistory.length > 0 ?
        cronoHistory[0].key : null;
      const phasefromHistory = latestKey ? 
        latestKey === 'f1n15h1t3m5t3p' ? 'finish' :
        app.trackOption.find( x => x.key === latestKey ).phase : null;
      
      
      /*
      const inItems = batch.items.filter( x => x.history.find( y => 
        new Date(y.time) > new Date(tideStart) && 
        y.who === uID ) ? true : false );
      const inHistory = inItems.history
      
      
      const theItem
      const inBatchhistory = !inBhis ? false : true;
      
      const inBhisFb = batch.items.find( x => x.history.find( y => 
        new Date(y.time) > new Date(tideStart) && 
        ( y.type === 'first' && y.info.builder.includes(uID) ) ) ? true : false );
      const inBatchhistoryFirstbuilder = !inBhisFb ? false : true;
      */
      /*
      const inBncN = batch.nonCon.find({ 
        'nonCon.time': {"$gte": new Date( isoDate )},
        'nonCon.who': uID
      }).fetch();
      const inBatchnonconNew = inBncN.length > 0 ? true : false;
      
      const inBncF = batch.find({ 
        'nonCon.fix.time': {"$gte": new Date( isoDate )},
        'nonCon.fix.who': uID
      });
      const inBatchnonconFix = inBncF.length > 0 ? true : false;
      
      const inBncI = batch.find({ 
        'nonCon.inspect.time': {"$gte": new Date( isoDate )},
        'nonCon.inspect.who': uID
      }).fetch();
      const inBatchnonconInspect = inBncI.length > 0 ? true : false;
      */
      if(phasefromHistory) {
        return [ 'fromHistory', phasefromHistory ];
      }else{
        return false;
      }
        //inBatchnonconNew, 
        //inBatchnonconFix, 
        // inBatchnonconInspect 

    // }catch(err) {
    //   throw new Meteor.Error(err);
    // }
  }
  
  
  /*
  
  phaseVaugeGuess(uID, tideStart) {
    // try{ // DOES WORK but is very broad, we can do better
      const isoDate = tideStart.toString();
      
      const inBhis = BatchDB.find({ 
        orgKey: Meteor.user().orgKey, 
        'items.history.time': {"$gte": new Date( isoDate )},
        'items.history.who': uID
      }).fetch();
      const inBatchhistory = inBhis.length > 0 ? true : false;
      
      const inBhisFb = BatchDB.find({ 
        orgKey: Meteor.user().orgKey, 
        'items.history.time': {"$gte": new Date( isoDate )},
        'items.history.info.builder': uID
      }).fetch();
      const inBatchhistoryFirstbuilder = inBhisFb.length > 0 ? true : false;
      
      const inBncN = BatchDB.find({ 
        orgKey: Meteor.user().orgKey, 
        'nonCon.time': {"$gte": new Date( isoDate )},
        'nonCon.who': uID
      }).fetch();
      const inBatchnonconNew = inBncN.length > 0 ? true : false;
      
      const inBncF = BatchDB.find({ 
        orgKey: Meteor.user().orgKey, 
        'nonCon.fix.time': {"$gte": new Date( isoDate )},
        'nonCon.fix.who': uID
      }).fetch();
      const inBatchnonconFix = inBncF.length > 0 ? true : false;
      
      const inBncI = BatchDB.find({ 
        orgKey: Meteor.user().orgKey, 
        'nonCon.inspect.time': {"$gte": new Date( isoDate )},
        'nonCon.inspect.who': uID
      }).fetch();
      const inBatchnonconInspect = inBncI.length > 0 ? true : false;
      
      return { 
        inBatchhistory, 
        inBatchhistoryFirstbuilder, 
        inBatchnonconNew, 
        inBatchnonconFix, 
        inBatchnonconInspect 
      };
    // }catch(err) {
    //   throw new Meteor.Error(err);
    // }
  }
  
  */
  
  
});