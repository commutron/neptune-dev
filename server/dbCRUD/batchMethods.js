import moment from 'moment';
import { batchCacheUpdate } from '/server/cacheMethods.js';
import { batchTideTime } from '/server/tideGlobalMethods';

Meteor.methods({

//// Batches \\\\
  addBatch(batchNum, widgetId, vKey, salesNum, sDate, eDate, qTime) {
    const doc = WidgetDB.findOne({_id: widgetId});
    const legacyduplicate = BatchDB.findOne({batch: batchNum});
    const duplicateX = XBatchDB.findOne({batch: batchNum});
    const auth = Roles.userIsInRole(Meteor.userId(), 'create');
    const accessKey = Meteor.user().orgKey;
    if(auth && !legacyduplicate && !duplicateX && doc.orgKey === accessKey) {
      const qTimeNum = qTime ? Number(qTime) : false;
      BatchDB.insert({
  			batch: batchNum,
  			orgKey: accessKey,
  			shareKey: false,
  			widgetId: widgetId,
  			versionKey: vKey,
        tags: [],
        live: true,
        createdAt: new Date(),
        createdWho: Meteor.userId(),
        updatedAt: new Date(),
  			updatedWho: Meteor.userId(),
  			finishedAt: false,
  			salesOrder: salesNum,
  			start: new Date(sDate),
  			end: new Date(eDate),
  			quoteTimeBudget: [{
          updatedAt: new Date(),
          timeAsMinutes: qTimeNum
        }],
  			notes: false,
        river: false,
        riverAlt: false,
        tide: [],
        items: [],
        nonCon: [],
        escaped: [],
        cascade: [],
        blocks: [],
        releases: [],
        shortfall: [],
        altered: [],
        events: [],
      });
      Meteor.defer( ()=>{
        batchCacheUpdate( accessKey, true );
        Meteor.call('priorityCacheUpdate', accessKey, true);
        Meteor.call('buildNewTrace');
      });
      return true;
    }else{
      return false;
    }
  },
  
  editBatch(batchId, newBatchNum, vKey, salesNum, sDate) {
    const accessKey = Meteor.user().orgKey;
    const doc = BatchDB.findOne({_id: batchId});
    let legacyduplicate = BatchDB.findOne({batch: newBatchNum});
    let duplicateX = XBatchDB.findOne({batch: newBatchNum});
    doc.batch === newBatchNum ? legacyduplicate = false : null;
    const auth = Roles.userIsInRole(Meteor.userId(), 'edit');
    if(auth && !legacyduplicate && !duplicateX && doc.orgKey === accessKey) {
      BatchDB.update({_id: batchId, orgKey: accessKey}, {
        $set : {
          batch: newBatchNum,
          versionKey: vKey,
          salesOrder: salesNum,
          start: sDate,
  			  updatedAt: new Date(),
  			  updatedWho: Meteor.userId()
        }});
      Meteor.defer( ()=>{
        batchCacheUpdate( accessKey, true);
        Meteor.call('updateOneMinify', batchId);
      });
      return true;
    }else{
      return false;
    }
  },
  
  alterBatchFulfill(batchId, oldDate, newDate, reason) {
    const accessKey = Meteor.user().orgKey;
    const auth = Roles.userIsInRole(Meteor.userId(), ['edit', 'sales']);
    if(auth) {
      BatchDB.update({_id: batchId, orgKey: accessKey}, {
        $set : {
          end: new Date(newDate),
        }});
      BatchDB.update({_id: batchId, orgKey: accessKey}, {
        $push : {
          altered: {
            changeDate: new Date(),
            changeWho: Meteor.userId(),
            changeReason: reason,
            changeKey: 'end',
            oldValue: oldDate,
            newValue: newDate
          }
        }});
      Meteor.defer( ()=>{
        Meteor.call('priorityCacheUpdate', accessKey, true);
        Meteor.call('updateOneMovement', batchId);
      });
      return true;
    }else{
      return false;
    }
  },
  
  /////////////// Events ///////////////////////
  
  setBatchEvent(accessKey, batchId, eventTitle, eventDetail) {
    BatchDB.update({_id: batchId, orgKey: accessKey}, {
      $push : { events : { 
        title: eventTitle,
        detail: eventDetail,
        time: new Date()
      }
    }});
  },
  
  /////////////////////////////////////////////////

  changeStatus(batchId, status) {
    const flip = !status;
    const txtOld = flip.toString();
    const txtNew = status.toString();
    if(Roles.userIsInRole(Meteor.userId(), 'run')) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
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
        Meteor.call('updateOneMovement', batchId);
        if(status === true) {
          Meteor.call('disableLock', batchId);
        }
      });
    }else{null}
  },
  
  enableLock(batchId) {
    const doc = BatchDB.findOne({_id: batchId});
    const clear = doc.live === false && doc.finishedAt !== false &&
                    doc.end < new Date() && doc.cascade.length === 0;
    if(Roles.userIsInRole(Meteor.userId(), 'run') && clear) {
      let totalUnits = 0;
      let scrapUnits = 0;
      for(let i of doc.items) {
        totalUnits += i.units;
        const sc = i.history.find(s => s.type === 'scrap' && s.good === true);
        !sc ? null : scrapUnits += i.units;
      }
      const tTime = !doc.tide ? 0 : batchTideTime(doc.tide);
      const ncTypes = Meteor.call('nonConSelfCount', doc.nonCon);
    
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
  			$set : {
  			  lock: true,
  			  lockTrunc: {
  			    lockedAt: new Date(),
  			    unitQuantity: Number(totalUnits),
  			    scrapQuantity: Number(scrapUnits),
  			    tideTotal: Number(tTime),
  			    ncTypes: ncTypes
  			  }
        }
      });
    }else{null}
  },
  
  disableLock(batchId) {
    const doc = BatchDB.findOne({_id: batchId});
    const locked = doc.lock === true;
    if(Roles.userIsInRole(Meteor.userId(), 'run') && locked) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
  			$set : {
  			  lock: false
        }
      });
    }else{null}
  },
  
  // push a tag
  pushBTag(batchId, tag) {
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
  pullBTag(batchId, tag) {
    if(Roles.userIsInRole(Meteor.userId(), 'run')) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
        $pull : {
          tags: tag
        }});
    }else{
      null;
    }
  },

  setBatchNote(batchId, note) {
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
  
// setup quote time key // LEGACY SUPPORT
  upBatchTimeBudget(batchId) {
    try{
      if(Roles.userIsInRole(Meteor.userId(), ['sales', 'edit'])) {
        BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
          $set : { 
            'quoteTimeBudget': []
          }});
      }else{
        null;
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  // push time budget, whole time for batch
  pushBatchTimeBudget(batchId, qTime) {
    try{
      const accessKey = Meteor.user().orgKey;
      if(Roles.userIsInRole(Meteor.userId(), ['sales', 'run', 'edit'])) {
        BatchDB.update({_id: batchId, orgKey: accessKey}, {
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
          Meteor.call('priorityCacheUpdate', accessKey, true);
        });
      }else{
        null;
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  
  setRiver(batchId, riverId, riverAltId) {
    if(Roles.userIsInRole(Meteor.userId(), 'run')) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
        $set : {
          updatedAt: new Date(),
  			  updatedWho: Meteor.userId(),
          river: riverId,
          riverAlt: riverAltId,
        }});
      return true;
    }else{
      return false;
    }
  },
  
  addReleaseLEGACY(batchId, rType, rDate, caution) {
    if(Roles.userIsInRole(Meteor.userId(), ['run', 'kitting'])) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
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
  
  cancelReleaseLEGACY(batchId, rType) {
    if(Roles.userIsInRole(Meteor.userId(), ['run', 'kitting'])) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'releases.type': rType}, {
        $pull : { releases: { type: rType }
      }});
      return true;
    }else{
      return false;
    }
  },
  
  cautionFlipReleaseLEGACY(batchId, rType, caution) {
    if(Roles.userIsInRole(Meteor.userId(), ['run', 'kitting'])) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'releases.type': rType}, {
        $set : {
          'releases.$.caution': caution
      }});
      return true;
    }else{
      return false;
    }
  },

  // finish Batch
  finishBatch(batchId, permission) {
    const doc = BatchDB.findOne({_id: batchId});
    const allDone = doc.items.every( x => x.finishedAt !== false );
    const privateKey = permission || Meteor.user().orgKey;
    if(doc.finishedAt === false && allDone) {
      BatchDB.update({_id: batchId, orgKey: privateKey}, {
  			$set : { 
  			  live: false,
  			  finishedAt: new Date()
      }});
      Meteor.defer( ()=>{
        Meteor.call('completeCacheUpdate', privateKey, true);
      });
    }else{null}
  },
  
  // Clear / Undo finish Batch
  undoFinishBatch(batchId, oldDate) {
    if( Roles.userIsInRole(Meteor.userId(), 'run') ) {
      const privateKey = Meteor.user().orgKey;
      BatchDB.update({_id: batchId, orgKey: privateKey}, {
  			$set : { 
  			  live: true,
  			  finishedAt: false
        },
        $push : {
          altered: {
            changeDate: new Date(),
            changeWho: Meteor.userId(),
            changeReason: 'user discretion',
            changeKey: 'finishedAt',
            oldValue: oldDate,
            newValue: 'false'
          }
        }
      });
      Meteor.defer( ()=>{
        Meteor.call('completeCacheUpdate', privateKey, true);
      });
    }else{null}
  },

//// Non-Cons \\\\
  floodNC(batchId, ref, type) {
    const doc = BatchDB.findOne({_id: batchId, orgKey: Meteor.user().orgKey});
    if(!Meteor.userId() || !doc) { null }else{
      const liveItems = doc.items.filter( x => x.finishedAt === false );
      const liveSerials = Array.from(liveItems, x => {
                            const double = doc.nonCon.find( y => 
                              y.ref === ref &&
                              y.serial === x.serial &&
                              y.type === type &&
                              y.inspect === false
                            );
                            if( !double ) { return x.serial } } );
      for( let sn of liveSerials ) {
        BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
          $push : { nonCon: {
            key: new Meteor.Collection.ObjectID().valueOf(), // id of the nonCon entry
            serial: sn, // barcode id of item
            ref: ref, // referance on the widget
            type: type, // type of nonCon
            where: 'wip', // where in the process
            time: new Date(), // when nonCon was discovered
            who: Meteor.userId(),
            fix: false,
            inspect: false,
            reject: [],
            skip: false,
            snooze: false,
            comm: ''
        }}});
      }
      return true;
    }
  },
  
  addNC(batchId, bar, ref, type, step, fix) {
    const doc = BatchDB.findOne({_id: batchId, orgKey: Meteor.user().orgKey});
    const double = doc.nonCon.find( x => 
                    x.serial === bar &&
                    x.ref === ref &&
                    x.type === type &&
                    x.inspect === false
                  );
    if(!Meteor.userId() || double) { null }else{
      
      let repaired = fix ? {time: new Date(),who: Meteor.userId()} : false;
      
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
        $push : { nonCon: {
          key: new Meteor.Collection.ObjectID().valueOf(), // id of the nonCon entry
          serial: bar, // barcode id of item
          ref: ref, // referance on the widget
          type: type, // type of nonCon
          where: step, // where in the process
          time: new Date(), // when nonCon was discovered
          who: Meteor.userId(),
          fix: repaired,
          inspect: false,
          reject: [],
          skip: false,
          snooze: false,
          trash: false,
          comm: ''
      }}});
    }
  },


  fixNC(batchId, ncKey) {
    if(Meteor.userId()) {
  		BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'nonCon.key': ncKey}, {
  			$set : { 
  			  'nonCon.$.fix': {
  			    time: new Date(),
  			    who: Meteor.userId()
  			  }
  			}
  		});
    }else{null}
  },

  inspectNC(batchId, ncKey) {
    if(Meteor.userId()) {
  		BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'nonCon.key': ncKey}, {
  			$set : { 
  			  'nonCon.$.inspect': {
  			    time: new Date(),
  			    who: Meteor.userId()
  			  }
  			}
  		});
    }else{null}
  },
  
  rejectNC(batchId, ncKey, timeRepair, whoRepair) {
    if(Meteor.userId()) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'nonCon.key': ncKey}, {
        $push : {
          'nonCon.$.reject': {
            attemptTime: timeRepair,
            attemptWho: whoRepair,
            rejectTime: new Date(),
            rejectWho: Meteor.userId()
          }
        },
        $set : {
          'nonCon.$.fix': false
        }
      });
    }else{null}
  },
    
  editNC(batchId, serial, ncKey, ref, type, where) {
    const doc = BatchDB.findOne({_id: batchId, orgKey: Meteor.user().orgKey});
    const double = doc.nonCon.find( x => 
                    x.serial === serial &&
                    x.ref === ref &&
                    x.type === type &&
                    x.where === where &&
                    x.inspect === false
                  );
    if(!Roles.userIsInRole(Meteor.userId(), 'inspect') || double) { null }else{
		  BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'nonCon.key': ncKey}, {
  			$set : { 
  			  'nonCon.$.ref': ref,
  			  'nonCon.$.type': type,
  			  'nonCon.$.where': where
  			}
  		});
    }
  },
  
  // trigger a re-inspect
  reInspectNC(batchId, ncKey) {
    if(Roles.userIsInRole(Meteor.userId(), 'inspect')) {
		  BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'nonCon.key': ncKey}, {
  			$set : { 
  			  'nonCon.$.inspect': false
  			}
  		});
    }else{null}
  },

  snoozeNC(batchId, ncKey) {
    if(Roles.userIsInRole(Meteor.userId(), 'inspect')) {
  		BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'nonCon.key': ncKey}, {
  			$set : {
  			  'nonCon.$.skip': { 
  			    time: new Date(),
  			    who: Meteor.userId()
  			  },
  			  'nonCon.$.snooze': true
  			}
  		});
    }else{null}
  },
  
  trashNC(batchId, ncKey) {
    if(Roles.userIsInRole(Meteor.userId(), 'verify')) {
  		BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'nonCon.key': ncKey}, {
  			$set : {
  			  'nonCon.$.trash': { 
  			    time: new Date(),
  			    who: Meteor.userId()
  			  }
  			}
  		});
    }else{null}
  },
  
  unTrashNC(batchId, ncKey) {
    if(Roles.userIsInRole(Meteor.userId(), 'inspect')) {
  	  BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'nonCon.key': ncKey}, {
  	    $set : {
  			  'nonCon.$.trash': false
  			}
  	  });
    }else{null}
  },

  
  autoTrashShortNC(accessKey, batchId, serial, refs) {
    const org = AppDB.findOne({ orgKey: accessKey });
    const type = org ? org.missingType : false;
    const doc = BatchDB.findOne({_id: batchId, orgKey: accessKey});
    if(type && doc) {
      const related = doc.nonCon.filter( x => 
                        x.serial === serial &&
                        x.type === type &&
                        x.inspect === false &&
                        refs.includes( x.ref ) 
                      );
      const trash = Array.from(related, x => x.key);
      for( let tKey of trash) {
        BatchDB.update({_id: batchId, orgKey: accessKey, 'nonCon.key': tKey}, {
          $pull : { nonCon: {key: tKey}
        }});
      }
    }
  },

  UnSkipNC(batchId, ncKey) {
    if(Roles.userIsInRole(Meteor.userId(), 'inspect')) {
  	  BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'nonCon.key': ncKey}, {
  	    $set : {
  			  'nonCon.$.skip': false,
  			  'nonCon.$.snooze': false
  			}
  	  });
    }else{null}
  },
  
  commentNC(batchId, ncKey, com) {
    if(Roles.userIsInRole(Meteor.userId(), 'inspect')) {
  		BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'nonCon.key': ncKey}, {
  			$set : {
  			  'nonCon.$.comm': com
  			}
  		});
    }else{null}
  },
  
  ncRemove(batchId, ncKey, override) {
    const auth = Roles.userIsInRole(Meteor.userId(), ['remove', 'qa']);
    if(!auth && override === undefined) {
      null;
    }else{
      const org = AppDB.findOne({ orgKey: Meteor.user().orgKey });
      const minorPIN = org ? org.minorPIN : null;
      if(auth || minorPIN === override) {
        BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'nonCon.key': ncKey}, {
          $pull : { nonCon: {key: ncKey}
        }});
        return true;
      }else{
        return false;
      }
    }
  },

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
  
//// RMA Cascade ////
  addRMACascade(batchId, rmaId, qua, com, flowObj, nonConArr) {
    const doc = BatchDB.findOne({_id: batchId});
    const dupe = doc.cascade.find( x => x.rmaId === rmaId );
    const auth = Roles.userIsInRole(Meteor.userId(), 'qa');
    if(auth && !dupe) {
      
      for( let obj of flowObj ) {
        // set unique key in the track object
        obj['key'] = new Meteor.Collection.ObjectID().valueOf();
      }
      
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
        $push : { cascade: {
          key: new Meteor.Collection.ObjectID().valueOf(),
          rmaId: rmaId,
          time: new Date(),
          who: Meteor.userId(),
          quantity: Number(qua),
          comm: com,
          flow: flowObj,
          nonCons: nonConArr
        }},
        $set : {
  			  live: true
        }
      });
      return true;
    }else{
      return false;
    }
  },
    
/// editing an RMA Cascade
  editRMACascade(batchId, cKey, rmaId, qua, com, nonConArr) {
    const doc = BatchDB.findOne({_id: batchId});
    let dupe = doc.cascade.find( x => x.rmaId === rmaId );
    dupe ? dupe.rmaId === rmaId ? dupe = false : null : null;
    const auth = Roles.userIsInRole(Meteor.userId(), 'qa');
    if(auth && !dupe) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'cascade.key': cKey}, {
        $set : {
          'cascade.$.rmaId': rmaId,
          'cascade.$.quantity': qua,
          'cascade.$.comm': com,
          'cascade.$.nonCons': nonConArr
        }
      });
      return true;
    }else{
      return false;
    }
  },
  
  pullRMACascade(batchId, cKey) {
    const auth = Roles.userIsInRole(Meteor.userId(), ['remove', 'qa']);
    if(auth) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'cascade.key': cKey}, {
        $pull : { cascade: {key: cKey}
      }});
      return true;
    }else{
      return false;
    }
  },
  
  //// Blockers \\\\
  addBlock(batchId, blockTxt) {
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
  
  editBlock(batchId, blKey, blockTxt) {
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
  
  solveBlock(batchId, blKey, act) {
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

  removeBlock(batchId, blKey) {
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
  // Shortfall // Narrow Shortage
  
  addShort(batchId, partNum, refs, serial, step, comm) {
    const doc = BatchDB.findOne({_id: batchId, orgKey: Meteor.user().orgKey});
    const legacyCheck = doc.shortfall ? true : false;
    const double = legacyCheck ? 
                    doc.shortfall.find( x => 
                      x.partNum === partNum &&
                      x.serial === serial
                    ) : false;
    if(!Meteor.userId() || double) { return false }else{
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
        $push : { shortfall: {
          key: new Meteor.Collection.ObjectID().valueOf(), // id of the shortage entry
          partNum: partNum || '', // short part number
          refs: refs || [], // referances on the widget
          serial: serial || '', // apply to item
          where: step || '', // where in the process
          cTime: new Date(), // Object
          cWho: Meteor.userId(), // Object
          uTime: new Date(), // Object
          uWho: Meteor.userId(), // Object
          inEffect: null, // Boolean or Null
          reSolve: null, // Boolean or Null
          comm: comm || '' // comments // String
      }}});
      const accessKey = Meteor.user().orgKey;
      Meteor.call('autoTrashShortNC', accessKey, batchId, serial, refs);
      return true;
    }
  },
  
  editShort(batchId, serial, shKey, partNum, refs, inEffect, reSolve, comm) {
    const doc = BatchDB.findOne({_id: batchId, orgKey: Meteor.user().orgKey});
    const double = doc.shortfall.filter( x => 
                    x.partNum === partNum &&
                    x.serial === serial
                  );
    if(!Roles.userIsInRole(Meteor.userId(), 'verify') || double.length > 1) { null }else{
      const doc = BatchDB.findOne({_id: batchId, orgKey: Meteor.user().orgKey});
      const prevSH = doc.shortfall.find( x => x.key === shKey );
      let pn = partNum || prevSH.partNum;
      let rf = refs || prevSH.refs;
      //let sn = serial;
      //let st = step;
      let ef = inEffect === undefined ? prevSH.inEffect : inEffect;
      let sv = reSolve === undefined ? prevSH.reSolve : reSolve;
      let cm = comm || prevSH.comm;

		  BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'shortfall.key': shKey}, {
  			$set : { 
  			  'shortfall.$.partNum': pn || '',
  			  'shortfall.$.refs': rf || [],
  			  //'shortfall.$.serial': sn || '',
  			  //'shortfall.$.step': st || '',
  			  'shortfall.$.uTime': new Date(),
          'shortfall.$.uWho': Meteor.userId(),
          'shortfall.$.inEffect': ef,
          'shortfall.$.reSolve': sv,
  			  'shortfall.$.comm': cm || ''
  			}
  		});
  		const accessKey = Meteor.user().orgKey;
  		Meteor.call('autoTrashShortNC', accessKey, batchId, serial, refs);
    }
  },
  
  setShort(batchId, shKey, inEffect, reSolve) {
    if(!Roles.userIsInRole(Meteor.userId(), 'verify')) { null }else{
		  let ef = inEffect === undefined ? null : inEffect;
      let sv = reSolve === undefined ? null : reSolve;
		  
		  BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'shortfall.key': shKey}, {
  			$set : {
  			  'shortfall.$.uTime': new Date(),
          'shortfall.$.uWho': Meteor.userId(),
          'shortfall.$.inEffect': ef,
          'shortfall.$.reSolve': sv,
  			}
  		});
    }
  },
  
  removeShort(batchId, shKey, override) {
    const auth = Roles.userIsInRole(Meteor.userId(), ['remove', 'qa', 'run']);
    if(!auth && override === undefined) {
      null;
    }else{
      const org = AppDB.findOne({ orgKey: Meteor.user().orgKey });
      const minorPIN = org ? org.minorPIN : null;
      if(auth || minorPIN === override) {
        BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'shortfall.key': shKey}, {
          $pull : { shortfall: {key: shKey}
        }});
        return true;
      }else{
        return false;
      }
    }
  },
  
  //////////////////// DESTRUCTIVE \\\\\\\\\\\\\\\\\\\\\
  
  deleteBatchItems(batchId) {
    const accessKey = Meteor.user().orgKey;
    const doc = BatchDB.findOne({_id: batchId});
    const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
    const auth = Roles.userIsInRole(Meteor.userId(), 'remove');
    const inUse = doc.items.some( x => x.history.length > 0 ) && !isAdmin ? true : false;
    const howMany = doc.items.length + ' items';
    if(!inUse && auth && doc.orgKey === accessKey) {
      BatchDB.update({_id: batchId, orgKey: accessKey}, {
        $set : {
          items: [],
        },
        $push : {
          altered: {
            changeDate: new Date(),
            changeWho: Meteor.userId(),
            changeReason: 'user discretion',
            changeKey: 'items',
            oldValue: howMany,
            newValue: '0 items'
          }
        }
      });
      return true;
    }else{
      return false;
    }
  },
  
  deleteBatchTide(batchId) {
    const accessKey = Meteor.user().orgKey;
    const doc = BatchDB.findOne({_id: batchId});
    const auth = Roles.userIsInRole(Meteor.userId(), 'remove');
    const inUse = doc.tide.some( x => x.stopTime === false ) ? true : false;
    const howMany = doc.tide.length + ' times';
    if(!inUse && auth && doc.orgKey === accessKey) {
      BatchDB.update({_id: batchId, orgKey: accessKey}, {
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
      return true;
    }else{
      return false;
    }
  },
  
  /*deleteBatchProblems(batchId) {
    const accessKey = Meteor.user().orgKey;
    const doc = BatchDB.findOne({_id: batchId});
    const auth = Roles.userIsInRole(Meteor.userId(), 'remove');
    const howManyNC = doc.nonCon.length + ' nonCons';
    const howManyES = doc.escaped.length + ' escaped';
    const howManySH = doc.shortfall.length + ' shortfalls';
    const howMany = `${howManyNC}, ${howManyES}, ${howManySH}`;
    
    if(auth && doc.orgKey === accessKey) {
      BatchDB.update({_id: batchId, orgKey: accessKey}, {
        $set : {
          nonCon: [],
          escaped: [],
          shortfall: [],
        },
        $push : {
          altered: {
            changeDate: new Date(),
            changeWho: Meteor.userId(),
            changeReason: 'user discretion',
            changeKey: 'nonCon, escaped, shortfall',
            oldValue: howMany,
            newValue: '0 nonCons, 0 escaped, 0 shortfalls'
          }
        }
      });
      return true;
    }else{
      return false;
    }
  },*/
  
  deleteWholeBatch(batchId, pass) {
    const doc = BatchDB.findOne({_id: batchId});
    
    const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
    const auth = Roles.userIsInRole(Meteor.userId(), 'remove');
    
    const inUse = doc.tide.length > 0 || doc.items.length > 0 ? true : false;
      // nonCon.length > 0 || escaped.length > 0 || shortfall.length > 0
        
    if(!inUse && isAdmin && auth) {
      const lock = doc.createdAt.toISOString().split("T")[0];
      const access = doc.orgKey === Meteor.user().orgKey;
      const unlock = lock === pass;
      if(access && unlock) {
        BatchDB.remove({_id: batchId});
        return true;
      }else{
        return false;
      }
    }else{
      return 'inUse';
    }
  },
  
  
});