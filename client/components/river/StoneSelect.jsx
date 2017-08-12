import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import Stone from './Stone.jsx';
import FirstRepeat from './FirstRepeat.jsx';
import NCTributary from './NCTributary.jsx';

export default class StoneSelect extends Component	{

  render() {
    
    const flow = this.props.flow;
    
    const bDone = this.props.history;

    const fDone = [];
    this.props.allItems.map( (entry)=> {
      entry.history.map( (entry)=> {
        if(entry.type === 'first' && entry.good === true) {
          fDone.push('first' + entry.step);
        }else{null;}
      });
    });
    
    for(let flowStep of flow) {
      const first = flowStep.type === 'first';
      const inspect = flowStep.type === 'inspect';
      
      const check = first ? 
                    bDone.find(ip => ip.key === flowStep.key) || fDone.includes('first' + flowStep.step)
                    :
                    inspect && this.props.regRun === true ?
                    bDone.find(ip => ip.key === flowStep.key && ip.good === true) ||
                    bDone.find(ip => ip.step === flowStep.step && ip.type === 'first' && ip.good === true)
                    :
                    bDone.find(ip => ip.key === flowStep.key && ip.good === true);
    
      if(check) {
        null;
      }else{
        
        const stepNum = flow.indexOf(flowStep);
        const last = stepNum === 0 ? false : stepNum -1;
        const lastStep = last !== false ? flow[last] : false;
        
        const nc = this.props.nonCons;
        let skipped = nc.every( x => x.skip !== false );
        
		    let block = nc.some( x => x.where === flowStep.step ) ? false : true;
		  
  		  if(nc.length > 0 && !skipped) {
  		    
  		    if(block || flowStep.type === 'finish') {
  		      Session.set( 'nowStep', nc[0].where );
  		      return (
    		      <NCTributary
        			  id={this.props.id}
        			  nonCons={nc} />
  		      );
  		    }else{
  		      Session.set('nowStep', flowStep.step);
            Session.set('nowWanchor', flowStep.how);
  		      return (
  		        <div>
    		        <Stone 
                  id={this.props.id}
                  barcode={this.props.serial}
                  sKey={flowStep.key}
                  step={flowStep.step}
                  type={flowStep.type}
                  users={this.props.users}
                  methods={this.props.methods} />
                {lastStep ?
                  <FirstRepeat
                    flowStep={lastStep}
                    id={this.props.id}
                    barcode={this.props.serial}
                    history={this.props.history}
                    users={this.props.users}
                    methods={this.props.methods} />
                :null}
                <NCTributary
          			  id={this.props.id}
          			  nonCons={this.props.nonCons} />
        			</div>
  		      );
  		    }
  		  }else if(nc.length > 0) {
  		    Session.set('nowStep', flowStep.step);
          Session.set('nowWanchor', flowStep.how);
  		    return (
		        <div>
  		        <Stone 
                id={this.props.id}
                barcode={this.props.serial}
                sKey={flowStep.key}
                step={flowStep.step}
                type={flowStep.type}
                users={this.props.users}
                methods={this.props.methods} />
              {lastStep ?
                <FirstRepeat
                  flowStep={lastStep}
                  id={this.props.id}
                  barcode={this.props.serial}
                  history={this.props.history}
                  users={this.props.users}
                  methods={this.props.methods} />
              :null}
              <NCTributary
        			  id={this.props.id}
        			  nonCons={this.props.nonCons} />
      			</div>
		      );
  		  }else{
  		    Session.set('nowStep', flowStep.step);
          Session.set('nowWanchor', flowStep.how);
          return (
            <div>
              <Stone 
                id={this.props.id}
                barcode={this.props.serial}
                sKey={flowStep.key}
                step={flowStep.step}
                type={flowStep.type}
                users={this.props.users}
                methods={this.props.methods} />
              {lastStep ?
                <FirstRepeat
                  flowStep={lastStep}
                  id={this.props.id}
                  barcode={this.props.serial}
                  history={this.props.history}
                  users={this.props.users}
                  methods={this.props.methods} />
              :null}
            </div>
          );
        }
      }
      
    }
    
    // end of flow
    Session.set('nowStep', 'done');
    return (
      <div className='greenT centre cap'>
        <h2>{Pref.trackLast}ed</h2>
        <h3>{moment(bDone[bDone.length -1].time).calendar()}</h3>
      </div>
    );
  }
}