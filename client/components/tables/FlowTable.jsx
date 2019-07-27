import React from 'react';
import Pref from '/client/global/pref.js';

import FlowForm, { FlowRemove } from '../forms/FlowForm.jsx';

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
                <tbody className='clean'>
                  <tr><td>type: {entry.type}</td></tr>
                  <tr><td>key: <i className='small'>{entry.flowKey}</i></td></tr>
                  <tr><td><dl>
                    <dt>{Pref.nonCon} Lists:</dt>
                      {entry.type === 'plus' ?
                        entry.ncLists.map( (en, ix)=>{
                         const obj = app.nonConTypeLists.find( x => x.key === en );
                         if(obj) {
                          return( 
                            <dd key={ix}>{obj.listPrefix}. {obj.listName}</dd>
                        )}})
                      :
                        <dd><em>Legacy</em></dd>
                      }
                  </dl></td></tr>
                  <tr>
                    <td>
                      <FlowForm
                        id={id}
                        edit={true}
                        preFill={entry}
                        existFlows={flows}
                        app={app}
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
      							{/*<th>{Pref.instruct} title</th>*/}
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
    {/*<td>{step.how}</td>*/}
  </tr>
);

export default FlowTable;