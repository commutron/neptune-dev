import React from 'react';
import Pref from '/client/global/pref.js';

import FlowForm from '../forms/FlowForm.jsx';
import {FlowRemove} from '../forms/FlowForm.jsx';

const FlowTable = ({ id, flows, app })=> {
  let sty = {
    minWidth: '70%',
    maxWidth: '90%'
  };
  return(
    <div>
      {flows.map( (entry, index)=>{ 
        return(
          <details key={entry.flowKey} className='blueBorder' open={index === 0 ? true : false}>
            <summary>{entry.title}</summary>
            <div className='balance'>
              <table>
                <tbody>
                  <tr><td>type: {entry.type}</td></tr>
                  <tr><td>key: {entry.flowKey}</td></tr>
                  <tr>
                    <td>
                      <FlowForm
                        id={id}
                        edit={true}
                        preFill={entry}
                        existFlows={flows}
                        options={app.trackOption}
                        end={app.lastTrack}
                        small={true} />
                      <FlowRemove id={id} fKey={entry.flowKey} />
                    </td>
                  </tr>
                </tbody>
              </table>
              <table style={sty}>
                <thead className='cap'>
                  <tr>
                    <th>step</th>
                    <th>type</th>
      							<th>{Pref.phase}</th>
      							<th>{Pref.instruct} title</th>
                  </tr>
                </thead>
                <tbody>
                  {entry.flow.map( (step)=>{
                    return (
                      <FlowRow
                        key={step.key}
                        step={step} />
                    )})}
                </tbody>
              </table>
            </div>
          </details>
        )})}
    </div>
  );
};

const FlowRow = ({ step })=> (
  <tr>
    <td>{step.step}</td>
    <td>{step.type}</td>
    <td>{step.phase}</td>
    <td>{step.how}</td>
  </tr>
);

export default FlowTable;