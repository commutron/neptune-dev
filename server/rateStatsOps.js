import moment from 'moment';
import 'moment-timezone';
// import 'moment-business-time';


  function timeRanges(accessKey, clientTZ, counter, cycles, bracket) {
    const nowLocal = moment().tz(clientTZ);
    
    async function runLoop() {
      let countArray = [];
      for(let w = 0; w < cycles; w++) {
      
        const loopBack = nowLocal.clone().subtract(w, bracket); 
       
        const rangeStart = loopBack.clone().startOf(bracket).toISOString();
        const rangeEnd = loopBack.clone().endOf(bracket).toISOString();
        
        
        quantity = await new Promise(function(resolve) {
          const fetch = counter(accessKey, rangeStart, rangeEnd);
          resolve(fetch);
        });
        countArray.unshift({ x:cycles-w, y:quantity });
      }
      return countArray;
    }
      
      return runLoop();
    
  }
  
  export function countNewUser(accessKey, rangeStart, rangeEnd) {
    const userFind = Meteor.users.find({
      orgKey: accessKey, 
      createdAt: { 
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }
    }).fetch();
    return userFind.length;
  }

  export function countNewGroup(accessKey, rangeStart, rangeEnd) {
    const groupFind = GroupDB.find({
      orgKey: accessKey, 
      createdAt: { 
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }
    }).fetch();
    return groupFind.length;
  }

  export function countNewWidget(accessKey, rangeStart, rangeEnd) {
    const widgetFind = WidgetDB.find({
      orgKey: accessKey, 
      createdAt: { 
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }
    }).fetch();
    return widgetFind.length;
  }

  export function countNewVersion(accessKey, rangeStart, rangeEnd) {
    const widgetFind = WidgetDB.find({
      orgKey: accessKey, 
      createdAt: { 
        $lte: new Date(rangeEnd) 
      }
    }).fetch();
    
    let vCount = 0;
    for(let wf of widgetFind) {
      const thisV = wf.versions.filter( x =>
        moment(x.createdAt).isBetween(rangeStart, rangeEnd)
      );
      vCount = vCount + thisV.length;   
    }
    return vCount;
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
      if( moment(gf.finishedAt).isSameOrBefore(moment(gf.end), 'day') ) {
        doneOnTime++;
      }else if( moment(gf.finishedAt).isAfter(moment(gf.end), 'day') ) {
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
    for(let gfx of generalFindX) {
      if( moment(gfx.completedAt).isSameOrBefore(moment(gfx.salesEnd), 'day') ) {
        doneOnTimeX++;
      }else if( moment(gfx.completedAt).isAfter(moment(gfx.salesEnd), 'day') ) {
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
  
  export function countTestFail(accessKey, rangeStart, rangeEnd) {
    let tfCount = 0;
    
    const generalFind = BatchDB.find({
      orgKey: accessKey, 
      items: { $elemMatch: { 
        createdAt: { 
          $lte: new Date(rangeEnd) 
        }, 
        finishedAt: { 
          $gte: new Date(rangeStart) 
      }}}
    }).fetch();
    
    for(let gf of generalFind) {
      const thisTF = gf.items.filter( x =>
        x.history.find( y =>
          moment(y.time).isBetween(rangeStart, rangeEnd) &&
          y.type === 'test' && y.good === false )
      );
      
      tfCount = tfCount + thisTF.length;   
    }
    return tfCount;
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
  
  
  cycleWeekRate(clientTZ, stat, cycles, bracket) {////
    try {
      let loop = false;
      
      if( !stat || typeof stat !== 'string' ) {
        null;
      }else if( stat === 'newUser' ) {
        loop = countNewUser;
      }else if( stat === 'newGroup' ) {
        loop = countNewGroup;
      }else if( stat === 'newWidget' ) {
        loop = countNewWidget;
      }else if( stat === 'newVersion' ) {
        loop = countNewVersion;
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
      }else if( stat === 'failItem' ) {
        loop = countTestFail;
      }else if( stat === 'scrapItem' ) {
        loop = countScrap;
      }else{
        null;
      }
      
      if( !loop || typeof cycles !== 'number' ) {
        return false;
      }else{
        const accessKey = Meteor.user().orgKey;
        return timeRanges(accessKey, clientTZ, loop, cycles, bracket);
      }
    }catch(err) {
      throw new Meteor.Error(err);
    }
  }
  

  
  
  
});