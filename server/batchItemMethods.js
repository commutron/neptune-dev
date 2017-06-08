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
  			widgetId: widgetId,
  			versionKey: vKey,
        tags: [],
        active: true,
        createdAt: new Date(),
  			createdWho: Meteor.userId(),
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
        scrap: Number(0),
        short: [],
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
  			  end: eDate
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
      const user = Roles.userIsInRole(Meteor.userId(), 'remove');
      const access = doc.orgKey === Meteor.user().orgKey;
      const unlock = lock === pass;
      if(user && access && unlock) {
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
      barFirst < barLast
      &&
      barLast - barFirst <= 1000
      &&
      unit > 0
      &&
      unit < 100
      )
      {
        const doc = BatchDB.findOne({_id: batchId, orgKey: Meteor.user().orgKey});
        const open = doc.finishedAt === false;
        const auth = Roles.userIsInRole(Meteor.userId(), 'run');
        
        if(auth && open && doc) {
          
          let bad = [];
      
          for(var click = barFirst; click < barLast; click++) {
            let barcode = click.toString();
            let duplicate = doc.items.find(x => x.serial === barcode);
            if(duplicate) {
              bad.push(barcode);
            }else{
              BatchDB.update({_id: batchId}, {
                $push : { items : {
                  serial: barcode,
                  unit: Number(unit),
                  createdAt: new Date(),
                  createdWho: Meteor.userId(),
                  finishedAt: false,
                  finishedWho: false,
                  history: [],
                  alt: false,
                  rma: [],
                }}});
            }
          }
    // callbacks = [success, not added]
          return [true, bad];
        }else{
          return [false, false];
        }
      }
      else
      {
        return [false, false];
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
          'items.$.unit': Number(unit)
        }});
      return true;
    }else{
      return false;
    }
  },
  
  //// history entries

  addHistory(batchId, bar, key, step, type, com) {
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
          good: true,
          time: new Date(),
          who: Meteor.userId(),
          comm : com,
          info: false
      }}});
      return true;
    }
  },

  addFirst(batchId, bar, key, step, type, com, good, whoB, howB, howI, diff, ng) {
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
          comm : com,
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
    if(!Roles.userIsInRole(Meteor.userId(), 'inspect')) {
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
  
  //  remove a step
  pullHistory(batchId, bar, key) {
    if(Roles.userIsInRole(Meteor.userId(), 'edit')) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'items.serial': bar}, {
        $pull : {
          'items.$.history': {key: key}
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
  
  // delete \\
  deleteItem(batchId, bar, pass) {
    const doc = BatchDB.findOne({_id: batchId});
    const subDoc = doc.items.find( x => x.serial === bar );
    const inUse = subDoc.history.length > 0 ? true : false;
    if(!inUse) {
      const lock = subDoc.createdAt.toISOString();
      const admin = Roles.userIsInRole(Meteor.userId(), 'remove');
      const access = doc.orgKey === Meteor.user().orgKey;
      const unlock = lock === pass;
      if(admin && access && unlock) {
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


//// Non-Cons \\\\
  addNC(batchId, bar, ref, type, step) {
    if(Meteor.userId()) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
        $push : { nonCon: {
          key: new Meteor.Collection.ObjectID().valueOf(), // id of the nonCon entry
          serial: bar, // barcode id of item
          ref: ref, // referance on the widget
          type: type, // type of nonCon
          where: step, // where in the process
          time: new Date(), // when nonCon was discovered
          who: Meteor.userId(),
          fix: false,
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

  // this has not been implemented or tested \\
  /*
  ncRemove(batchId, key) {
  const auth = Roles.userIsInRole(Meteor.userId(), 'remove');
    BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'nonCon.key': key}, {
      $pull : { nonCon: { key: key }
       }});
  },
  */
  
  // RMA Cascade //
  
  addRMACascade(batchId, rmaId, qua, com, flowObj) {
    const doc = BatchDB.findOne({_id: batchId});
    const dupe = doc.cascade.find( x => x.rmaId === rmaId );
    const auth = Roles.userIsInRole(Meteor.userId(), ['edit', 'qa']);
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
          nonCon: []
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
  
  
  /// editing an RMA Cascade
  
  /// unset an rma on an item
  
  /*
  
  pullRMA(batchId, rmaNum) {
    if(Roles.userIsInRole(Meteor.userId(), 'remove')) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'rma.rma': rmaNum}, {
        $pull : {
          rma : { rma : rmaNum }
        }});
      return true;
    }else{
      return false;
    }
  },
  */
  

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
      // increment batch scrap count
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
        $inc : { 
          scrap: Number(1)
        }
      });
      return true;
    }else{
      return false;
    }
  },
  

  //// Shortages \\\\

  addShort(batchId, prtNm, quant, com) {
    const auth = Roles.userIsInRole(Meteor.userId(), 'run');
    if(auth) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
        $push : { short: {
          key: new Meteor.Collection.ObjectID().valueOf(),
          partNum: prtNm,
  			  quantity: quant,
          time: new Date(),
          who: Meteor.userId(),
          comm: com,
          resolve: false,
          followup: false
          }}});
          return true;
        }else{
          return false;
        }
  },
  
  resolveShort(batchId, shKey, act, alt) {
    const auth = Roles.userIsInRole(Meteor.userId(), 'run');
    if(auth) {
  		BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'short.key': shKey}, {
  			$set : { 
  			  'short.$.resolve':
  			    {
  			      action: act,
              time: new Date(),
              who: Meteor.userId(),
              alt: alt
            }
  			}
  		});
  		return true;
    }else{
      return false;
    }
  },
  
  recShort(batchId, shKey) {
    const auth = Roles.userIsInRole(Meteor.userId(), 'run');
    if(auth) {
  		BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'short.key': shKey}, {
  			$set : { 
  			  'short.$.followup': new Date()
  			}
  		});
			return true;
    }else{
      return false;
    }
  },
  
  editShortCom(batchId, shKey, com) {
    const auth = Roles.userIsInRole(Meteor.userId(), 'run');
    if(auth) {
  		BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'short.key': shKey}, {
  			$set : { 
  			  'short.$.comm': com
  			}
  		});
			return true;
    }else{
      return false;
    }
  },
  
  undoReShort(batchId, shKey) {
    const auth = Roles.userIsInRole(Meteor.userId(), 'run');
    if(auth) {
  		BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'short.key': shKey}, {
  			$set : { 
  			  'short.$.resolve': false,
  			  'short.$.followup': false
  			}
  		});
  		return true;
    }else{
      return false;
    }
  },

  sRemove(batchId, shKey) {
    if(Roles.userIsInRole(Meteor.userId(), 'remove')) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
        $pull : { short: { key: shKey }
         }});
      return true;
    }else{
      return false;
    }
  },


  //////////////////////////////////////////////////////////////////////////////////////////////////

});