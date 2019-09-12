import moment from 'moment';
import business from 'moment-business';
import 'moment-timezone';
import 'moment-business-time';


  function weekRanges(clientTZ, counter, cycles) {
    const nowLocal = moment().tz(clientTZ);
    
    let countArray = [];
    for(let w = 0; w < cycles; w++) {
    
      const loopBack = nowLocal.clone().subtract(w, 'week'); 
     
      const rangeStart = loopBack.clone().startOf('week').toISOString();
      const rangeEnd = loopBack.clone().endOf('week').toISOString();
      
      const quantity = counter(rangeStart, rangeEnd);
      countArray.unshift({ x:cycles-w, y:quantity });
    }
    
    return countArray;
  }
  
  function countNewBatch(rangeStart, rangeEnd) {
    
    const generalFind = BatchDB.find({
      orgKey: Meteor.user().orgKey, 
      createdAt: { 
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }
    }).fetch();
    const generalFindX = XBatchDB.find({
      orgKey: Meteor.user().orgKey, 
      createdAt: { 
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }
    }).fetch();
      
    return generalFind.length + generalFindX.length;
  }
  
  function countDoneBatch(rangeStart, rangeEnd) {
    
    let doneOnTime = 0;
    let doneLate = 0;
    
    const generalFind = BatchDB.find({
      orgKey: Meteor.user().orgKey, 
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
      orgKey: Meteor.user().orgKey, 
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
  
  function countDoneItem(rangeStart, rangeEnd) {
    
    let diCount = 0;
    
    const generalFind = BatchDB.find({
      orgKey: Meteor.user().orgKey, 
      items: { $elemMatch: { finishedAt: {
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }}}
    }).fetch();
    
    for(let gf of generalFind) {
      const thisDI = gf.items.filter( x =>
        x.finishedAt !== false &&
        moment(x.finishedAt).isSame(rangeStart, 'week')
      );
      
      diCount = diCount + thisDI.length;   
    }
    return diCount;
  }
  
  function countNewNC(rangeStart, rangeEnd) {
    
    let ncCount = 0;
    
    const generalFind = BatchDB.find({
      orgKey: Meteor.user().orgKey, 
      nonCon: { $elemMatch: { time: { 
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }}}
    }).fetch();
    for(let gf of generalFind) {
      const thisNC = gf.nonCon.filter( 
        x => moment(x.time).isSame(rangeStart, 'week') 
      );
      ncCount = ncCount + thisNC.length;   
    }
    /*
    const generalFindX = XBatchDB.find({
      orgKey: Meteor.user().orgKey, 
      'nonconformaces.time': { 
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }
    }).fetch();
    */  
    return ncCount;
  }
  
  function countNewSH(rangeStart, rangeEnd) {
    
    let shCount = 0;
    
    const generalFind = BatchDB.find({
      orgKey: Meteor.user().orgKey, 
      shortfall: { $elemMatch: { cTime: { 
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }}}
    }).fetch();
    for(let gf of generalFind) {
      const thisSH = gf.shortfall.filter( 
        x => moment(x.cTime).isSame(rangeStart, 'week') 
      );
      shCount = shCount + thisSH.length;   
    }
    /*
    const generalFindX = XBatchDB.find({
      orgKey: Meteor.user().orgKey, 
      'omitted.time': { 
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }
    }).fetch();
    */  
    return shCount;
  }
  
  function countScrap(rangeStart, rangeEnd) {
    
    let scCount = 0;
    
    const generalFind = BatchDB.find({
      orgKey: Meteor.user().orgKey, 
      items: { $elemMatch: { finishedAt: { 
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }}}
    }).fetch();
    
    for(let gf of generalFind) {
      const thisSC = gf.items.filter( x =>
        x.history.find( y =>
          moment(y.time).isSame(rangeStart, 'week') &&
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
        const runCounter = weekRanges(clientTZ, loop, cycles);
        return runCounter;
      }
    }catch(err) {
      throw new Meteor.Error(err);
    }
  }
  

  
  
  
});