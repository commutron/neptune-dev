import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import { MatchButton } from '/client/layouts/Models/Popover';
import { FlowRemove } from '../forms/FlowFormHead';

const FlowTable = ({ id, flows, app, openActions })=> {
  
  const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
  const canEdt = Roles.userIsInRole(Meteor.userId(), 'edit');
  
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
            <summary><strong>{entry.title}</strong></summary>
            <div className=''>
              <FlowToolbar 
                id={id} 
                entry={entry} 
                canEdt={canEdt}
                openActions={openActions}
              />
              
              <NClists 
                plus={entry.type === 'plus'}
                chosen={entry.ncLists} 
                app={app} 
              />
                      
              <table style={sty} className='w100 vmargin wmargin'>
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
                </tbody>
              </table>
            </div>
          </details>
        )})}
        
        {isAdmin &&
          <div className='space1v'>
            <button
              className='action up'
              disabled={!isAdmin}
              onClick={(e)=>handleRebuild()}
            >Rebuild {Pref.flow}s for current app settings</button>
          </div>}
    </div>
  );
};

const FlowToolbar = ({ id, entry, canEdt, openActions })=> (
  <div className='floattaskbar shallow light'>
      <MatchButton 
        text='Edit Flow'
        icon='fa-solid fa-project-diagram'
        doFunc={()=>openActions('topflow', entry.flowKey)}
        lock={!canEdt}
      />
      
      <MatchButton 
        text='Change Process'
        icon='fa-solid fa-stream'
        doFunc={()=>openActions('proflow', entry.flowKey)}
        lock={!canEdt}
      />
      
      <FlowRemove 
        id={id} 
        fKey={entry.flowKey} 
        access={canEdt} 
      />
      
      <span className='flexSpace' /> 
      
      <div>type: {entry.type}</div>
  </div>
);

const NClists = ({ plus, chosen, app })=> {
  
  const filtered = app.nonConTypeLists.filter( x => chosen.includes(x.key) );
  
  const sorted = filtered.sort((n1, n2)=>
    n1.listPrefix < n2.listPrefix ? -1 : n1.listPrefix > n2.listPrefix ? 1 : 0 );
                    
  return(
    <div className='indent2min'>
      <p>{Pref.nonCon} Lists:
      {plus ?
        sorted.map( (obj, ix)=>(
          <i key={ix} className='gap'>
            <b className='up'>{obj.listPrefix}.</b> {obj.listName}
          </i>
        ))
      :
        <em>Legacy</em>
      }
      </p>
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