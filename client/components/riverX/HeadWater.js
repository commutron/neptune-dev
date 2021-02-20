import FlowCounter, { FallCounter, CascadeCounter } from '/client/utility/ProgressCounterX';
import { round2Decimal } from '/client/utility/Convert';

function HeadWater( batchData, seriesData, widgetData ) {
  
  let hasRiver = false;
  let flow = [];
  let flowCounts = false;
  
  const itemS = seriesData && seriesData.items.sort( (x,y)=> x.serial - y.serial);
  const srange = itemS && itemS.length > 0 ?
                  `${itemS[0].serial} - ${itemS[itemS.length-1].serial}` : null;
      
  
  if( batchData && widgetData ) {
    const river = widgetData.flows.find( x => x.flowKey === batchData.river);
    if(river) {
      flow = river.flow;
      hasRiver = true;
    }
    
    flowCounts = FlowCounter(flow, seriesData);
  }
   
  return { hasRiver, flow, srange, flowCounts };
}
    
export default HeadWater;

export function HighWater( batchData, app ) {
  
  if( batchData && app ) {
    
    const floorRel = batchData.releases.findIndex( x => x.type === 'floorRelease') >= 0;
    
    const fallCounts = FallCounter(batchData, app);
   
    return { floorRel, fallCounts };
  }
}

export function WhiteWater( itemData, seriesData, rapidsData ) {
  
  if(rapidsData.length > 0) {
    
    let rapDids = [];
    
    if(!seriesData) {
      
      for(const rapid of rapidsData) {
        
        const casCount = CascadeCounter(rapid, true);
        
        if( rapid.live === true && casCount !== 1 ) {
          return {
            rapid: rapid,
            runCount: casCount,
            rapDids: rapDids,
            iRapid: false
          };
        }else{
          rapDids.push({
            rapid: rapid.rapid, 
            type: rapid.type,
            quantity: rapid.quantity,
            count: casCount
          });
        }
      }
      return {
        rapid: false,
        runCount: false,
        rapDids: rapDids,
        iRapid: false
      };
    }else{
      
      for(const rapid of rapidsData) {
        
        const rapDidI = seriesData.items.filter( i => 
                          i.altPath.find( r => 
                            r.rapidId === rapid._id && r.completed === true ) 
                         ).length;
        const iDone = round2Decimal( rapDidI / rapid.quantity );
        
        const iRapid = !itemData ? false : 
                        itemData.altPath.find( i => i.rapId === rapid._id );
        
        if( rapid.live === true && iDone !== 1 ) {
          return {
            rapid: rapid,
            runCount: iDone,
            rapDids: rapDids,
            iRapid: iRapid
          };
        }else{
          rapDids.push({
            rapid: rapid.rapid, 
            type: rapid.type,
            quantity: rapid.quantity,
            count: iDone
          });
        }
      }
      return {
        rapid: false,
        runCount: false,
        rapDids: rapDids,
        iRapid: false
      };
    }
  }else{
    return {
      rapid: false,
      runCount: false,
      rapDids: false,
      iRapid: false
    };
  }
}