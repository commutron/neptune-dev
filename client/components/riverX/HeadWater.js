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
  
  let rapIs = false;
  let rapDo = [];
  let rapDids = [];
    
  if(rapidsData.length > 0) {
    
    if(!seriesData) {
      
      for(let rapid of rapidsData) {
        
        const casCount = CascadeCounter(rapid, true);
        
        rapid.count = casCount;
        
        if( rapid.live === true && casCount !== 1 ) {
          rapDo.push(rapid);
        }else{
          rapDids.push({
            rapid: rapid.rapid, 
            type: rapid.type,
            quantity: rapid.quantity
          });
        }
      }
      return { rapIs, rapDo, rapDids };
    }else{
      
      for(let rapid of rapidsData) {
        
        const rapDidI = seriesData.items.filter( i => 
                          i.altPath.find( r => 
                            r.rapId === rapid._id && r.completed === true ) 
                        ).length;
        const iDone = round2Decimal( rapDidI / rapid.quantity );
        
        rapid.count = iDone;
        
        if( rapid.live === true && iDone !== 1 ) {
          
          rapIs = !itemData ? false : itemData.altPath.find( i => i.rapId === rapid._id );
          
          rapDo.push(rapid);
          
        }else{
          rapDids.push({
            rapid: rapid.rapid, 
            type: rapid.type,
            quantity: rapid.quantity,
          });
        }
      }
      return { rapIs, rapDo, rapDids };
    }
  }else{
    return { rapIs, rapDo, rapDids };
  }
}