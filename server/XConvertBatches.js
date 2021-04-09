

Meteor.methods({
  
  
  convertToXBatch(batchId) {
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
        
        const noteblock = !bdoc.notes ? [] :
                [{
                  key: new Meteor.Collection.ObjectID().valueOf(),
                  block: bdoc.notes.content || '',
                  time: bdoc.notes.time || new Date(),
                  who: bdoc.notes.who || 'unknown',
                  solve: false
                }];
                
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
    			blocks: noteblock,
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
  },
  
  
  checkIfBatchConverted(batchId) {
    const bdoc = BatchDB.findOne({_id: batchId});
    
    const xbatch = XBatchDB.findOne({ batch: bdoc.batch });
    
    const ok = xbatch ? true : false;
    return ok;
  },
  
  
  findAnyLegacyBlocks() {
    const bbatch = BatchDB.find( { $where: "this.blocks.length > 0" } ).fetch();
    
    let blockList = [];
    
    for( let bb of bbatch ) {
      blockList.push(bb.batch);
    }
    return blockList;
  },
  
  
  adminFORCERemoveOldBatch(batchId, batchNum) {
    const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
    const privateKey = Meteor.user().orgKey;
    
    const doc = BatchDB.findOne({_id: batchId, batch: batchNum});
    
    if(isAdmin && doc) {
      
      const rapids = Meteor.call('checkIfRapidConverted', batchId);
      const series = Meteor.call('checkIfSeriesConverted', batchId);
      const batchX = Meteor.call('checkIfBatchConverted', batchId);
      
      if( rapids === true && series === true && batchX === true ) {
        
        BatchDB.remove({_id: batchId});
        TraceDB.remove({batchID: batchId});

      }
    }
    
    Meteor.defer( ()=>{
      Meteor.call('buildNewTraceX', batchNum, privateKey);
    });
  }
  
});