import moment from 'moment';
import { batchTideTime } from '/server/tideGlobalMethods';
import { syncLocale } from '/server/utility.js';
import { getShipDue, getEndWork } from '/server/shipOps';

Meteor.methods({

  addBatchX(batchNum, groupId, widgetId, vKey, 
            salesNum, sDate, eDate, quantity, withSeries, qTime
  ) {
    const doc = WidgetDB.findOne({ _id: widgetId },{fields:{'orgKey':1}});
    const duplicateX = XBatchDB.findOne({ batch: batchNum },{fields:{'_id':1}});
    const auth = Roles.userIsInRole(Meteor.userId(), 'create');
    const accessKey = Meteor.user().orgKey;
    
    const inHours = parseFloat( qTime );
    const inMinutes = moment.duration(inHours, 'hours').asMinutes();
    const qTimeNum = isNaN(inMinutes) ? false : Number(inMinutes);

    if(auth && !duplicateX && doc.orgKey === accessKey) {

      XBatchDB.insert({
  			batch: batchNum,
  			orgKey: accessKey,
  			shareKey: null,
  			groupId: groupId,
  			widgetId: widgetId,
  			versionKey: vKey,
        tags: [],
        createdAt: new Date(),
        createdWho: Meteor.userId(),
        updatedAt: new Date(),
  			updatedWho: Meteor.userId(),
  			live: true,
  			salesOrder: salesNum,
  			salesStart: new Date(sDate),
  			salesEnd: new Date(eDate),
  			quoteTimeBudget: [{
          updatedAt: new Date(),
          timeAsMinutes: qTimeNum
        }],
  			completed: false,
  			completedAt: null,
  			completedWho: null,
  			quantity: Number(quantity),
  			serialize: withSeries,
  			river: false,
  			waterfall: [],
  			tide: [],
  			blocks: [],
        releases: [],
        altered: [],
        events: []
      });
      
      // full scheme adds lock, lockTrunc, finBffrRel, finShipAim, finShipDue, finEndWork
      if(withSeries) {
        const duplicate = XSeriesDB.findOne({batch: batchNum},{fields:{'_id':1}});
        
        if(!duplicate) {
          XSeriesDB.insert({
      			batch: batchNum,
      			orgKey: accessKey,
      	    groupId: groupId,
      			widgetId: widgetId,
      			versionKey: vKey,
            createdAt: new Date(),
            createdWho: Meteor.userId(),
            updatedAt: new Date(),
      			updatedWho: Meteor.userId(),
            items: [],
            nonCon: [],
            shortfall: [],
          });
        }
      }
      
      Meteor.defer( ()=>{
        Meteor.call('buildNewTraceX', batchNum, accessKey);
      });
      return true;
    }else{
      return false;
    }
  },
  
  editBatchX(batchId, newBatchNum, vKey, salesNum, sDate, quantity) {
    const accessKey = Meteor.user().orgKey;
    const auth = Roles.userIsInRole(Meteor.userId(), ['edit','run']);
    
    const doc = XBatchDB.findOne({_id: batchId},{fields:{'orgKey':1,'batch':1,'tide':1}});
    const srs = XSeriesDB.findOne({batch: doc.batch},{fields:{'_id':1}});

    if(auth && doc.orgKey === accessKey) {
      const numswitch = doc.batch !== newBatchNum;
      
      const openTide = !numswitch ? false :
                       doc.tide && doc.tide.find( t => t.stopTime === false );
      
      let duplicate = !numswitch ? false :
                      XBatchDB.findOne({batch: newBatchNum},{fields:{'_id':1}});
    
      if(!openTide && !duplicate) {
        XBatchDB.update({_id: batchId, orgKey: accessKey}, {
          $set : {
            batch: newBatchNum,
            versionKey: vKey,
            salesOrder: salesNum,
            salesStart: new Date(sDate),
    			  quantity: Number(quantity),
    			  updatedAt: new Date(),
    			  updatedWho: Meteor.userId()
          }});
        
        if(srs) {
          XSeriesDB.update({batch: doc.batch}, {
            $set : {
        			batch: newBatchNum,
        			versionKey: vKey,
              updatedAt: new Date(),
        			updatedWho: Meteor.userId(),
            }
          });
        }
        
        Meteor.defer( ()=>{
          Meteor.call('updateOneMinify', batchId, accessKey);
        });
        return true;
      }
    }else{
      return false;
    }
  },

  alterBatchXFulfill(batchId, oldDate, newDate, reason) {
    const accessKey = Meteor.user().orgKey;
    const auth = Roles.userIsInRole(Meteor.userId(), ['edit', 'sales']);
    
    if(auth) {
      XBatchDB.update({_id: batchId, orgKey: accessKey}, {
        $set : {
          salesEnd: new Date(newDate),
        }});
      XBatchDB.update({_id: batchId, orgKey: accessKey}, {
        $push : {
          altered: {
            changeDate: new Date(),
            changeWho: Meteor.userId(),
            changeReason: reason,
            changeKey: 'salesEnd',
            oldValue: oldDate,
            newValue: newDate
          }
        }});
      Meteor.defer( ()=>{
        Meteor.call('updateOneMovement', batchId, accessKey);
      });
      if(XBatchDB.findOne({_id: batchId, completed: true},{fields:{'_id':1}})) {
        Meteor.defer( ()=>{
          Meteor.call('saveEndState', batchId, accessKey);
        });
      }
      return true;
    }else{
      return false;
    }
  },
  
  changeStatusX(batchId, status) {
    const flip = !status;
    const txtOld = flip.toString();
    const txtNew = status.toString();
    const accessKey = Meteor.user().orgKey;
    if(Roles.userIsInRole(Meteor.userId(), 'run')) {
      XBatchDB.update({_id: batchId, orgKey: accessKey}, {
  			$set : {
  			  live: status
        },
        $push : {
          altered: {
            changeDate: new Date(),
            changeWho: Meteor.userId(),
            changeReason: 'user discretion',
            changeKey: 'live',
            oldValue: txtOld,
            newValue: txtNew
          }
        }});
        Meteor.defer( ()=>{
          Meteor.call('updateOneMovement', batchId, accessKey);
          if(status === true) {
            Meteor.call('disableLockX', batchId, accessKey);
          }
        });
    }else{null}
  },
  
  enableLockX(batchId, privateKey) {
    const accessKey = privateKey || Meteor.user().orgKey;
    const doc = XBatchDB.findOne({_id: batchId});
    const srs = XSeriesDB.findOne({batch: doc.batch});
    const clear = doc.live === false && doc.completed === true &&
                    doc.salesEnd < new Date();
    if(( privateKey || Roles.userIsInRole(Meteor.userId(), 'run') ) && clear) {
      
      const tTime = !doc.tide ? 0 : batchTideTime(doc.tide);
      const wfCount = Meteor.call('waterfallSelfCount', doc.waterfall);
      
      const items = !srs ? [] : srs.items;
      let totalUnits = 0;
      let scrapItems = 0;
      let scrapUnits = 0;
      for(let i of items) {
        totalUnits += i.units;
        const sc = i.scrapped;
        !sc ? null : scrapItems += 1;
        !sc ? null : scrapUnits += i.units;
      }
      const ncTypes = !srs ? [] : Meteor.call('nonConSelfCount', srs.nonCon);
      const shPNums = !srs ? [] : Meteor.call('shortfallSelfCount', srs.shortfall);
      const rvSteps = !srs ? [] : Meteor.call('riverStepSelfCount', srs.items);
      
      const endPerformance = Meteor.call('performTarget', batchId);
      
      XBatchDB.update({_id: batchId, orgKey: accessKey}, {
  			$set : {
  			  lock: true,
  			  lockTrunc: {
  			    lockedAt: new Date(),
  			    totalQuantity:  Number(doc.quantity),
  			    itemQuantity:  Number(items.length),
  			    unitQuantity: Number(totalUnits),
  			    scitemQuantity: Number(scrapItems),
  			    scunitQuantity: Number(scrapUnits),
  			    tideTotal: Number(tTime),
  			    ncTypes: ncTypes,
  			    shTypes: shPNums,
  			    rvSteps: rvSteps,
  			    wfSteps: wfCount,
  			    performTgt: endPerformance
  			  }
        }
      });
      return true;
    }else{
      return false;
    }
  },
  
  disableLockX(batchId, privateKey) {
    const doc = XBatchDB.findOne({_id: batchId},{fields:{'lock':1}});
    const locked = doc.lock === true;
    const accessKey = privateKey || Meteor.user().orgKey;
    const auth = privateKey || Roles.userIsInRole(Meteor.userId(), 'run');
    if(auth && locked) {
      XBatchDB.update({_id: batchId, orgKey: accessKey}, {
  			$set : {
  			  lock: false
        }
      });
      return true;
    }else{
      return false;
    }
  },
  
  /////////////// Events ///////////////////////
  setXBatchEvent(accessKey, batchId, eventTitle, eventDetail) {
    XBatchDB.update({_id: batchId, orgKey: accessKey}, {
      $push : { events : { 
        title: eventTitle,
        detail: eventDetail,
        time: new Date()
      }
    }});
  },
  
  pushCustomEvent(batchId, eventTitle, eventDetail) {
    if(Roles.userIsInRole(Meteor.userId(), 'run')) {
      const orgKey = Meteor.user().orgKey;
      const username = Meteor.user().username;
      const sub = 'custom event by ' + username;
      
      XBatchDB.update({_id: batchId, orgKey: orgKey}, {
        $push : { events : { 
          title: eventTitle,
          detail: eventDetail,
          time: new Date(),
          sub: sub
        }
      }});
      return true;
    }
  },
  
  // push a tag
  pushBTagX(batchId, tag) {
    if(Roles.userIsInRole(Meteor.userId(), 'run')) {
      XBatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
        $push : { 
          tags: tag
        }});
    }else{
      null;
    }
  },
  // pull a tag
  pullBTagX(batchId, tag) {
    if(Roles.userIsInRole(Meteor.userId(), 'run')) {
      XBatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
        $pull : {
          tags: tag
        }});
    }else{
      null;
    }
  },
  
  addRelease(batchId, rType, rDate, caution) {
    const accessKey = Meteor.user().orgKey;
    if(Roles.userIsInRole(Meteor.userId(), ['run', 'kitting'])) {
      XBatchDB.update({_id: batchId, orgKey: accessKey}, {
        $push : { releases: {
            type: rType,
            time: rDate,
            who: Meteor.userId(),
            caution: caution
          }
      }});
      Meteor.defer( ()=>{ Meteor.call('updateOneNoise', batchId, accessKey); });
      
      if(rType === 'floorRelease') {
        Meteor.defer( ()=>{
          const batch = XBatchDB.findOne({_id: batchId},{fields:{'groupId':1,'widgetId':1,'salesOrder':1}});
          const group = GroupDB.findOne({_id: batch.groupId},
                          {fields:{'group':1,'alias':1,'emailOptIn':1, 'emailPrime':1, 'emailSecond':1
                        }});
                        
          if(group.emailOptIn && group.emailPrime) {
            const isG = group.group; 
            const wig = WidgetDB.findOne({_id: batch.widgetId},{fields:{'widget':1,'describe':1}});
            const ver = VariantDB.findOne({versionKey: batch.versionKey},{fields:{'variant':1}});
            const isW = wig.widget.toUpperCase() + ' ' + ver.variant + ' - ' + wig.describe;
          
            Meteor.call('handleExternalEmail', 
              accessKey, group.emailPrime, group.emailSecond, 
              isG, isW, batch.salesOrder
            );
          }
        });
      }
      
      return true;
    }else{
      return false;
    }
  },
  
  cancelRelease(batchId, rType) {
    const accessKey = Meteor.user().orgKey;
    if(Roles.userIsInRole(Meteor.userId(), ['run', 'kitting'])) {
      XBatchDB.update({_id: batchId, orgKey: accessKey, 'releases.type': rType}, {
        $pull : { releases: { type: rType }
      }});
      Meteor.defer( ()=>{ Meteor.call('updateOneNoise', batchId, accessKey); });
      return true;
    }else{
      return false;
    }
  },
  
  cautionFlipRelease(batchId, rType, caution) {
    if(Roles.userIsInRole(Meteor.userId(), ['run', 'kitting'])) {
      XBatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'releases.type': rType}, {
        $set : {
          'releases.$.caution': caution
      }});
      return true;
    }else{
      return false;
    }
  },
  
  //// Tide
  
  // push time budget, whole time in minutes for batch
  pushBatchXTimeBudget(batchId, qTime) {
    try{
      const accessKey = Meteor.user().orgKey;
      if(Roles.userIsInRole(Meteor.userId(), ['sales', 'run', 'edit'])) {
        XBatchDB.update({_id: batchId, orgKey: accessKey}, {
          $push : { 
            'quoteTimeBudget': {
              $each: [ {
                updatedAt: new Date(),
                timeAsMinutes: Number(qTime)
              } ],
              $position: 0
            }
          }});
        Meteor.defer( ()=>{
          Meteor.call('updateOneMovement', batchId, accessKey);
        });
      }else{
        null;
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },

  //// River \\\\
  setRiverX(batchId, riverId) {
    const accessKey = Meteor.user().orgKey;
    if(Roles.userIsInRole(Meteor.userId(), 'run')) {
      XBatchDB.update({_id: batchId, orgKey: accessKey}, {
        $set : {
          updatedAt: new Date(),
  			  updatedWho: Meteor.userId(),
          river: riverId,
        }});
      Meteor.defer( ()=>{ 
        Meteor.call('updateOneMinify', batchId, accessKey); 
        Meteor.call('updateOneMovement', batchId, accessKey);
      });
      return true;
    }else{
      return false;
    }
  },
  
  //// Waterfall
  addCounter(batchId, wfKey, gate, type, wfBranch, actionVal) {
    const accessKey = Meteor.user().orgKey;
    const action = actionVal ? actionVal : 'clicker';
    if(Roles.userIsInRole(Meteor.userId(), 'run')) {
      XBatchDB.update({_id: batchId, orgKey: accessKey}, {
        $push : { 
          waterfall: {
            wfKey: wfKey,
            gate: gate,
            type: type,
            position: Number(0),
            action: action,// "slider"
            branchKey: wfBranch,
            counts: []
          }
      }});
      Meteor.defer( ()=>{ 
        Meteor.call('updateOneMinify', batchId, accessKey);
        Meteor.call('updateOneMovement', batchId, accessKey);
      });
      return true;
    }else{
      return false;
    }
  },
  setCounterPosX(batchId, wfKey, wfPos) {
    const accessKey = Meteor.user().orgKey;
    if(Roles.userIsInRole(Meteor.userId(), 'run')) {
      XBatchDB.update({
        _id: batchId,
        orgKey: accessKey,
        'waterfall.wfKey': wfKey
      }, {
        $set : { 
          'waterfall.$.position': Number(wfPos),
      }});
      return true;
    }else{
      return false;
    }
  },
  removeCounter(batchId, wfKey) {
    const accessKey = Meteor.user().orgKey;
    const doc = XBatchDB.findOne({_id: batchId},{fields:{'waterfall':1}});
    const subdoc = doc ? doc.waterfall.find( x => x.wfKey === wfKey) : null;
    const inUse = subdoc ? subdoc.counts.length > 0 : null;
    if(doc && subdoc && !inUse) {
      if(Roles.userIsInRole(Meteor.userId(), 'run')) {
        XBatchDB.update({_id: batchId, orgKey: accessKey}, {
          $pull : {
            waterfall: { wfKey : wfKey }
          }});
        Meteor.defer( ()=>{ 
          Meteor.call('updateOneMinify', batchId, accessKey);
          Meteor.call('updateOneMovement', batchId, accessKey);
        });
        return true;
      }else{
        return false;
      }
    }else{
      return 'inUse';
    }
  },
  
  positiveCounter(batchId, wfKey, upVal) {
    if(!Roles.userIsInRole(Meteor.userId(), 'active')) {
      null;
    }else{
      const num = upVal ? Math.abs(upVal) : Math.abs(1);
      
      XBatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'waterfall.wfKey': wfKey}, {
        $push : { 'waterfall.$.counts': { 
          tick: Number(num),
          time: new Date(),
          who: Meteor.userId()
      }}});
    }
  },
  negativeCounter(batchId, wfKey, dnVal) {
    if(!Roles.userIsInRole(Meteor.userId(), 'active')) {
      null;
    }else{
      const num = dnVal ? -Math.abs(dnVal) : -Math.abs(1);
      
      XBatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'waterfall.wfKey': wfKey}, {
        $push : { 'waterfall.$.counts': { 
          tick: Number(num),
          time: new Date(),
          who: Meteor.userId()
      }}});
    }
  },
  
  // Finish Batch
  finishBatchX(batchId, privateKey) {
    if(privateKey ||
      Roles.userIsInRole(Meteor.userId(), "BRKt3rm1n2t1ng8r2nch") ||
      Roles.userIsInRole(Meteor.userId(), "run") )
    {
      const accessKey = privateKey || Meteor.user().orgKey;
      
      const doc = XBatchDB.findOne({_id: batchId},
                  {fields:{'batch':1,'quantity':1,'serialize':1,'tide':1,'waterfall':1}});
      
      const didSome = doc.quantity > 0;
      
      const didFall = doc.waterfall.length > 0;
      
      let falling = [];
      for(let wf of doc.waterfall) {
        falling.push(wf.counts.length === 0 ? false :
          Array.from(wf.counts, x => x.tick).reduce((x,y)=> x + y) 
          === ( wf.action === "slider" ? 100 : doc.quantity ) );
      }
      const allFall = !didFall ? true : falling.every( x => x === true );
      
      const didFlow = doc.serialize === true;
      const srs = didFlow && XSeriesDB.findOne({batch: doc.batch},{fields:{'items':1}});
      const allFlow = !srs ? true : srs.items.every( x => x.completed === true );
    
      if(didSome && allFall && allFlow) {
        XBatchDB.update({_id: batchId, orgKey: accessKey}, {
    			$set : {
    			  completed: true,
    			  completedAt: new Date(),
    			  completedWho: Meteor.userId(),
        }});
        
        const openRapid = XRapidsDB.findOne({extendBatch: doc.batch, live: true},{fields:{'_id':1}});
        if(!openRapid) {
          XBatchDB.update({_id: batchId, orgKey: accessKey}, {
      			$set : { 
      			  live: false
          }});
        }
        Meteor.defer( ()=>{
          Meteor.call('updateOneMovement', batchId, accessKey);
          Meteor.call('saveEndState', batchId, accessKey);
        });
      }else{null}
    }else{null}
  },
  
  saveEndState(batchId, privateKey) {
    this.unblock();
    const b = XBatchDB.findOne({_id: batchId},{fields:{'salesEnd':1}});
    if(b) {
      syncLocale(privateKey);
      
      const endPriority = Meteor.call('priorityRank', batchId, privateKey);
      
      const endBffrRel = endPriority.bffrRel;
      const endShipAim = endPriority.shipAim;

      const endShipDue = getShipDue(batchId, b.salesEnd);
      const endEndWork = getEndWork(batchId, b.salesEnd);
      
      XBatchDB.update(batchId, {
  			$set : { 
  			  finBffrRel: endBffrRel,
  			  finShipAim: endShipAim,
  			  finShipDue: endShipDue,
  			  finEndWork: endEndWork,
      }});
    }
  },
  
  fixCompleteTime(batchId, backDate) {
    const accessKey = Meteor.user().orgKey;
    if(Roles.userIsInRole(Meteor.userId(), ['edit'])) {
      XBatchDB.update({_id: batchId, orgKey: accessKey}, {
        $set : { 
          completedAt: new Date(backDate),
    			completedWho: Meteor.userId(),
      }});
      Meteor.defer( ()=>{ 
        Meteor.call('updateOneMovement', batchId, accessKey);
        Meteor.call('saveEndState', batchId, accessKey);
      });
      return true;
    }else{
      return false;
    }
  },
  
  // Undo Finish Batch
  undoFinishBatchX(batchId, override) {
    if(!Roles.userIsInRole(Meteor.userId(), 'run' || override === undefined)) {
      null;
    }else{
      const doc = XBatchDB.findOne({_id: batchId},{fields:{'completed':1,'completedAt':1,'lock':1}});
      const completed = doc && doc.completed;
      
      if(completed && !doc.lock) {
        const privateKey = Meteor.user().orgKey;
        const cmltDate = doc.completedAt;
        const inTime = moment().diff(moment(cmltDate), 'minutes') < 60;
        const org = AppDB.findOne({ orgKey: privateKey },{fields:{'orgPIN':1}});
        const orgPIN = org ? org.orgPIN : null;
        if(inTime || orgPIN === override) {
          XBatchDB.update({_id: batchId, orgKey: privateKey}, {
      			$set : { 
      			  live: true,
      			  completed: false,
      			  completedAt: false,
      			  completedWho: false,
            },
            $push : {
              altered: {
                changeDate: new Date(),
                changeWho: Meteor.userId(),
                changeReason: 'user discretion',
                changeKey: 'completed',
                oldValue: cmltDate,
                newValue: 'false'
              }
          }});
          Meteor.defer( ()=>{
            Meteor.call('updateOneMovement', batchId, privateKey);
          });
          return true;
        }else{
          return false;
        }
      }else{
        return false;
      }
    }
  },
  
  //// Blockers \\\\
  addBlockX(batchId, blockTxt) {
    if(Meteor.userId()) {
      XBatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
        $push : { blocks: {
          key: new Meteor.Collection.ObjectID().valueOf(),
          block: blockTxt,
          time: new Date(),
          who: Meteor.userId(),
          solve: false
        }}});
      return true;
    }else{
      return false;
    }
  },
  
  editBlockX(batchId, blKey, blockTxt) {
    const doc = XBatchDB.findOne({_id: batchId},{fields:{'blocks':1}});
    const subDoc = doc.blocks.find( x => x.key === blKey );
    const mine = subDoc.who === Meteor.userId();
    const auth = Roles.userIsInRole(Meteor.userId(), 'run');
    if(mine || auth) {
  		XBatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'blocks.key': blKey}, {
  			$set : { 
  			  'blocks.$.block': blockTxt,
  			  'blocks.$.who': Meteor.userId()
  			}});
			return true;
    }else{
      return false;
    }
  },
  
  solveBlockX(batchId, blKey, act) {
    const auth = Roles.userIsInRole(Meteor.userId(), 'run');
    if(auth) {
  		XBatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'blocks.key': blKey}, {
  			$set : { 
  			  'blocks.$.solve':
  			    {
  			      action: act,
              time: new Date(),
              who: Meteor.userId(),
            }
  			}});
  		return true;
    }else{
      return false;
    }
  },

  removeBlockX(batchId, blKey) {
    if(Roles.userIsInRole(Meteor.userId(), 'run')) {
      XBatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
        $pull : { blocks: { key: blKey }
         }});
      return true;
    }else{
      return false;
    }
  },
  
  // FORCE FINISH ALL
  FORCEfinishBatchX(batchId, 
    doneScrap, remainScrap, unstartDelete, unstartScrap, comm, pinInput
  ) {
    if(Roles.userIsInRole(Meteor.userId(), "qa") ) {
      const accessKey = Meteor.user().orgKey;
      
      const org = AppDB.findOne({ orgKey: accessKey },{fields:{'orgPIN':1}});
      const orgPIN = org ? org.orgPIN : null;
        
      const doc = XBatchDB.findOne({_id: batchId},{fields:{'batch':1,'serialize':1}});
      
      if(pinInput === orgPIN) {
  
        const didFlow = doc.serialize === true;
        const srs = didFlow && XSeriesDB.findOne({batch: doc.batch},{fields:{'items':1}});
        
        const srsId = !srs ? null : srs._id;
        
        const srsI = !srs ? [] : srs.items;
        
        const doneI = srsI.filter( i=> i.completed && 
          i.history.findIndex( s => s.type === 'scrap' && s.good === true ) === -1 );
        for(let di of doneI) {
          if(doneScrap) {  
            Meteor.call('scrapItemX', srsId, di.serial, 'force finish', 'Force Finish All');
          }
        }
        
        const runI = srsI.filter( i=> !i.completed && i.history.length > 0 );
        for(let ri of runI) {
          if(remainScrap) {  
            Meteor.call('scrapItemX', srsId, ri.serial, 'force finish', 'Force Finish All');
          }else{
            Meteor.call('finishIncompleteItemX', srsId, ri.serial, 'Force Finish All');
          }
        }
        
        const noI = srsI.filter( i=> !i.completed && i.history.length === 0 );
        for(let ni of noI) {
          if(unstartDelete) { 
            Meteor.call('authPullItemX', srsId, ni.serial, accessKey);
          }else if(unstartScrap) {
            Meteor.call('scrapItemX', srsId, ni.serial, 'force finish', 'Force Finish All');
          }else{
            Meteor.call('finishIncompleteItemX', srsId, ni.serial, 'Force Finish All');
          }
        }
      
        XBatchDB.update({_id: batchId, orgKey: accessKey}, {
    			$set : { 
    			  completed: true,
    			  completedAt: new Date(),
    			  completedWho: Meteor.userId(),
    			},
    			$push : {
            altered: {
              changeDate: new Date(),
              changeWho: Meteor.userId(),
              changeReason: 'user discretion',
              changeKey: 'completed',
              oldValue: 'false',
              newValue: 'true'
            },
            blocks: {
              key: new Meteor.Collection.ObjectID().valueOf(),
              block: comm,
              time: new Date(),
              who: Meteor.userId(),
              solve: false
            }
        }});
        
        const openRapid = XRapidsDB.findOne({extendBatch: doc.batch, live: true});
        if(!openRapid) {
          XBatchDB.update({_id: batchId, orgKey: accessKey}, {
      			$set : { 
      			  live: false
          }});
        }
        Meteor.defer( ()=>{
          Meteor.call('updateOneMovement', batchId, accessKey);
          Meteor.call('saveEndState', batchId, accessKey);
        });
        return true;
      }else{ return false }
    }else{ return false }
  },
    //////////////////// DESTRUCTIVE \\\\\\\\\\\\\\\\\\\\\
  // Items delete is in the Series Methods
  deleteXBatchTide(batchId, pinInput) {
    const accessKey = Meteor.user().orgKey;
    const doc = XBatchDB.findOne({_id: batchId});
    const auth = Roles.userIsInRole(Meteor.userId(), 'remove');
    const done = doc.completed;
    const inUse = doc.tide.some( x => x.stopTime === false ) ? true : false;
    const howMany = doc.tide.length + ' times';
    
    const keyMatch = doc.orgKey === accessKey;
    
    const org = AppDB.findOne({ orgKey: accessKey },{fields:{'orgPIN':1}});
    const orgPIN = org ? org.orgPIN : null;
    const pinMatch = pinInput === orgPIN;
    
    if(!done && !inUse && auth && keyMatch && pinMatch) {
      XBatchDB.update({_id: batchId, orgKey: accessKey}, {
        $set : {
          tide: [],
        },
        $push : {
          altered: {
            changeDate: new Date(),
            changeWho: Meteor.userId(),
            changeReason: 'user discretion',
            changeKey: 'tide',
            oldValue: howMany,
            newValue: '0 times'
          }
        }
      });
      Meteor.defer( ()=>{
        Meteor.call('updateOneMovement', batchId, accessKey);
      });
      return true;
    }else{
      return false;
    }
  },
  
  deleteXBatchFall(batchId, pinInput) {
    const accessKey = Meteor.user().orgKey;
    const doc = XBatchDB.findOne({_id: batchId});
    const auth = Roles.userIsInRole(Meteor.userId(), 'remove');
    const done = doc.completed;
    const howMany = doc.waterfall.length + ' counters';
    
    const keyMatch = doc.orgKey === accessKey;
    
    const org = AppDB.findOne({ orgKey: accessKey },{fields:{'orgPIN':1}});
    const orgPIN = org ? org.orgPIN : null;
    const pinMatch = pinInput === orgPIN;
    
    if(!done && auth && keyMatch && pinMatch) {
      XBatchDB.update({_id: batchId, orgKey: accessKey}, {
        $set : {
          waterfall: [],
        },
        $push : {
          altered: {
            changeDate: new Date(),
            changeWho: Meteor.userId(),
            changeReason: 'user discretion',
            changeKey: 'waterfall',
            oldValue: howMany,
            newValue: '0 counters'
          }
        }
      });
      Meteor.defer( ()=>{
        Meteor.call('updateOneMovement', batchId, accessKey);
      });
      return true;
    }else{
      return false;
    }
  },
  
  deleteWholeXBatch(batchID, pass, pinInput) {
    const accessKey = Meteor.user().orgKey;
    
    const doc = XBatchDB.findOne({_id: batchID});
    const srs = XSeriesDB.findOne({batch: doc.batch});
    
    const items = !srs ? false : srs.items.length > 0;
    const probs = !srs ? false : srs.nonCon.length > 0 || srs.shortfall.length > 0;
    const inUse = doc.tide.length > 0 || doc.waterfall.length > 0;
    const done = doc.completed;
    
    if(!done && !items && !probs && !inUse) {
      const lock = doc.createdAt.toISOString().split("T")[0];
      const auth = Roles.userIsInRole(Meteor.userId(), 'remove');
      const access = doc.orgKey === accessKey;
      const unlock = lock === pass;
      
      const org = AppDB.findOne({ orgKey: accessKey },{fields:{'orgPIN':1}});
      const orgPIN = org ? org.orgPIN : null;
      const pinMatch = pinInput === orgPIN;
      
      if(auth && access && unlock && pinMatch) {
        XBatchDB.remove({_id: batchID});
        TraceDB.remove({batchID: batchID});
        if(srs) {
          XSeriesDB.remove({_id: srs._id});
        }
        return true;
      }else{
        return false;
      }
    }else{
      return 'inUse';
    }
  },
  
});