import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import {FlowRemove} from '../forms/FlowForm.jsx';

// requires flows array

export default class FlowsList extends Component	{

  render() {
    
    const auth = Roles.userIsInRole(Meteor.userId(), 'edit');

    return (
      <div>
        {this.props.flows.map( (entry, index)=>{
          return(
            <details key={index}>
              <summary>{entry.title}</summary>
              <i>{entry.flowKey}</i>
              <br />
              {auth ? <FlowRemove id={this.props.id} fKey={entry.flowKey} /> : null}
              {entry.flow.map( (step, index)=>{
                return (
                  <div className='infoBox' key={index}>
                    <div className='titleBar'>{step.step}</div>
                    <p>key: {step.key}</p>
                    <p>Type: {step.type}</p>
                    <p>Instruction: {step.how}</p>
                  </div>
                );
              })}
            </details>
            )})}
      </div>
    );
  }
}