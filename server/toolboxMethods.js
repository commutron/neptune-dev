
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
  
  /*
  backdateTideWall() {
    try {
      const oldDate = moment().subtract(2, 'weeks');
      const replaceDate = oldDate.toISOString();
      AppDB.update({orgKey: Meteor.user().orgKey}, {
        $set : {
          tideWall: replaceDate,
        }});
      return true;
    }catch (err) {
      throw new Meteor.Error(err);
    }
  }
  */
  
  
 ///////////// Repair \\\\\\\\\\\\\\\\\\\\\
  /*
  addPhasesRepair(dprts) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      AppDB.update({orgKey: Meteor.user().orgKey}, {
        $set : { 
          phases : dprts
      }});
      return true;
    }else{
      return false;
    }
  },
  */
  
  /*
  UNSETphaseArray() {
    try{
      if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
        AppDB.update({orgKey: Meteor.user().orgKey}, {
          $unset : { 
            'phases': ""
          }})//,{multi: true});
      }else{
        null;
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  */
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
  
          
        
});