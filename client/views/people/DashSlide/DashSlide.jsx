import React, { useState, useEffect } from 'react';
//import { toast } from 'react-toastify';
import Pref from '/client/global/pref.js';
//import Tabs from '/client/components/bigUi/Tabs/Tabs.jsx';

import NumStatRing from '/client/components/charts/Dash/NumStatRing.jsx';
import PeoplePanel from './PeoplePanel.jsx';


const DashSlide = ({ app, user, users, batches, bCache })=> {
  
  const [ update, forceUpdate] = useState(false);
  const [ eBatchesState, eBatchesSet ] = useState([]);
  const [ xyBatchState, xyBatchSet ] = useState([]);
  const [ userPhases, setUserPhases ] = useState({});
  const [ pList, setPhaseList ] = useState([]);
  const [ phasesXY, setPhasesXY ] = useState([]);
  
  
  const updatePhases = (uID, newPhase)=>{
    let currPhases = userPhases;
    currPhases[uID] = newPhase;
    setUserPhases(currPhases);
    const smpList = _.values(currPhases);
    setPhaseList(smpList);
  };
  
  const removePhaser = (uID)=>{
    const indexes = Object.keys(app.phases);
    const rmvKeys = Array.from(indexes, x => uID+x ); 
    let currPhases = userPhases;
    const lessPhases = _.omit(currPhases, rmvKeys);
    setUserPhases(lessPhases);
    const smpList = _.values(lessPhases);
    setPhaseList(smpList);
  };
  
  const obj2xy = (obj) => {
    if( typeof obj === 'object' ) {
      const itr = Object.entries(obj);
      const xy = Array.from(itr, (arr)=> { return {x: arr[0], y: arr[1]} } );
      return xy;
    }else{
      return [];
    }
  };
  
  useEffect( ()=>{
    const pQuant = pList.reduce( (allPhase, phase)=> { 
    phase &&
      phase in allPhase ? allPhase[phase]++ : allPhase[phase] = 1;
    return allPhase;
    }, {});
    const pXY = obj2xy(pQuant);
    setPhasesXY(pXY);
  }, [users, pList]);
  
  const liveUsers = users.filter( x => Roles.userIsInRole(x._id, 'active') && 
                                      !Roles.userIsInRole(x._id, 'readOnly') );
  const eUsers = liveUsers.filter( x => x.engaged );
  const dUsers = liveUsers.filter( x => !x.engaged );
  const userArr = [eUsers.length, dUsers.length ];

  Roles.userIsInRole(Meteor.userId(), 'debug') && console.log({eUsers});
  
  const tideBatches = batches.filter( x => Array.isArray(x.tide) === true );
  
  useEffect( ()=>{
    const eBatches = eUsers.map( (user, index)=>{
      const acBatch = tideBatches.find( y =>
        y.tide.find( z => z.tKey === user.engaged.tKey ) );
      if(acBatch) {
        return acBatch;
      }  
    });
    Roles.userIsInRole(Meteor.userId(), 'debug') && console.log({eBatches});
    eBatchesSet(eBatches);
    
    const qBatches = eBatches.reduce( (allBatch, batch, index, array)=> { 
      const objkey = !batch ? false : batch.batch;
      objkey &&
        objkey in allBatch ? allBatch[objkey]++ : allBatch[objkey] = 1;
      return allBatch;
    }, {});
    const itrXY = obj2xy(qBatches);
  
    Roles.userIsInRole(Meteor.userId(), 'debug') && console.log({qBatches,itrXY});
    xyBatchSet(itrXY);
  });
  

  return(
    <div className='space5x5 invert overscroll'>
      
      <p className='rightText nomargin'>
        <button
          title='refresh data'
          className='blendAction transparent grayT'
          onClick={()=>forceUpdate(!update)}>
          <i className="fas fa-sync-alt"></i>
        </button>
      </p>
      
      <div className='balance'>
            
        <NumStatRing
          total={eUsers.length}
          nums={userArr}
          name={`People Are ${Pref.engaged}`} 
          title={`${eUsers.length} people currently\n${Pref.engaged} with ${Pref.batches}`} 
          colour='blue'
        />
        
        <NumStatRing
          total={phasesXY.length}
          nums={phasesXY}
          name={`${Pref.phases} Are ${Pref.engaged}`} 
          title={`People currently ${Pref.engaged} in\n${phasesXY.length} ${Pref.phases}`} 
          colour='blue'
        />
        
        <NumStatRing
          total={xyBatchState.length}
          nums={xyBatchState}
          name={`${Pref.batches} Are ${Pref.engaged}`} 
          title={`${xyBatchState.length} ${Pref.batches} currently\n${Pref.engaged} by people`} 
          colour='blue'
        />
            
      </div>
    
      <div className='wide'>
         
        <PeoplePanel
          app={app}
          eUsers={eUsers}
          dUsers={dUsers}
          eBatches={eBatchesState}
          bCache={bCache}
          updatePhases={(id, ph)=>updatePhases(id, ph)}
          removePhaser={(id)=>removePhaser(id)}
          update={update} />
          
      </div>    
          
    </div>
  );
};

export default DashSlide;
  