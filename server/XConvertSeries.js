
function convertItems(bdoc, xrapids) {
  const altKey = bdoc.riverAlt;
  
  let goodItems = [];
  
  for( const litem of bdoc.items ) {
    const itemcomplete = litem.finishedAt !== false ? true : false;
    
    let altPathArr = [];
    
    altKey && litem.alt === 'yes' ? 
      altPathArr.push({
        river: altKey,
        rapId: false,
        assignedAt: litem.createdAt
      }) : null;
         
    for( let cKey of litem.rma ) {
      
      const bcas = bdoc.cascade.find( x => x.key === cKey );
      
      if(bcas) {
        const newxrapid = xrapids.find( r => r.issueOrder === ('rma-' + bcas.rmaId) );
        const rapId = newxrapid ? newxrapid._id : false;
        
        if(rapId) {
          const cstart = bcas.time;
        
          const scrapfin = litem.history.find( x => x.type === 'scrap' );
          
          const otherfin = litem.history.filter( x =>
                    x.type === 'finish' && x.key !== "f1n15h1t3m5t3p" );
                    
          const rmaIndex = litem.rma.findIndex( x => x === cKey );
          const rmadone = otherfin[rmaIndex];
          
          const isdone = rmadone ? true : scrapfin ? true : false;
          const atdone = rmadone ? rmadone.time : scrapfin ? scrapfin.time : litem.finishedAt;
          const whodone = rmadone ? rmadone.who : scrapfin ? scrapfin.who : litem.finishedWho;
          
          altPathArr.push({
            river: false,
            rapId: rapId,
            assignedAt: cstart,
            completed: isdone,
            completedAt: atdone,
            completedWho: whodone
          });
        }
      }
    }
          
    goodItems.push({
      serial: litem.serial,
      createdAt: litem.createdAt,
      createdWho: litem.createdWho,
      completed: itemcomplete,
      completedAt: litem.finishedAt,
      completedWho: litem.finishedWho,
      units: Number(litem.units),
      subItems: litem.subItems,
      history: litem.history,
      altPath: altPathArr
    });
    
  }
  
  return goodItems;
}

function convertNonCons(oldNonCons) {

  let goodNonCon = [];
  
  for( const lnc of oldNonCons ) {
    
    goodNonCon.push({
      key: lnc.key,
      serial: lnc.serial,
      ref: lnc.ref,
      type: lnc.type,
      where: lnc.where,
      time: lnc.time,
      who: lnc.who,
      fix: lnc.fix,
      inspect: lnc.inspect,
      reject: lnc.reject || [],
      snooze: lnc.snooze || false,
      trash: lnc.trash || false,
      comm: lnc.comm || ''
    });
    
  }
  
  return goodNonCon;
}
        

Meteor.methods({
  
  
  convertToSeries(batchId) {
    try {
      const auth = Roles.userIsInRole(Meteor.userId(), 'admin');
      const bdoc = BatchDB.findOne({_id: batchId});
      const xrapids = XRapidsDB.find({extendBatch: bdoc.batch}).fetch();
      
      if(auth && bdoc) {
        const widget = WidgetDB.findOne({_id: bdoc.widgetId});
        const group = GroupDB.findOne({_id: widget.groupId});
        
        const hasSeries = XSeriesDB.findOne({batch: bdoc.batch});
        
        if(!hasSeries) {
        
          const newItems = convertItems(bdoc, xrapids);
          
          const newNonCon = convertNonCons(bdoc.nonCon);
          
          const goodShortfall = bdoc.shortfall;
          
          XSeriesDB.insert({
      			batch: bdoc.batch,
      			orgKey: bdoc.orgKey,
      	    groupId: group._id,
      			widgetId: bdoc.widgetId,
      			versionKey: bdoc.versionKey,
            createdAt: bdoc.createdAt,
            createdWho: bdoc.createdWho,
            updatedAt: bdoc.updatedAt,
      			updatedWho: bdoc.updatedWho,
            items: newItems,
            nonCon: newNonCon,
            shortfall: goodShortfall || []
          });
          
          return true; // done in theory
        }else{
          return 'hasSeries'; // already done
        }
      }else{
        return false; // no batch
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  
  
  checkIfSeriesConverted(batchId) {
    const bdoc = BatchDB.findOne({_id: batchId});
    
    const srs = XSeriesDB.findOne({ batch: bdoc.batch });
    
    const ok = srs ? true : false;
    return ok;
  },
  
  
  
  
});