import moment from 'moment';
import Config from '/server/hardConfig.js';

Meteor.methods({
  
  checkDuplicateItems(serialArr, unit, regexSN, staticStart, rtnObj) {
    let goodSerial = [];
    let badSerial = [];

    const narrowS = XSeriesDB.find({
                      "items.serial": { $regex: new RegExp( staticStart ) }
                    },{fields:{'items.serial':1}}).fetch();
    
    for( let serialTry of serialArr ) {
      const correctFormat = regexSN.test(serialTry);
      
      if(!correctFormat) {
        badSerial.push(serialTry);
      }else{
        
        const dupNew = narrowS.find( s => s.items.find( i => i.serial === serialTry ) );

        if(dupNew) {
          badSerial.push(serialTry);
        }else{
          if(rtnObj) {
            goodSerial.push({
              serial: serialTry,
              createdAt: new Date(),
              createdWho: Meteor.userId(),
              completed: false,
              completedAt: false,
              completedWho: false,
              units: Number(unit),
              subItems: [],
              history: [],
              altPath: []
            });
          }else{
            goodSerial.push(serialTry);
          }
        }
      }
    }
    return [ goodSerial, badSerial ];
  },
  
  addYearMonthDayItems(batchId, seriesId, seqLth, serialArr, unit) {
    const accessKey = Meteor.user().orgKey;
    
    const appSetting = AppDB.findOne({orgKey: accessKey});
    const floor = seqLth === 10 ? appSetting.latestSerial.tenDigit :
                                  appSetting.latestSerial.nineDigit;
                    
    const regexSQ = seqLth === 10 ? RegExp(/^(\d{10})$/) : RegExp(/^(\d{9})$/);
                    
    if(Roles.userIsInRole(Meteor.userId(), 'create')) {
    
      if(Array.isArray(serialArr) && serialArr.length > 0) {
        const doc = XBatchDB.findOne({_id: batchId, orgKey: accessKey});
        const srs = XSeriesDB.findOne({_id: seriesId, orgKey: accessKey});
        const open = doc.completed === false;
        
        if(open && srs) {
        
          const seriesTotal = serialArr.length + srs.items.length;
        
          if(seriesTotal <= doc.quantity && 
              seriesTotal <= Config.seriesLimit && unit <= Config.unitLimit
          ) {
            
            const staticStart = serialArr.length > 0 ?
                                serialArr[0].substring(0, 6) : 'XX';
          
            const dpCk = Meteor.call('checkDuplicateItems', 
                                  serialArr, unit, regexSQ, staticStart, true);
                                      
            const badBarcodes = dpCk[1] || [];
            
            const goodBarcodes = dpCk[0] || [];
     
            if(goodBarcodes.length > 0) {
              
              XSeriesDB.update({_id: seriesId}, {
                $push : { items : {
                  $each: goodBarcodes
              }}});
          
              XSeriesDB.update({_id: seriesId}, {
                $set : {
                  updatedAt: new Date(),
          			  updatedWho: Meteor.userId()
              }});
              
              const barLast = goodBarcodes[goodBarcodes.length - 1];
              if(Number(barLast) > floor) {
                seqLth == 9 ?
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

              Meteor.defer( ()=>{ 
                Meteor.call('updateOneMinify', batchId, accessKey); 
              }); 
            }
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
    }else{
      return false;
    }
  },
  
  addYearWeekPanelItemsX(batchId, seriesId, serialArr) {
    const accessKey = Meteor.user().orgKey;
    
    const appSetting = AppDB.findOne({orgKey: accessKey});
    const floor = appSetting.latestSerial.eightDigit;
    
    if(Roles.userIsInRole(Meteor.userId(), 'create')) {
    
      if(Array.isArray(serialArr) && serialArr.length > 0) {
        const doc = XBatchDB.findOne({_id: batchId, orgKey: accessKey});
        const srs = XSeriesDB.findOne({_id: seriesId, orgKey: accessKey});
        const open = doc.completed === false;
        
        if(open && srs) {
        
          const seriesTotal = serialArr.length + srs.items.length;
        
          if(seriesTotal <= doc.quantity && seriesTotal <= Config.seriesLimit ) {
            
            const regexWP = RegExp(/^(\d{8})$/);
            
            const staticStart = serialArr.length > 0 ?
                                serialArr[0].substring(0, 4) : 'XX';
            
            const dpCk = Meteor.call('checkDuplicateItems', 
                                    serialArr, "1", regexWP, staticStart, true);
                                      
            const badBarcodes = dpCk[1] || [];
            
            const goodBarcodes = dpCk[0] || [];
   
            if(goodBarcodes.length > 0) {
              XSeriesDB.update({_id: seriesId}, {
                $push : { items : {
                  $each: goodBarcodes
              }}});
          
              XSeriesDB.update({_id: seriesId}, {
                $set : {
                  updatedAt: new Date(),
          			  updatedWho: Meteor.userId()
                }});
              
              const barLast = goodBarcodes[goodBarcodes.length - 1];
              if(Number(barLast) > floor) {
                AppDB.update({orgKey: accessKey}, {
                  $set : {
                    'latestSerial.eightDigit': Number(barLast)
                }});
              }else{
                null;
              }
            
              Meteor.defer( ()=>{ 
                Meteor.call('updateOneMinify', batchId, accessKey); 
              }); 
            }
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
          
          const seriesTotal = serialArr.length + srs.items.length;
        
          if(seriesTotal <= doc.quantity && seriesTotal <= Config.seriesLimit ) {
            
            const regexNS = RegExp(/^(\d{6}\-\d{7})$/);
            
            const staticStart = serialArr.length > 0 ?
                                serialArr[0].substring(0, 11) : 'XX';
                                
            const dpCk = Meteor.call('checkDuplicateItems', 
                                    serialArr, "1", regexNS, staticStart, true);
                                      
            const badBarcodes = dpCk[1] || [];
            
            const goodBarcodes = dpCk[0] || [];
            
            if(goodBarcodes.length > 0) {
              
              XSeriesDB.update({_id: seriesId}, {
                $push : { items : {
                  $each: goodBarcodes
              }}});
            
              XSeriesDB.update({_id: seriesId}, {
                $set : {
                  updatedAt: new Date(),
          			  updatedWho: Meteor.userId()
                }});
              
              Meteor.defer( ()=>{ 
                Meteor.call('updateOneMinify', batchId, accessKey); 
              });
            }
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
    }else{
      return false;
    }
  },

  //// panel break
  breakItemIntoUnitsX(batchId, seriesId, bar, newSerials) {
    const accessKey = Meteor.user().orgKey;
    const auth = Roles.userIsInRole(Meteor.userId(), 'remove');
    const regexSN = RegExp(/^(\d{8,10})$|^(\d{6}\-\d{7})$/);
    
    const srs = XSeriesDB.findOne({_id: seriesId, orgKey: accessKey});
    const item = srs ? srs.items.find( x => x.serial === bar ) : false;
    if(auth && item) {
      for(let serialTry of newSerials) {
        
        const dupNew = XSeriesDB.findOne({ 'items.serial': serialTry });
        const correctFormat = regexSN.test(serialTry);
        
        if(dupNew || !correctFormat) {
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

  //// unit corection
  setItemUnitX(seriesId, bar, unit) {
    const auth = Roles.userIsInRole(Meteor.userId(), ['edit', 'run']);
    if(auth && unit >= 1 && unit <= Config.unitLimit) {
      XSeriesDB.update({_id: seriesId, orgKey: Meteor.user().orgKey, 'items.serial': bar}, {
        $set : { 
          'items.$.units': Number(unit)
        }});
      return true;
    }else{
      return false;
    }
  },
  
  //// history entries
  addHistoryX(batchId, seriesId, bar, key, step, type, com, pass, benchmark) {
    if(type === 'inspect' && !Roles.userIsInRole(Meteor.userId(), 'inspect')) {
      return false;
    }else{
      const orgKey = Meteor.user().orgKey;
      const username = Meteor.user().username;
      XSeriesDB.update({_id: seriesId, orgKey: orgKey, 'items.serial': bar}, {
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
            'setXBatchEvent', 
            orgKey,
            batchId, 
            'Start of Process', 
            `First ${step} ${type} recorded by ${username}`
          );
        }
        if(benchmark === 'last') {
          Meteor.call(
            'setXBatchEvent', 
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

  addFirstX(batchId, seriesId, bar, key, step, good, whoB, howB, howI, diff, ng, firstfirst) {
    if(!Roles.userIsInRole(Meteor.userId(), 'verify')) {
      return false;
    }else{
      const orgKey = Meteor.user().orgKey;
      const username = Meteor.user().username;
      XSeriesDB.update({_id: seriesId, orgKey: orgKey, 'items.serial': bar}, {
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
            'setXBatchEvent', 
            orgKey, 
            batchId, 
            'NG First-off Verification', 
            `An unacceptable ${step} first-off recorded by ${username}`
          );
        }
        if(firstfirst === true && good === true) {
          Meteor.call(
            'setXBatchEvent', 
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
  addTestX(batchId, seriesId, bar, key, step, type, com, pass, more, benchmark) {
    if(!Roles.userIsInRole(Meteor.userId(), 'active') ||
       !Roles.userIsInRole(Meteor.userId(), 'inspect')
    ) {
      return false;
    }else{
      const orgKey = Meteor.user().orgKey;
      const username = Meteor.user().username;
      XSeriesDB.update({_id: seriesId, orgKey: orgKey, 'items.serial': bar}, {
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
            'setXBatchEvent', 
            orgKey,
            batchId, 
            'Start of Process', 
            `First passed ${step} recorded by ${username}`
          );
        }
        if(benchmark === 'last' && pass === true) {
          Meteor.call(
            'setXBatchEvent', 
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
  
  checkNestX(serial) {
    
    const elsewhere = XSeriesDB.findOne({"items.subItems": { $in: [ serial ] } });
    const isSubed = !elsewhere ? false : true; 
                    
    const internal = XSeriesDB.findOne({'items.serial': serial});
    const exists = !internal ? false : true;
    const icomplete = !exists ? false : 
            internal.items.findIndex( i => i.serial === serial && i.completed === true) >= 0;
    const openNC = !exists ? false : 
            internal.nonCon.findIndex( x => x.serial === serial && x.inspect === false && x.trash === false) >= 0;
    const openSH = !exists ? false : 
            internal.shortfall.findIndex( s => s.serial === serial && !(s.inEffect || s.reSolve)) >= 0;
    const iscrap = !exists ? false : 
            internal.items.findIndex( i => i.serial === serial &&
              i.history.findIndex( s => s.type === 'scrap' && s.good === true ) >= 0 ) >= 0;
        
    return [ isSubed, exists, icomplete, openNC, openSH, iscrap ];
  },
  
  addNestedX(seriesId, serial, key, step, com, subSerial, exists, complete) {
    if(!subSerial || serial === subSerial || !Roles.userIsInRole(Meteor.userId(), 'active')) {
      return false;
    }else{
      XSeriesDB.update({_id: seriesId, orgKey: Meteor.user().orgKey, 'items.serial': serial}, {
        $push : { 
          'items.$.history': {
            key: key,
            step: step,
            type: 'nest',
            good: true,
            time: new Date(),
            who: Meteor.userId(),
            comm : com,
            info: {
              subSerial: subSerial
            }
          },
          'items.$.subItems' : subSerial
        }
      });
      if(exists && !complete) {
        XSeriesDB.update({'items.serial': subSerial}, {
          $push : { 
    			  'items.$.history': {
    			    key: 'f1n15h1t3m5t3p',
              step: 'nested incomplete',
              type: 'finish',
              good: true,
              time: new Date(),
              who: Meteor.userId(),
              comm: '',
              info: false
    			  }
    			},
    			$set : { 
    			  'items.$.completed': true,
    			  'items.$.completedAt': new Date(),
    			  'items.$.completedWho': Meteor.userId()
    			}
        });
      }
      if(exists) {
        XSeriesDB.update({'items.serial': subSerial}, {
          $push : { 
            'items.$.history': {
              key: key+'n3st3d',
              step: step,
              type: 'nested',
              good: true,
              time: new Date(),
              who: Meteor.userId(),
              comm : '',
              info: {
                parentSerial: serial
              }
            }
          }
        });
      }
      return true;
    }
  },

  // finish Item
  finishItemX(batchId, seriesId, serial, key, step, type, com, benchmark) {
    if(!Roles.userIsInRole(Meteor.userId(), "BRKt3rm1n2t1ng8r2nch")) {
      return false;
    }else{
      const orgKey = Meteor.user().orgKey;
      const username = Meteor.user().username;
      XSeriesDB.update({_id: seriesId, orgKey: orgKey, 'items.serial': serial}, {
  			$push : { 
  			  'items.$.history': {
  			    key: key,
            step: step,
            type: type,
            good: true,
            time: new Date(),
            who: Meteor.userId(),
            comm : com,
            info: false
  			  }
  			},
  			$set : { 
  			  'items.$.completed': true,
  			  'items.$.completedAt': new Date(),
  			  'items.$.completedWho': Meteor.userId()
  			}
      });
      Meteor.defer( ()=>{
        if(benchmark === 'first') {
          Meteor.call(
            'setXBatchEvent', 
            orgKey,
            batchId, 
            'Start of Process', 
            `First item recorded as complete by ${username}`
          );
        }
        if(benchmark === 'last') {
          Meteor.call(
            'setXBatchEvent', 
            orgKey, 
            batchId, 
            'End of Process', 
            `Final item recorded as complete by ${username}`
          );
          Meteor.call('finishBatchX', batchId, orgKey);
        }
      });
  		return true;
    }
  },
  
  finishItemRapid(seriesId, serial, key, step, type, com, rapId) {
    if(!Roles.userIsInRole(Meteor.userId(), "BRKt3rm1n2t1ng8r2nch")) {
      return false;
    }else{
      const orgKey = Meteor.user().orgKey;
      
      const srs = XSeriesDB.findOne({_id: seriesId});
      const item = srs.items.find( x => x.serial === serial );
      let rapidPath = item.altPath.find( y => y.rapId === rapId );
      rapidPath['completed'] = true;
      rapidPath['completedAt'] = new Date();
      rapidPath['completedWho'] = Meteor.userId();
      
      XSeriesDB.update({_id: seriesId, orgKey: orgKey, 'items.serial': serial}, {
        $push : { 
  			  'items.$.history': {
  			    key: key,
            step: step,
            type: type,
            good: true,
            time: new Date(),
            who: Meteor.userId(),
            comm : com,
            info: false
  			  },
  			  'items.$.altPath': rapidPath
  			}
      });
      XSeriesDB.update({_id: seriesId, orgKey: orgKey, 'items.serial': serial}, {
  			$pull : {
          'items.$.altPath': { rapId: rapId, completed: false }
        }
      });
  		return true;
    }
  },

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
  			  'items.$.completedWho': Meteor.userId(),
  			  'items.$.scrapped': true
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

  //  remove a step
  popHistoryX(seriesId, serial) {
    if(Roles.userIsInRole(Meteor.userId(), 'active')) {
      const series = XSeriesDB.findOne({_id: seriesId, orgKey: Meteor.user().orgKey, 'items.serial': serial});
      const itemHistory = series.items.find( x => x.serial === serial).history;
      if(itemHistory.length > 0) {
        const lastEntry = itemHistory[itemHistory.length -1];
        const timeElapse = moment.duration(moment().diff(moment(lastEntry.time))).asSeconds();
        if(timeElapse > 0 && timeElapse < 30) {
          XSeriesDB.update({_id: seriesId, orgKey: Meteor.user().orgKey, 'items.serial': serial}, {
            $pop : { 'items.$.history': 1 }
          });
        }else{
          null;
        }
      }else{
        null;
      }
    }
  },
  
  pullNestedX(seriesId, serial, nestedSerial, eKey, time) {
    if(Roles.userIsInRole(Meteor.userId(), ['edit', 'run'])) {
      
      Meteor.call('pullHistoryX', seriesId, serial, eKey, time);
      
      XSeriesDB.update({_id: seriesId, 'items.serial': serial}, {
        $pull : {
          'items.$.subItems': nestedSerial
      }});
      
      const srSub = XSeriesDB.findOne({'items.serial': nestedSerial});
      const itSub = srSub ? srSub.items.find( x => x.serial === nestedSerial ) : null;
      const hiSub = itSub ? itSub.history.find( x => x.type === 'nested' && 
                              x.info && x.info.parentSerial === serial) : null;
      if(hiSub) {
        let idSub = srSub._id;
        let eKeySub = hiSub.key;
        let timeSub = hiSub.time;
        Meteor.call('pullHistoryX', idSub, nestedSerial, eKeySub, timeSub);
      }
      return true;
    }else{
      return false;
    }
      
  },
  
//  remove a step
  pullHistoryX(seriesId, serial, eKey, time) {
    const accessKey = Meteor.user().orgKey;
    if(Roles.userIsInRole(Meteor.userId(), ['edit', 'run'])) {
      const srs = XSeriesDB.findOne({_id: seriesId});
      const item = srs ? srs.items.find( x => x.serial === serial ) : null;
      
      let entory = item.history.find( x => x.key === eKey && 
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
    
    XSeriesDB.update({_id: seriesId, orgKey: accessKey, 'items.serial': serial}, {
      $push : { 
        'items.$.history': replace,
    }});
    
    if(replace.type === 'scrap') {
      XSeriesDB.update({_id: seriesId, orgKey: accessKey, 'items.serial': serial}, {
        $set : {
          'items.$.scrapped': false
      }});
    }
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

  setInflowAltPath(seriesId, serial, altKey) {
    const doc = XSeriesDB.findOne({_id: seriesId, 'items.serial': serial});
    const subDoc = doc.items.find( x => x.serial === serial );
    const isAlt = subDoc.altPath.find( a => a.river !== false );
    
    if(isAlt) {
      XSeriesDB.update({_id: seriesId, orgKey: Meteor.user().orgKey, 'items.serial': serial}, {
        $pull : {
         'items.$.altPath': { river: isAlt.river }
      }});
    }
    
    XSeriesDB.update({_id: seriesId, orgKey: Meteor.user().orgKey, 'items.serial': serial}, {
      $push : { 
        'items.$.altPath': {
          river: altKey,
          rapId: false,
          assignedAt: new Date()
        }
    }});
  },
  
  unsetInflowAltPath(seriesId, serial, altKey) {
    XSeriesDB.update({_id: seriesId, orgKey: Meteor.user().orgKey, 'items.serial': serial}, {
      $pull : {
       'items.$.altPath': { river: altKey }
    }});
  },
  
  setRapidFork(seriesId, serial, rapId) {
    const doc = XSeriesDB.findOne({_id: seriesId, 'items.serial': serial});
    const subDoc = doc.items.find( x => x.serial === serial );
    
    const rapid = XRapidsDB.findOne({_id: rapId});
    
    const auth = Roles.userIsInRole(Meteor.userId(), ['qa', 'run', 'inspect']);
    
    if( auth && !subDoc.altPath.find( a => a.rapId === rapId ) ) {
          
      XSeriesDB.update({_id: seriesId, orgKey: Meteor.user().orgKey, 'items.serial': serial}, {
        $push : { 
          'items.$.altPath': {
            river: false,
            rapId: rapId,
            assignedAt: new Date(),
            completed: false,
            completedAt: null,
            completedWho: null
          }
      }});

      if(rapid.autoNC) {
        for(let nc of rapid.autoNC) {
          XSeriesDB.update({_id: seriesId, orgKey: Meteor.user().orgKey}, {
            $push : { nonCon: {
              key: new Meteor.Collection.ObjectID().valueOf(),
              serial: serial,
              ref: nc.ref,
              type: nc.type,
              where: 'extend',
              time: new Date(), 
              who: Meteor.userId(),
              fix: false,
              inspect: false,
              reject: [],
              snooze: false,
              trash: false,
              comm: ''
          }}});
        }
      }
      if(rapid.autoSH) {
        for(let sh of rapid.autoSH) {
          XSeriesDB.update({_id: seriesId, orgKey: Meteor.user().orgKey}, {
            $push : { shortfall: {
              key: new Meteor.Collection.ObjectID().valueOf(),
              partNum: sh.part,
              refs: sh.refs,
              serial: serial,
              where: 'extend', 
              cTime: new Date(),
              cWho: Meteor.userId(),
              uTime: new Date(),
              uWho: Meteor.userId(),
              inEffect: null, // Boolean or Null
              reSolve: null, // Boolean or Null
              comm: ''
          }}});
        }
      }
      return true;
    }else{
      return false;
    }
  },
  
  /// unset an rapid alt path
  unsetRapidFork(seriesId, serial, rapId) {
    const doc = XSeriesDB.findOne({_id: seriesId, orgKey: Meteor.user().orgKey, 'items.serial': serial});
    const subDoc = doc.items.find( x => x.serial === serial );
    const rapIs = subDoc.altPath.find( y => y.rapId === rapId );
    
    const openNC = doc.nonCon.filter( x => x.serial === serial && 
                                      x.inspect === false && x.trash === false );
    
    const auth = Roles.userIsInRole(Meteor.userId(), ['qa', 'remove']);
    
    if(rapIs.completed === false && openNC.length === 0 && auth) {
      
      XSeriesDB.update({_id: seriesId, orgKey: Meteor.user().orgKey, 'items.serial': serial}, {
        $pull : {
         'items.$.altPath': { rapId: rapId }
      }});
      return true;
    }else{
      return false;
    }
  },
  
  unfinishRapidFork(seriesId, serial, rapId) {
    const accessKey = Meteor.user().orgKey;
    const doc = XSeriesDB.findOne({_id: seriesId, orgKey: accessKey, 'items.serial': serial});
    const subDoc = doc.items.find( x => x.serial === serial );
    const rapIs = subDoc.altPath.find( y => y.rapId === rapId );
    
    const finStep = subDoc.history.find( x => moment(x.time).isSame(rapIs.completedAt, 'minute') );
    const finKey = finStep.key;
    const finTime = finStep.time;
    
    if(Roles.userIsInRole(Meteor.userId(), "BRKt3rm1n2t1ng8r2nch")) {
      
      let rapidPath = rapIs;
      rapidPath['completed'] = false;
      rapidPath['completedAt'] = false;
      rapidPath['completedWho'] = false;
      
      XSeriesDB.update({_id: seriesId, orgKey: accessKey, 'items.serial': serial}, {
        $push : { 
  			  'items.$.altPath': rapidPath
  			}
      });
      XSeriesDB.update({_id: seriesId, orgKey: accessKey, 'items.serial': serial}, {
  			$pull : {
          'items.$.altPath': { rapId: rapId, completed: true }
        }
      });
      if(finKey && finTime) {
        Meteor.call('pullHistoryX', seriesId, serial, finKey, finTime);
      }
      return true;
    }else{
      return false;
    }
  },
  
  // delete \\
  deleteItemX(batchId, seriesId, serial, pass, pinVal) {
    const accessKey = Meteor.user().orgKey;
    
    const doc = XSeriesDB.findOne({_id: seriesId});
    const subDoc = doc.items.find( x => x.serial === serial );
    
    const inUse = subDoc.history.length > 0 ? true : false;
    const alBad = subDoc.history.every( x => !x.good );
    
    const lock = subDoc.createdAt.toISOString().split("T")[0];
    const auth = Roles.userIsInRole(Meteor.userId(), 'remove');
    const access = doc.orgKey === accessKey;
    const unlock = lock === pass;
    
    const org = AppDB.findOne({ orgKey: accessKey });
    const orgPIN = org ? org.orgPIN : null;
    const pinMatch = pinVal === orgPIN;
    
    const clear = !inUse ? true : alBad && pinMatch ? true : false;
    
    if(!clear) {
      return 'inUse';
    }else{
      if(auth && access && unlock) {
    		XSeriesDB.update(seriesId, {
          $pull : { items: { serial: serial }
        }});
        Meteor.defer( ()=>{ Meteor.call('updateOneMinify', batchId, accessKey); });
        return true;
      }else{
        return false;
      }
    }
  },
  
  authPullItemX(seriesId, serial, accessKey) {
		XSeriesDB.update({_id: seriesId, orgKey: accessKey}, {
      $pull : { items: { serial: serial }
    }});
  },
  
});