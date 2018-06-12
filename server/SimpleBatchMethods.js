//import moment from 'moment';

Meteor.methods({

//// Simple Batches \\\\
  addSimpleBatch(batchNum, groupId, widgetId, vKey, salesNum, sDate, eDate, quantity, counterSelect) {
    const doc = WidgetDB.findOne({_id: widgetId});
    const legacyduplicate = BatchDB.findOne({batch: batchNum});
    const simpleduplicate = SimpleBatchDB.findOne({batch: batchNum});
    const auth = Roles.userIsInRole(Meteor.userId(), 'create');
    
    let counterObjs = [];
    for(let cs of counterSelect) {
      let app = AppDB.findOne({orgKey: Meteor.user().orgKey});
      let step = app && app.counterOptions && app.counterOptions.find( x => x.key === cs );
      if(step) {
        counterObjs.push({
          ckey: cs,
          step: step.step,
          counts: []
        });
      }
    }
    
    if(auth && !legacyduplicate && !simpleduplicate && doc.orgKey === Meteor.user().orgKey) {
      SimpleBatchDB.insert({
  			batch: batchNum,
  			orgKey: Meteor.user().orgKey,
  			shareKey: false,
  			groupId: groupId,
  			widgetId: widgetId,
  			versionKey: vKey,
        tags: [],
        createdAt: new Date(),
        createdWho: Meteor.userId(),
        updatedAt: new Date(),
  			updatedWho: Meteor.userId(),
  			finishedAt: false,
  			salesOrder: salesNum,
  			start: sDate,
  			end: eDate,
  			notes: false,
        floorRelease: false,
        blocks: [],
        omitted: [],
        quantity: Number(quantity),
        counters: counterObjs
      });
      return true;
    }else{
      return false;
    }
  },
  
  editSimpleBatch(batchId, newBatchNum, vKey, sDate, eDate) {
    const doc = BatchDB.findOne({_id: batchId});
    let duplicate = BatchDB.findOne({batch: newBatchNum});
    doc.batch === newBatchNum ? duplicate = false : null;
    const auth = Roles.userIsInRole(Meteor.userId(), 'edit');
    if(auth && !duplicate && doc.orgKey === Meteor.user().orgKey) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
        $set : {
          batch: newBatchNum,
          versionKey: vKey,
          start: sDate,
  			  end: eDate,
  			  updatedAt: new Date(),
  			  updatedWho: Meteor.userId()
        }});
      return true;
    }else{
      return false;
    }
  },

  deleteSimpleBatch(batch, pass) {
    const doc = BatchDB.findOne({_id: batch._id});
    // if any items have history
    const inUse = doc.items.some( x => x.history.length > 0 ) ? true : false;
    if(!inUse) {
      const lock = doc.createdAt.toISOString().split("T")[0];
      const auth = Roles.userIsInRole(Meteor.userId(), 'remove');
      const access = doc.orgKey === Meteor.user().orgKey;
      const unlock = lock === pass;
      if(auth && access && unlock) {
        BatchDB.remove(batch);
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
  			  active: status
      }});
    }else{null}
  },
*/  
  // push a tag
  pushpBTag(batchId, tag) {
    if(Roles.userIsInRole(Meteor.userId(), 'run')) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
        $push : { 
          tags: tag
        }});
    }else{
      null;
    }
  },
  // pull a tag
  pullpBTag(batchId, tag) {
    if(Roles.userIsInRole(Meteor.userId(), 'run')) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
        $pull : {
          tags: tag
        }});
    }else{
      null;
    }
  },

  setSimpleBatchNote(batchId, note) {
    if(Roles.userIsInRole(Meteor.userId(), 'run')) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
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
  
  releaseToFloorSimple(batchId, rDate) {
    if(Roles.userIsInRole(Meteor.userId(), 'run')) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
        $set : {
          updatedAt: new Date(),
  			  updatedWho: Meteor.userId(),
          floorRelease: {
            time: rDate,
            who: Meteor.userId()
          }
      }});
      return true;
    }else{
      return false;
    }
  },
  
  cancelFloorReleaseSimple(batchId) {
    if(Roles.userIsInRole(Meteor.userId(), 'run')) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
        $set : {
          updatedAt: new Date(),
  			  updatedWho: Meteor.userId(),
          floorRelease: false
      }});
      return true;
    }else{
      return false;
    }
  },


  
  //// history entries

  positiveCounter(batchId, bar, key, step, type, com, pass) {
    if(type === 'inspect' && !Roles.userIsInRole(Meteor.userId(), 'inspect')) {
      return false;
    }else{
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'items.serial': bar}, {
        $push : { 'items.$.history': {
          key: key,
          step: step,
          type: type,
          good: pass,
          time: new Date(),
          who: Meteor.userId(),
          comm : com,
          info: false
      }}});
      return true;
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
  
  // finish Batch
  finishSimpleBatch(batchId, permission) {
    const doc = BatchDB.findOne({_id: batchId});
    const allDone = doc.items.every( x => x.finishedAt !== false );
    if(doc.finishedAt === false && allDone) {
      BatchDB.update({_id: batchId, orgKey: permission}, {
  			$set : { 
  			  active: false,
  			  finishedAt: new Date()
      }});
    }else{null}
  },
  
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
  addpBlock(batchId, blockTxt) {
    if(Meteor.userId()) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
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
  
  editpBlock(batchId, blKey, blockTxt) {
    const doc = BatchDB.findOne({_id: batchId});
    const subDoc = doc.blocks.find( x => x.key === blKey );
    const mine = subDoc.who === Meteor.userId();
    const auth = Roles.userIsInRole(Meteor.userId(), 'run');
    if(mine || auth) {
  		BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'blocks.key': blKey}, {
  			$set : { 
  			  'blocks.$.block': blockTxt,
  			  'blocks.$.who': Meteor.userId()
  			}});
			return true;
    }else{
      return false;
    }
  },
  
  solvepBlock(batchId, blKey, act) {
    const auth = Roles.userIsInRole(Meteor.userId(), 'run');
    if(auth) {
  		BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'blocks.key': blKey}, {
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

  removepBlock(batchId, blKey) {
    if(Roles.userIsInRole(Meteor.userId(), 'run')) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
        $pull : { blocks: { key: blKey }
         }});
      return true;
    }else{
      return false;
    }
  },
  
  //// Shortages \\\\
  
  // Omitted // Wide Shortage
  /*
  addOmitSimple(batchId, partNum, refs, inEffect, comm) {
    if(!Roles.userIsInRole(Meteor.userId(), 'run')) { null }else{
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
        $push : { omitted: {
          key: new Meteor.Collection.ObjectID().valueOf(), // id of the shortage entry
          partNum: partNum || '', // short part number
          refs: refs || [], // referances on the widget
          cTime: new Date(), // Object
          cWho: Meteor.userId(), // Object
          uTime: new Date(), // Object
          uWho: Meteor.userId(), // Object
          inEffect: inEffect || null, // Boolean or Null
          reSolve: null, // Boolean or Null
          comm: comm || '' // comments
      }}});
    }
  },
  
  editOmitSimple(batchId, omKey, partNum, refs, inEffect, reSolve, comm) {
    if(!Roles.userIsInRole(Meteor.userId(), 'run')) { null }else{
      const doc = BatchDB.findOne({_id: batchId, orgKey: Meteor.user().orgKey});
      const prevOm = doc && doc.omitted.find( x => x.key === omKey );
      let pn = partNum;
      let rf = refs;
      let ef = inEffect;
      let sv = reSolve;
      let cm = comm;
      if(!prevOm) { null }else{
        pn = !partNum || partNum === '' && prevOM.partNum;
        rf = !refs || refs === [] || refs === '' && prevOM.refs; 
        ef = inEffect === undefined && prevOM.inEffect;
        sv = reSolve === undefined && prevOM.reSolve;
        cm = !comm || comm === '' && prevOM.comm; 
      }
		  BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'omitted.key': omKey}, {
  			$set : { 
  			  'omitted.$.partNum': pn || '',
  			  'omitted.$.refs': rf || [],
  			  'omitted.$.uTime': new Date(),
          'omitted.$.uWho': Meteor.userId(),
          'omitted.$.inEffect': ef || null,
          'omitted.$.reSolve': sv || null,
  			  'omitted.$.comm': cm || ''
  			}
  		});
    }
  },
  
  setOmitSimple(batchId, omKey, inEffect, reSolve) {
    if(!Roles.userIsInRole(Meteor.userId(), 'run')) { null }else{
		  BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'omitted.key': omKey}, {
  			$set : {
  			  'omitted.$.uTime': new Date(),
          'omitted.$.uWho': Meteor.userId(),
          'omitted.$.inEffect': inEffect || null,
          'omitted.$.reSolve': reSolve || null,
  			}
  		});
    }
  },
  
  removeOmitSimple(batchId, omKey) {
    if(!Roles.userIsInRole(Meteor.userId(), 'run')) { 
      return false;
    }else{
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'omitted.key': omKey}, {
        $pull : { omitted: {key: omKey}
      }});
      return true;
    }
  },
  */

  //////////////////////////////////////////////////////////////////////////////////////////////////

});