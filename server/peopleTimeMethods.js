import moment from 'moment';
//import timezone from 'moment-timezone';
//import business from 'moment-business';

Meteor.methods({
  
  phaseBestGuess(uID, batchNum, tideStart, tideStop) {
    try{
      const tStop = tideStop ? tideStop : new Date();
      const batch = BatchDB.findOne({ orgKey: Meteor.user().orgKey, batch: batchNum });
      const app = AppDB.findOne({ orgKey: Meteor.user().orgKey});
      const phaseDB = [...app.trackOption, app.lastTrack];
      
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
      const phasefromHistory = cronoHistory.length > 0 ?
        phaseDB.find( x => x.key === cronoHistory[0].key ) : null;
      const historyPhase = phasefromHistory ? phasefromHistory.phase : null;
      
      
      const inBncN = batch.nonCon.filter( x =>
        x.time > tideStart && x.time < tStop && x.who === uID );
      const cronoNC = inBncN.sort((x1, x2)=> {
                            if (x1.time < x2.time) { return 1 }
                            if (x1.time > x2.time) { return -1 }
                            return 0;
                          });
      const phasefromNC = cronoNC.length > 0 ?
        phaseDB.find( x => x.phase === cronoNC[0].where ) : null;
      const ncPhase = phasefromNC ? phasefromNC.phase : null;
      
      /*
      const inBncF = batch.filter( x =>
        x.fix !== false && x.fix.time > tideStart && x.fix.time < tStop && x.fix.who === uID );
      
      const inBncI = batch.filter( x =>
        x.inspect !== false && x.inspect.time > tideStart && x.inspect.time < tStop && x.inspect.who === uID );
      
      const anyNC = [...inBncN, inBncF, inBncI ] 
      console.log(anyNC);
      */
      
      if(phasefromHistory) {
        return [ 'fromHistory', historyPhase ];
      }else if(phasefromNC) {
        return [ 'fromNC', ncPhase ];
      }else{
        return false;
      }
    }catch(err) {
      throw new Meteor.Error(err);
    }
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
  
  
  /// Given history flat -> outputs step keys with quantity of each ///
  /*
    const stepsArr = Array.from(historyFlat, st => st.key );
      
    const stepsReduced = stepsArr.reduce( (allSteps, step)=> { 
      step in allSteps ? allSteps[step]++ : allSteps[step] = 1;
      return allSteps;
    }, {});
  
    const stepQu = Object.entries(stepsReduced)
      .reduce( (result, val)=> {
        result.push( { ph: val[0], qu: val[1] } );
        return result;
      }, []);
      
    console.log(stepQu);
  */
  ///////////////////////////////////////////////////////////////
  
});