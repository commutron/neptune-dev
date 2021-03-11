import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';

import Config from '/server/hardConfig.js';

import { batchTideTime } from './tideGlobalMethods.js';
import { calcShipDay } from './reportCompleted.js';
import { 
  sortBranches, 
  flattenHistory,
  countWaterfall
} from './utility';

moment.updateLocale('en', {
  workinghours: Config.workingHours,
  shippinghours: Config.shippingHours
});

//const isNow = (t)=>{ return ( now.isSame(moment(t), 'day') ) };

function collectBranchCondition(privateKey, batchID) {
  return new Promise(resolve => {
    const app = AppDB.findOne({orgKey: privateKey});
    const branches = app.branches;
    const batchX = XBatchDB.findOne({_id: batchID});
    const batch = BatchDB.findOne({_id: batchID});
    
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
            
            const wfCount = countWaterfall(step.counts);
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
          onFloor: released,
          branchSets: branchSets
        });
      }
    }else{
      resolve(false);
    }
  });
}


function dryPriorityCalc(bQuTmBdg, bTide, shipAim, now, shipLoad) {
  const shipAimMmnt = moment(shipAim);
  
  const totalQuoteMinutes = bQuTmBdg.length === 0 ? 0 :
                                bQuTmBdg[0].timeAsMinutes;
                                
  const totalTideMinutes = batchTideTime(bTide);
  
  const quote2tide = totalQuoteMinutes - totalTideMinutes;
  const overQuote = quote2tide < 0 ? true : false;
  const q2tNice = overQuote ? 0 : quote2tide;
  
  const estLatestBegin = shipAimMmnt.clone().subtractWorkingTime(q2tNice, 'minutes');
  
  // additional ship bumper
  // const estConclude = shipAimMmnt;//shipAimMmnt.clone().subtractWorkingTime(0, 'hours');
  const estSoonest = now.clone().addWorkingTime(q2tNice, 'minutes');

  const buffer = shipAimMmnt.workingDiff(estSoonest, 'minutes');
  
  const estEnd2fillBuffer = buffer || null;
  
  const dayGap = shipAimMmnt.workingDiff(now, 'days', true);
  const shipPull = dayGap <= 2.5 ? shipLoad * 2 : shipLoad;
  // const bffrRel = Math.round( ( estEnd2fillBuffer / 100 ) - dayGap );
  const bffrRel = Math.round( ( estEnd2fillBuffer / 100 ) + dayGap - shipPull );
  
  return { quote2tide, estSoonest, estLatestBegin, bffrRel, estEnd2fillBuffer };
}

function collectPriority(privateKey, batchID, mockDay) {
  return new Promise(resolve => {
    
    const app = AppDB.findOne({orgKey:privateKey}, {fields:{'nonWorkDays':1}});
    if(Array.isArray(app.nonWorkDays) ) {  
      moment.updateLocale('en', { holidays: app.nonWorkDays });
    }

    const now = moment().tz(Config.clientTZ);
    
    const b = BatchDB.findOne({_id: batchID}) ||
              XBatchDB.findOne({_id: batchID});
    
    if(!b) {
      resolve(false);
    }else{
      const endEntry = b.salesEnd || b.end;
      const doneEntry = b.completed ? b.completedAt : b.finishedAt;
      
      const future = mockDay ? mockDay : endEntry;
      const calcShip = calcShipDay( now, future );
      const shipAim = calcShip[1];
      const lateLate = calcShip[2];
      
      const qtBready = !b.quoteTimeBudget ? false : true;
      
      const oRapid = XRapidsDB.findOne({extendBatch: b.batch, live: true}) ? true : false;
      
      if(qtBready && b.tide && !doneEntry) {
        const shipLoad = TraceDB.find({shipAim: { 
          $gte: new Date(now.clone().nextShippingTime().startOf('day').format()),
          $lte: new Date(now.clone().nextShippingTime().endOf('day').format()) 
        }},{fields:{'batchID':1}}).count();
      
        const dryCalc = dryPriorityCalc(b.quoteTimeBudget, b.tide, shipAim, now, shipLoad);

        resolve({
          batch: b.batch,
          batchID: b._id,
          salesOrder: b.salesOrder,
          quote2tide: dryCalc.quote2tide,
          estSoonest: dryCalc.estSoonest.format(),
          estLatestBegin: dryCalc.estLatestBegin.format(),
          completed: doneEntry, 
          bffrRel: dryCalc.bffrRel,
          estEnd2fillBuffer: dryCalc.estEnd2fillBuffer,
          // endEntry: endEntry,
          shipAim: shipAim.format(),
          lateLate: lateLate,
          oRapid: oRapid
        });
      }else{
        resolve({
          batch: b.batch,
          batchID: b._id,
          salesOrder: b.salesOrder,
          quote2tide: false,
          completed: doneEntry,
          bffrRel: false,
          estEnd2fillBuffer: 0,
          // endEntry: endEntry,  
          shipAim: shipAim.format(),
          lateLate: lateLate,
          oRapid: oRapid
        });
      }
    }
  });
}

function getFastPriority(privateKey, bData, now, shipAim) {
  return new Promise(resolve => {
    
    const doneEntry = bData.completed ? bData.completedAt : bData.finishedAt;
      
    const qtBready = !bData.quoteTimeBudget ? false : true;
    
    if(qtBready && bData.tide && !doneEntry) {
      const shipLoad = TraceDB.find({shipAim: { 
        $gte: new Date(now.clone().nextShippingTime().startOf('day').format()),
        $lte: new Date(now.clone().nextShippingTime().endOf('day').format()) 
      }},{fields:{'batchID':1}}).count();
        
      const dryCalc = dryPriorityCalc(bData.quoteTimeBudget, bData.tide, shipAim, now, shipLoad);
      
      resolve({
        quote2tide: dryCalc.quote2tide,
        estSoonest: dryCalc.estSoonest.format(),
        estLatestBegin: dryCalc.estLatestBegin.format(),
        bffrRel: dryCalc.bffrRel,
        estEnd2fillBuffer: dryCalc.estEnd2fillBuffer
      });
    }else{
      resolve({
        quote2tide: false,
        estSoonest: false,
        estLatestBegin: false,
        bffrRel: false,
        estEnd2fillBuffer: 0
      });
    }
  });
}


function collectProgress(privateKey, batchID, branchOnly) {
  return new Promise(resolve => {
    const app = AppDB.findOne({orgKey: privateKey});
    const brancheS = sortBranches(app.branches);
            
    const relevantBrancheS = !branchOnly ? brancheS :
            brancheS.filter( b => b.branch === branchOnly );
            
    const bx = XBatchDB.findOne({_id: batchID});
    const batch = BatchDB.findOne({_id: batchID});
    
    let branchSets = [];
    
    if(bx) {
      const totalItems = bx.quantity;
      
      for(let branch of relevantBrancheS) {
        const steps = bx.waterfall.filter( x => x.branchKey === branch.brKey );
        
        let counter = 0;
        for(let stp of steps) {
          const wfCount = stp.counts.length === 0 ? 0 :
            Array.from(stp.counts, x => x.tick).reduce((x,y)=> x + y);
          counter = counter + wfCount;
        }
        
        const calPer = ( counter / (totalItems * steps.length) ) * 100;
        const calNum = calPer > 0 && calPer < 1 ? 
                          calPer.toPrecision(1) : Math.floor( calPer );
        
        branchSets.push({
          branch: branch.branch,
          steps: steps.length,
          // count: counter,
          calNum: calNum,
          ncLeft: false,
          shLeft: false
        });
      }
      
      resolve({
        batchID: bx._id,
        totalItems: totalItems,
        branchSets: branchSets,
      });
    
    }else if(batch) {
      const docW = WidgetDB.findOne({_id: batch.widgetId});
      const flow = docW.flows.find( x => x.flowKey === batch.river );
      const riverFlow = flow ? flow.flow : [];
      
      const totalItems = batch.items.length;
      
      const rNC = batch.nonCon.filter( n => 
        !n.trash && n.inspect === false && n.skip === false );
      
      const doneItems = batch.items.filter( x => x.finishedAt !== false ).length;
      const wipItems = batch.items.filter( 
                        x => x.finishedAt === false ); // not done
      
      const historyFlat = flattenHistory(wipItems);
      
      for(let branch of relevantBrancheS) {
        const steps = riverFlow.filter( x => x.branchKey === branch.brKey && x.type !== 'first' );
        
        let counter = 0;
        for(let stp of steps) {
          const wipTally = historyFlat.filter( x => x.key === stp.key ).length;
          counter = counter + ( doneItems + wipTally );
        }
        
        const nonConLeft = branch.brKey === 't3rm1n2t1ng8r2nch' ? rNC.length > 0 :
                            rNC.filter( x => x.where === branch.branch ).length > 0;
        const shortLeft = batch.shortfall.filter( s => 
                          s.inEffect !== true && s.reSolve !== true 
                        ).length > 0;
        
        const calPer = ( counter / (totalItems * steps.length) ) * 100;
        const calNum = calPer > 0 && calPer < 1 ? 
                          calPer.toPrecision(1) : Math.floor( calPer );
        
        branchSets.push({
          branch: branch.branch,
          steps: steps.length,
          // count: counter,
          calNum: calNum,
          ncLeft: nonConLeft,
          shLeft: shortLeft
        });
      }
 
      resolve({
        batchID: batch._id,
        totalItems: totalItems,
        branchSets: branchSets,
      });
      
    }else{
      resolve(false);
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
    return bundlePriority();
  },
  priorityFast(serverAccessKey, bData, now, shipAim) {
    async function bundlePriority() {
      const accessKey = serverAccessKey || Meteor.user().orgKey;
      try {
        bundle = await getFastPriority(accessKey, bData, now, shipAim);
        return bundle;
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    return bundlePriority();
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