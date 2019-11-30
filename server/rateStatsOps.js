import moment from 'moment';
import 'moment-timezone';
// import 'moment-business-time-ship';


  function weekRanges(accessKey, clientTZ, counter, cycles) {
    const nowLocal = moment().tz(clientTZ);
    
    let countArray = [];
    for(let w = 0; w < cycles; w++) {
    
      const loopBack = nowLocal.clone().subtract(w, 'week'); 
     
      const rangeStart = loopBack.clone().startOf('week').toISOString();
      const rangeEnd = loopBack.clone().endOf('week').toISOString();
      
      const quantity = counter(accessKey, rangeStart, rangeEnd);
      countArray.unshift({ x:cycles-w, y:quantity });
    }
    
    return countArray;
  }
  
  export function countNewBatch(accessKey, rangeStart, rangeEnd) {
    
    const generalFind = BatchDB.find({
      orgKey: accessKey, 
      createdAt: { 
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }
    }).fetch();
    const generalFindX = XBatchDB.find({
      orgKey: accessKey, 
      createdAt: { 
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }
    }).fetch();
      
    return generalFind.length + generalFindX.length;
  }
  
  export function countDoneBatch(accessKey, rangeStart, rangeEnd) {
    
    let doneOnTime = 0;
    let doneLate = 0;
    
    const generalFind = BatchDB.find({
      orgKey: accessKey, 
      finishedAt: { 
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }
    }).fetch();
    for(let gf of generalFind) {
      if( moment(gf.finishedAt).isSameOrBefore(gf.end) ) {
        doneOnTime++;
      }else if( moment(gf.finishedAt).isAfter(gf.end) ) {
        doneLate++;
      }else{
        null;
      }
    }
    
    let doneOnTimeX = 0;
    let doneLateX = 0;
    
    const generalFindX = XBatchDB.find({
      orgKey: accessKey, 
      completedAt: { 
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }
    }).fetch();
    for(let gf of generalFindX) {
      if( moment(gf.completedAt).isSameOrBefore(gf.salesEnd) ) {
        doneOnTimeX++;
      }else if( moment(gf.completedAt).isAfter(gf.salesEnd) ) {
        doneLateX++;
      }else{
        null;
      }
    }
    
    return [ doneOnTime + doneOnTimeX, doneLate + doneLateX ];
  }
  
  export function countNewItem(accessKey, rangeStart, rangeEnd) {
    
    let diCount = 0;
    
    const generalFind = BatchDB.find({
      orgKey: accessKey, 
      items: { $elemMatch: { createdAt: {
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }}}
    }).fetch();
    
    for(let gf of generalFind) {
      const thisDI = gf.items.filter( x =>
        moment(x.createdAt).isBetween(rangeStart, rangeEnd)
      );
      
      diCount = diCount + thisDI.length;   
    }
    return diCount;
  }
  
  export function countDoneItem(accessKey, rangeStart, rangeEnd) {
    
    let diCount = 0;
    
    const generalFind = BatchDB.find({
      orgKey: accessKey, 
      items: { $elemMatch: { finishedAt: {
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }}}
    }).fetch();
    
    for(let gf of generalFind) {
      const thisDI = gf.items.filter( x =>
        x.finishedAt !== false &&
        moment(x.finishedAt).isBetween(rangeStart, rangeEnd)
      );
      
      diCount = diCount + thisDI.length;   
    }
    return diCount;
  }
  
  export function countNewNC(accessKey, rangeStart, rangeEnd) {
    
    let ncCount = 0;
    
    const generalFind = BatchDB.find({
      orgKey: accessKey, 
      nonCon: { $elemMatch: { time: { 
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }}}
    }).fetch();
    for(let gf of generalFind) {
      const thisNC = gf.nonCon.filter( 
        x => moment(x.time).isBetween(rangeStart, rangeEnd) 
      );
      ncCount = ncCount + thisNC.length;   
    }
    /*
    const generalFindX = XBatchDB.find({
      orgKey: accessKey, 
      'nonconformaces.time': { 
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }
    }).fetch();
    */  
    return ncCount;
  }
  
  export function countNewSH(accessKey, rangeStart, rangeEnd) {
    
    let shCount = 0;
    
    const generalFind = BatchDB.find({
      orgKey: accessKey, 
      shortfall: { $elemMatch: { cTime: { 
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }}}
    }).fetch();
    for(let gf of generalFind) {
      const thisSH = gf.shortfall.filter( 
        x => moment(x.cTime).isBetween(rangeStart, rangeEnd) 
      );
      shCount = shCount + thisSH.length;   
    }
    /*
    const generalFindX = XBatchDB.find({
      orgKey: accessKey, 
      'omitted.time': { 
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }
    }).fetch();
    */  
    return shCount;
  }
  
  export function countScrap(accessKey, rangeStart, rangeEnd) {
    
    let scCount = 0;
    
    const generalFind = BatchDB.find({
      orgKey: accessKey, 
      items: { $elemMatch: { finishedAt: { 
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }}}
    }).fetch();
    
    for(let gf of generalFind) {
      const thisSC = gf.items.filter( x =>
        x.history.find( y =>
          moment(y.time).isBetween(rangeStart, rangeEnd) &&
          y.type === 'scrap' && y.good === true )
      );
      
      scCount = scCount + thisSC.length;   
    }
    return scCount;
  }
      
  
Meteor.methods({
  
  
  cycleWeekRate(clientTZ, stat, cycles) {
    try {
      let loop = false;
      
      if( !stat || typeof stat !== 'string' ) {
        null;
      }else if( stat === 'newBatch' ) {
        loop = countNewBatch;
      }else if( stat === 'doneBatch' ) {
        loop = countDoneBatch;
      }else if( stat === 'newItem' ) {
        loop = countNewItem;
      }else if( stat === 'doneItem' ) {
        loop = countDoneItem;
      }else if( stat === 'newNC' ) {
        loop = countNewNC;
      }else if( stat === 'newSH' ) {
        loop = countNewSH;
      }else if( stat === 'scrapItem' ) {
        loop = countScrap;
      }else{
        null;
      }
      
      if( !loop || typeof cycles !== 'number' ) {
        return false;
      }else{
        const accessKey = Meteor.user().orgKey;
        const runCounter = weekRanges(accessKey, clientTZ, loop, cycles);
        return runCounter;
      }
    }catch(err) {
      throw new Meteor.Error(err);
    }
  }
  

  
  
  
});