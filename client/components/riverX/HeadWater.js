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

export function HighWater( batchData ) {
  
  if( batchData ) {
    
    const floorRel = batchData.releases.findIndex( x => x.type === 'floorRelease') >= 0;
    
    const fallCounts = FallCounter(batchData);
   
    return { floorRel, fallCounts };
  }
}

export function WhiteWater( itemData, seriesData, rapidsData ) {
  
  let rapIs = false;
  let rapDo = [];
  let rapDid = [];
  let rapMax = false;
  let rapDids = [];
    
  if(rapidsData.length > 0) {
    
    if(!seriesData) {
      
      for(let rapid of rapidsData) {
        
        const casCount = WhiteWaterCounter(rapid);
        
        if( rapid.live === true /* && casCount[1] !== 1 */) {
          rapid.rSet = casCount[0];
          rapid.rDone = casCount[1];
          rapid.rCounts = casCount[2];
          rapDo.push(rapid);
        }else{
          rapDids.push({
            rapid: rapid.rapid, 
            type: rapid.type,
            issueOrder: rapid.issueOrder,
            quantity: rapid.quantity,
            rSet: casCount[0],
            rDone: casCount[1],
            rCounts: casCount[2]
          });
        }
      }
      return { rapIs, rapDid, rapDo, rapMax, rapDids };
    }else{
      
      for(let rapid of rapidsData) {
        
        const iCount = WhiteWaterCounter(rapid, seriesData);
        
        iCount[0] === rapid.quantity ? rapMax = true : null; 
        
        if( rapid.live === true && iCount[1] !== 1 ) {
          
          const alt = !itemData ? false : 
                        itemData.altPath.find( i => i.rapId === rapid._id );
          if(alt) {
            if(alt.completed === false) {
              rapIs = alt;
            }else{
              rapDid.push(alt.rapId);
            }
          }
          rapid.rSet = iCount[0];
          rapid.rDone = iCount[1];
          rapDo.push(rapid);
        }else{
          rapDids.push({
            rapid: rapid.rapid, 
            type: rapid.type,
            issueOrder: rapid.issueOrder,
            quantity: rapid.quantity,
            rSet: iCount[0],
            rDone: iCount[1]
          });
        }
      }
      return { rapIs, rapDid, rapDo, rapMax, rapDids };
    }
  }else{
    return { rapIs, rapDid, rapDo, rapMax, rapDids };
  }
}