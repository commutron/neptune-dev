import moment from 'moment';
import timezone from 'moment-timezone';

function findRelevantBatches(orgKey, from, to) {
  return new Promise(resolve => {
    // for BatchDB only
    // time window - without timezone corection, assumes the server is onsite
    const batchPack = BatchDB.find({
        orgKey: Meteor.user().orgKey,
        $and : [
          { createdAt: { $lte: new Date( to ) } },
          { $or : [ 
            { finishedAt : false }, 
            { finishedAt : { $gte: new Date( from ) } } 
          ] }
        ]
      }).fetch();

    resolve(batchPack);
  });
}

function loopBatches(batches, from, to) {
  return new Promise(resolve => {
    let allItems = [];
    let allNonCons = [];
    let shortfallCount = 0;
    for(let b of batches) {
      const inTimeShort = !b.shortfall ? [] : b.shortfall.filter( x => moment(x.cTime).isBetween(from, to) );
      const shortfallUnique = [...new Set(
                                Array.from(
                                  inTimeShort, 
                                    x => x.partNum ) 
                              ) ];
      shortfallCount += shortfallUnique.length;
      allNonCons.push(...b.nonCon);
      allItems.push(...b.items);
    }
    resolve({allItems, allNonCons, shortfallCount});
  });
}

function loopItems(items, from, to ) {
  return new Promise(resolve => {
    let finishedItems = 0;
    let firstPass = 0;
    let firstFail = 0;
    let testFail = 0;
    let scraps = 0;
    for(let i of items) {
      if(i.finishedAt !== false && moment(i.finishedAt).isBetween(from, to) ) { 
        finishedItems += 1;
      }
      const inTime = i.history.filter( x => moment(x.time).isBetween(from, to) );
      
      firstPass += inTime.filter( x => x.type === 'first' && x.good !== false ).length;
      firstFail += inTime.filter( x => x.type === 'first' && x.good === false ).length;
      testFail += inTime.filter( x => x.type === 'test' && x.good === false ).length;
      scraps += inTime.filter( x => x.type === 'scrap' && x.good === true ).length;
    }
    
    resolve({finishedItems, firstPass, firstFail, testFail, scraps});
  });
}

function loopNonCons(nonCons, from, to, flatTypeListClean, phases, getNC, getType, getPhase) {
  return new Promise(resolve => {
    const inTime = getNC ? nonCons.filter( x => moment(x.time).isBetween(from, to) ) : [];
    let foundNC = getNC ? inTime.length : false;
    let uniqueSerials = getNC ? [... new Set( Array.from(inTime, x => x.serial ) ) ].length : false;
    let typeBreakdown = getNC && getType ? [] : false;
    if(getNC && getType) {
      for(let ncOp of flatTypeListClean) {
        const num = inTime.filter( x => x.type === ncOp ).length;
        typeBreakdown.push([ ncOp, num ]);
      }
    }else{null}
    
    let phaseBreakdown = getNC && getPhase ? [] : false;
    if(getNC && getPhase) {
      for(let ph of phases) {
        const num = inTime.filter( x => x.where === ph ).length;
        phaseBreakdown.push([ ph, num ]);
      }
    }else{null}
    
    resolve({foundNC, uniqueSerials, typeBreakdown, phaseBreakdown});
  });
}




Meteor.methods({
  
  buildReport(startDay, endDay, getNC, getType, getPhase) {
    const orgKey = Meteor.user().orgKey;
    let org = AppDB.findOne({orgKey: Meteor.user().orgKey});
    
    const ncTypesCombo = Array.from(org.nonConTypeLists, x => x.typeList);
  	    const ncTCF = [].concat(...ncTypesCombo,...org.nonConOption);
	  const flatTypeList = Array.from(ncTCF, x => 
	    typeof x === 'string' ? x : 
	    x.live === true && x.typeText
	  );
	  const flatTypeListClean = flatTypeList.filter(f=> f);
        
    let phases = !org ? [] : org.phases;
    const from = moment(startDay).startOf('day').format();
    const to = moment(endDay).endOf('day').format();
    
    async function getBatches() {
      try {
        batchSlice = await findRelevantBatches(orgKey, from, to);
        batchArange = await loopBatches(batchSlice, from, to);
        itemStats = await loopItems(batchArange.allItems, from, to);
        nonConStats = await loopNonCons(batchArange.allNonCons, from, to, flatTypeListClean, phases, getNC, getType, getPhase);
        const batchInclude = batchSlice.length;
        const itemsInclude = batchArange.allItems.length;
        //const itemsWithPercent = ( ( nonConStats.uniqueSerials / itemsInclude ) * 100 ).toFixed(1) + '%';
        const shortfallCount = batchArange.shortfallCount;
        return {batchInclude, itemsInclude, shortfallCount, itemStats, nonConStats};
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    return getBatches();
  }
  
  
})