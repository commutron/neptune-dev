import moment from 'moment';
import business from 'moment-business';
import 'moment-timezone';
import 'moment-business-time';

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
});

//const now = moment().tz(clientTZ);
//const isNow = (t)=>{ return ( now.isSame(moment(t), 'day') ) };

export function batchTideTime(batchTide) {
    
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

function collectPhaseCondition(privateKey, batchID) {
  return new Promise(resolve => {
    let collection = false;
    const app = AppDB.findOne({orgKey: privateKey});
    const batchX = XBatchDB.findOne({_id: batchID});
    const batch = BatchDB.findOne({_id: batchID});
    if(batchX) {
      const quantity = batchX.quantity;
      const waterfall = batchX.waterfall;
      const released = batchX.releases.findIndex( x => x.type === 'floorRelease') >= 0;
      let previous = released;
      
      let progSteps = waterfall;
      progSteps.map( (step, index)=> {
        if(!previous) {
          progSteps[index].condition = 'onHold';
        }else{
          
          const wfCount = step.counts.length === 0 ? 0 :
            Array.from(step.counts, x => x.tick).reduce((x,y)=> x + y);
          
          if( wfCount <= 0 ) {
            progSteps[index].condition = 'canStart';
            previous = false;
          }else{
            
            let condition = wfCount < quantity ? 
                            'stepRemain' : 'allClear';
                         
            progSteps[index].condition = condition;
          }
        }
      });
      
      let phaseSets = [];
      for(let phase of app.phases) {
        const phaseSteps = progSteps.filter( x => x.phase === phase );
        const conArr = Array.from(phaseSteps, x => x.condition );
           
        const phaseCon = phaseSteps.length === 0 ? false :
          conArr.includes('canStart') ||
          conArr.includes('stepRemain') ?
          'open' : 
          'closed';
          
        phaseSets.push({
          phase: phase,
          condition: phaseCon
        });
      }
 
      collection = {
        batch: batchX.batch,
        batchID: batchX._id,
        // stepSets: progSteps, // only need for debug
        phaseSets: phaseSets
      };
      
      resolve(collection);
    }else if(batch) {
      const docW = WidgetDB.findOne({_id: batch.widgetId});
      const flow = docW.flows.find( x => x.flowKey === batch.river );
      const riverFlow = flow ? flow.flow : [];
      
      const rNC = batch.nonCon.filter( n => 
        !n.trash && n.inspect === false && n.skip === false );
      const released = typeof batch.floorRelease === 'object';
      let previous = released;
      
      let progSteps = riverFlow;//.filter( x => x.type !== 'first' );
      progSteps.map( (step, index)=> {
        if(!previous) {
          progSteps[index].condition = 'onHold';
        }else{
          
          const wipStart = batch.items.some( 
            x => x.history.find( 
              y => y.key === step.key && y.good === true
          ) );
          
          if( wipStart === false ) {
            progSteps[index].condition = 'canStart';
            previous = false;
          }else if(step.type === 'first') {
            progSteps[index].condition = 'allClear';
          }else{
            
            const wipDone = batch.items.every( 
              x => x.finishedAt !== false || x.history.find( 
                y => ( y.key === step.key && y.good === true ) )
            );
            
            let condition = !wipDone ? 'stepRemain' : 'allClear';
                         
            progSteps[index].condition = condition;
          }
        }
      });
      
      let phaseSets = [];
      for(let phase of app.phases) {
        const phaseSteps = progSteps.filter( x => x.phase === phase );
        const conArr = Array.from(phaseSteps, x => x.condition );
        const nonConLeft = phase === 'finish' ? rNC.length :
                            rNC.filter( x => x.where === phase ).length;
            
        const phaseCon = phaseSteps.length === 0 ? false :
          conArr.includes('canStart') ||
          conArr.includes('stepRemain') ||
          nonConLeft > 0 ?
          'open' : 
          'closed';
          
        phaseSets.push({
          phase: phase,
          condition: phaseCon
        });
      }
 
      collection = {
        batch: batch.batch,
        batchID: batch._id,
        // stepSets: progSteps, // only need for debug
        phaseSets: phaseSets
      };
      
      resolve(collection);
    }else{
      resolve(collection);
    }
  });
}

function collectStatus(privateKey, batchID, clientTZ) {
  return new Promise(resolve => {
    let collection = false;
    
    const bx = XBatchDB.findOne({_id: batchID});
    const b = !bx ? BatchDB.findOne({_id: batchID}) : {};
    
    const now = moment().tz(clientTZ);
    
    if(bx) {
      let complete = bx.completed; // is it done
      let salesEnd = moment.tz(bx.salesEnd, clientTZ); // when is it due
      let timeRemain = !complete ? 
        business.weekDays( now, salesEnd ) : 0; // how long until due
      
      collection = {
        batch: bx.batch,
        batchID: bx._id,
        weekDaysRemain: timeRemain,
        itemQuantity: bx.quantity,
        riverChosen: false,
        isActive: false
      };
      
      resolve(collection);
      
    }else if(b) {
      let complete = b.finishedAt !== false; // is it done
      let salesEnd = moment.tz(b.end, clientTZ); // when is it due
      let timeRemain = !complete ? 
        business.weekDays( now, salesEnd ) : 0; // how long until due
      // const timeRemain = !complete ? salesEnd.workingDiff(now, 'days') : 0;
      
      let itemQuantity = b.items.length; // how many items
      const riverChosen = b.river !== false; // River Setup
      // indie active check
      const tide = b.tide || [];
      const isActive = tide.find( x => 
        now.isSame(moment(x.startTime).tz(clientTZ), 'day')
      ) ? true : false;
      // what percent of items are complete
      // const percentOfDoneItems = temp === 'cool' ? 0 : 
      //   (( b.items.filter( x => x.finishedAt !== false )
      //     .length / itemQuantity) * 100 ).toFixed(0);

      collection = {
        batch: b.batch,
        batchID: b._id,
        // timeElapse: timeElapse,
        weekDaysRemain: timeRemain,
        itemQuantity: itemQuantity,
        riverChosen: riverChosen,
        isActive: isActive
      };
      
      resolve(collection);
      
    }else{
      resolve(collection);
    }
  });
}

function collectPriority(privateKey, batchID, clientTZ) {
  return new Promise(resolve => {
    let collection = false;
    const b = BatchDB.findOne({_id: batchID});
    if(!b) {
      resolve(collection);
    }else{
      
      const qtBready = !b.quoteTimeBudget ? false : true;
      
      const now = moment().tz(clientTZ);
      const endDay = moment.tz(b.end, clientTZ);
      const lateLate = now.clone().isAfter(endDay);
      
      const shipTime = endDay.isShipDay() ? 
        endDay.nextShippingTime() : endDay.lastShippingTime();
        
      let quote2tide = false;
      let estEnd2fillBuffer = false;
      
      if(qtBready) {
        const qtB = qtBready && b.quoteTimeBudget.length > 0 ? 
                    b.quoteTimeBudget[0].timeAsMinutes : 0;
        
        const totalQuoteMinutes = qtB || 0;
        
        const totalTideMinutes = batchTideTime(b.tide);
        
        quote2tide = totalQuoteMinutes - totalTideMinutes;
        const overQuote = quote2tide < 0 ? true : false;
        const q2tNice = overQuote ? 0 : quote2tide;
        
        const estComplete = now.clone().addWorkingTime(q2tNice, 'minutes');
        
        const buffer = shipTime.workingDiff(estComplete, 'minutes');
        
        estEnd2fillBuffer = buffer || null;
      }
     
      collection = {
        batch: b.batch,
        batchID: b._id,
        quote2tide: quote2tide,
        estEnd2fillBuffer: estEnd2fillBuffer,
        shipTime: shipTime.format(),
        lateLate: lateLate
      };
      
      resolve(collection);
    }
  });
}


function collectProgress(privateKey, batchID) {
  return new Promise(resolve => {
    let collection = false;
    const batch = BatchDB.findOne({_id: batchID});
    if(!batch) {
      resolve(collection);
    }else{
      const app = AppDB.findOne({orgKey: privateKey});
      const docW = WidgetDB.findOne({_id: batch.widgetId});
      const flow = docW.flows.find( x => x.flowKey === batch.river );
      const riverFlow = flow ? flow.flow : [];
      const rNC = batch.nonCon.filter( n => 
        !n.trash && n.inspect === false && n.skip === false );
      
      let phaseSets = [];
      for(let phase of app.phases) {
        const steps = riverFlow.filter( x => x.phase === phase && x.type !== 'first' );
        const nonConLeft = phase === 'finish' ? rNC.length > 0 :
                            rNC.filter( x => x.where === phase ).length > 0;
        phaseSets.push({
          phase: phase,
          steps: steps,
          count: 0,
          ncLeft: nonConLeft
        });
      }
      
      const doneItems = batch.items.filter( x => x.finishedAt !== false ).length;
      const wipItems = batch.items.filter( 
                        x => x.finishedAt === false ); // not done
      const wipItemHistory = Array.from( wipItems, 
                              x => x.history.filter( 
                                y => y.type !== 'first' && y.good === true) );
      const historyFlat = [].concat(...wipItemHistory);

      phaseSets.map( (phet, index)=> {
        for(let stp of phet.steps) {
          const wipTally = historyFlat.filter( x => x.key === stp.key ).length;
          phaseSets[index].count = phet.count + ( doneItems + wipTally );
        }
      });
 
      collection = {
        batch: batch.batch,
        batchID: batch._id,
        totalItems: batch.items.length,
        phaseSets: phaseSets,
      };
      
      resolve(collection);
    }
  });
}


function collectNonCon(privateKey, batchID, temp) {
  return new Promise(resolve => {
    let collection = false;
    const b = BatchDB.findOne({_id: batchID});
    if(!b) {
      resolve(collection);
    }else{
      const itemQuantity = b.items.length;
      // nonCon relevant
      const rNC = b.nonCon.filter( n => !n.trash );
      // how many nonCons
      const nonConTotal = temp === 'cool' ? 0 : 
        rNC.length;
      // how many are unresolved  
      const nonConLeft = rNC.filter( x => 
        x.inspect === false && ( x.skip === false || x.snooze === true )
      ).length;
      // nc rate
      const ncRate = ( nonConTotal / itemQuantity ).toFixed(1, 10);
      // how many items have nonCons
      const hasNonCon = temp === 'cool' ? 0 :
        [... new Set( Array.from(rNC, x => { return x.serial }) ) ].length;
      // what percent of items have nonCons
      const percentOfNCitems = temp === 'cool' ? 0 :
        ((hasNonCon / itemQuantity) * 100 ).toFixed(0);
      // how many items are scrapped
      const itemIsScrap = temp === 'cool' ? 0 :
        b.items.filter( x => x.history.find( 
                          y => y.type === 'scrap' && y.good === true ) )
                            .length;
      // how many items with RMA
      let itemHasRMA = temp === 'cool' ? 0 :
        b.items.filter( x => x.rma.length > 0).length;
 
      collection = {
        batch: b.batch,
        batchID: b._id,
        nonConTotal: nonConTotal,
        nonConRate: ncRate,
        nonConLeft: nonConLeft,
        percentOfNCitems: isNaN(percentOfNCitems) ? '0%' : percentOfNCitems + '%',
        itemIsScrap: itemIsScrap,
        itemHasRMA: itemHasRMA
      };
      
      resolve(collection);
    }
  });
}


Meteor.methods({
  
  overviewBatchStatus(batchID, clientTZ) {
    async function bundleProgress(batchID) {
      const accessKey = Meteor.user().orgKey;
      try {
        bundle = await collectStatus(accessKey, batchID, clientTZ);
        return bundle;
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    return bundleProgress(batchID);
  },
  
  priorityRank(batchID, clientTZ, serverAccessKey) {
    async function bundlePriority(batchID, clientTZ) {
      const accessKey = serverAccessKey || Meteor.user().orgKey;
      try {
        bundle = await collectPriority(accessKey, batchID, clientTZ);
        return bundle;
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    return bundlePriority(batchID, clientTZ);
  },
  
  phaseProgress(batchID) {
    async function bundleProgress(batchID) {
      const accessKey = Meteor.user().orgKey;
      try {
        bundle = await collectProgress(accessKey, batchID);
        return bundle;
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    return bundleProgress(batchID);
  },
  
  phaseCondition(batchID, serverAccessKey) {
    async function bundleCondition(batchID) {
      const accessKey = serverAccessKey || Meteor.user().orgKey;
      try {
        bundle = await collectPhaseCondition(accessKey, batchID);
        return bundle;
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    return bundleCondition(batchID);
  },
  
  nonconQuickStats(batchID, temp) {
    async function bundleNonCon(batchID) {
      const accessKey = Meteor.user().orgKey;
      try {
        bundle = await collectNonCon(accessKey, batchID, temp);
        return bundle;
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    return bundleNonCon(batchID);
  }
  
});