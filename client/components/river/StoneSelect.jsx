import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import Stone from './Stone.jsx';
import FirstRepeat from './FirstRepeat.jsx';

export default class StoneSelect extends Component	{

  current() {
    const flow = this.props.flow;
    
    const bDone = this.props.history;

    const fDone = [];
    this.props.allItems.map( (entry)=> {
      entry.history.map( (entry)=> {
        if(entry.type === 'first' && entry.good === true) {
          fDone.push(entry.type + entry.step);
        }else{null;}
      });
    });
    
    for(let flowStep of flow) {
      const first = flowStep.type === 'first';
      
      const check = !first ? 
                    bDone.find(ip => ip.key === flowStep.key && ip.good === true) 
                    :
                    bDone.find(ip => ip.key === flowStep.key) || fDone.includes(flowStep.type + flowStep.step);
    
      if(check) {
        null;
      }else{
        Session.set('nowStep', flowStep.step);
        Session.set('nowWanchor', flowStep.how);
        return [
          flow.indexOf(flowStep),
          (
          <Stone 
            id={this.props.id}
            barcode={this.props.barcode}
            sKey={flowStep.key}
            step={flowStep.step}
            type={flowStep.type}
            users={this.props.users}
            methods={this.props.methods}
          />
          )
        ];
      }
    }
    
    // end of flow
    Session.set('nowStep', 'done');
    return(
      <div className='greenT centre cap'>
        <h2>{Pref.trackLast}ed</h2>
        <h3>{moment(bDone[bDone.length -1].time).calendar()}</h3>
      </div>
    );
  }

  render() {
    
    const current = this.current();
    const last = current[0] === 0 ? false : current[0] -1;
    const lastStep = last !== false ? this.props.flow[last] : false;
    
    return (
      <div>
        {current[1]}
        <FirstRepeat
          flowStep={lastStep}
          id={this.props.id}
          barcode={this.props.barcode}
          history={this.props.history}
          users={this.props.users}
          methods={this.props.methods} />
      </div>
    );
  }
}