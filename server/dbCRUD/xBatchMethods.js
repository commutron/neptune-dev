import moment from 'moment';

Meteor.methods({

//// Complex, Dexterous, Multiplex Batches \\\\
  addBatchX(batchNum, groupId, widgetId, vKey, salesNum, sDate, eDate, quantity) {
    const doc = WidgetDB.findOne({_id: widgetId});
    const legacyduplicate = BatchDB.findOne({batch: batchNum});
    const duplicateX = XBatchDB.findOne({batch: batchNum});
    const auth = Roles.userIsInRole(Meteor.userId(), 'create');
    const accessKey = Meteor.user().orgKey;
    
    if(auth && !legacyduplicate && !duplicateX && doc.orgKey === accessKey) {
      XBatchDB.insert({
  			batch: batchNum,
  			orgKey: accessKey,
  			shareKey: null,
  			groupId: groupId,
  			widgetId: widgetId,
  			versionKey: vKey,
        tags: [],
        notes: false,
        createdAt: new Date(),
        createdWho: Meteor.userId(),
        updatedAt: new Date(),
  			updatedWho: Meteor.userId(),
  			live: true,
  			salesOrder: salesNum,
  			salesStart: sDate,
  			salesEnd: eDate,
  			completed: false,
  			completedAt: null,
  			completedWho: null,
  			quantity: Number(quantity),
  			serialize: false,
  			river: false,
  			waterfall: [],
  			tide: [],
  			rapids: [],
  			blocks: [],
        releases: [],
        verifications: [],
        nonconformaces: [],
        altered: [],
        events: []
      });
      Meteor.defer( ()=>{
        Meteor.call('batchCacheUpdate', accessKey, true);
      });
      return true;
    }else{
      return false;
    }
  },
  
  editBatchX(batchId, newBatchNum, vKey, salesNum, sDate, eDate, quantity) {
    const doc = XBatchDB.findOne({_id: batchId});
    const legacyduplicate = BatchDB.findOne({batch: newBatchNum});
    let duplicate = XBatchDB.findOne({batch: newBatchNum});
    doc.batch === newBatchNum ? duplicate = false : null;
    const auth = Roles.userIsInRole(Meteor.userId(), 'edit');
    if(auth && !duplicate && !legacyduplicate && doc.orgKey === Meteor.user().orgKey) {
      XBatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
        $set : {
          batch: newBatchNum,
          versionKey: vKey,
          salesOrder: salesNum,
          salesStart: sDate,
  			  salesEnd: eDate,
  			  quantity: Number(quantity),
  			  updatedAt: new Date(),
  			  updatedWho: Meteor.userId()
        }});
      return true;
    }else{
      return false;
    }
  },

  deleteBatchX(batch, pass) {
    const doc = XBatchDB.findOne({_id: batch._id});
    // if any items have history
    const inUse = doc.rapids.length > 1 ||
                  doc.blocks.length > 1 ||
                  doc.releases.length > 1 ||
                  doc.verifications.length > 1 ||
                  doc.nonconformaces.length > 1 ||
                  doc.omitted.length > 1;
    if(!inUse) {
      const lock = doc.createdAt.toISOString().split("T")[0];
      const auth = Roles.userIsInRole(Meteor.userId(), 'remove');
      const access = doc.orgKey === Meteor.user().orgKey;
      const unlock = lock === pass;
      if(auth && access && unlock) {
        XBatchDB.remove(batch);
        return true;
      }else{
        return false;
      }
    }else{
      return 'inUse';
    }
  },
/*
  changepStatus(batchId, status) {
    if(Roles.userIsInRole(Meteor.userId(), 'run')) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
  			$set : {
  			  updatedAt: new Date(),
  			  updatedWho: Meteor.userId(),
  			  live: status
      }});
    }else{null}
  },
*/  
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

  setBatchNoteX(batchId, note) {
    if(Roles.userIsInRole(Meteor.userId(), 'run')) {
      XBatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
        $set : { notes : {
          time: new Date(),
          who: Meteor.userId(),
          content: note
        }}});
      return true;
    }else{
      return false;
    }
  },
  
  addRelease(batchId, rType, rDate, caution) {
    if(Roles.userIsInRole(Meteor.userId(), ['run', 'kitting'])) {
      XBatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
        $push : { releases: {
            type: rType,
            time: rDate,
            who: Meteor.userId(),
            caution: caution
          }
      }});
      return true;
    }else{
      return false;
    }
  },
  
  cancelRelease(batchId, rType) {
    if(Roles.userIsInRole(Meteor.userId(), ['run', 'kitting'])) {
      XBatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'releases.type': rType}, {
        $pull : { releases: { type: rType }
      }});
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

  //// Waterfall
  
  addCounter(batchId, wfKey, gate, type, wfBranch) {
    if(Roles.userIsInRole(Meteor.userId(), 'run')) {
      XBatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
        $push : { 
          waterfall: {
            wfKey: wfKey,
            gate: gate,
            type: type,
            action: 'clicker',// "slider", "timer", "stopwatch"
            branchKey: wfBranch,
            counts: []
          }
      }});
      return true;
    }else{
      return false;
    }
  },
  removeCounter(batchId, wfKey) {
    const doc = XBatchDB.findOne({_id: batchId});
    const subdoc = doc ? doc.waterfall.find( x => x.wfKey === wfKey) : null;
    const inUse = subdoc ? subdoc.counts.length > 0 : null;
    if(doc && subdoc && !inUse) {
      if(Roles.userIsInRole(Meteor.userId(), 'run')) {
        XBatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
          $pull : {
            waterfall: { wfKey : wfKey }
          }});
        return true;
      }else{
        return false;
      }
    }else{
      return 'inUse';
    }
  },
  
  //// counter entries \\\\ // meteor.apply( noRetry ) ????
  
  metaCounter(batchId, wfKey, meta) {
    if(!Roles.userIsInRole(Meteor.userId(), 'active')) {
      null;
    }else{
      XBatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'waterfall.wfKey': wfKey}, {
        $push : { 'waterfall.$.counts': { 
          tick: Number(0),
          time: new Date(),
          who: Meteor.userId(),
          meta: meta
      }}});
    }
  },
  
  positiveCounter(batchId, wfKey) {
    if(!Roles.userIsInRole(Meteor.userId(), 'active')) {
      null;
    }else{
      XBatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'waterfall.wfKey': wfKey}, {
        $push : { 'waterfall.$.counts': { 
          tick: Number(1),
          time: new Date(),
          who: Meteor.userId()
      }}});
    }
  },
  
  negativeCounter(batchId, wfKey) {
    if(!Roles.userIsInRole(Meteor.userId(), 'active')) {
      null;
    }else{
      XBatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'waterfall.wfKey': wfKey}, {
        $push : { 'waterfall.$.counts': { 
          tick: Number(-1),
          time: new Date(),
          who: Meteor.userId()
      }}});
    }
  },
  
  // Finish Batch
  finishBatchX(batchId) {
    if(!Roles.userIsInRole(Meteor.userId(), 'finish')) {
      null;
    }else{
      const doc = XBatchDB.findOne({_id: batchId});
      const did = doc.quantity > 0;
      const noItems = doc.serialize === false;
      if(doc && did && noItems) {
        XBatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
    			$set : { 
    			  live: false,
    			  completed: true,
    			  completedAt: new Date(),
    			  completedWho: Meteor.userId(),
        }});
      }else{null}
    }
  },
  
  // Undo Finish Batch
  undoFinishBatchX(batchId, override) {
    if(!Roles.userIsInRole(Meteor.userId(), 'finish' || override === undefined)) {
      null;
    }else{
      const doc = XBatchDB.findOne({_id: batchId});
      const inTime = doc.completed ? moment().diff(moment(doc.completedAt), 'minutes') < 60 : false;
      const org = AppDB.findOne({ orgKey: Meteor.user().orgKey });
      const orgPIN = org ? org.orgPIN : null;
      if(doc && (inTime || orgPIN === override)) {
        XBatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
    			$set : { 
    			  live: true,
    			  completed: false,
    			  completedAt: false,
    			  completedWho: false,
        }});
        return true;
      }else{
        return false;
      }
    }
  },

/*
  addFirst(batchId, bar, key, step, good, whoB, howB, howI, diff, ng) {
    if(!Roles.userIsInRole(Meteor.userId(), 'verify')) {
      return false;
    }else{
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'items.serial': bar}, {
        $push : { 'items.$.history': {
          key: key,
          step: step,
          type: 'first',
          good: good,
          time: new Date(),
          who: Meteor.userId(),
          comm : '',
          info: {
            builder: whoB,
            buildMethod: howB,
            verifyMethod: howI,
            change: diff,
            issue: ng
          }
      }}});
      return true;
    }
  },
*/

  
  /*

// Escaped NonCon
  addEscape(batchId, ref, type, quant, ncar) {
    if(Roles.userIsInRole(Meteor.userId(), ['run', 'qa'])) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
        $push : { escaped: {
          key: new Meteor.Collection.ObjectID().valueOf(), // flag id
          ref: ref, // referance on the widget
          type: type, // type of nonCon
          quantity: Number(quant),
          ncar: ncar,
          time: new Date(), // when nonCon was discovered
          who: Meteor.userId(),
          }}});
    }else{null}
  },
  
  */

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
    const doc = XBatchDB.findOne({_id: batchId});
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
  
  //// Shortages \\\\
  

  //////////////////////////////////////////////////////////////////////////////////////////////////

});