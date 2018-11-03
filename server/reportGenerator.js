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

function loopBatches(batches, from, to, getShort) {
  return new Promise(resolve => {
    let allItems = [];
    let allNonCons = [];
    let shortfallCount = getShort ? 0 : false;
    for(let b of batches) {
      if(getShort) {
        const inTimeShort = !b.shortfall ? [] : b.shortfall.filter( x => moment(x.cTime).isBetween(from, to) );
        const shortfallUnique = [...new Set(
                                  Array.from(
                                    inTimeShort, 
                                      x => x.partNum ) 
                                ) ];
        shortfallCount += shortfallUnique.length;
      }else{null}
      allNonCons.push(...b.nonCon);
      allItems.push(...b.items);
    }
    resolve({allItems, allNonCons, shortfallCount});
  });
}

function loopItems(items, from, to, getFirst, getTest, getScrap) {
  return new Promise(resolve => {
    let finishedItems = 0;
    let firstPass = getFirst ? 0 : false;
    let firstFail = getFirst ? 0 : false;
    let testFail = getTest ? 0 : false;
    let scraps = getScrap ? 0 : false;
    for(let i of items) {
      if(i.finishedAt !== false && moment(i.finishedAt).isBetween(from, to) ) { finishedItems += 1 }
      const inTime = i.history.filter( x => moment(x.time).isBetween(from, to) );
      if(getFirst) {
        firstPass += inTime.filter( x => x.type === 'first' && x.good !== false ).length;
        firstFail += inTime.filter( x => x.type === 'first' && x.good === false ).length;
      }else{null}
      if(getTest) {
        testFail += inTime.filter( x => x.type === 'test' && x.good === false ).length;
      }else{null}
      if(getScrap) {
        scraps += inTime.filter( x => x.type === 'scrap' && x.good === true ).length;
      }else{null}
    }
    
    resolve({finishedItems, firstPass, firstFail, testFail, scraps});
  });
}

function loopNonCons(nonCons, from, to, optionsLegacy, getNC, getType, getRef) {
  return new Promise(resolve => {
    const inTime = getNC ? nonCons.filter( x => moment(x.time).isBetween(from, to) ) : [];
    let foundNC = getNC ? inTime.length : false;
    let uniqueSerials = getNC ? [... new Set( Array.from(inTime, x => x.serial ) ) ].length : false;
    let refC = getNC && getRef ? inTime.filter( x => x.ref.split('')[0] === 'c' ).length : false;
    let refR = getNC && getRef ? inTime.filter( x => x.ref.split('')[0] === 'r' ).length : false;
    let refU = getNC && getRef ? inTime.filter( x => x.ref.split('')[0] === 'u' ).length : false;
    let refQ = getNC && getRef ? inTime.filter( x => x.ref.split('')[0] === 'q' ).length : false;
    let refPCB = getNC && getRef ? inTime.filter( x => 
                                    x.ref.includes('pcb') || x.ref.includes('board')
                                  ).length : false;
    const refBreakdown = getNC && getRef ? [ 
      [ 'C', refC ], 
      [ 'R', refR ], 
      [ 'U', refU ], 
      [ 'Q', refQ ], 
      [ 'PCB', refPCB ] 
    ] : false;
    let typeBreakdown = getNC && getType ? [] : false;
    if(getNC && getType) {
      for(let ncOp of optionsLegacy) {
        const num = inTime.filter( x => x.type === ncOp ).length;
        typeBreakdown.push([ ncOp, num ]);
      }
    }else{null}
    resolve({foundNC, uniqueSerials, refBreakdown, typeBreakdown});
  });
}




Meteor.methods({
  
  buildReport(startDay, endDay, getShort, getFirst, getTest, getScrap, getNC, getType, getRef) {
    const orgKey = Meteor.user().orgKey;
    let org = AppDB.findOne({orgKey: Meteor.user().orgKey});
    let optionsLegacy = !org ? [] : org.nonConOption;
    const from = moment(startDay).startOf('day').format();
    const to = moment(endDay).endOf('day').format();
    
    async function getBatches() {
      try {
        batchSlice = await findRelevantBatches(orgKey, from, to);
        batchArange = await loopBatches(batchSlice, from, to, getShort);
        itemStats = await loopItems(batchArange.allItems, from, to, getFirst, getTest, getScrap);
        nonConStats = await loopNonCons(batchArange.allNonCons, from, to, optionsLegacy, getNC, getType, getRef);
        const batchInclude = batchSlice.length;
        const itemsInclude = batchArange.allItems.length;
        const itemsWithPercent = ( ( nonConStats.uniqueSerials / itemsInclude ) * 100 ).toFixed(1) + '%';
        const shortfallCount = batchArange.shortfallCount;
        return {batchInclude, itemsInclude, itemsWithPercent, shortfallCount, itemStats, nonConStats};
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    
    return getBatches();
    
  },
  
  
  
})