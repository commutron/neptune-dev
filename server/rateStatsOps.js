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
    /*
    const fetchU = Meteor.users.aggregate([
      { $match: { 
          orgKey: accessKey,
          createdAt: { 
            $gte: new Date(rangeStart),
            $lte: new Date(rangeEnd) 
          }
      } },
      { $count: "uCount" }
    ]);
    const resultU = fetchU[0] ? fetchU[0].uCount : 0;
    */
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
    /*
    const fetchG = GroupDB.aggregate([
      { $match: { 
          orgKey: accessKey,
          createdAt: { 
            $gte: new Date(rangeStart),
            $lte: new Date(rangeEnd) 
          }
      } },
      { $count: "gCount" }
    ]);
    const resultG = fetchG[0] ? fetchG[0].gCount : 0;
    */
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
    /*
    const fetchW = WidgetDB.aggregate([
      { $match: { 
          orgKey: accessKey,
          createdAt: { 
            $gte: new Date(rangeStart),
            $lte: new Date(rangeEnd) 
          }
      } },
      { $count: "wCount" }
    ]);
    const resultW = fetchW[0] ? fetchW[0].wCount : 0;
    */
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
    /*
    const fetchV = VariantDB.aggregate([
      { $match: { 
          orgKey: accessKey,
          createdAt: { 
            $gte: new Date(rangeStart),
            $lte: new Date(rangeEnd) 
          }
      } },
      { $count: "vCount" }
    ]);
    const resultV = fetchV[0] ? fetchV[0].vCount : 0;
    */
    return resultV;
  }

  export function countNewBatch(accessKey, rangeStart, rangeEnd) {
    
    const resultB = BatchDB.find({
      orgKey: accessKey, 
      createdAt: { 
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }
    },{fields:{'_id':1}}).count();
    
    const resultX = XBatchDB.find({
      orgKey: accessKey, 
      createdAt: { 
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }
    },{fields:{'_id':1}}).count();
    
    /*
    const fetchB = BatchDB.aggregate([
      { $match: { 
          orgKey: accessKey,
          createdAt: { 
            $gte: new Date(rangeStart),
            $lte: new Date(rangeEnd) 
          }
      } },
      { $count: "bCount" }
    ]);
    const resultB = fetchB[0] ? fetchB[0].bCount : 0;
    
    const fetchX = XBatchDB.aggregate([
      { $match: { 
          orgKey: accessKey, 
          createdAt: { 
            $gte: new Date(rangeStart),
            $lte: new Date(rangeEnd) 
          }
      } },
      { $count: "xCount" }
    ]);
    const resultX = fetchX[0] ? fetchX[0].xCount : 0;
   */
    return resultB + resultX;
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
    
    const b = BatchDB.find({
      orgKey: accessKey, 
      finishedAt: { 
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }
    },{fields:{
      'end': 1,
      'finishedAt': 1,
      'tide': 1,
      'quoteTimeBudget': 1,
      'lockTrunc': 1
    }}).fetch();
    await Promise.all(b.map( async (gf, inx)=> {
      await new Promise( (resolve)=> {
        doneCalc(gf.end, gf.finishedAt, gf.tide, gf.quoteTimeBudget, gf.lockTrunc);
        resolve(true);
      });
    }));
    
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
    
    let diCount = 0;
    
    BatchDB.find({
      orgKey: accessKey,
      createdAt: { 
        $lte: new Date(rangeEnd)
      },
      items: { $elemMatch: { createdAt: {
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }}}
    }).forEach( (gf)=> {
      const thisDI = gf.items.filter( x =>
        moment(x.createdAt).isBetween(rangeStart, rangeEnd)
      );
      
      diCount = diCount + thisDI.length;   
    });
    return diCount;
  }
  
  export function countDoneItem(accessKey, rangeStart, rangeEnd) {
    
    let diCount = 0;
    
    BatchDB.find({
      orgKey: accessKey,
      createdAt: { 
        $lte: new Date(rangeEnd)
      },
      items: { $elemMatch: { finishedAt: {
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }}}
    }).forEach( (gf)=> {
      const thisDI = gf.items.filter( x =>
        x.finishedAt !== false &&
        moment(x.finishedAt).isBetween(rangeStart, rangeEnd)
      );
      diCount = diCount + thisDI.length;   
    });
    return diCount;
  }
  
  export function countNewNC(accessKey, rangeStart, rangeEnd) {
    
    let ncCount = 0;
    
    BatchDB.find({
      orgKey: accessKey,
      createdAt: { 
        $lte: new Date(rangeEnd)
      },
      nonCon: { $elemMatch: { time: { 
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }}}
    }).forEach( (gf)=> {
      if(gf.lock) {
        const tnc = gf.lockTrunc.ncTypes.reduce( 
                      (acc, obj)=> { return acc + obj.count },0);
        ncCount += tnc;
      }else{
        const thisNC = gf.nonCon.filter( 
          x => moment(x.time).isBetween(rangeStart, rangeEnd) 
        );
        ncCount += thisNC.length;
      }
    });
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
    
    BatchDB.find({
      orgKey: accessKey, 
      createdAt: { 
        $lte: new Date(rangeEnd)
      },
      shortfall: { $elemMatch: { cTime: { 
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd)
      }}}
    }).forEach( (gf)=> {
      if(gf.lock) {
        const tsh = gf.lockTrunc.shTypes.reduce( 
                      (acc, obj)=> { return acc + obj.count },0);
        shCount += tsh;
      }else{
        const thisSH = gf.shortfall.filter( 
          x => moment(x.cTime).isBetween(rangeStart, rangeEnd) 
        );
        shCount += thisSH.length;
      }
    });
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
    
    BatchDB.find({
      orgKey: accessKey,
      createdAt: { 
        $lte: new Date(rangeEnd)
      },
      items: { $elemMatch: { 
        createdAt: { 
          $lte: new Date(rangeEnd)
        }, 
        finishedAt: { 
          $gte: new Date(rangeStart)
      }}}
    }).forEach( (gf)=> {
      const thisTF = gf.items.filter( x =>
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
    
    BatchDB.find({
      orgKey: accessKey,
      createdAt: { 
        $lte: new Date(rangeEnd)
      },
      items: { $elemMatch: { finishedAt: { 
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }}}
    }).forEach( (gf)=> {
      const thisSC = gf.items.filter( x =>
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
  
  
  
  
});