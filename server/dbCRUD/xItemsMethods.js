import moment from 'moment';
import Config from '/server/hardConfig.js';

Meteor.methods({
  
//// Series Items \\\\
  addMultiItemsX(batchId, seriesId, seqLth, barFirst, barLast, unit) { //serialArr) {
    const accessKey = Meteor.user().orgKey;
    
    const appSetting = AppDB.findOne({orgKey: accessKey});

    const floor = seqLth === 10 ? appSetting.latestSerial.tenDigit :
                    seqLth === 9 ? appSetting.latestSerial.nineDigit :
                    appSetting.latestSerial.eightDigit;
                    
    const regexSQ = seqLth === 10 ? RegExp(/^(\d{10})$/) :
                    seqLth === 9 ? RegExp(/^(\d{9})$/) :
                    RegExp(/^(\d{8})$/);
    
    const barEnd = barLast + 1;
    const serialCount =  barEnd - barFirst;
    
    if(
      isNaN(barFirst) || isNaN(barEnd)
      ||
      barFirst > barEnd
      ||
      unit >= 1000 || unit <= 0
    ) {
      return {
        success: false,
        message: 'Invalid Sequence'
      };
    }else if(!Roles.userIsInRole(Meteor.userId(), 'create')) {
      return {
        success: false,
        message: 'No Create Access'
      };
    }else{
      const doc = XBatchDB.findOne({_id: batchId, orgKey: accessKey});
      const srs = XSeriesDB.findOne({_id: seriesId, orgKey: accessKey});
      const open = doc.completed === false;
      
      if(!doc || !srs || !open ) {
        return {
          success: false,
          message: 'Unavailable Order'
        };
      }else{
        const seriesTotal = serialCount + srs.items.length;
      
        if(seriesTotal > doc.quantity || seriesTotal > 5000 ) {
          return {
            success: false,
            message: 'Too Many Items'
          };
        }else{
          
          let badBarcodes = [];
            
          for(let click = barFirst; click < barEnd; click++) {
            const serialTry = click.toString();
            
            const dupOLD = BatchDB.findOne({ 'items.serial': serialTry }); // untill migration
            const dupNew = XSeriesDB.findOne({ 'items.serial': serialTry });
            const correctFormat = regexSQ.test(serialTry);
              
            if(dupOLD || dupNew || !correctFormat) {
              badBarcodes.push(serialTry);
            }else{
              
              XSeriesDB.update({_id: seriesId}, {
                $push : { items : {
                  serial: serialTry,
                  createdAt: new Date(),
                  createdWho: Meteor.userId(),
                  completed: false,
                  completedAt: false,
                  completedWho: false,
                  units: Number(unit),
                  subItems: [],
                  history: [],
                  altPath: false
              }}});
              
            }
          }
              
          XSeriesDB.update({_id: seriesId}, {
            $set : {
              updatedAt: new Date(),
      			  updatedWho: Meteor.userId()
            }});
          
          if(barLast > floor) {
            seqLth == 8 ?
              AppDB.update({orgKey: accessKey}, {
                $set : {
                  'latestSerial.eightDigit': Number(barLast)
              }})
            : seqLth == 9 ?
              AppDB.update({orgKey: accessKey}, {
                $set : {
                  'latestSerial.nineDigit': Number(barLast)
              }})
            : seqLth == 10 ?
              AppDB.update({orgKey: accessKey}, {
                $set : {
                  'latestSerial.tenDigit': Number(barLast)
              }})
            : null;
          }else{
            null;
          }
          
          Meteor.defer( ()=>{ Meteor.call('updateOneMinify', batchId, accessKey); });
          return {
            success: true,
            message:'done',
            dupes: badBarcodes
          };
        }
      }
    }
  },
          
  addYearWeekPanelItemsX(batchId, seriesId, serialArr) {
    const accessKey = Meteor.user().orgKey;
    
    if(Roles.userIsInRole(Meteor.userId(), 'create')) {
    
      if(Array.isArray(serialArr) && serialArr.length > 0) {
        const doc = XBatchDB.findOne({_id: batchId, orgKey: accessKey});
        const srs = XSeriesDB.findOne({_id: seriesId, orgKey: accessKey});
        const open = doc.completed === false;
        
        if(open && srs) {
          
          let badBarcodes = [];
          
          const regexWP = RegExp(/^(\d{8})$/);
          
          for( let serialTry of serialArr ) {
            const dupOLD = BatchDB.findOne({ 'items.serial': serialTry }); // untill migration
            const dupNew = XSeriesDB.findOne({ 'items.serial': serialTry });
            const correctFormat = regexWP.test(serialTry);
            
            if(!dupOLD && !dupNew && correctFormat) {
              
              XSeriesDB.update({_id: seriesId}, {
                $push : { items : {
                  serial: serialTry,
                  createdAt: new Date(),
                  createdWho: Meteor.userId(),
                  completed: false,
                  completedAt: false,
                  completedWho: false,
                  units: Number(1),
                  subItems: [],
                  history: [],
                  altPath: false
              }}});
              
            }else{
              badBarcodes.push(serialTry);
            }
          }
        
          XSeriesDB.update({_id: seriesId}, {
            $set : {
              updatedAt: new Date(),
      			  updatedWho: Meteor.userId()
            }});
          
          Meteor.defer( ()=>{ Meteor.call('updateOneMinify', batchId, accessKey); }); 
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

  addSourceYearWeekSeqItemsX(batchId, seriesId, serialArr) {
    const accessKey = Meteor.user().orgKey;
    
    if(Roles.userIsInRole(Meteor.userId(), 'create')) {
    
      if(Array.isArray(serialArr) && serialArr.length > 0) {
        const doc = XBatchDB.findOne({_id: batchId, orgKey: accessKey});
        const srs = XSeriesDB.findOne({_id: seriesId, orgKey: accessKey});
        const open = doc.completed === false;
        
        if(open && srs) {
          
          let badBarcodes = [];
          
          const regexNS = RegExp(/^(\d{6}\-\d{7})$/);
          
          for( let serialTry of serialArr ) {
            const dupOLD = BatchDB.findOne({ 'items.serial': serialTry }); // untill migration
            const dupNew = XSeriesDB.findOne({ 'items.serial': serialTry });
            const correctFormat = regexNS.test(serialTry);
            
            if(!dupOLD && !dupNew && correctFormat) {
              
              XSeriesDB.update({_id: seriesId}, {
                $push : { items : {
                  serial: serialTry,
                  createdAt: new Date(),
                  createdWho: Meteor.userId(),
                  completed: false,
                  completedAt: false,
                  completedWho: false,
                  units: Number(1),
                  subItems: [],
                  history: [],
                  altPath: false
              }}});
              
            }else{
              badBarcodes.push(serialTry);
            }
          }
        
          XSeriesDB.update({_id: seriesId}, {
            $set : {
              updatedAt: new Date(),
      			  updatedWho: Meteor.userId()
            }});
          
          Meteor.defer( ()=>{ Meteor.call('updateOneMinify', batchId, accessKey); }); 
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
  deleteItemX(batchId, seriesId, serial, pass) {
    const accessKey = Meteor.user().orgKey;
    
    const doc = XSeriesDB.findOne({_id: seriesId});
    const subDoc = doc.items.find( x => x.serial === serial );
    const inUse = subDoc.history.length > 0 ? true : false;
    
    if(!inUse) {
      const lock = subDoc.createdAt.toISOString().split("T")[0];
      const auth = Roles.userIsInRole(Meteor.userId(), 'remove');
      const access = doc.orgKey === accessKey;
      const unlock = lock === pass;
      
      if(auth && access && unlock) {
    		XSeriesDB.update(seriesId, {
          $pull : { items: { serial: serial }
        }});
        Meteor.defer( ()=>{ Meteor.call('updateOneMinify', batchId, accessKey); });
        return true;
      }else{
        return false;
      }
    }else{
      return 'inUse';
    }
  },

  /* YXXYXXXXXYXXXXXXXXXXXXXYXXXXXXXXXXXXXXXXXXXXX
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
        Meteor.defer( ()=>{ Meteor.call('updateOneMinify', batchId, accessKey); });
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  },
  KXXXXXXKXXXXKXXXXXXXXXXXXKXXXXXXXXXXXXXXXXXXXXXXX
  */

  //// panel break
  breakItemIntoUnitsX(batchId, seriesId, bar, newSerials) {
    const accessKey = Meteor.user().orgKey;
    const auth = Roles.userIsInRole(Meteor.userId(), 'remove');
    const regexSN = RegExp(/^(\d{8,10})$|^(\d{6}\-\d{7})$/);
    
    const srs = XSeriesDB.findOne({_id: seriesId, orgKey: accessKey});
    const item = srs ? srs.items.find( x => x.serial === bar ) : false;
    if(auth && item) {
      for(let serialTry of newSerials) {
        
        const dupOLD = BatchDB.findOne({ 'items.serial': serialTry }); // untill migration
        const dupNew = XSeriesDB.findOne({ 'items.serial': serialTry });
        const correctFormat = regexSN.test(serialTry);
        
        if(dupOLD || dupNew || !correctFormat) {
          null;
        }else{
              
          XSeriesDB.update(seriesId, {
            $push : { items : {
              serial: serialTry,
              createdAt: new Date(),
              createdWho: Meteor.userId(),
              completed: false,
              completedAt: false,
              completedWho: false,
              units: Number(1),
              subItems: [bar],
              history: item.history,
              altPath: item.altPath
          }}});
        }
        XSeriesDB.update(seriesId, {
          $pull : { items: { serial: bar }
        }});
        XSeriesDB.update(seriesId, {
          $set : {
            updatedAt: new Date(),
    			  updatedWho: Meteor.userId()
        }});
      }
      Meteor.defer( ()=>{ Meteor.call('updateOneMinify', batchId, accessKey); });
      return true;
    }else{
      return false;
    }
  },

  /*
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
  */
  //// unit corection
  setItemUnitX(seriesId, bar, unit) {
    const auth = Roles.userIsInRole(Meteor.userId(), ['edit', 'run']);
    if(auth && unit >= 1 && unit <= 1000) {
      XSeriesDB.update({_id: seriesId, orgKey: Meteor.user().orgKey, 'items.serial': bar}, {
        $set : { 
          'items.$.units': Number(unit)
        }});
      return true;
    }else{
      return false;
    }
  },
  
  /*
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
    if(!Roles.userIsInRole(Meteor.userId(), 'active') ||
       !Roles.userIsInRole(Meteor.userId(), 'inspect')
    ) {
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
      return true;
    }
  },

  // finish Item
  finishItem(batchId, serial, key, step, type, benchmark) {
    if(!Roles.userIsInRole(Meteor.userId(), "BRKt3rm1n2t1ng8r2nch")) {
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
  */
// Scrap \\
  scrapItemX(seriesId, bar, step, comm) {
    if(Roles.userIsInRole(Meteor.userId(), 'qa')) {
      const orgKey = Meteor.user().orgKey;
      // update item
      XSeriesDB.update({_id: seriesId, orgKey: orgKey, 'items.serial': bar}, {
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
  			  'items.$.completed': true,
  			  'items.$.completedAt': new Date(),
  			  'items.$.completedWho': Meteor.userId()
  			}
      });
      return true;
    }else{
      return false;
    }
  },

// Close an incomplete item \\
  finishIncompleteItemX(seriesId, bar, comm) {
    if(Roles.userIsInRole(Meteor.userId(), ['qa', 'run'])) {
      const orgKey = Meteor.user().orgKey;
      // update item
      XSeriesDB.update({_id: seriesId, orgKey: orgKey, 'items.serial': bar}, {
        // entry to history
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
  			  'items.$.completed': true,
  			  'items.$.completedAt': new Date(),
  			  'items.$.completedWho': Meteor.userId()
  			}
      });
      return true;
    }else{
      return false;
    }
  },
  /*
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
  */
//  remove a step
  pullHistoryX(seriesId, serial, eKey, time) {
    const accessKey = Meteor.user().orgKey;
    if(Roles.userIsInRole(Meteor.userId(), ['edit', 'run'])) {
      const srs = XSeriesDB.findOne({_id: seriesId});
      const item = srs ? srs.items.find( x => x.serial === serial ) : null;
      
      const entory = item.history.find( x => x.key === eKey && 
                                  x.time.toISOString() === time.toISOString() );
      if(entory) {
        entory.good = false;
      
        XSeriesDB.update({_id: seriesId, orgKey: accessKey, 'items.serial': serial}, {
          $pull : {
            'items.$.history': {key: eKey, time: time}
        }});
          
        Meteor.call('pushHistoryEntry', seriesId, serial, accessKey, entory);
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  },
  // replace a step
  pushHistoryEntry(seriesId, serial, accessKey, replace) {
    //some validation on the replace would be good
    XSeriesDB.update({_id: seriesId, orgKey: accessKey, 'items.serial': serial}, {
      $push : { 
        'items.$.history': replace
    }});
  },

  //  Undo a Finish
  pullFinishX(batchId, seriesId, serial) {
    const accessKey = Meteor.user().orgKey;
    if( !Roles.userIsInRole(Meteor.userId(), "BRKt3rm1n2t1ng8r2nch") ) {
      null;
    }else{
      const doc = XBatchDB.findOne({_id: batchId});
      const docOpen = doc ? doc.completed === false : null;
      
      const srs = XSeriesDB.findOne({_id: seriesId});
      const subDoc = srs ? srs.items.find( x => x.serial === serial ) : null;
      
      const whenDid = subDoc.completedAt;
      const whoDid = subDoc.completedWho;
    
      if(doc && docOpen) {
        XSeriesDB.update({_id: seriesId, orgKey: accessKey, 'items.serial': serial}, {
          $pull : {
            'items.$.history': { key: 'f1n15h1t3m5t3p' }
          },
          $set : { 
    			  'items.$.completed': false,
  			    'items.$.completedAt': false,
  			    'items.$.completedWho': false
    			},
        });
        Meteor.call('pushUndoFinishEntry', seriesId, serial, accessKey, whenDid, whoDid);
        return true;
      }else{
        return false;
      }
    }
  },
  pushUndoFinishEntry(seriesId, serial, accessKey, formerWhen, formerWho) {
    XSeriesDB.update({_id: seriesId, orgKey: accessKey, 'items.serial': serial}, {
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
  },

 /*
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
  */
  /*
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
  */
  
});