import moment from 'moment';

Meteor.methods({

//// Batches \\\\
  addBatch(batchNum, widgetId, vKey, salesNum, sDate, eDate) {
    const doc = WidgetDB.findOne({_id: widgetId});
    const legacyduplicate = BatchDB.findOne({batch: batchNum});
    const duplicateX = XBatchDB.findOne({batch: batchNum});
    const auth = Roles.userIsInRole(Meteor.userId(), 'create');
    const accessKey = Meteor.user().orgKey;
    if(auth && !legacyduplicate && !duplicateX && doc.orgKey === accessKey) {
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
  			start: sDate,
  			end: eDate,
  			quoteTimeBudget: [],
  			notes: false,
        river: false,
        riverAlt: false,
        floorRelease: false,
        tide: [],
        items: [],
        nonCon: [],
        escaped: [],
        cascade: [],
        blocks: [],
        omitted: [],
        shortfall: [],
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
  
  editBatch(batchId, newBatchNum, vKey, salesNum, sDate, eDate) {
    const doc = BatchDB.findOne({_id: batchId});
    let legacyduplicate = BatchDB.findOne({batch: newBatchNum});
    let duplicateX = XBatchDB.findOne({batch: newBatchNum});
    doc.batch === newBatchNum ? legacyduplicate = false : null;
    const auth = Roles.userIsInRole(Meteor.userId(), 'edit');
    if(auth && !legacyduplicate && !duplicateX && doc.orgKey === Meteor.user().orgKey) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
        $set : {
          batch: newBatchNum,
          versionKey: vKey,
          salesOrder: salesNum,
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

  deleteBatch(batchId, pass) {
    const doc = BatchDB.findOne({_id: batchId});
    // if any items have history
    const inUse = doc.items.some( x => x.history.length > 0 ) ? true : false;
    if(!inUse) {
      const lock = doc.createdAt.toISOString().split("T")[0];
      const auth = Roles.userIsInRole(Meteor.userId(), 'remove');
      const access = doc.orgKey === Meteor.user().orgKey;
      const unlock = lock === pass;
      if(auth && access && unlock) {
        BatchDB.remove({_id: batchId});
        return true;
      }else{
        return false;
      }
    }else{
      return 'inUse';
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
    try {
      const batchNum = BatchDB.findOne({_id: batchId, orgKey: accessKey}).batch;
      Meteor.users.update({
        orgKey: accessKey,
        'watchlist.type': 'batch', 
        'watchlist.keyword': batchNum,
        'watchlist.mute': false
      }, {
        $push : { inbox : {
          notifyKey: new Meteor.Collection.ObjectID().valueOf(),
          keyword: batchNum,
          type: 'batch',
          title: eventTitle,
          detail: eventDetail,
          time: new Date(),
          unread: true
        }
      }},{multi: true});
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  
  /////////////////////////////////////////////////

  changeStatus(batchId, status) {
    if(Roles.userIsInRole(Meteor.userId(), 'run')) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
  			$set : {
  			  updatedAt: new Date(),
  			  updatedWho: Meteor.userId(),
  			  live: status
      }});
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
  
// setup quote time key
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
      if(Roles.userIsInRole(Meteor.userId(), ['sales', 'edit'])) {
        BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
          $push : { 
            'quoteTimeBudget': {
              $each: [ {
                updatedAt: new Date(),
                timeAsMinutes: Number(qTime)
              } ],
              $position: 0
            }
          }});
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
  
  releaseToFloor(batchId, rDate) {
    const userID = Meteor.userId();
    if(Roles.userIsInRole(userID, 'run')) {
      const orgKey = Meteor.user().orgKey;
      const username = Meteor.user().username;
      BatchDB.update({_id: batchId, orgKey: orgKey}, {
        $set : {
          updatedAt: new Date(),
  			  updatedWho: userID,
          floorRelease: {
            time: rDate,
            who: userID
          }
      }});
      Meteor.defer( ()=>{
        Meteor.call(
          'setBatchEvent', 
          orgKey, 
          batchId, 
          'Floor Release', 
          `Released from kitting by ${username}`
        );
      });
      return true;
    }else{
      return false;
    }
  },
  
  cancelFloorRelease(batchId) {
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
  
//// Tide \\\\\

  startTideTask(batchId) {
    try {
      if(!Roles.userIsInRole(Meteor.userId(), 'active')) { null }else{
        const newTkey = new Meteor.Collection.ObjectID().valueOf();
        BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
          $push : { tide: { 
            tKey: newTkey,
            who: Meteor.userId(),
            startTime: new Date(),
            stopTime: false
        }}});
        Meteor.users.update(Meteor.userId(), {
          $set: {
            engaged: {
              task: 'PRO',
              tKey: newTkey
            }
          }
        });
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  stopTideTask(batchId, tKey) {
    try {
      const doc = BatchDB.findOne({_id: batchId, 'tide.tKey': tKey });
      const sub = doc && doc.tide.find( x => x.tKey === tKey && x.who === Meteor.userId() );
      if(!sub) { null }else{
        BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'tide.tKey': tKey}, {
          $set : { 
            'tide.$.stopTime' : new Date()
        }});
        Meteor.users.update(Meteor.userId(), {
          $set: {
            engaged: false
          }
        });
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },


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
      barEnd - barFirst < 1001
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
    if(auth && unit > 0 && unit <= 100) {
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
    }else{null}
  },
  
  // Clear / Undo finish Batch
  undoFinishBatch(batchId) {
    if( Roles.userIsInRole(Meteor.userId(), 'admin') ) {
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey}, {
  			$set : { 
  			  live: true,
  			  finishedAt: false
      }});
    }else{null}
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
      const inTime = whenDid !== false ? moment().diff(moment(whenDid), 'minutes') < (60 * 24 * 7) : false;

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

//// Non-Cons \\\\
  floodNC(batchId, ref, type) {
    const doc = BatchDB.findOne({_id: batchId, orgKey: Meteor.user().orgKey});
    if(!Meteor.userId() || !doc) { null }else{
      const liveItems = doc.items.filter( x => x.finishedAt === false );
      const liveSerials = Array.from(liveItems, x => x.serial);
      for( let sn of liveSerials ) {
        const double = doc.nonCon.find( x => 
                        x.ref === ref &&
                        x.serial === sn &&
                        x.type === type &&
                        x.inspect === false
                      );
        if(double) { null }else{
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
      }
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
  
  // Omitted // Wide Shortage
  
  addOmit(batchId, partNum, refs, inEffect, comm) {
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
  
  editOmit(batchId, omKey, partNum, refs, inEffect, reSolve, comm) {
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
  
  setOmit(batchId, omKey, inEffect, reSolve) {
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
  
  removeOmit(batchId, omKey) {
    if(!Roles.userIsInRole(Meteor.userId(), 'run')) { 
      return false;
    }else{
      BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'omitted.key': omKey}, {
        $pull : { omitted: {key: omKey}
      }});
      return true;
    }
  },
  
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

  //////////////////////////////////////////////////////////////////////////////////////////////////

});