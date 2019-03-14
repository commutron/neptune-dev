
Meteor.methods({

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
  resetCacheDB() {
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