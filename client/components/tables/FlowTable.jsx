import React from 'react';
import moment from 'moment';
import Pref from '/public/pref.js';
import { toast } from 'react-toastify';

import TabsVert from '/client/components/smallUi/Tabs/TabsVert';
import { MatchButton } from '/client/layouts/Models/Popover';
import FlowRemove from '../forms/Flow/FlowRemove';

const FlowTable = ({ id, flows, app, openActions, canEdt, canSls, isDebug })=> {
  
  function handleRebuild() {
    if(canSls) {
      Meteor.call('rebuildWidgetFlows', id, (error, re)=>{
        if(error)
          console.log(error);
        re && toast.success('Running');
      });
    }
  }

  return(
    <div>
      {flows.map( (entry, index)=>{ 
        const qtTotalM = (entry.qtTime || []).reduce((x,y)=> x + y[1], 0).toFixed(2,10);
        const qtTotalH = moment.duration(qtTotalM, 'minutes').asHours().toFixed(2,10);
        return(
          <details key={entry.flowKey} className='chip border2 borderLightGray' open={index === 0 ? true : false}>
            <summary className='rowWrap gapsC'>
              <strong>{entry.title}</strong>
              <span className='flexSpace' /> 
              <div className='small'>updated: {entry.updatedAt && moment(entry.updatedAt).calendar()}</div>
              <div className='small'>type: {entry.type}</div>
            </summary>
            <div className='topLine'>
              <FlowToolbar 
                id={id} 
                entry={entry} 
                canEdt={canEdt}
                canSls={canSls}
                openActions={openActions}
              />
              
              <TabsVert 
                tabs={['Process','Quote','NonCons']}
                extraClass='vmargin wmargin'
                contentClass='minH240 spacehalf'>
                       
              <table style={{minWidth:'70%'}} className='w100 '>
                <thead className='cap'>
                  <tr className='line2x'>
                    <th>step</th>
                    <th>type</th>
      							<th>{Pref.branch}</th>
      							<th>{Pref.instruct} header</th>
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
              
              <table style={{minWidth:'70%'}} className='w100 '>
                
                <thead className='cap'>
                  <tr className='line2x'>
                    <th>QT Task</th>
                    <th>Minutes</th>
      							<th>Hours</th>
      							<th></th>
                  </tr>
                </thead>
                <tbody className='cap'>
                  <tr className='line2x bold'>
                    <td>Total Time</td>
                    <td className='numFont smTxt rightText'>{qtTotalM}</td>
                    <td className='numFont smTxt rightText'>{qtTotalH}</td>
                    <th></th>
                  </tr>
                </tbody>
                <tbody>
                  {(entry.qtTime || []).map( (qt)=>{
                    return (
                      <QtRow
                        key={qt[0]}
                        app={app}
                        qt={qt} />
                    )})}
                </tbody>
              </table>
              
              <NClists
                basic={entry.type === 'basic'}
                chosen={entry.ncLists} 
                app={app} 
              />
              
              </TabsVert>
            </div>
          </details>
        )})}
        
        {isDebug && canSls ?
          <div className='space1v'>
            <button
              className='action yellowSolid up'
              disabled={!canSls}
              onClick={()=>handleRebuild()}
            >Rebuild {Pref.flow}s for current app settings</button>
          </div> : null}
    </div>
  );
};

const FlowToolbar = ({ id, entry, canEdt, canSls, openActions })=> (
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
      
      <MatchButton 
        text='Assign Quoted Time'
        icon='fa-solid fa-hourglass-start'
        doFunc={()=>openActions('qtflow', entry.flowKey)}
        lock={!canSls}
      />
      
      <span className='flexSpace' /> 
      
      <FlowRemove 
        id={id} 
        fKey={entry.flowKey} 
        access={canEdt} 
      />
  </div>
);

const NClists = ({ basic, chosen, app })=> {
  
  const filtered = app.nonConTypeLists.filter( x => (chosen || []).includes(x.key) );
  
  const sorted = filtered.sort((n1, n2)=>
    n1.listPrefix < n2.listPrefix ? -1 : n1.listPrefix > n2.listPrefix ? 1 : 0 );
                    
  return(
    <div className='indent2min'>
      <p>Available Noncon Types:</p>
      <dl className='med readlines'>
        {basic ? <em>Legacy</em> :
          sorted.map( (obj, ix)=>(
            <dd key={ix} className='gap'>
              <b className='up'>{obj.listPrefix}.</b> {obj.listName}</dd>
          ))
        }
        </dl>
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
const QtRow = ({ app, qt })=> {
  const qtapp = app.qtTasks?.find( x => x.qtKey === qt[0] );
  const inhr = moment.duration(qt[1], 'minutes').asHours().toFixed(2,10);
  return(
    <tr>
      <td>{qtapp?.qtTask || 'missing'}</td>
      <td className='numFont smTxt rightText'>{qt[1]}</td>
      <td className='numFont smTxt rightText'>{inhr}</td>
      <td className='bold small smCap centreText'>{qtapp?.fixed ? 'STATIC' : ''}</td>
    </tr>
  );
};

export default FlowTable;