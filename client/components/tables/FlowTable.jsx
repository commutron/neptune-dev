import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import FlowFormHead, { FlowRemove } from '../forms/FlowFormHead.jsx';
import FlowFormRoute from '../forms/FlowFormRoute.jsx';

const FlowTable = ({ id, flows, app })=> {
  
  const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
  
  function handleRebuild() {
    if(isAdmin) {
      Meteor.call('rebuildWidgetFlows', id, (error, re)=>{
        if(error)
          console.log(error);
        re && toast.success('Running');
      });
    }
  }
  

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
            <div className=''>
              <table className='wide'>
                <tbody className='clean centreText'>
                  <tr>
                    <td>type: {entry.type}</td>
                    <td>key: <i className='small'>{entry.flowKey}</i></td>
                    <td><dl>
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
                    </dl></td>
                    <td>
                      <FlowFormHead
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
              <table style={sty} className='wide'>
                <thead className='cap'>
                  <tr className='line3x'>
                    <th>step</th>
                    <th>type</th>
      							<th>{Pref.branch}</th>
      							<th>{Pref.instruct} anchor</th>
                  </tr>
                </thead>
                <tbody>
                  {entry.flow.map( (step)=>{
                    return (
                      <FlowRow
                        key={step.key}
                        app={app}
                        step={step} />
                    )})}
                  <tr>
                    <td colSpan='4'>
                    <FlowFormRoute
                      id={id}
                      edit={true}
                      preFill={entry}
                      existFlows={flows}
                      app={app}
                      small={true} />
                  </td></tr>
                </tbody>
              </table>
            </div>
          </details>
        )})}
        
        {isAdmin &&
          <div className='space3v'>
            <button
              className='action clearGreen up'
              disabled={!isAdmin}
              onClick={(e)=>handleRebuild()}
            >Rebuild {Pref.flow}s for current app settings</button>
          </div>}
    </div>
  );
};

const FlowRow = ({ app, step })=> {
  const branch = app.branches.find( x => x.brKey === step.branchKey );
  const niceBr =  branch ? branch.branch : '';
  return(
    <tr>
      <td>{step.step}</td>
      <td>{step.type}</td>
      <td>{niceBr}</td>
      <td>{step.how}</td>
    </tr>
  );
};

export default FlowTable;