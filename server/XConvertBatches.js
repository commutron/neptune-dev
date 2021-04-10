import moment from 'moment';

Meteor.methods({
  
  
  convertToXBatch(batchId) {
    try {
      const auth = Roles.userIsInRole(Meteor.userId(), 'admin');
      const bdoc = BatchDB.findOne({_id: batchId});
      
      if(auth && bdoc) {
        
        const isX = XBatchDB.findOne({batch: bdoc.batch});
        
        if(!isX) {
          const widget = WidgetDB.findOne({_id: bdoc.widgetId});
          const group = GroupDB.findOne({_id: widget.groupId});
          
          const salesStart = bdoc.start !== undefined ? bdoc.start :
                  bdoc.createdAt;
          
          const salesEnd = bdoc.end !== undefined ? bdoc.end :
                  moment(bdoc.createdAt).add(6, 'weeks').format();
          
          const quoteTB = bdoc.quoteTimeBudget !== undefined ? bdoc.quoteTimeBudget :
                  [{
                    updatedAt: new Date(),
                    timeAsMinutes: 0
                  }];
                  
          const bcomplete = bdoc.finishedAt !== false ? true : false;   
          const bcompWho = bdoc.finishedAt !== false ? 'unknown' : null;   
          
          const quantity = bdoc.items.length;
          
          let blocksArr = bdoc.blocks || [];
          
          !bdoc.notes ? null :
            blocksArr.push({
              key: new Meteor.Collection.ObjectID().valueOf(),
              block: bdoc.notes.content || '',
              time: bdoc.notes.time || new Date(),
              who: bdoc.notes.who || 'unknown',
              solve: false
            });
                  
          const releases = bdoc.releases !== undefined ? bdoc.releases :
                  [{
                    type: 'floorRelease',
                    time: bdoc.createdAt,
                    who: bdoc.createdWho,
                    caution: false
                  }];
          
          XBatchDB.insert({
      			batch: bdoc.batch,
      			orgKey: bdoc.orgKey,
      			shareKey: null,
      			groupId: group._id,
      			widgetId: bdoc.widgetId,
      			versionKey: bdoc.versionKey,
            tags: bdoc.tags || [],
            createdAt: bdoc.createdAt,
            createdWho: bdoc.createdWho,
            updatedAt: bdoc.updatedAt,
      			updatedWho: bdoc.updatedWho,
      			live: bdoc.live,
      			salesOrder: bdoc.salesOrder || 'n/a',
      			salesStart: new Date(salesStart),
      			salesEnd: new Date(salesEnd),
      			quoteTimeBudget: quoteTB,
      			completed: bcomplete,
      			completedAt: bdoc.finishedAt || null,
      			completedWho: bcompWho,
      			quantity: Number(quantity),
      			serialize: true,
      			river: bdoc.river,
      			waterfall: [],
      			tide: bdoc.tide || [],
      			blocks: blocksArr,
            releases: releases,
            altered: bdoc.altered || [],
            events: bdoc.events || []
          });
          
          return true;
        }else{
          return 'isX';
        }
      }else{
        return false;
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  
  
  checkIfBatchConverted(batchId) {
    const bdoc = BatchDB.findOne({_id: batchId});
    
    const xbatch = XBatchDB.findOne({ batch: bdoc.batch });
    
    const ok = xbatch ? true : false;
    return ok;
  },

  
  adminFORCERemoveOldBatch(batchId, batchNum) {
    try {
      const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
      const privateKey = Meteor.user().orgKey;
      
      const doc = BatchDB.findOne({_id: batchId, batch: batchNum});
      const docTide = doc.tide || [];
      
      if(isAdmin && doc) {
        
        const rapids = Meteor.call('checkIfRapidConverted', batchId);
        const series = Meteor.call('checkIfSeriesConverted', batchId);
        const batchX = Meteor.call('checkIfBatchConverted', batchId);
        
        if( rapids === true && series === true && batchX === true ) {
          
          const xdoc = XBatchDB.findOne({batch: batchNum});
          const srs = XSeriesDB.findOne({batch: batchNum});
          
          if(
            docTide.length === xdoc.tide.length &&
            doc.items.length === srs.items.length &&
            doc.nonCon.length === srs.nonCon.length &&
            (!doc.shortfall || doc.shortfall.length === srs.shortfall.length)
          ) {
          
            BatchDB.remove({_id: batchId});
            TraceDB.remove({batchID: batchId});
            
          }
        }
      }
      
      Meteor.defer( ()=>{
        Meteor.call('buildNewTraceX', batchNum, privateKey);
      });
    }catch (err) {
      throw new Meteor.Error(err);
    }
  }
  
});