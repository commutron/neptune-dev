import React, {Component} from 'react';
//import Pref from '/client/global/pref.js';

import StoneSelect from './StoneSelect.jsx';
import RiverFork from './RiverFork.jsx';
import RMACascade from './RMACascade.jsx';
import AltMarker from '/client/components/uUi/AltMarker.jsx';

export default class River extends Component	{
  
  nonCons() {
    relevant = this.props.batchData.nonCon.filter( 
        x => x.serial === this.props.itemData.serial && x.inspect === false );
    relevant.sort((n1, n2)=> {
      if (n1.ref < n2.ref) { return -1 }
      if (n1.ref > n2.ref) { return 1 }
      return 0;
    });
    return relevant;
  }
  
  rmas() {
    let relevant = [];
    for(let doRMA of this.props.itemData.rma) {
      let match = this.props.batchData.cascade.find( x => x.key === doRMA);
      match ? relevant.push(match) : false;
    }
    return relevant;
  }

  render() {

    const a = this.props.app;
    const b = this.props.batchData;
    const i = this.props.itemData;
    const w = this.props.widgetData;
    
    let flow = [];
    let rma = [];
    
    if(i.finishedAt !== false) {
    // set flow as rma steps
      rma = this.rmas();
      for(let rflw of rma) {
        for(let step of rflw.flow) {
          flow.push(step);
        }
      }
    }else if(b.riverAlt && i.alt === 'yes') {
    // set flow as Alt River
      flow = w.flows.find( x => x.flowKey === b.riverAlt).flow;
    }else{
    // set flow as River
      flow = w.flows.find( x => x.flowKey === b.river).flow;
    }
		
		const nc = this.nonCons();

		// present option between River and Alt River
		if(i.finishedAt === false && b.riverAlt && !i.alt) {
		  return(
		    <RiverFork
          id={b._id}
          serial={i.serial}
          flows={w.flows}
          river={b.river}
          riverAlt={b.riverAlt} />
      );
		}

    return (
			<div>
			
			  {i.finishedAt !== false && b.cascade.length > 0 ?
			    <RMACascade 
            id={b._id}
            barcode={i.serial}
            rma={rma}
            cascadeData={b.cascade}
            rmaList={i.rma}
            allItems={b.items} />
          :null}
			  
			  <div>
			    {i.finishedAt === false && b.riverAlt && i.alt !== false ? 
			      <AltMarker id={b._id} serial={i.serial} alt={i.alt} />
			    : null}
          <StoneSelect
            id={b._id}
            flow={flow}
            rmas={rma}
            allItems={b.items}
            nonCons={nc}
            serial={i.serial}
            history={i.history}
            regRun={i.finishedAt === false}
            users={this.props.users}
            methods={a.toolOption} />
        </div>
        
			</div>
		);
  }
}