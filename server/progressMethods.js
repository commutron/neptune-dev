// import moment from 'moment';
import { 
  sortBranches, 
  flattenHistory,
  countWaterfall
} from './utility';


function collectBranchCondition(privateKey, batchID) {
  return new Promise(resolve => {
    const app = AppDB.findOne({orgKey: privateKey});
    const branches = app.branches.filter( b => b.open && b.pro );
    const batchX = XBatchDB.findOne({_id: batchID});
    
    if(batchX) {
      if(batchX.completed && !batchX.live) {
        resolve({
          batch: batchX.batch,
          batchID: batchX._id,
          onFloor: false,
          donePnt: 0,
          stormy: [false, false, false],
          branchSets: []
        });
      }else{
        const quantity = batchX.quantity;
        
        const docW = WidgetDB.findOne({_id: batchX.widgetId});
        const flow = docW.flows.find( x => x.flowKey === batchX.river );
        const riverFlow = flow ? flow.flow : [];
        
        const srs = XSeriesDB.findOne({batch: batchX.batch});
        const rNC = !srs ? [] : srs.nonCon.filter( n => !n.trash && n.inspect === false );
        
        const waterfall = batchX.waterfall;
        const items = !srs ? [] : srs.items;
        const itemsDonePercent = items.filter( x => x.completed ).length / items.length;
        const donePnt = isNaN(itemsDonePercent) ? 0 : itemsDonePercent;
        
        const rSH = !srs ? [] : srs.shortfall.some( s => s.inEffect !== true && s.reSolve !== true );
        const iTF = items.some( x => x.history.find( y => y.type === 'test' && y.good === false ) );
          
        const stormy = [ rNC.length > 0, rSH, iTF ];
        
        const released = batchX.releases.findIndex( x => x.type === 'floorRelease') >= 0;
        let previous = released;
        
        let progSteps = [...waterfall,...riverFlow];
        progSteps.map( (step, index)=> {
          if(!previous) {
            progSteps[index].condition = 'onHold';
          }else{
            
            if(step.counts) {
              const wfCount = countWaterfall(step.counts);
              if( wfCount <= 0 ) {
                progSteps[index].condition = 'canStart';
                previous = false;
              }else{
                
                let condition = wfCount < quantity ? 'stepRemain' : 'allClear';
                             
                progSteps[index].condition = condition;
              }
            }else{
              const wipStart = items.some( x => x.history.find( 
                y => y.key === step.key && y.good === true
              ) );
              
              if( wipStart === false ) {
                progSteps[index].condition = 'canStart';
                previous = false;
              }else if(step.type === 'first') {
                progSteps[index].condition = 'allClear';
              }else{
                
                const wipDone = items.every( 
                  x => x.completed || x.history.find( 
                    y => ( y.key === step.key && y.good === true ) )
                );
                
                let condition = !wipDone ? 'stepRemain' : 'allClear';
                
                progSteps[index].condition = condition;
              }
            }
          }
        });
        
        let branchSets = [];
        for(let branch of branches) {
          const branchSteps = progSteps.filter( x => x.branchKey === branch.brKey );
          const conArr = Array.from(branchSteps, x => x.condition );
           
          const nonConLeft = branch.brKey === 't3rm1n2t1ng8r2nch' ? rNC.length :
                              rNC.some( x => x.where === branch.branch );
          
          const branchCon = branchSteps.length === 0 ? false :
            conArr.includes('canStart') ||
            conArr.includes('stepRemain') ||
            nonConLeft > 0 ? 
            'open' :
            conArr.includes('onHold') ? 'onHold' :
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
          donePnt: donePnt,
          stormy: stormy,
          branchSets: branchSets
        });
      }
    }else{
      resolve(false);
    }
  });
}

const reduceTide = (tArr)=> {
  let durr = 0;
  for(let td of tArr) {
    const start = td.startTime;
    const stop = td.stopTime ? td.stopTime : new Date();
    
    durr += Math.floor( ( ( stop - start ) / 60000 ) );
  }
  return durr;
};

function collectBranchTime(privateKey, batchID) {
  return new Promise(resolve => {
    const app = AppDB.findOne({orgKey: privateKey},{
                fields:{ 'branches': 1, 'qtTasks': 1 
                }});
    const brancheS = sortBranches( app.branches.filter( b => b.open && b.pro ) );

    const bx = XBatchDB.findOne({_id: batchID},{
                fields:{ 'tide': 1, 'quoteTimeCycles': 1, 'quantity': 1
                }});
    
    let branchTime = [];
    
    if(bx) {
      const tide = bx.tide || [];
      
      const bQTtimes = bx.quoteTimeCycles || [];

      for(let branch of brancheS) {
   
        const brArray = tide.filter( t => t.task === branch.branch );
        const brTime = reduceTide(brArray);
        
        let brQTime = 0;
        let brQtTasks = app.qtTasks.filter( q => q.brKey === branch.brKey );
        for( let qtTask of brQtTasks ) {
          const bqchunk = bQTtimes.find( bqt => bqt[0] === qtTask.qtKey );
          const bsettime = !bqchunk ? 0 : qtTask.fixed ? bqchunk[1] : ( bqchunk[1] * (bx.quantity || 0) );
          brQTime += bsettime;
        }
        const budgt = bQTtimes.length === 0 ? null : brQTime;
        
        branchTime.push({
          branch: branch.branch,
          time: brTime,
          budget: budgt
        });
      }
      resolve({
        batchID: bx._id,
        branchTime: branchTime,
      });
    }else{
      resolve(false);
    }
  });
}

function collectProgress(privateKey, batchID) {
  return new Promise(resolve => {
    const app = AppDB.findOne({orgKey: privateKey});
    const brancheS = sortBranches( app.branches.filter( b => b.open && b.pro ) );

    const bx = XBatchDB.findOne({_id: batchID});
    
    let branchProg = [];
    
    if(bx) {
      const totalTotal = bx.quantity;
   
      const docW = WidgetDB.findOne({_id: bx.widgetId});
      const flow = docW.flows.find( x => x.flowKey === bx.river );
      const riverFlow = flow ? flow.flow : [];
      
      const srs = XSeriesDB.findOne({batch: bx.batch});
      const items = !srs ? [] : srs.items.filter( i => !i.altPath.some(a=> a.river !== false) );
      const totalItems = items.length;
      
      const doneItems = items.filter( x => x.completed ).length;
      const wipItems = items.filter( x => !x.completed );
      
      const historyFlat = flattenHistory(wipItems, true);
      
      const rNC = !srs ? [] : srs.nonCon.filter( n => !n.trash && n.inspect === false );
      
      for(let branch of brancheS) {
   
        let counter = 0;
        let maxCount = 0;
        
        let flowlength = 0;
        let falllength = 0;
        
        for(let fll of bx.waterfall) {
          if(fll.branchKey === branch.brKey) {
            falllength += 1;
            const wfCount = countWaterfall(fll.counts);
            counter = counter + wfCount;
            const fllMax = fll.action === 'slider' ? 100 : totalTotal;
            maxCount = maxCount + fllMax;
          }
        }
        
        for(let rv of riverFlow) {
          if(rv.branchKey !== branch.brKey) {
            continue;
          }else if(rv.type === 'first') {
            
            flowlength += 1;
            const didFirst = items.findIndex(x=> x.history.findIndex(y=> y.key === rv.key) >= 0) >= 0;
            didFirst ? counter = counter + 1 : null;
            maxCount = maxCount + 1;
            
          }else if(rv.type !== 'first') {
            
            flowlength += 1;
            const wipTally = historyFlat.filter( x => x.key === rv.key ).length;
            counter = counter + ( doneItems + wipTally );
            maxCount = maxCount + totalItems;
          }
        }
        
        const calPer = ( counter / maxCount ) * 100;
        const calNum = calPer > 0 && calPer < 1 ? 
                          calPer.toPrecision(1) : Math.floor( calPer );
        
        const nonConLeft = branch.brKey === 't3rm1n2t1ng8r2nch' ? rNC.length > 0 :
                            rNC.filter( x => x.where === branch.branch ).length > 0;
        const shortLeft = (!srs ? [] : srs.shortfall).filter( s => 
                            s.inEffect !== true && s.reSolve !== true 
                          ).length > 0;
                        
        branchProg.push({
          branch: branch.branch,
          steps: falllength + flowlength,
          calNum: calNum,
          ncLeft: nonConLeft,
          shLeft: shortLeft
        });
      }
      
      resolve({
        batchID: bx._id,
        totalItems: totalTotal,
        branchProg: branchProg,
      });
      
    }else{
      resolve(false);
    }
  });
}


Meteor.methods({

  branchProgress(batchID, serverAccessKey) {
    this.unblock();
    async function bundleProgress(batchID) {
      const accessKey = serverAccessKey || Meteor.user().orgKey;
      try {
        bundle = await collectProgress(accessKey, batchID);
        return bundle;
      }catch (err) {
        throw new Meteor.Error(err.message);
      }
    }
    return bundleProgress(batchID);
  },
  
  branchTaskTime(batchID, serverAccessKey) {
    this.unblock();
    async function bundleTaskTime(batchID) {
      const accessKey = serverAccessKey || Meteor.user().orgKey;
      try {
        return await collectBranchTime(accessKey, batchID);
      }catch (err) {
        throw new Meteor.Error(err.message);
      }
    }
    return bundleTaskTime(batchID);
  },
  
  branchCondition(batchID, serverAccessKey) {
    this.unblock();
    async function bundleCondition(batchID) {
      const accessKey = serverAccessKey || Meteor.user().orgKey;
      try {
        bundle = await collectBranchCondition(accessKey, batchID);
        return bundle;
      }catch (err) {
        throw new Meteor.Error(err.message);
      }
    }
    return bundleCondition(batchID);
  },
  
});