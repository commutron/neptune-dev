import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import FlowForm from '../forms/FlowForm.jsx';
import {FlowRemove} from '../forms/FlowForm.jsx';

export default class FlowTable extends Component	{

  render() {
    
    const a = this.props.app;
    const flows = this.props.flows.reverse();
    
    const sty = {
      minWidth: '70%',
      maxWidth: '90%'
    };
    
    return (
      <div>
        {flows.map( (entry, index)=>{ 
          return(
            <details key={index} className='blueBorder' open={index === 0 ? true : false}>
              <summary>{entry.title}</summary>
              <div className='balance'>
                <table>
                  <tbody>
                    <tr><td>type: {entry.type}</td></tr>
                    <tr><td>key: {entry.flowKey}</td></tr>
                    <tr>
                      <td>
                        <FlowForm
                          id={this.props.id}
                          edit={true}
                          preFill={entry}
                          existFlows={this.props.flows}
                          options={a.trackOption}
                          end={a.lastTrack}
                          small={true} />
                        <FlowRemove id={this.props.id} fKey={entry.flowKey} />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table style={sty}>
                  <thead className='cap'>
                    <tr>
                      <th>step</th>
        							<th>type</th>
        							<th>{Pref.instruct} title</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entry.flow.map( (step, index)=>{
                      return (
                        <FlowRow
                          key={index}
                          step={step} />
                      )})}
                  </tbody>
                </table>
              </div>
            </details>
          )})}
      </div>
    );
  }
}


export class FlowRow extends Component {
  
  render() {
    
    const s = this.props.step;
                   
    return(
      <tr>
        <td>{s.step}</td>
        <td>{s.type}</td>
        <td>{s.how}</td>
      </tr>
    );
  }
}
       