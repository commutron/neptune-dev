
// Scafolding for a future independant Item database collection
// Not in use, non functioning
// Will require an DB for the info for a run/set of items. Orbit? 

/*

//import moment from 'moment';

Meteor.methods({

//// Items \\\\
  addMultiItems(batchId, barFirst, barLast, unit) {
    
    const barEnd = barLast + 1;
    
    const appSetting = AppDB.findOne({orgKey: Meteor.user().orgKey});
    const floor = barFirst.toString().length === 10 ?
                  appSetting.latestSerial.tenDigit :
                  appSetting.latestSerial.nineDigit;
    
    if(
      !isNaN(barFirst)
      &&
      !isNaN(barEnd)
      &&
      barFirst.toString().length === barEnd.toString().length
      &&
      barFirst < barEnd
      &&
      barEnd - barFirst <= 1000
      &&
      unit > 0
      &&
      unit <= 250
      ) {
        const doc = BatchDB.findOne({_id: batchId, orgKey: Meteor.user().orgKey});
        const open = doc.finishedAt === false;
        const auth = Roles.userIsInRole(Meteor.userId(), 'run');
        
        const dupeCheck = (barFirst, barEnd, floor) => {
          let clear = true;
          if(barFirst < floor) { 
            for(var flick = barFirst; flick < barEnd; flick++) {
              let barcode = flick.toString();
              let wideDuplicate = BatchDB.findOne({ 'items.serial': barcode });
              if(wideDuplicate) {
                clear = false;
                break;
              }else{
                null;
              }
            }
          }else{
            null;
          }
          return clear;
        };
        
        const dupeClear = dupeCheck(barFirst, barEnd, floor);
        
        if(doc && open && auth && dupeClear ) {

          for(var click = barFirst; click < barEnd; click++) {
            let barcode = click.toString();
            ItemDB.insert({
                serial: barcode,
                orgKey: Meteor.user().orgKey,
                batch: batchNum,
                widgetId: widgetId,
                versionKey: vKey,
                createdAt: new Date(),
                createdWho: Meteor.userId(),
                updatedAt: new Date(),
  			        updatedWho: Meteor.userId(),
                finishedAt: false,
                finishedWho: false,
                
                units: Number(unit), // non tracked children
                panel: false,
                panelCode: false,
                subItems: [],
                
                history: [],
                nonCon: [],
                shortage: [],
                altPath: [],
                rma: [],
              });
            }
          
          if(barLast > floor) {
            if(barLast < 999999999 ) {
              AppDB.update({orgKey: Meteor.user().orgKey}, {
                $set : {
                  'latestSerial.nineDigit': Number(barLast)
                }});
            }else if(barLast < 10000000000 ) {
              AppDB.update({orgKey: Meteor.user().orgKey}, {
                $set : {
                  'latestSerial.tenDigit': Number(barLast)
                }});
            }else{
              null;
            }
          }else{
            null;
          }
          return {
            success: true,
            message:'done'
          };
        }else{
          if(!dupeClear) {
            return {
              success: false,
              message: 'duplicate serials'
            };
          }else{
            return {
              success: false,
              message: 'noAuth'
            };
          }
        }
      }else{
        if(barFirst <= floor) {
          return {
            success: false,
            message: 'tooLowRange'
          };
        }else{
          return {
            success: false,
            message: 'noRange'
          };
        }
      }
    },
  
  //// history entries

  addHistory(batchId, bar, key, step, type, com, pass) {
    if(type === 'inspect' && !Roles.userIsInRole(Meteor.userId(), 'inspect')) {
      return false;
    }else{
      ItemDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'items.serial': bar}, {
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

  addFirst(batchId, bar, key, step, good, whoB, howB, howI, diff, ng) {
    if(!Roles.userIsInRole(Meteor.userId(), 'verify')) {
      return false;
    }else{
      ItemDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'items.serial': bar}, {
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
  
  // ship failed test
  addTest(batchId, bar, key, step, type, com, pass, more) {
    if(type === 'test' && !Roles.userIsInRole(Meteor.userId(), 'test')) {
      return false;
    }else{
      ItemDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'items.serial': bar}, {
        $push : { 'items.$.history': {
          key: key,
          step: step,
          type: type,
          good: pass,
          time: new Date(),
          who: Meteor.userId(),
          comm : com,
          info: more
      }}});
      return true;
    }
  },
  
  addNested(batchId, serial, key, step, subSerial) {
    if(!Roles.userIsInRole(Meteor.userId(), 'active')) {
      return false;
    }else{
      ItemDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'items.serial': serial}, {
        $push : { 
          'items.$.history': {
            key: key,
            step: step,
            type: 'nest',
            good: true,
            time: new Date(),
            who: Meteor.userId(),
            comm : subSerial,
            info: false
          },
          'items.$.subItems' : subSerial
        }
      });
      return true;
    }
  },

  // finish Item
  finishItem(batchId, serial, key, step, type) {
    if(!Roles.userIsInRole(Meteor.userId(), 'finish')) {
      return false;
    }else{
      ItemDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'items.serial': serial}, {
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
      Meteor.call('finishBatch', batchId, Meteor.user().orgKey);
  		return true;
    }
  },
  
// Scrap \\
  scrapItem(batchId, bar, step, comm) {
    if(Roles.userIsInRole(Meteor.userId(), 'qa')) {
      // update item
      ItemDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'items.serial': bar}, {
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
      ItemDB.update({_id: batchId, orgKey: Meteor.user().orgKey, serial: bar}, {
        $pull : {
          history: {key: key, time: time}
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
      ItemDB.update({_id: batchId, orgKey: Meteor.user().orgKey, serial: bar}, {
        $push : { 
          history: replace
        }});
    }else{
      null;
    }
  },
  
  //  Undo a Finish
  pullFinish(batchId, serial) {
    if(Roles.userIsInRole(Meteor.userId(), 'finish')) {
      ItemDB.update({_id: batchId, orgKey: Meteor.user().orgKey, serial: serial}, {
        $pull : {
          history: { key: 'f1n15h1t3m5t3p' }
        },
        $set : { 
  			  finishedAt: false,
  			  finishedWho: false
  			},
      });
        return true;
    }else{
      return false;
    }
  },
  pushUndoFinish(batchId, serial) {
    if(Roles.userIsInRole(Meteor.userId(), 'finish')) {
      ItemDB.update({_id: batchId, orgKey: Meteor.user().orgKey, serial: serial}, {
        $push : { 
  			  history: {
  			    key: new Meteor.Collection.ObjectID().valueOf(),
            step: 'undo finish',
            type: 'undo',
            good: false,
            time: new Date(),
            who: Meteor.userId(),
            comm: '',
            info: false
  			  }}});
    }else{
      null;
    }
  },
  
//// panel break
  breakItemIntoUnits(id, bar, newSerials) {
    const auth = Roles.userIsInRole(Meteor.userId(), 'remove');
    const batch = BatchDB.findOne({_id: id, orgKey: Meteor.user().orgKey});
    const item = batch ? batch.items.find( x => x.serial === bar ) : false;
    if(auth && item) {
      for(let sn of newSerials) {
        BatchDB.update({_id: id}, {
          $push : { items : {
            serial: sn,
            createdAt: new Date(),
            createdWho: Meteor.userId(),
            finishedAt: false,
            finishedWho: false,
            units: Number(1),
            panel: false,
            panelCode: bar,
            subItems: [],
            history: item.history,
            alt: item.alt,
            rma: []
        }}});
      }
      BatchDB.update({_id: id}, {
        $set : {
          updatedAt: new Date(),
  			  updatedWho: Meteor.userId()
      }});
      BatchDB.update(id, {
        $pull : { items: { serial: bar }
      }});
      return true;
    }else{
      return false;
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
          reject: [],
          skip: false,
          snooze: false,
          comm: ''
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
    
  editNC(batchId, ncKey, ref, type, where) {
    if(Roles.userIsInRole(Meteor.userId(), 'inspect')) {
		  BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'nonCon.key': ncKey}, {
  			$set : { 
  			  'nonCon.$.ref': ref,
  			  'nonCon.$.type': type,
  			  'nonCon.$.where': where
  			}
  		});
    }else{null}
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
  
  skipNC(batchId, ncKey) {
    if(Roles.userIsInRole(Meteor.userId(), 'inspect')) {
  		BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'nonCon.key': ncKey}, {
  			$set : {
  			  'nonCon.$.skip': { 
  			    time: new Date(),
  			    who: Meteor.userId()
  			  },
  			  'nonCon.$.snooze': false
  			}
  		});
    }else{null}
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

  //////////////////////////////////////////////////////////////////////////////////////////////////

});

*/