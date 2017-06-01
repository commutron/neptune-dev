import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import StoneSelect from './StoneSelect.jsx';
import RiverFork from './RiverFork.jsx';
import RMACascade from './RMACascade.jsx';
import NCButton from './NCButton.jsx';
import NCTributary from './NCTributary.jsx';

export default class River extends Component	{
  
  nonCons() {
    const bar = this.props.itemData.serial;
    let relevant = [];
    for(let value of this.props.batchData.nonCon) {
      if(value.serial === bar && value.inspect === false) {
        relevant.push(value);
      }else{null}
    }
    relevant.sort((nc1, nc2) => {return nc1.ref > nc2.ref});
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
    let skipped = nc.every( x => x.skip !== false );
		let detour = nc.length > 0 && !skipped ? 'hide' : ''; // stone display
		
		// present option between River and Alt River
		if(i.finishedAt === false && b.riverAlt && !i.alt) {
		  return(
		    <RiverFork
          id={b._id}
          barcode={i.serial}
          river={b.river}
          riverAlt={b.riverAlt}
          flows={w.flows} />
        )}


    return (
			<div>
			
			  {i.finishedAt !== false && b.cascade.length > 0 ?
			    <RMACascade 
            id={b._id}
            barcode={i.serial}
            rma={rma}
            cascades={b.cascade}
            rmaList={i.rma}
            allItems={b.items} />
          :null}
			  
			  <div className={detour}>
			    {i.finishedAt === false && b.riverAlt && i.alt === 'yes' ? 
			      <p className='blueT centre'>Alternate Flow</p> 
			    : null}
          <StoneSelect 
            id={b._id}
            flow={flow}
            rmas={rma}
            allItems={b.items}
            barcode={i.serial}
            history={i.history}
            users={this.props.users}
            methods={a.toolOption} />
        </div>
        
        <NCButton
          id={b._id}
          barcode={i.serial}
          nons={a.nonConOption}
          ancs={a.ancillaryOption} />
          
        <NCTributary
  			  id={b._id}
  			  bar={i.serial}
  			  nonCons={nc}
  			  ncOps={a.nonConOption} />
                
			</div>
			);
  }
}