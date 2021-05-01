// import moment from 'moment';
import Config from '/server/hardConfig.js';


Meteor.methods({

  ////////////
  // Testing Functions //
  
  sendTestMail(all, title, message) {
    const mssgTitle = title || 'Sample Notification';
    const mssgDetail = message || 'This is a test';
    if(all) {
      try {
        Meteor.users.update({ orgKey: Meteor.user().orgKey }, {
          $push : { inbox : {
            notifyKey: new Meteor.Collection.ObjectID().valueOf(),
            keyword: 'General',
            type: 'general',
            title: mssgTitle,
            detail: mssgDetail,
            time: new Date(),
            unread: true
          }
        }},{multi: true});
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }else{
      try {
        Meteor.users.update(Meteor.userId(), {
          $push : { inbox : {
            notifyKey: new Meteor.Collection.ObjectID().valueOf(),
            keyword: 'General',
            type: 'general',
            title: mssgTitle,
            detail: mssgDetail,
            time: new Date(),
            unread: true
          }
        }});
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
  },
  
  sendErrorMail(errorTitle, errorTime, errorUser, errorMessage) {
    Meteor.users.update({ roles: { $in: ["admin"] } }, {
        $push : { inbox : {
          notifyKey: new Meteor.Collection.ObjectID().valueOf(),
          keyword: 'Error',
          type: 'ERROR',
          title: errorTitle,
          detail: `${errorTime}, ${errorUser}, ${errorMessage}`,
          time: new Date(),
          unread: true
        }
      }},{multi: true});
      
  },
  
  
 ///////////// Repair \\\\\\\\\\\\\\\\\\\\\

  /*
  migrateALLWidgetVersions() {
    this.unblock();
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      // const accessKey = Meteor.userId();
      const allWidgets = WidgetDB.find({orgKey: Meteor.user().orgKey}).fetch();
      
      for( let wijt of allWidgets ) {
        Meteor.call('migrateWidgetVersions', wijt._id);
      }
      
      return true;  
    }else{
      return false;
    }
  },
  */
  
  resetALLCacheDB() {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      CacheDB.remove({orgKey: Meteor.user().orgKey});
      return true;
    }else{
      return false;
    }
  },

  
  fixRemoveDamagedBatch() {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      const allBatchX = XBatchDB.find({}).fetch();
      for( let bx of allBatchX ) {
        if(!bx.orgKey) {
           XBatchDB.remove({_id: bx._id});
        }
      }
      return true;
    }else{
      return false;
    }
  },

  /*
  dateObjBatchUPGRADE() {
    if(!Roles.userIsInRole(Meteor.userId(), 'admin')) {
      return false;
    }else{
      const allXBatches = XBatchDB.find({}).fetch();
      for(let xbatch of allXBatches) {
        const salesStartX = moment(xbatch.salesStart).startOf('day').format();
        const salesEndX = moment(xbatch.salesEnd).endOf('day').format();
        XBatchDB.update({_id: xbatch._id}, {
    			$set : { 
    			  salesStart: new Date(salesStartX),
    			  salesEnd: new Date(salesEndX)
    			}
    		});
    		XBatchDB.update({_id: xbatch._id}, {
    			$unset : { 
    			  end: ''
    			}
    		});
      }
      return true;
    }
  },
  */
  repairNonConsDANGEROUS(oldText, newText, exact) {
    if(!Roles.userIsInRole(Meteor.userId(), 'admin')) {
      return false;
    }else{
      const allSeries = XSeriesDB.find({orgKey: Meteor.user().orgKey}).fetch();
      for(let srs of allSeries) {
        const srsId = srs._id;
        const nonCons = srs.nonCon;
        for(let nc of nonCons) {
          const where = nc.where;
          if(!where) {
            null;
          }else{
            const match = !exact ? where.includes(oldText)
                          : where === oldText;
            if(!match) {
              null;
            }else{
              XSeriesDB.update({_id: srsId, orgKey: Meteor.user().orgKey, 'nonCon.key': nc.key}, {
          			$set : { 
          			  'nonCon.$.where': newText
          			}
          		});
            }
          }
        }
      }
      return true;
    }
  },
  
  
  ResetAppLatestSerial() {
    try{
      if(Roles.userIsInRole(Meteor.userId(), 'admin')) {

        let max8s = [];
        let max9s = [];
        let max10s = [];
        
        const allSeries = XSeriesDB.find({}).fetch();
        
        for(let sdt of allSeries) {
          if(sdt.items.length > 0) {
            const highest = _.max(sdt.items, (it)=> {
              if(it.serial.length <= 10) {
                return Number(it.serial);
              }
            });
            if(!highest.serial) {null;
            }else if(highest.serial.length === 10) {
              max10s.push(highest.serial);
            }else if(highest.serial.length === 9) {
              max9s.push(highest.serial);
            }else if(highest.serial.length === 8) {
              max8s.push(highest.serial);
            }else{null}
          }
        }
        
        let max8 = max8s.length == 0 ? 10000000 : 
                    _.max(max8s, (it)=> it);
        let max9 = max9s.length == 0 ? 100000000 :
                    _.max(max9s, (it)=> it);
        let max10 = max10s.length == 0 ? 1000000000 : 
                    _.max(max10s, (it)=> it);
        
        AppDB.update({ orgKey: Meteor.user().orgKey }, {
          $set : { 
            latestSerial: {
              eightDigit: Number(max8),
              nineDigit: Number(max9),
              tenDigit: Number(max10)
            }
          }});
          return true;
      }else{
        return false;
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  
  
  FIXNestLinks() {
    
    const allSeries = XSeriesDB.find({orgKey: Meteor.user().orgKey}).fetch();
    
    for( let srs of allSeries ) {
      const hasProb = srs.items.some( x => x.history.find( y => y.type === 'nest') !== undefined);
      if(hasProb) {
        for( let i of srs.items ) {
          const probs = i.history.filter( y => y.type === 'nest' && !y.info );
          for(const hist of probs) {
            const nestSerial = hist.comm;
            
            const oldKey = hist.key;
            const oldTime = hist.time;
            
            if(nestSerial) {
            
              let entory = hist;
              entory.info = { subSerial: nestSerial };
              entory.comm = '';
  
              XSeriesDB.update({_id: srs._id, 'items.serial': i.serial}, {
                $pull : {
                  'items.$.history': {key: oldKey, time: oldTime}
              }});
              
              XSeriesDB.update({_id: srs._id, 'items.serial': i.serial}, {
                $push : { 
                  'items.$.history': entory,
              }});
          
              const exist = XSeriesDB.findOne({'items.serial': nestSerial});
              if(exist) {
                
                XSeriesDB.update({'items.serial': nestSerial}, {
                  $push : { 
                    'items.$.history': {
                      key: hist.key+'n3st3d',
                      step: hist.step,
                      type: 'nested',
                      good: hist.good,
                      time: hist.time,
                      who: hist.who,
                      comm : '',
                      info: {
                        parentSerial: i.serial
                    }
                }}});
              }
            }
          }
        }
      }
    }
    return true;
  },
  
  FIXNestedKeys() {
    
    const allSeries = XSeriesDB.find({orgKey: Meteor.user().orgKey}).fetch();
    
    for( let srs of allSeries ) {
      const hasProb = srs.items.some( x => x.history.find( y => y.type === 'nested') !== undefined);
      if(hasProb) {
        for( let i of srs.items ) {
          const probs = i.history.filter( y => y.type === 'nested' );
          for(const hist of probs) {
            
            const oldKey = hist.key;
            const oldTime = hist.time;
            
            if(oldKey.includes('n3st3d')) {
              null;
            }else{
            
              let entory = hist;
              entory.key = oldKey+'n3st3d';
  
              XSeriesDB.update({_id: srs._id, 'items.serial': i.serial}, {
                $pull : {
                  'items.$.history': {key: oldKey, time: oldTime}
              }});
              
              XSeriesDB.update({_id: srs._id, 'items.serial': i.serial}, {
                $push : { 
                  'items.$.history': entory,
              }});
            }
          }
        }
      }
    }
    return true;
  },
  
  WhatNestFlows() {
    
    const allWidgets = WidgetDB.find({orgKey: Meteor.user().orgKey}).fetch();
    
    let found = [];
    
    for( let wgt of allWidgets ) {
      const has = wgt.flows.find( x => x.flow.some( y => y.type === 'nest') );
      
      if(has) {
        found.push(wgt.widget);
      }
    }
    return found;
  },
  
  NonArrayRelease() {
    
    const allBatch = XBatchDB.find({orgKey: Meteor.user().orgKey}).fetch();
    
    let found = [];
    
    for( let bch of allBatch ) {
      const has = !Array.isArray(bch.releases);
      
      if(has) {
        found.push(bch.batch);
      }
    }
    return found;
  },
  
  
        
});