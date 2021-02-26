import FlowCounter, { FallCounter, WhiteWaterCounter } from '/client/utility/ProgressCounterX';

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
  let rapDid = [];
  let rapDids = [];
    
  if(rapidsData.length > 0) {
    
    if(!seriesData) {
      
      for(let rapid of rapidsData) {
        
        const casCount = WhiteWaterCounter(rapid, true);
        
        rapid.count = casCount;
        
        if( rapid.live === true && casCount !== 1 ) {
          rapDo.push(rapid);
        }else{
          rapDids.push({
            rapid: rapid.rapid, 
            type: rapid.type,
            issueOrder: rapid.issueOrder,
            quantity: rapid.quantity
          });
        }
      }
      return { rapIs, rapDid, rapDo, rapDids };
    }else{
      
      for(let rapid of rapidsData) {
        
        const iCount = WhiteWaterCounter(rapid, true, seriesData);
        
        rapid.count = iCount;
        
        if( rapid.live === true && iCount !== 1 ) {
          
          const alt = !itemData ? false : 
                        itemData.altPath.find( i => i.rapId === rapid._id );
          if(alt) {
            if(alt.completed === false) {
              rapIs = alt;
            }else{
              rapDid.push(alt.rapId);
            }
          }
          rapDo.push(rapid);
        }else{
          rapDids.push({
            rapid: rapid.rapid, 
            type: rapid.type,
            issueOrder: rapid.issueOrder,
            quantity: rapid.quantity,
          });
        }
      }
      return { rapIs, rapDid, rapDo, rapDids };
    }
  }else{
    return { rapIs, rapDid, rapDo, rapDids };
  }
}