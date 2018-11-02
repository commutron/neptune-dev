import moment from 'moment';
import timezone from 'moment-timezone';

function findRelevantBatches(orgKey, from, to) {
  return new Promise(resolve => {
    // for BatchDB only
    const allBatches = BatchDB.find({orgKey: orgKey}).fetch();
    // time window - without timezone corection, assumes the server is onsite
    const batchPack = allBatches.filter( x => 
                        moment(x.createdAt).isBefore(to) &&
                          ( x.finishedAt === false || 
                            moment(x.finishedAt).isAfter(from) ) );
    resolve(batchPack);
  });
}

function loopBatches(batches, from, to) {
  return new Promise(resolve => {
    let allItems = [];
    let allNonCons = [];
    let shortfallCount = 0;
    for(let b of batches) {
      const shortfallUnique = !b.shortfall ? [] : 
                                [...new Set(
                                  Array.from(
                                    b.shortfall, 
                                    x => moment(x.cTime).isBetween(from, to) ? 
                                    x.partNum : null ) 
                                ) ];
      shortfallCount += shortfallUnique.length;
      allNonCons.push(...b.nonCon);
      allItems.push(...b.items);
    }
    resolve({allItems, allNonCons, shortfallCount});
  });
}

function loopItems(items, from, to) {
  return new Promise(resolve => {
    let finishedItems = 0;
    let firstPass = 0;
    let firstFail = 0;
    let testFail = 0;
    let scraps = 0;
    for(let i of items) {
      if(i.finishedAt !== false && moment(i.finishedAt).isBetween(from, to) ) { finishedItems += 1 }
      const inTime = i.history.filter( x => moment(x.time).isBetween(from, to) );
      firstPass += inTime.filter( x => x.type === 'first' && x.good !== false ).length;
      firstFail += inTime.filter( x => x.type === 'first' && x.good === false ).length;
      testFail += inTime.filter( x => x.type === 'test' && x.good === false ).length;
      scraps += inTime.filter( x => x.type === 'scrap' && x.good === true ).length;
    }
    resolve({finishedItems, firstPass, firstFail, testFail, scraps});
  });
}

function loopNonCons(nonCons, from, to, optionsLegacy) {
  return new Promise(resolve => {
    const inTime = nonCons.filter( x => moment(x.time).isBetween(from, to) );
    let foundNC = inTime.length;
    let uniqueSerials = [... new Set( Array.from(inTime, x => x.serial ) ) ].length;
    let refC = inTime.filter( x => x.ref.split('')[0] === 'c' ).length;
    let refR = inTime.filter( x => x.ref.split('')[0] === 'r' ).length;
    let refU = inTime.filter( x => x.ref.split('')[0] === 'u' ).length;
    let refQ = inTime.filter( x => x.ref.split('')[0] === 'q' ).length;
    const refBreakdown = { refC, refR, refU, refQ };
    let typeBreakdown = [];
    for(let ncOp of optionsLegacy) {
      const num = inTime.filter( x => x.type === ncOp ).length;
      typeBreakdown.push({ type: ncOp, quantity: num });
    }
    resolve({foundNC, uniqueSerials, refBreakdown, typeBreakdown});
  });
}




Meteor.methods({
  
  buildReport(startDay, endDay) {
    const orgKey = Meteor.user().orgKey;
    let org = AppDB.findOne({orgKey: Meteor.user().orgKey});
    let optionsLegacy = !org ? [] : org.nonConOption;
    const from = moment(startDay).startOf('day').format();
    const to = moment(endDay).endOf('day').format();
    
    async function getBatches() {
      try {
        batchSlice = await findRelevantBatches(orgKey, from, to);
        batchArange = await loopBatches(batchSlice, from, to);
        itemStats = await loopItems(batchArange.allItems, from, to);
        nonConStats = await loopNonCons(batchArange.allNonCons, from, to, optionsLegacy);
        const shortfallCount = batchArange.shortfallCount;
        return {shortfallCount, itemStats, nonConStats};
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    
    return getBatches();



    
  },
  
  
  
})