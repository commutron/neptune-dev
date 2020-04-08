import moment from 'moment';

Meteor.methods({

//// Items \\\\
  
  ///// With Duplicate Pre Check //////
  addMultiItems(batchId, barFirst, barLast, unit) {
    
    const barEnd = barLast + 1;
    
    const appSetting = AppDB.findOne({orgKey: Meteor.user().orgKey});
    const floor = barFirst.toString().length === 10 ?
                  appSetting.latestSerial.tenDigit :
                  barFirst.toString().length === 9 ?
                  appSetting.latestSerial.nineDigit :
                  appSetting.latestSerial.eightDigit;
    
    if(
      !isNaN(barFirst)
      &&
      !isNaN(barEnd)
      &&
      barFirst.toString().length === barEnd.toString().length
      &&
      barFirst < barEnd
      &&
      ( barEnd - barFirst ) <= 9999
      &&
      unit >= 1
      &&
      unit <= 999
      ) {
        const doc = BatchDB.findOne({_id: batchId, orgKey: Meteor.user().orgKey});
        const open = doc.finishedAt === false;
        const auth = Roles.userIsInRole(Meteor.userId(), 'create');
        
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
          let barcodeOne = barFirst.toString();
          let narrowDuplicate = BatchDB.findOne({ 'items.serial': barcodeOne });
          if(narrowDuplicate) { clear = false }
          return clear;
        };
        
        const dupeClear = dupeCheck(barFirst, barEnd, floor);
        
        if(doc && open && auth && dupeClear ) {

          for(var click = barFirst; click < barEnd; click++) {
            let barcode = click.toString();
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
          BatchDB.update({_id: batchId}, {
            $set : {
              updatedAt: new Date(),
      			  updatedWho: Meteor.userId()
            }});
          if(barLast > floor) {
            if(barLast < 88888888 ) {
              AppDB.update({orgKey: Meteor.user().orgKey}, {
                $set : {
                  'latestSerial.eightDigit': Number(barLast)
                }});
            }else if(barLast < 999999999 ) {
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
    
  addYearWeekPanelItems(batchId, serialArr) {
    this.unblock();
    
    if(Roles.userIsInRole(Meteor.userId(), 'create')) {
    
      if(Array.isArray(serialArr) && serialArr.length > 0) {
        const doc = BatchDB.findOne({_id: batchId, orgKey: Meteor.user().orgKey});
        const open = doc.finishedAt === false;
        
        if(open) {
          
          let badBarcodes = [];
          
          for( let serialTry of serialArr ) {
            let duplicate = BatchDB.findOne({ 'items.serial': serialTry });
            
            if(!duplicate) {
              
              BatchDB.update({_id: batchId}, {
                $push : { items : {
                  serial: serialTry,
                  createdAt: new Date(),
                  createdWho: Meteor.userId(),
                  finishedAt: false,
                  finishedWho: false,
                  units: Number(1),
                  panel: false,
                  panelCode: false,
                  subItems: [],
                  history: [],
                  alt: false,
                  rma: []
              }}});
              
            }else{
              badBarcodes.push(serialTry);
            }
          }
        
          BatchDB.update({_id: batchId}, {
            $set : {
              updatedAt: new Date(),
      			  updatedWho: Meteor.userId()
            }});
            
          return {
            success: true,
            dupes: badBarcodes
          };
            
        }else{
          return false;
        }
        
      }else{
        return false;
      }
    }else{
      return false;
    }
  },
  
  
// delete \\
  deleteItem(batchId, bar, pass) {
    const doc = BatchDB.findOne({_id: batchId});
    const subDoc = doc.items.find( x => x.serial === bar );
    const inUse = subDoc.history.length > 0 ? true : false;
    if(!inUse) {
      const lock = subDoc.createdAt.toISOString().split("T")[0];
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
  
  // fix delete \\
  /*
  dataFIXduplicateserial(batchNum, serialNum, dateStamp) {
  
    const doc = BatchDB.findOne({batch: batchNum});
    const subDocMatch = doc && doc.items.find( x => 
      x.serial === serialNum && x.createdAt.toISOString() === dateStamp );
    if(subDocMatch) {
      const auth = Roles.userIsInRole(Meteor.userId(), 'admin');
      if(auth) {
    		BatchDB.update({batch: batchNum}, {
          $pull : { items: { 
            serial: serialNum, 
            createdAt: new Date(dateStamp) 
          }
        }});
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  },
  */
  
  
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
    const auth = Roles.userIsInRole(Meteor.userId(), ['edit', 'run']);
    if(auth && unit >= 1 && unit <= 999) {
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

  addHistory(batchId, bar, key, step, type, com, pass, benchmark) {
    if(type === 'inspect' && !Roles.userIsInRole(Meteor.userId(), 'inspect')) {
      return false;
    }else{
      const orgKey = Meteor.user().orgKey;
      const username = Meteor.user().username;
      BatchDB.update({_id: batchId, orgKey: orgKey, 'items.serial': bar}, {
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
      Meteor.defer( ()=>{
        if(benchmark === 'first') {
          Meteor.call(
            'setBatchEvent', 
            orgKey,
            batchId, 
            'Start of Process', 
            `First ${step} ${type} recorded by ${username}`
          );
        }
        if(benchmark === 'last') {
          Meteor.call(
            'setBatchEvent', 
            orgKey, 
            batchId,
            'End of Process', 
            `Final ${step} ${type} recorded by ${username}`
          );
        }
      });
      return true;
    }
  },

  addFirst(batchId, bar, key, step, good, whoB, howB, howI, diff, ng, firstfirst) {
    if(!Roles.userIsInRole(Meteor.userId(), 'verify')) {
      return false;
    }else{
      const orgKey = Meteor.user().orgKey;
      const username = Meteor.user().username;
      BatchDB.update({_id: batchId, orgKey: orgKey, 'items.serial': bar}, {
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
      Meteor.defer( ()=>{
        if(firstfirst === true && good === false) {
          Meteor.call(
            'setBatchEvent', 
            orgKey, 
            batchId, 
            'NG First-off Verification', 
            `An unacceptable ${step} first-off recorded by ${username}`
          );
        }
        if(firstfirst === true && good === true) {
          Meteor.call(
            'setBatchEvent', 
            orgKey, 
            batchId, 
            'First-off Verification', 
            `First good ${step} first-off recorded by ${username}`
          );
        }
      });
      return true;
    }
  },
  
  // ship failed test
  addTest(batchId, bar, key, step, type, com, pass, more, benchmark) {
    if(type === 'test' && !Roles.userIsInRole(Meteor.userId(), 'test')) {
      return false;
    }else{
      const orgKey = Meteor.user().orgKey;
      const username = Meteor.user().username;
      BatchDB.update({_id: batchId, orgKey: orgKey, 'items.serial': bar}, {
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
      Meteor.defer( ()=>{
        if(benchmark === 'first' && pass === true) {
          Meteor.call(
            'setBatchEvent', 
            orgKey,
            batchId, 
            'Start of Process', 
            `First passed ${step} recorded by ${username}`
          );
        }
        if(benchmark === 'last' && pass === true) {
          Meteor.call(
            'setBatchEvent', 
            orgKey, 
            batchId, 
            'End of Process', 
            `Final passed ${step} recorded by ${username}`
          );
        }
      });
      return true;
    }
  },
  
  addNested(batchId, serial, key, step, subSerial) {
    if(!Roles.userIsInRole(Meteor.userId(), 'active')) {
      return false;
    }else{
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'items.serial': serial}, {
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
      /*
      Meteor.defer( ()=>{
      if(benchmark === 'first') {
        Meteor.call(
          'setBatchEvent', 
          orgKey,
          batchId, 
          'Start of Process', 
          `First ${step} ${type} recorded by ${username}`
        );
      }
      if(benchmark === 'last') {
        Meteor.call(
          'setBatchEvent', 
          orgKey, 
          batchId, 
          'End of Process', 
          `Final ${step} ${type} recorded by ${username}`
        );
      }
      */
      return true;
    }
  },

  // finish Item
  finishItem(batchId, serial, key, step, type, benchmark) {
    if(!Roles.userIsInRole(Meteor.userId(), 'finish')) {
      return false;
    }else{
      const orgKey = Meteor.user().orgKey;
      const username = Meteor.user().username;
      BatchDB.update({_id: batchId, orgKey: orgKey, 'items.serial': serial}, {
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
      Meteor.defer( ()=>{
        if(benchmark === 'first') {
          Meteor.call(
            'setBatchEvent', 
            orgKey,
            batchId, 
            'Start of Process', 
            `First item recorded as complete by ${username}`
          );
        }
        if(benchmark === 'last') {
          Meteor.call(
            'setBatchEvent', 
            orgKey, 
            batchId, 
            'End of Process', 
            `Final item recorded as complete by ${username}`
          );
        }
        Meteor.call('finishBatch', batchId, orgKey);
      });
  		return true;
    }
  },
  
// Scrap \\
  scrapItem(batchId, bar, step, comm) {
    if(Roles.userIsInRole(Meteor.userId(), 'qa')) {
      const orgKey = Meteor.user().orgKey;
      const username = Meteor.user().username;
      // update item
      BatchDB.update({_id: batchId, orgKey: orgKey, 'items.serial': bar}, {
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
      Meteor.defer( ()=>{
        Meteor.call(
          'setBatchEvent', 
          orgKey,
          batchId, 
          'Item Scrapped', 
          `Item ${bar} recorded as scrapped by ${username}`
        );
      });
      return true;
    }else{
      return false;
    }
  },
  
// Close an incomplete item \\
  finishIncompleteItem(batchId, bar, comm) {
    if(Roles.userIsInRole(Meteor.userId(), ['qa', 'run'])) {
      const orgKey = Meteor.user().orgKey;
      const username = Meteor.user().username;
      // update item
      BatchDB.update({_id: batchId, orgKey: orgKey, 'items.serial': bar}, {
        // scrap entry to history
        $push : { 
  			  'items.$.history': {
  			    key: 'f1n15h1t3m5t3p',
            step: 'finish incomplete',
            type: 'finish',
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
      Meteor.defer( ()=>{
        Meteor.call(
          'setBatchEvent', 
          orgKey,
          batchId, 
          'Item Finished Incomplete', 
          `Item ${bar} recorded as finished by ${username}`
        );
      });
      return true;
    }else{
      return false;
    }
  },
  
  //  remove a step
  popHistory(batchId, serial) {
    if(Roles.userIsInRole(Meteor.userId(), 'active')) {
      const batch = BatchDB.findOne({_id: batchId, orgKey: Meteor.user().orgKey, 'items.serial': serial});
      const itemHistory = batch.items.find( x => x.serial === serial).history;
      const lastEntry = itemHistory[itemHistory.length -1];
      const timeElapse = moment.duration(moment().diff(moment(lastEntry.time))).asSeconds();
      if(timeElapse > 0 && timeElapse < 10) {
        BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'items.serial': serial}, {
          $pop : { 'items.$.history': 1 }
        });
      }else{
        null;
      }
    }
  },
  
//  remove a step
  pullHistory(batchId, bar, key, time) {
    if(Roles.userIsInRole(Meteor.userId(), ['edit', 'run'])) {
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
  
  //  Undo a Finish
  pullFinish(batchId, serial, override) {
    if(!Roles.userIsInRole(Meteor.userId(), 'finish') || override === undefined) {
      null;
    }else{
      const doc = BatchDB.findOne({_id: batchId});
      const docOpen = doc ? doc.finishedAt === false : false;
      const subDoc = doc ? doc.items.find( x => x.serial === serial ) : false;
      
      const whenDid = subDoc.finishedAt;
      const whoDid = subDoc.finishedWho;
      const inTime = whenDid !== false ? 
        moment().diff(moment(whenDid), 'minutes') < (60 * 24 * 7) : false;

      const accessKey = Meteor.user().orgKey;
      const org = AppDB.findOne({ orgKey: accessKey });
      const minorPIN = org ? org.minorPIN : null;
      if(doc && docOpen && (inTime || minorPIN === override)) {
        BatchDB.update({_id: batchId, orgKey: accessKey, 'items.serial': serial}, {
          $pull : {
            'items.$.history': { key: 'f1n15h1t3m5t3p' }
          },
          $set : { 
    			  'items.$.finishedAt': false,
    			  'items.$.finishedWho': false
    			},
        });
        Meteor.call('pushUndoFinish', batchId, serial, accessKey, whenDid, whoDid);
        return true;
      }else{
        return false;
      }
    }
  },
  pushUndoFinish(batchId, serial, accessKey, formerWhen, formerWho) {
    const orgValid = AppDB.findOne({ orgKey: accessKey });
    if(orgValid) {
      BatchDB.update({_id: batchId, orgKey: accessKey, 'items.serial': serial}, {
        $push : { 
  			  'items.$.history': {
  			    key: new Meteor.Collection.ObjectID().valueOf(),
            step: 'finish',
            type: 'undo',
            good: false,
            time: new Date(),
            who: Meteor.userId(),
            comm: '',
            info: {
              formerWhen: formerWhen,
              formerWho: formerWho
            }
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
 
  setRMA(batchId, bar, cKey) {
    const doc = BatchDB.findOne({_id: batchId, orgKey: Meteor.user().orgKey, 'items.serial': bar});
    const subDoc = doc.items.find( x => x.serial === bar );
    const rmaDoc = doc.cascade.find( x => x.key === cKey );
    if( Roles.userIsInRole(Meteor.userId(), ['qa', 'run', 'inspect']) && 
        subDoc.rma.includes( cKey ) === false ) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'items.serial': bar}, {
        $push : { 
          'items.$.rma': cKey
        }});
      // add noncons
      const nonCons = rmaDoc.nonCons || [];
      for(let nc of nonCons) {
        BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
          $push : { nonCon: {
            key: new Meteor.Collection.ObjectID().valueOf(), // id of the nonCon entry
            serial: bar, // barcode id of item
            ref: nc.ref, // referance on the widget
            type: nc.type, // type of nonCon
            where: 'rma', // where in the process
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
    }else{
      return false;
    }
  },
  
  /// unset an rma on an item
  unsetRMA(batchId, serial, cKey) {
    const doc = BatchDB.findOne({_id: batchId, orgKey: Meteor.user().orgKey, 'items.serial': serial});
    const outstndng = doc.nonCon.filter( x => x.serial === serial && x.inspect !== false && x.skip === false );
    if(outstndng.length === 0 && Roles.userIsInRole(Meteor.userId(), ['qa', 'remove'])) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'items.serial': serial}, {
        $pull : {
          'items.$.rma': cKey
        }});
      return true;
    }else{
      return false;
    }
  }
  
  
});