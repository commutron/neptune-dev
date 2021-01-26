import FlowCounter, { FallCounter } from '/client/utility/ProgressCounterX';

function HeadWater( batchData, seriesData, widgetData ) {
  
  let hasRiver = false;
  let flow = [];
  let flowCounts = false;
  
  if( batchData && widgetData ) {
    const river = widgetData.flows.find( x => x.flowKey === batchData.river);
    if(river) {
      flow = river.flow;
      hasRiver = true;
    }
    
    flowCounts = FlowCounter(flow, seriesData);
  }
    
  return { hasRiver, flow, flowCounts };
}
    
export default HeadWater;

export function HighWater( batchData, app ) {
  
  if( batchData && app ) {
    
    const floorRel = batchData.releases.findIndex( x => x.type === 'floorRelease') >= 0;
    
    const fallCounts = FallCounter(batchData, app);
   
    return { floorRel, fallCounts };
  }
}