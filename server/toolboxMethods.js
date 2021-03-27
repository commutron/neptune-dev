// import moment from 'moment';

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
      const allBatch = BatchDB.find({}).fetch();
      for( let b of allBatch ) {
        if(!b.orgKey) {
           BatchDB.remove({_id: b._id});
        }
      }
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
  
  makeNotesIntoBlockXBatch() {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      const allBatchX = XBatchDB.find({}).fetch();
      for( let bx of allBatchX ) {
        if(bx.notes) {
          XBatchDB.update({_id: bx._id, orgKey: Meteor.user().orgKey}, {
            $push : { blocks: {
              key: new Meteor.Collection.ObjectID().valueOf(),
              block: bx.notes.content,
              time: bx.notes.time,
              who: bx.notes.who,
              solve: false
            }},
            $set : {
              notes : false
            }
          });
        }
      }
      return true;
    }else{
      return false;
    }
  },
  UNSETbplusNotesKey() {
    try{
      if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
        XBatchDB.update({ orgKey: Meteor.user().orgKey }, {
          $unset : { 
            'notes': ""
          }},{multi: true});
          return true;
      }else{
        return false;
      }
    }catch (err) {
      throw new Meteor.Error(err);
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
      const allBatches = BatchDB.find({orgKey: Meteor.user().orgKey}).fetch();
      for(let batch of allBatches) {
        const batchId = batch._id;
        const nonCons = batch.nonCon;
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
              BatchDB.update({_id: batchId, orgKey: Meteor.user().orgKey, 'nonCon.key': nc.key}, {
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
  
  
  UNSETbplusOmittedKey() {
    try{
      if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
        XBatchDB.update({ orgKey: Meteor.user().orgKey }, {
          $unset : { 
            'omitted': ""
          }},{multi: true});
          return true;
      }else{
        return false;
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  UNSETbplusRapidKey() {
    try{
      if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
        XBatchDB.update({ orgKey: Meteor.user().orgKey }, {
          $unset : { 
            'rapids': ""
          }},{multi: true});
          return true;
      }else{
        return false;
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  UNSETbplusNonconKey() {
    try{
      if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
        XBatchDB.update({ orgKey: Meteor.user().orgKey }, {
          $unset : { 
            'nonconformaces': ""
          }},{multi: true});
          return true;
      }else{
        return false;
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  UNSETbplusVeriKey() {
    try{
      if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
        XBatchDB.update({ orgKey: Meteor.user().orgKey }, {
          $unset : { 
            'verifications': ""
          }},{multi: true});
          return true;
      }else{
        return false;
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  
  ResetAppLatestSerial() {
    try{
      if(Roles.userIsInRole(Meteor.userId(), 'admin')) {

        let max8s = [];
        let max9s = [];
        let max10s = [];
        
        const allBatch = BatchDB.find({}).fetch();
        
        for(let bdt of allBatch) {
          if(bdt.items.length > 0) {
            const highest = _.max(bdt.items, (it)=> {
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
  
  unlockALLxbatch() {
    try{
      if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
        XBatchDB.update({ orgKey: Meteor.user().orgKey }, {
          $set : { 
            lock: false
          }},{multi: true});
          return true;
      }else{
        return false;
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  
  altFlowUse() {
    if(!Roles.userIsInRole(Meteor.userId(), 'admin')) {
      return [];
    }else{
      let alive = [];
      let dormant = [];
      const allBatches = BatchDB.find({orgKey: Meteor.user().orgKey}).fetch();
      for(let batch of allBatches) {
        const batchId = batch._id;
        const batchNum = batch.batch;
        const bAlt = batch.riverAlt !== false;
        const iAlt = batch.items.filter( x => x.alt === 'yes' ).length;
        if(batch.live === true) {
          alive.push({ batchId, batchNum, bAlt, iAlt });
        }else{
          dormant.push({ batchId, batchNum, bAlt, iAlt });
        }
      }
      const totalAliveAltBatch = alive.filter( x => x.bAlt === true ).length;
      const totalAliveAltItems = alive.reduce( (x, y) => x + y.iAlt, 0 );

      
      const totalDormantAltBatch = dormant.filter( x => x.bAlt === true ).length;
      const totalDormantAltItems = dormant.reduce( (x, y) => x + y.iAlt, 0 );
        //(x, y) => { if(x.iAlt > 0 || y.iAlt > 0) { return x.iAlt + y.iAlt } } );
      return {
        aliveBatchInfo: alive,
        dormantBatchInfo: dormant,
        totalAltBatch: totalAliveAltBatch + totalDormantAltBatch,
        totalAltItems: totalAliveAltItems + totalDormantAltItems,
        totalLiveBatch: totalAliveAltBatch,
        totalLiveBatchItems: totalAliveAltItems,
        totalDormantBatch: totalDormantAltBatch,
        totalDormantBatchItems: totalDormantAltItems
      };
    }
  },
  
  escapeUse() {
    if(!Roles.userIsInRole(Meteor.userId(), 'admin')) {
      return [];
    }else{
      const allBatches = BatchDB.find({ $where: "this.escaped.length > 0" }).fetch();
            
      const totalOne = allBatches.filter( x => x.escaped.length === 1 ).length;
      const multi = allBatches.filter( x => x.escaped.length > 1 );
      
      const totalMulti = multi.length;
      const multiBatch = Array.from(multi, m => m.batch );
      
      return {
        totalBatch: totalOne,
        totalMulti: totalMulti,
        multiBatch: multiBatch,
      };
    }
  },
  
  cascadeUse() {
    if(!Roles.userIsInRole(Meteor.userId(), 'admin')) {
      return [];
    }else{
      
      const allBatches = BatchDB.find({ $where: "this.cascade.length > 0" }).fetch();
            
      const totalOne = allBatches.filter( x => x.cascade.length === 1 ).length;
      const multi = allBatches.filter( x => x.cascade.length > 1 );
      
      const totalMulti = multi.length;
      const multiBatch = Array.from(multi, m => m.batch );
      
      return {
        totalBatch: totalOne,
        totalMulti: totalMulti,
        multiBatch: multiBatch,
      };
    }
  },
  
  checkForTide(bxID) {
    this.unblock();
    
    const doc = XBatchDB.findOne({_id: bxID});
    const tide = !doc ? false : doc.tide;
    const good = !tide || !Array.isArray(tide) ? 'nogood' : true;
    return good;
  }  
        
});