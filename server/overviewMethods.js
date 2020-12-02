import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';

import Config from '/server/hardConfig.js';

import { batchTideTime } from './tideGlobalMethods.js';
import { calcShipDay } from './reportCompleted.js';

moment.updateLocale('en', {
  workinghours: Config.workingHours,
  shippinghours: Config.shippingHours
});

//const isNow = (t)=>{ return ( now.isSame(moment(t), 'day') ) };

function collectBranchCondition(privateKey, batchID) {
  return new Promise(resolve => {
    const app = AppDB.findOne({orgKey: privateKey});
    const batchX = XBatchDB.findOne({_id: batchID});
    const batch = BatchDB.findOne({_id: batchID});
    const branches = app.branches;
    
    if(batchX) {
      if(batchX.completed && !batchX.live) {
        resolve({
          batch: batchX.batch,
          batchID: batchX._id,
          onFloor: false,
          branchSets: []
        });
      }else{
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
        
        let branchSets = [];
        for(let branch of branches) {
          const branchSteps = progSteps.filter( x => x.branchKey === branch.brKey );
          const conArr = Array.from(branchSteps, x => x.condition );
             
          const branchCon = branchSteps.length === 0 ? false :
            conArr.includes('canStart') ||
            conArr.includes('stepRemain') ?
            'open' :
            conArr.includes('onHold') ? 
            'onHold' :
            'closed';
            
          branchSets.push({
            brKey: branch.brKey,
            branch: branch.branch,
            condition: branchCon
          });
        }
   
        resolve({
          batch: batchX.batch,
          batchID: batchX._id,
          // stepSets: progSteps, // only need for debug
          onFloor: released,
          branchSets: branchSets
        });
      }
    }else if(batch) {
      if(batch.finishedAt !== false && !batch.live) {
        resolve({
          batch: batch.batch,
          batchID: batch._id,
          onFloor: false,
          branchSets: []
        });
      }else{
        const docW = WidgetDB.findOne({_id: batch.widgetId});
        const flow = docW.flows.find( x => x.flowKey === batch.river );
        const riverFlow = flow ? flow.flow : [];
        
        const rNC = batch.nonCon.filter( n => 
          !n.trash && n.inspect === false && n.skip === false );
        
        const released = batch.releases.findIndex( x => x.type === 'floorRelease') >= 0;
        let previous = released;
        
        let progSteps = riverFlow;
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
        
        let branchSets = [];
        for(let branch of branches) {
          const branchSteps = progSteps.filter( x => x.branchKey === branch.brKey );
          const conArr = Array.from(branchSteps, x => x.condition );
          
          const nonConLeft = branch.brKey === 't3rm1n2t1ng8r2nch' ? rNC.length :
                              rNC.filter( x => x.where === branch.branch ).length;
              
          const branchCon = branchSteps.length === 0 ? false :
            conArr.includes('canStart') ||
            conArr.includes('stepRemain') ||
            nonConLeft > 0 ?
            'open' :
            conArr.includes('onHold') ? 
            'onHold' :
            'closed';
            
          branchSets.push({
            brKey: branch.brKey,
            branch: branch.branch,
            condition: branchCon
          });
        }
   
        resolve({
          batch: batch.batch,
          batchID: batch._id,
          // branchSets: progSteps, // only need for debug
          onFloor: released,
          branchSets: branchSets
        });
      }
    }else{
      resolve(false);
    }
  });
}

function collectPriority(privateKey, batchID, mockDay) {
  return new Promise(resolve => {
    let collection = false;
    
    const app = AppDB.findOne({orgKey: privateKey});
    const nonWorkDays = app.nonWorkDays;
    if( Array.isArray(nonWorkDays) ) {  
      moment.updateLocale('en', {
        holidays: nonWorkDays
      });
    }
    const now = moment().tz(Config.clientTZ);
    
    const b = BatchDB.findOne({_id: batchID}) ||
              XBatchDB.findOne({_id: batchID});
    
    if(!b) {
      resolve(collection);
    }else{
      const endEntry = b.salesEnd || b.end;
      const doneEntry = b.completed ? b.completedAt : b.finishedAt;
      
      const future = mockDay ? mockDay : endEntry;
      const calcShip = calcShipDay( now, future );
      const shipAim = calcShip[1];
      const lateLate = calcShip[2];
      
      const qtBready = !b.quoteTimeBudget ? false : true;
        
      if(qtBready && b.tide && !doneEntry) {
        const totalQuoteMinutes = b.quoteTimeBudget.length === 0 ? 0 :
                                  b.quoteTimeBudget[0].timeAsMinutes;
                                  
        const totalTideMinutes = batchTideTime(b.tide);
        
        const quote2tide = totalQuoteMinutes - totalTideMinutes;
        const overQuote = quote2tide < 0 ? true : false;
        const q2tNice = overQuote ? 0 : quote2tide;
                                                      // insert additional ship bumper
        //const estConclude = shipAim;//shipAim.clone().subtractWorkingTime(0, 'hours');
        const estLatestBegin = shipAim.clone().subtractWorkingTime(q2tNice, 'minutes');
        
        const dayGap = shipAim.workingDiff(now, 'days');
        
        const estSoonest = now.clone().addWorkingTime(q2tNice, 'minutes');

        const buffer = shipAim.workingDiff(estSoonest, 'minutes');
        
        const estEnd2fillBuffer = buffer || null;
        
        const bffrRel =  Math.round( ( estEnd2fillBuffer / 100 ) - dayGap );
        
        collection = {
          batch: b.batch,
          batchID: b._id,
          salesOrder: b.salesOrder,
          quote2tide: quote2tide,
          estSoonest: estSoonest.format(),
          estLatestBegin: estLatestBegin.format(),
          completed: doneEntry, 
          bffrRel: bffrRel,
          estEnd2fillBuffer: estEnd2fillBuffer,
          // endEntry: endEntry,
          shipAim: shipAim.format(),
          lateLate: lateLate
        };
        resolve(collection);
      }else{
        collection = {
          batch: b.batch,
          batchID: b._id,
          salesOrder: b.salesOrder,
          quote2tide: false,
          completed: doneEntry,
          bffrRel: false,
          estEnd2fillBuffer: 0,
          // endEntry: endEntry,  
          shipAim: shipAim.format(),
          lateLate: lateLate
        };
        resolve(collection);
      }
    }
  });
}


function collectProgress(privateKey, batchID, branchOnly) {
  return new Promise(resolve => {
    const app = AppDB.findOne({orgKey: privateKey});
    const brancheS = app.branches.sort((b1, b2)=>
            b1.position < b2.position ? 1 : b1.position > b2.position ? -1 : 0 );
            
    const relevantBrancheS = !branchOnly ? brancheS :
            brancheS.filter( b => b.branch === branchOnly );
            
    const bx = XBatchDB.findOne({_id: batchID});
    const batch = BatchDB.findOne({_id: batchID});
    
    let collection = false;
    let branchSets = [];
    
    if(bx) {
      const waterfall = bx.waterfall;
      
      for(let branch of relevantBrancheS) {
        const steps = waterfall.filter( x => x.branchKey === branch.brKey );
        
        branchSets.push({
          branch: branch.branch,
          steps: steps,
          count: 0,
          ncLeft: 0,
          shLeft: 0
        });
      }

      branchSets.map( (brSet, index)=> {
        for(let stp of brSet.steps) {
          const wfCount = stp.counts.length === 0 ? 0 :
              Array.from(stp.counts, x => x.tick).reduce((x,y)=> x + y);
          branchSets[index].count = brSet.count + wfCount;
        }
      });
      
      collection = {
        batch: bx.batch,
        batchID: bx._id,
        totalItems: bx.quantity,
        branchSets: branchSets,
      };
      resolve(collection);
    
    }else if(batch) {
      const docW = WidgetDB.findOne({_id: batch.widgetId});
      const flow = docW.flows.find( x => x.flowKey === batch.river );
      const riverFlow = flow ? flow.flow : [];
      
      const rNC = batch.nonCon.filter( n => 
        !n.trash && n.inspect === false && n.skip === false );
      
      for(let branch of relevantBrancheS) {
        const steps = riverFlow.filter( x => x.branchKey === branch.brKey && x.type !== 'first' );
        const nonConLeft = branch.brKey === 't3rm1n2t1ng8r2nch' ? rNC.length > 0 :
                            rNC.filter( x => x.where === branch.branch ).length > 0;
        const shortLeft = batch.shortfall.filter( s => 
                          s.inEffect !== true && s.reSolve !== true 
                        ).length > 0;
    
        branchSets.push({
          branch: branch.branch,
          steps: steps,
          count: 0,
          ncLeft: nonConLeft,
          shLeft: shortLeft
        });
      }
      
      const doneItems = batch.items.filter( x => x.finishedAt !== false ).length;
      const wipItems = batch.items.filter( 
                        x => x.finishedAt === false ); // not done
      const wipItemHistory = Array.from( wipItems, 
                              x => x.history.filter( 
                                y => y.type !== 'first' && y.good === true) );
      const historyFlat = [].concat(...wipItemHistory);

      branchSets.map( (brSet, index)=> {
        for(let stp of brSet.steps) {
          const wipTally = historyFlat.filter( x => x.key === stp.key ).length;
          branchSets[index].count = brSet.count + ( doneItems + wipTally );
        }
      });
 
      collection = {
        batch: batch.batch,
        batchID: batch._id,
        totalItems: batch.items.length,
        branchSets: branchSets,
      };
      resolve(collection);
      
    }else{
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
  
  priorityRank(batchID, serverAccessKey, mockDay) {
    async function bundlePriority() {//batchID, orgKey, mockDay) {
      const accessKey = serverAccessKey || Meteor.user().orgKey;
      try {
        bundle = await collectPriority(accessKey, batchID, mockDay);
        return bundle;
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    return bundlePriority();//batchID, mockDay);
  },
  
  branchProgress(batchID, branchOnly) {
    this.unblock();
    async function bundleProgress(batchID) {
      const accessKey = Meteor.user().orgKey;
      try {
        bundle = await collectProgress(accessKey, batchID, branchOnly);
        return bundle;
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    return bundleProgress(batchID);
  },
  
  branchCondition(batchID, serverAccessKey) {
    async function bundleCondition(batchID) {
      const accessKey = serverAccessKey || Meteor.user().orgKey;
      try {
        bundle = await collectBranchCondition(accessKey, batchID);
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