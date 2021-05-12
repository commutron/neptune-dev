// import moment from 'moment';
// import { batchTideTime } from '/server/tideGlobalMethods';

Meteor.methods({

//// Series \\\\
  addSeries(batchId, groupId, widgetId, vKey) {
    const accessKey = Meteor.user().orgKey;
    const auth = Roles.userIsInRole(Meteor.userId(), 'create');
    
    const batch = XBatchDB.findOne({_id: batchId});
    
    if( batch && batch.orgKey === accessKey ) {
      
      const duplicate = XSeriesDB.findOne({batch: batch.batch});
    
      if(auth && !duplicate) {
  
        XSeriesDB.insert({
    			batch: batch.batch,
    			orgKey: accessKey,
    	    groupId: groupId,
    			widgetId: widgetId,
    			versionKey: vKey,
          createdAt: new Date(),
          createdWho: Meteor.userId(),
          updatedAt: new Date(),
    			updatedWho: Meteor.userId(),
          items: [],
          nonCon: [],
          shortfall: [],
        });
        XBatchDB.update({_id: batchId, orgKey: accessKey}, {
          $set : {
            serialize: true
          }
        });
        Meteor.defer( ()=>{
          Meteor.call('updateOneMinify', batchId, accessKey);
        });
        
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  },
  /*
  moveSeries(seriesId, newBatchId, newWidgetId) {
    const accessKey = Meteor.user().orgKey;
    const auth = Roles.userIsInRole(Meteor.userId(), 'edit');
    
    const srs = XSeriesDB.findOne({_id: seriesId});

    const newbatch = XBatchDB.findOne({_id: newBatchId});
    
    if( auth && srs && newbatch && newbatch.orgKey === accessKey ) {
      
      const duplicate = XSeriesDB.findOne({batch: newbatch.batch});

      if( !duplicate && srs.widgetId === newWidgetId ) {
    
        XSeriesDB.update({_id: seriesId, orgKey: accessKey}, {
          $set : {
            batch: newbatch.batch,
            updatedAt: new Date(),
  			    updatedWho: Meteor.userId()
          }
        });
        Meteor.defer( ()=>{
          Meteor.call('updateOneMinify', newBatchId, accessKey);
        });
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  },
*/


//// Non-Cons \\\\
  floodNCX(seriesId, ref, type) {
    const srs = XSeriesDB.findOne({_id: seriesId, orgKey: Meteor.user().orgKey});
    if(!Meteor.userId() || !srs) { null }else{
      const liveItems = srs.items.filter( x => x.completed === false );
      const liveSerials = Array.from(liveItems, x => {
                            const double = srs.nonCon.find( y => 
                              y.ref === ref &&
                              y.serial === x.serial &&
                              y.type === type &&
                              y.inspect === false
                            );
                            if( !double ) { return x.serial } } );
      for( let sn of liveSerials ) {
        XSeriesDB.update({_id: seriesId, orgKey: Meteor.user().orgKey}, {
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
            snooze: false,
            trash: false,
            comm: ''
        }}});
      }
      return true;
    }
  },

  addNCX(seriesId, bar, ref, type, step, fix) {
    const srs = XSeriesDB.findOne({_id: seriesId, orgKey: Meteor.user().orgKey});
    const double = srs.nonCon.find( x => 
                    x.serial === bar &&
                    x.ref === ref &&
                    x.type === type &&
                    x.inspect === false
                  );
    if(!Meteor.userId() || double) { null }else{
      
      let repaired = fix ? {time: new Date(),who: Meteor.userId()} : false;
      
      XSeriesDB.update({_id: seriesId, orgKey: Meteor.user().orgKey}, {
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
          snooze: false,
          trash: false,
          comm: ''
      }}});
    }
  },
  
  runNCAction(seriesId, ncKey, ACT, extra) {
    switch (ACT) {
      case 'FIX':
        Meteor.call('fixNCX', seriesId, ncKey);
        break;
      case 'INSPECT':
        Meteor.call('inspectNCX', seriesId, ncKey);
        break;
      case 'SNOOZE':
        Meteor.call('snoozeNCX', seriesId, ncKey);
        break;
      case 'WAKE':
        Meteor.call('wakeNCX', seriesId, ncKey);
        break;
      case 'REJECT':
        Meteor.call('rejectNCX', seriesId, ncKey, extra);
        break;
      case 'COMM':
        Meteor.call('commentNCX', seriesId, ncKey, extra);
        break;
      default:
        null;
    }
  },
  
  loopNCActions(seriesId, ncKeys, ACT) {
    if(Array.isArray(ncKeys)) {
      switch (ACT) {
        case 'FIXALL':
          for(let nCey of ncKeys) {
            Meteor.call('fixNCX', seriesId, nCey);
          }
          break;
        case 'INSPECTALL':
          for(let nCey of ncKeys) {
            Meteor.call('inspectNCX', seriesId, nCey);
          }
          break;
        default:
          null;
      }
    }
  },

  fixNCX(seriesId, ncKey) {
    if(Meteor.userId()) {
  		XSeriesDB.update({_id: seriesId, orgKey: Meteor.user().orgKey, 'nonCon.key': ncKey}, {
  			$set : { 
  			  'nonCon.$.fix': {
  			    time: new Date(),
  			    who: Meteor.userId()
  			  }
  			}
  		});
    }else{null}
  },

  inspectNCX(seriesId, ncKey) {
    if(Meteor.userId()) {
  		XSeriesDB.update({_id: seriesId, orgKey: Meteor.user().orgKey, 'nonCon.key': ncKey}, {
  			$set : { 
  			  'nonCon.$.inspect': {
  			    time: new Date(),
  			    who: Meteor.userId()
  			  }
  			}
  		});
    }else{null}
  },
  
  rejectNCX(seriesId, ncKey, extra) {
    if(Meteor.userId() && Array.isArray(extra)) {
      const timeRepair = extra[0];
      const whoRepair = extra[1];
      XSeriesDB.update({_id: seriesId, orgKey: Meteor.user().orgKey, 'nonCon.key': ncKey}, {
        $push : {
          'nonCon.$.reject': {
            attemptTime: new Date(timeRepair),
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
  
  reInspectNCX(seriesId, ncKey) {
    if(Roles.userIsInRole(Meteor.userId(), 'inspect')) {
		  XSeriesDB.update({_id: seriesId, orgKey: Meteor.user().orgKey, 'nonCon.key': ncKey}, {
  			$set : { 
  			  'nonCon.$.inspect': false
  			}
  		});
    }else{null}
  },

  editNCX(seriesId, serial, ncKey, ref, type, where) {
    const srs = XSeriesDB.findOne({_id: seriesId, orgKey: Meteor.user().orgKey});
    const double = srs.nonCon.find( x => 
                    x.serial === serial &&
                    x.ref === ref &&
                    x.type === type &&
                    x.where === where &&
                    x.inspect === false
                  );
    if(!Roles.userIsInRole(Meteor.userId(), 'inspect') || double) { null }else{
		  XSeriesDB.update({_id: seriesId, orgKey: Meteor.user().orgKey, 'nonCon.key': ncKey}, {
  			$set : { 
  			  'nonCon.$.ref': ref,
  			  'nonCon.$.type': type,
  			  'nonCon.$.where': where
  			}
  		});
    }
  },
  
  snoozeNCX(seriesId, ncKey) {
    if(Roles.userIsInRole(Meteor.userId(), 'inspect')) {
  		XSeriesDB.update({_id: seriesId, orgKey: Meteor.user().orgKey, 'nonCon.key': ncKey}, {
  			$set : {
  			  'nonCon.$.snooze': true
  			}
  		});
    }else{null}
  },
  
  wakeNCX(seriesId, ncKey) {
    if(Roles.userIsInRole(Meteor.userId(), 'inspect')) {
  	  XSeriesDB.update({_id: seriesId, orgKey: Meteor.user().orgKey, 'nonCon.key': ncKey}, {
  	    $set : {
  			  'nonCon.$.snooze': false
  			}
  	  });
    }else{null}
  },
  
  commentNCX(seriesId, ncKey, comm) {
    if(Roles.userIsInRole(Meteor.userId(), 'inspect') && typeof comm === 'string') {
  		XSeriesDB.update({_id: seriesId, orgKey: Meteor.user().orgKey, 'nonCon.key': ncKey}, {
  			$set : {
  			  'nonCon.$.comm': comm
  			}
  		});
    }else{null}
  },
  
  trashNCX(seriesId, ncKey) {
    if(Roles.userIsInRole(Meteor.userId(), 'verify')) {
  		XSeriesDB.update({_id: seriesId, orgKey: Meteor.user().orgKey, 'nonCon.key': ncKey}, {
  			$set : {
  			  'nonCon.$.trash': { 
  			    time: new Date(),
  			    who: Meteor.userId()
  			  }
  			}
  		});
    }else{null}
  },
  
  unTrashNCX(seriesId, ncKey) {
    if(Roles.userIsInRole(Meteor.userId(), 'inspect')) {
  	  XSeriesDB.update({_id: seriesId, orgKey: Meteor.user().orgKey, 'nonCon.key': ncKey}, {
  	    $set : {
  			  'nonCon.$.trash': false
  			}
  	  });
    }else{null}
  },

  autoTrashMissingNC(accessKey, seriesId, serial, refs) {
    const app = AppDB.findOne({orgKey:accessKey}, {fields:{'missingType':1}});
    const type = app ? app.missingType : false;
    const srs = XSeriesDB.findOne({_id: seriesId, orgKey: accessKey});
    if(type && srs) {
      const related = srs.nonCon.filter( x => 
                        x.serial === serial &&
                        x.type === type &&
                        x.inspect === false &&
                        refs.includes( x.ref ) 
                      );
      const trash = Array.from(related, x => x.key);
      for( let tKey of trash) {
        XSeriesDB.update({_id: seriesId, orgKey: accessKey, 'nonCon.key': tKey}, {
          $pull : { nonCon: {key: tKey}
        }});
      }
    }
  },
  
  removeNCX(seriesId, ncKey, override) {
    const auth = Roles.userIsInRole(Meteor.userId(), ['remove', 'qa']);
    if(!auth && override === undefined) {
      null;
    }else{
      const org = AppDB.findOne({ orgKey: Meteor.user().orgKey });
      const minorPIN = org ? org.minorPIN : null;
      if(auth || minorPIN === override) {
        XSeriesDB.update({_id: seriesId, orgKey: Meteor.user().orgKey, 'nonCon.key': ncKey}, {
          $pull : { nonCon: {key: ncKey}
        }});
        return true;
      }else{
        return false;
      }
    }
  },

  //// Shortages \\\\
  // Shortfall // Narrow Shortage
  
  addShortX(seriesId, partNum, refs, serial, step, comm) {
    const srs = XSeriesDB.findOne({_id: seriesId, orgKey: Meteor.user().orgKey});
    const double = srs.shortfall.find( x => 
                      x.partNum === partNum && x.serial === serial );
                      
    if(!Meteor.userId() || double) { return false }else{
      XSeriesDB.update({_id: seriesId, orgKey: Meteor.user().orgKey}, {
        $push : { shortfall: {
          key: new Meteor.Collection.ObjectID().valueOf(), // id of the shortage entry
          partNum: partNum || '', // part number
          refs: refs || [], // referances on the widget
          serial: serial || '', // apply to item
          where: step || '', // where in the process
          cTime: new Date(),
          cWho: Meteor.userId(),
          uTime: new Date(),
          uWho: Meteor.userId(),
          inEffect: null, // Boolean or Null
          reSolve: null, // Boolean or Null
          comm: comm || '' // comments // String
      }}});

      const accessKey = Meteor.user().orgKey;
      Meteor.call('autoTrashMissingNC', accessKey, seriesId, serial, refs);
      return true;
    }
  },

  editShortX(seriesId, serial, shKey, partNum, refs, inEffect, reSolve, comm) {
    const srs = XSeriesDB.findOne({_id: seriesId, orgKey: Meteor.user().orgKey});
    const double = srs.shortfall.filter( x => 
                    x.partNum === partNum && x.serial === serial );
                    
    if(!Roles.userIsInRole(Meteor.userId(), 'verify') || double.length > 1) { null }else{
      const prevSH = srs.shortfall.find( x => x.key === shKey );
      let pn = partNum || prevSH.partNum;
      let rf = refs || prevSH.refs;
      let ef = inEffect === undefined ? prevSH.inEffect : inEffect;
      let sv = reSolve === undefined ? prevSH.reSolve : reSolve;
      let cm = comm || prevSH.comm;

		  XSeriesDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'shortfall.key': shKey}, {
  			$set : { 
  			  'shortfall.$.partNum': pn || '',
  			  'shortfall.$.refs': rf || [],
  			  'shortfall.$.uTime': new Date(),
          'shortfall.$.uWho': Meteor.userId(),
          'shortfall.$.inEffect': ef,
          'shortfall.$.reSolve': sv,
  			  'shortfall.$.comm': cm || ''
  			}
  		});
  		const accessKey = Meteor.user().orgKey;
  		Meteor.call('autoTrashMissingNC', accessKey, seriesId, serial, refs);
    }
  },

  setShortX(seriesId, shKey, inEffect, reSolve) {
    if(!Roles.userIsInRole(Meteor.userId(), 'verify')) { null }else{
		  let ef = inEffect === undefined ? null : inEffect;
      let sv = reSolve === undefined ? null : reSolve;
		  
		  XSeriesDB.update({_id: seriesId, orgKey: Meteor.user().orgKey, 'shortfall.key': shKey}, {
  			$set : {
  			  'shortfall.$.uTime': new Date(),
          'shortfall.$.uWho': Meteor.userId(),
          'shortfall.$.inEffect': ef,
          'shortfall.$.reSolve': sv,
  			}
  		});
    }
  },
  
  removeShortX(seriesId, shKey, override) {
    const auth = Roles.userIsInRole(Meteor.userId(), ['remove', 'qa', 'run']);
    if(!auth && override === undefined) {
      null;
    }else{
      const org = AppDB.findOne({ orgKey: Meteor.user().orgKey });
      const minorPIN = org ? org.minorPIN : null;
      if(auth || minorPIN === override) {
        XSeriesDB.update({_id: seriesId, orgKey: Meteor.user().orgKey, 'shortfall.key': shKey}, {
          $pull : { shortfall: {key: shKey}
        }});
        return true;
      }else{
        return false;
      }
    }
  },

  //////////////////// DESTRUCTIVE \\\\\\\\\\\\\\\\\\\\\
  
  deleteSeriesItems(batchId, seriesId, pinInput) {
    const accessKey = Meteor.user().orgKey;
    const auth = Roles.userIsInRole(Meteor.userId(), 'remove');
    const srs = XSeriesDB.findOne({_id: seriesId});
    const inUse = srs.items.some( x => x.history.length > 0 );
    const howMany = srs.items.length + ' items';
    
    const keyMatch = srs.orgKey === accessKey;
    
    const org = AppDB.findOne({ orgKey: accessKey });
    const orgPIN = org ? org.orgPIN : null;
    const pinMatch = pinInput === orgPIN;
      
    if(!inUse && auth && keyMatch && pinMatch) {
      XSeriesDB.update({_id: seriesId, orgKey: accessKey}, {
        $set : {
          items: [],
        }
      });
      XBatchDB.update({_id: batchId}, {
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
      Meteor.defer( ()=>{ Meteor.call('updateOneMinify', batchId, accessKey); });
      return true;
    }else{
      return false;
    }
  },
  
  /*
  deleteSeriesProblems(seriesId) {
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
  
  deleteWholeSeries(batchId, seriesId) {
    const accessKey = Meteor.user().orgKey;
    const doc = XBatchDB.findOne({_id: batchId, orgKey: accessKey});
    const srs = XSeriesDB.findOne({_id: seriesId, orgKey: accessKey});
    
    const auth = Roles.userIsInRole(Meteor.userId(), ['run', 'remove', 'admin']);
    
    if(doc && srs && auth) {
      const match = doc.batch === srs.batch;
      
      const emptySRS = srs.items.length === 0 &&
                       srs.nonCon.length === 0 &&
                       srs.shortfall.length === 0;
        
      if(match && emptySRS) {
        XSeriesDB.remove({_id: seriesId});
        
        XBatchDB.update({_id: batchId}, {
          $set : {
            serialize: false
          }
        });
        
        Meteor.defer( ()=>{
          Meteor.call('updateOneMinify', batchId, accessKey);
        });
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  },

  
});