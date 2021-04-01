import moment from 'moment';
import 'moment-timezone';
// import 'moment-business-time';
import Config from '/server/hardConfig.js';
import { deliveryBinary } from '/server/reportCompleted.js';
import { checkTimeBudget } from '/server/tideGlobalMethods';

  export function countNewUser(accessKey, rangeStart, rangeEnd) {
    const resultU = Meteor.users.find({
      orgKey: accessKey, 
      createdAt: { 
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }
    },{fields:{'_id':1}},{limit:1}).count();
    return resultU;
  }

  export function countNewGroup(accessKey, rangeStart, rangeEnd) {
    const resultG = GroupDB.find({
      orgKey: accessKey, 
      createdAt: { 
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }
    },{fields:{'_id':1}}).count();
    return resultG;
  }

  export function countNewWidget(accessKey, rangeStart, rangeEnd) {
    const resultW = WidgetDB.find({
      orgKey: accessKey, 
      createdAt: { 
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }
    },{fields:{'_id':1}}).count();
    return resultW;
  }
  
  export function countNewVariant(accessKey, rangeStart, rangeEnd) {
    const resultV = VariantDB.find({
      orgKey: accessKey, 
      createdAt: { 
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }
    },{fields:{'_id':1}}).count();
    return resultV;
  }

  export function countNewBatch(accessKey, rangeStart, rangeEnd) {
    
    const result = XBatchDB.find({
      orgKey: accessKey, 
      createdAt: { 
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }
    },{fields:{'_id':1}}).count();
    
    return result;
  }
  
  export async function countDoneBatch(accessKey, rangeStart, rangeEnd) {
    
    let doneOnTime = 0;
    let doneLate = 0;
    let shipOnTime = 0;
    let shipLate = 0;
    let doneUnderQ = 0;
    let doneOverQ = 0;
    
    const doneCalc = (endAt, doneAt, tide, quoteTimeBudget, lockTrunc)=> {
      const dst = deliveryBinary(endAt, doneAt);
      dst[0] === 'late' ? doneLate++ : doneOnTime++;
      dst[1] === 'late' ? shipLate++ : shipOnTime++;
      
      const q = checkTimeBudget(tide, quoteTimeBudget, lockTrunc);
      if( !q ) {
        null;
      }else if(q < 0) {
        doneOverQ++;
      }else{
        doneUnderQ++;
      }
    };
    
    const bx = XBatchDB.find({
      orgKey: accessKey, 
      completedAt: { 
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }
    },{fields:{
      'salesEnd': 1,
      'completedAt': 1,
      'tide': 1,
      'quoteTimeBudget': 1,
      'lockTrunc': 1
    }}).fetch();
    await Promise.all(bx.map( async (gfx, inx)=> {
      await new Promise( (resolve)=> {
        doneCalc(gfx.salesEnd, gfx.completedAt, gfx.tide, gfx.quoteTimeBudget, gfx.lockTrunc);
        resolve(true);
      });
    }));
    
    return [ 
      doneOnTime,
      doneLate,
      shipOnTime,
      shipLate,
      doneUnderQ,
      doneOverQ
    ];
  }
  
  export function countNewItem(accessKey, rangeStart, rangeEnd) {
    
    let niCount = 0;
    
    XSeriesDB.find({
      orgKey: accessKey,
      createdAt: { 
        $lte: new Date(rangeEnd)
      },
      items: { $elemMatch: { createdAt: {
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }}}
    }).forEach( (srs)=> {
      const thisI = srs.items.filter( x =>
        moment(x.createdAt).isBetween(rangeStart, rangeEnd)
      );
      
      niCount = niCount + thisI.length;   
    });
    
    return niCount;
  }
  
  export function countDoneItem(accessKey, rangeStart, rangeEnd) {
    
    let diCount = 0;
    
    XSeriesDB.find({
      orgKey: accessKey,
      createdAt: { 
        $lte: new Date(rangeEnd)
      },
      items: { $elemMatch: { completedAt: {
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }}}
    }).forEach( (srs)=> {
      const thisI = srs.items.filter( x =>
        x.completed &&
        moment(x.completedAt).isBetween(rangeStart, rangeEnd)
      );
      diCount = diCount + thisI.length;   
    });
    
    return diCount;
  }
  
  export function countNewNC(accessKey, rangeStart, rangeEnd) {
    
    let ncCount = 0;
    
    XSeriesDB.find({
      orgKey: accessKey,
      createdAt: { 
        $lte: new Date(rangeEnd)
      },
      nonCon: { $elemMatch: { time: { 
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }}}
    }).forEach( (srs)=> {
      const thisNC = srs.nonCon.filter( 
        x => moment(x.time).isBetween(rangeStart, rangeEnd) 
      );
      ncCount += thisNC.length;
    });
    /* // count from batch lockTrunc \\
      const tnc = batch.lockTrunc.ncTypes.reduce( 
                      (acc, obj)=> { return acc + obj.count },0);
      ncCount += tnc; */
      
    return ncCount;
  }
  
  export function countNewSH(accessKey, rangeStart, rangeEnd) {
    let shCount = 0;
    
    XSeriesDB.find({
      orgKey: accessKey, 
      createdAt: { 
        $lte: new Date(rangeEnd)
      },
      shortfall: { $elemMatch: { cTime: { 
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd)
      }}}
    }).forEach( (srs)=> {
      const thisSH = srs.shortfall.filter( 
        x => moment(x.cTime).isBetween(rangeStart, rangeEnd) 
      );
      shCount += thisSH.length;
    });
    /* // count from batch lockTrunc \\
      const tsh = batch.lockTrunc.shTypes.reduce( 
                      (acc, obj)=> { return acc + obj.count },0);
      shCount += tsh; */
      
    return shCount;
  }
  
  export function countTestFail(accessKey, rangeStart, rangeEnd) {
    let tfCount = 0;
    
    XSeriesDB.find({
      orgKey: accessKey,
      createdAt: { 
        $lte: new Date(rangeEnd)
      },
      items: { $elemMatch: { 
        createdAt: { 
          $lte: new Date(rangeEnd)
        }, 
        completedAt: { 
          $gte: new Date(rangeStart)
      }}}
    }).forEach( (srs)=> {
      const thisTF = srs.items.filter( x =>
        x.history.find( y =>
          moment(y.time).isBetween(rangeStart, rangeEnd) &&
          y.type === 'test' && y.good === false )
      );
      
      tfCount = tfCount + thisTF.length;   
    });
    return tfCount;
  }
  
  export function countScrap(accessKey, rangeStart, rangeEnd) {
    let scCount = 0;
    
    XSeriesDB.find({
      orgKey: accessKey,
      createdAt: { 
        $lte: new Date(rangeEnd)
      },
      items: { $elemMatch: { completedAt: { 
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }}}
    }).forEach( (srs)=> {
      const thisSC = srs.items.filter( x =>
        x.history.find( y =>
          moment(y.time).isBetween(rangeStart, rangeEnd) &&
          y.type === 'scrap' && y.good === true )
      );
      scCount = scCount + thisSC.length;   
    });
    return scCount;
  }


Meteor.methods({
  
  
  cycleWeekRate(stat, cycles, bracket) {
    this.unblock();
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
      }else if( stat === 'newVariant' ) {
        loop = countNewVariant;
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
        return Meteor.call('loopTimeRanges', accessKey, loop, cycles, bracket);
      }
    }catch(err) {
      throw new Meteor.Error(err);
    }
  },
  
  loopTimeRanges(accessKey, counter, cycles, bracket) {
    const nowLocal = moment().tz(Config.clientTZ);
    
    async function runLoop() {
      let countArray = [];
      for(let w = 0; w < cycles; w++) {
      
        const loopBack = nowLocal.clone().subtract(w, bracket); 
       
        const rangeStart = loopBack.clone().startOf(bracket).toISOString();
        const rangeEnd = loopBack.clone().endOf(bracket).toISOString();
        
        const quantity = await new Promise(function(resolve) {
          resolve( counter(accessKey, rangeStart, rangeEnd) );
        });
        countArray.unshift({ x:cycles-w, y:quantity });
      }
      return countArray;
    }
    return runLoop();
  },
  
  
  cycleLiteRate(cName, cycles) {
    this.unblock();
      try {

      if( !cName || typeof cName !== 'string' || typeof cycles !== 'number' ) {
        return false;
      }else{
        const accessKey = Meteor.user().orgKey;
        
        const lite = CacheDB.findOne({ orgKey: accessKey, dataName: cName });
        const liteSet = lite.dataSet || [];
        
        if(liteSet.length >= cycles) {
          
          const cut = -Math.abs(cycles);
  
          const sliceSet = liteSet.slice(cut, liteSet.length);
          
          return sliceSet;
        }else{
          return [];
        }
      }
    }catch(err) {
      throw new Meteor.Error(err);
    }
  }
  
  
});