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
  let rapDo = false;
  let rapDid = [];
  let rapMax = false;
  let rapDids = [];
   
  for(let rapid of rapidsData) {
    
    const rCount = WhiteWaterCounter(rapid, seriesData);
    
    if( rapid.live === true ) {
      
      rCount[0] === rapid.quantity ? rapMax = true : null; 
       
      const alt = !itemData ? false : 
                    itemData.altPath.find( i => i.rapId === rapid._id );
      if(alt) {
        if(alt.completed === false) {
          rapIs = alt;
        }else{
          rapDid.push(alt.rapId);
        }
      }
      rapid.rSet = rCount[0];
      rapid.rDone = rCount[1];
      rapid.rCounts = rCount[2];
      rapDo = rapid;
    }else{
      rapDids.push({
        rapid: rapid.rapid, 
        type: rapid.type,
        issueOrder: rapid.issueOrder,
        quantity: rapid.quantity,
        closedAt: rapid.closedAt,
        rSet: rCount[0],
        rDone: rCount[1],
        rCounts: rCount[2]
      });
    }
  }
  
  return { rapIs, rapDid, rapDo, rapMax, rapDids };
}