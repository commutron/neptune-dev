import React, { Fragment } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import FlowFormHead, { FlowRemove } from '../forms/FlowFormHead.jsx';
import FlowFormRoute from '../forms/FlowFormRoute.jsx';

const FlowTable = ({ id, flows, brancheS, app })=> {
  
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
                <tbody className='clean'>
                  <tr>
                    <td>type: {entry.type}</td>
                    <td><dl>
                    <dt>{Pref.nonCon} Lists:</dt>
                      {entry.type === 'plus' ?
                        <NClists chosen={entry.ncLists} app={app} />
                      :
                        <em>Legacy</em>
                      }
                    </dl></td>
                    <td className='centreText'>
                      <FlowFormHead
                        id={id}
                        edit={true}
                        preFill={entry}
                        existFlows={flows}
                        brancheS={brancheS}
                        app={app}
                        small={true} />
                    </td>
                    <td className='centreText'>
                      <FlowFormRoute
                        id={id}
                        edit={true}
                        preFill={entry}
                        existFlows={flows}
                        app={app}
                        small={true} />
                    </td>
                    <td className='centreText'>
                      <FlowRemove id={id} fKey={entry.flowKey} />
                    </td>
                  </tr>
                </tbody>
              </table>
              <br />
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

const NClists = ({ chosen, app })=> {
  
  const filtered = app.nonConTypeLists.filter( x => chosen.includes(x.key) );
  
  const sorted = filtered.sort((n1, n2)=>
    n1.listPrefix < n2.listPrefix ? -1 : n1.listPrefix > n2.listPrefix ? 1 : 0 );
                    
  return(
    <Fragment>
    {sorted.map( (obj, ix)=>(
      <i key={ix} className='gap'>
        <b className='up'>{obj.listPrefix}.</b> {obj.listName}
      </i>
      ))}
    </Fragment>
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