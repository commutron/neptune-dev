Meteor.methods({

//// Batches \\\\
  addBatch(batchNum, widgetId, vKey, sDate, eDate) {
    const doc = WidgetDB.findOne({_id: widgetId});
    const duplicate = BatchDB.findOne({batch: batchNum});
    const auth = Roles.userIsInRole(Meteor.userId(), 'create');
    if(auth && !duplicate && doc.orgKey === Meteor.user().orgKey) {
      BatchDB.insert({
  			batch: batchNum,
  			orgKey: Meteor.user().orgKey,
  			shareKey: false,
  			widgetId: widgetId,
  			versionKey: vKey,
        tags: [],
        active: true,
        createdAt: new Date(),
        createdWho: Meteor.userId(),
        updatedAt: new Date(),
  			updatedWho: Meteor.userId(),
  			finishedAt: false,
  			start: sDate,
  			end: eDate,
  			notes: false,
        river: false,
        riverAlt: false,
        items: [],
        nonCon: [],
        escaped: [],
        cascade: [],
        blocks: [],
        });
      return true;
    }else{
      return false;
    }
  },
  
  editBatch(batchId, newBatchNum, vKey, sDate, eDate) {
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

  deleteBatch(batch, pass) {
    const doc = BatchDB.findOne({_id: batch._id});
    // if any items have history
    const inUse = doc.items.some( x => x.history.length > 0 ) ? true : false;
    if(!inUse) {
      const lock = doc.createdAt.toISOString();
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

  changeStatus(batchId, status) {
    if(Roles.userIsInRole(Meteor.userId(), 'run')) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
  			$set : {
  			  updatedAt: new Date(),
  			  updatedWho: Meteor.userId(),
  			  active: status
      }});
    }else{null}
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

//// Items \\\\
  addMultiItems(batchId, barFirst, barLast, unit) {
    if(
      !isNaN(barFirst)
      &&
      !isNaN(barLast)
      &&
      barFirst > 0
      &&
      barFirst.length === barLast.length
      &&
      barFirst < barLast
      &&
      barLast - barFirst <= 1000
      &&
      unit > 0
      &&
      unit <= 250
      )
      {
        const doc = BatchDB.findOne({_id: batchId, orgKey: Meteor.user().orgKey});
        const open = doc.finishedAt === false;
        const auth = Roles.userIsInRole(Meteor.userId(), 'run');
        
        if(auth && open && doc) {
          
          let bad = [];
          let rNum = parseInt(doc.batch, 10) - 12; // should be enough
          let fNum = parseInt(doc.batch, 10) + 12; // should be enough
          let recent = rNum.toString();
          let future = fNum.toString();
          // custom to sequencial batch numbers
          // by date would be better if i could get that to work
      
          for(var click = barFirst; click < barLast; click++) {
            let barcode = click.toString();
            let duplicate = doc.items.find(x => x.serial === barcode);
            let wideDuplicate = BatchDB.findOne({
              batch: {$gte: recent, $lte: future},  
              'items.serial': barcode});
            if(duplicate || wideDuplicate) {
              bad.push(barcode);
            }else{
              BatchDB.update({_id: batchId}, {
                $push : { items : {
                  serial: barcode,
                  createdAt: new Date(),
                  createdWho: Meteor.userId(),
                  finishedAt: false,
                  finishedWho: false,
                  units: Number(unit), // non tracked children
                  panel: false,
                  panelCode: false,
                  subItems: [],
                  history: [],
                  alt: false,
                  rma: []
                }}});
            }
          }
    // callbacks = [success, not added]
          return [true, bad, 'partial'];
        }else{
          return [false, false, 'noAuth'];
        }
      }
      else
      {
        return [false, false, 'noRange'];
      }
  },
  
  // delete \\
  deleteItem(batchId, bar, pass) {
    const doc = BatchDB.findOne({_id: batchId});
    const subDoc = doc.items.find( x => x.serial === bar );
    const inUse = subDoc.history.length > 0 ? true : false;
    if(!inUse) {
      const lock = subDoc.createdAt.toISOString();
      const auth = Roles.userIsInRole(Meteor.userId(), 'remove');
      const access = doc.orgKey === Meteor.user().orgKey;
      const unlock = lock === pass;
      if(auth && access && unlock) {
    		BatchDB.update(batchId, {
          $pull : { items: { serial: bar }
        }});
        return true;
      }else{
        return false;
      }
    }else{
      return 'inUse';
    }
  },
  
  //// fork, use alternative flow
  
  forkItem(id, bar, choice) {
    if(Meteor.userId()) {
      BatchDB.update({_id: id, orgKey: Meteor.user().orgKey, 'items.serial': bar}, {
        $set : { 
          'items.$.alt': choice 
        }});
      return true;
    }else{
      return false;
    }
  },
  
  //// unit corection
  
  setItemUnit(id, bar, unit) {
    const auth = Roles.userIsInRole(Meteor.userId(), 'run');
    if(auth && unit > 0 && unit < 100) {
      BatchDB.update({_id: id, orgKey: Meteor.user().orgKey, 'items.serial': bar}, {
        $set : { 
          'items.$.units': Number(unit)
        }});
      return true;
    }else{
      return false;
    }
  },
  
  //// history entries

  addHistory(batchId, bar, key, step, type, com, pass) {
    if(type === 'inspect' && !Roles.userIsInRole(Meteor.userId(), 'inspect')) {
      return false;
    }else if(type === 'test' && !Roles.userIsInRole(Meteor.userId(), 'test')) {
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

  addFirst(batchId, bar, key, step, type, good, whoB, howB, howI, diff, ng) {
    if(!Roles.userIsInRole(Meteor.userId(), 'inspect')) {
      return false;
    }else{
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'items.serial': bar}, {
        $push : { 'items.$.history': {
          key: key,
          step: step,
          type: type,
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


  finishItem(batchId, barcode, key, step, type) {
    if(!Roles.userIsInRole(Meteor.userId(), 'finish')) {
      return false;
    }else{
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'items.serial': barcode}, {
  			$push : { 
  			  'items.$.history': {
  			    key: key,
            step: step,
            type: type,
            good: true,
            time: new Date(),
            who: Meteor.userId(),
            comm : '',
            info: false
  			  }
  			},
  			$set : { 
  			  'items.$.finishedAt': new Date(),
  			  'items.$.finishedWho': Meteor.userId()
  			}
      });
      
      // finish batch
      const doc = BatchDB.findOne({_id: batchId});
      const allDone = doc.items.every( x => x.finishedAt !== false );
      if(doc.finishedAt === false && allDone) {
        BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
    			$set : { 
    			  active: false,
    			  finishedAt: new Date()
        }});
      }else{null}
  		return true;
    }
  },
  
// Scrap \\
  scrapItem(batchId, bar, step, comm) {
    if(Roles.userIsInRole(Meteor.userId(), 'qa')) {
      // update item
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'items.serial': bar}, {
        // scrap entry to history
        $push : { 
  			  'items.$.history': {
  			    key: new Meteor.Collection.ObjectID().valueOf(),
            step: step,
            type: 'scrap',
            good: true,
            time: new Date(),
            who: Meteor.userId(),
            comm: comm,
            info: false
  			  }
  			},
  			// finish item
  			$set : { 
  			  'items.$.finishedAt': new Date(),
  			  'items.$.finishedWho': Meteor.userId()
  			}
      });
      return true;
    }else{
      return false;
    }
  },
  
//  remove a step
  pullHistory(batchId, bar, key, time) {
    if(Roles.userIsInRole(Meteor.userId(), 'edit')) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'items.serial': bar}, {
        $pull : {
          'items.$.history': {key: key, time: time}
        }});
        return true;
    }else{
      return false;
    }
  },
  
// replace a step
  pushHistory(batchId, bar, replace) {
    //some validation on the replace would be good
    if(Roles.userIsInRole(Meteor.userId(), 'edit')) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'items.serial': bar}, {
        $push : { 
          'items.$.history': replace
        }});
    }else{
      null;
    }
  },

//// Non-Cons \\\\
  addNC(batchId, bar, ref, type, step, fix) {
    if(Meteor.userId()) {
      
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
          skip: false,
          }}});
    }else{null}
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
    
  editNC(batchId, ncKey, type) {
    if(Roles.userIsInRole(Meteor.userId(), 'run')) {
  		BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'nonCon.key': ncKey}, {
  			$set : { 
  			  'nonCon.$.type': type,
  			}
  		});
    }else{null}
  },

  skipNC(batchId, ncKey, com) {
    if(Meteor.userId()) {
  		BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'nonCon.key': ncKey}, {
  			$set : {
  			  'nonCon.$.comm': com,
  			  'nonCon.$.skip': { 
  			    time: new Date(),
  			    who: Meteor.userId()
  			  }
  			}
  		});
    }else{null}
  },

  UnSkipNC(batchId, ncKey) {
    if(Meteor.userId()) {
  		BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'nonCon.key': ncKey}, {
  			$set : {
  			  'nonCon.$.skip': false
  			}
  		});
    }else{null}
  },
  
  ncRemove(batchId, ncKey) {
    const auth = Roles.userIsInRole(Meteor.userId(), ['remove', 'qa']);
    if(auth) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'nonCon.key': ncKey}, {
        $pull : { nonCon: {key: ncKey}
      }});
      return true;
    }else{
      return false;
    }
  },
  
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
  addRMACascade(batchId, rmaId, qua, com, flowObj) {
    const doc = BatchDB.findOne({_id: batchId});
    const dupe = doc.cascade.find( x => x.rmaId === rmaId );
    const auth = Roles.userIsInRole(Meteor.userId(), ['qa']);
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
          flow: flowObj
        }},
        $set : {
  			  active: true
        }
      });
      return true;
    }else{
      return false;
    }
  },
    
   /// editing an RMA Cascade
   
  editRMACascade(batchId, cKey, rmaId, qua, com) {
    const doc = BatchDB.findOne({_id: batchId});
    let dupe = doc.cascade.find( x => x.rmaId === rmaId );
    dupe ? dupe.rmaId === rmaId ? dupe = false : null : null;
    const auth = Roles.userIsInRole(Meteor.userId(), ['edit', 'qa']);
    if(auth && !dupe) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'cascade.key': cKey}, {
        $set : {
          'cascade.$.rmaId': rmaId,
          'cascade.$.quantity': qua,
          'cascade.$.comm': com
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
   
   
  setRMA(batchId, bar, cKey) {
    if(Roles.userIsInRole(Meteor.userId(), ['qa', 'run', 'inspect'])) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'items.serial': bar}, {
        $push : { 
          'items.$.rma': cKey
        }});
      return true;
    }else{
      return false;
    }
  },
  
  /// unset an rma on an item
  /// low risk, no inUse check
  unsetRMA(batchId, bar, cKey) {
    if(Roles.userIsInRole(Meteor.userId(), ['qa', 'remove'])) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'items.serial': bar}, {
        $pull : {
          'items.$.rma': cKey
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

  //////////////////////////////////////////////////////////////////////////////////////////////////

});