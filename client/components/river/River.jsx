import React, {Component} from 'react';
//import Pref from '/client/global/pref.js';

import StoneSelect from './StoneSelect.jsx';
import RiverFork from './RiverFork.jsx';
import RMACascade from './RMACascade.jsx';
import MiniHistory from './MiniHistory.jsx';
import AltMarker from '/client/components/uUi/AltMarker.jsx';

export default class River extends Component	{
  
  constructor() {
    super();
    this.state = {
      lock: true,
      complete: false,
      undoStepOption: false
    };
    //this.reveal = this.reveal.bind(this);
  }
  
  tempOpenOption() {
    this.setState({ undoStepOption : true });
    Meteor.setTimeout(()=> {
    	this.setState({ undoStepOption : false });
    }, 1000*5);
  }
  closeOption() {
    this.setState({ undoStepOption : false });
  }

  render() {
    
    const b = this.props.batchData;
    const i = this.props.itemData;
    const w = this.props.widgetData;
    const app = this.props.app;
    const users = this.props.users;
    const flow = this.props.flow;
    const flowAlt = this.props.flowAlt;
    const progCounts = this.props.progCounts;
  
    let useFlow = [];
    let rma = [];
    
    if(i.finishedAt !== false) {
    // set flow as rma steps
      for(let doRMA of i.rma) {
        let match = b.cascade.find( x => x.key === doRMA);
        match ? rma.push(match) : false;
      }
      for(let rflw of rma) {
        for(let step of rflw.flow) {
          useFlow.push(step);
        }
      }
    }else if(b.riverAlt && i.alt === 'yes') {
    // set flow as Alt River
      useFlow = !flowAlt ? w.flows.find( x => x.flowKey === b.riverAlt).flow : flowAlt;
    }else{
    // set flow as River
      useFlow = !flow ? w.flows.find( x => x.flowKey === b.river).flow : flow;
    }
  
    const shortfalls = b.shortfall || [];
    const sh = shortfalls.filter( x => x.serial === i.serial )
                .sort((s1, s2)=> {
                  if (s1.partNum < s2.partNum) { return -1 }
                  if (s1.partNum > s2.partNum) { return 1 }
                  return 0;
                });
  
	// present option between River and Alt River
	if(i.finishedAt === false && b.riverAlt && !i.alt) {
	  return(
	    <div>
        <div>
    	    <RiverFork
            id={b._id}
            serial={i.serial}
            flows={w.flows}
            river={b.river}
            riverAlt={b.riverAlt} />
        </div>
  		  <div className='space'>
  			  <MiniHistory history={i.history} />
  			</div>
    	</div>
    );
	}

    return(
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
            bComplete={b.finishedAt}
            flow={useFlow}
            isAlt={i.alt === 'yes'}
            hasAlt={!b.riverAlt ? false : true}
            rmas={rma}
            allItems={b.items}
            nonCons={b.nonCon}
            sh={sh}
            item={i}
            //regRun={i.finishedAt === false}
            users={users}
            progCounts={progCounts}
            app={app}
            showVerify={this.props.showVerify}
            changeVerify={this.props.changeVerify}
            undoOption={this.state.undoStepOption}
            openUndoOption={()=>this.tempOpenOption()}
            closeUndoOption={()=>this.closeOption()} />
        </div>
        
  		</div>
  	);
  }
}