import ProgressCounter from '/client/utility/ProgressCounter.js';

function HeadWater( batchData, widgetData ) {
  
  const b = batchData;
  const w = widgetData;
  
  let hasRiver = false;
  let flow = [];
  let flowAlt = [];
  let floorRel = false;
  let progCounts = false;
  
  if( b && w ) {
    const river = w.flows.find( x => x.flowKey === b.river);
    const riverAlt = w.flows.find( x => x.flowKey === b.riverAlt );
    if(river) {
      flow = river.flow;
      hasRiver = true;
    }
    if(riverAlt) {
      flowAlt = riverAlt.flow;
    }
    
    floorRel = b.releases.findIndex( x => x.type === 'floorRelease') >= 0;
    
    if( Array.isArray(b.items) ) {
      progCounts = ProgressCounter(flow, flowAlt, b);
    }
  }
    
  return { hasRiver, flow, flowAlt, floorRel, progCounts };
}
    
export default HeadWater;