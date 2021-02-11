import FlowCounter, { FallCounter } from '/client/utility/ProgressCounterX';

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