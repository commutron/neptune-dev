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
  const [ eUsersState, eUsersSet ] = useState([]);
  const [ dUsersState, dUsersSet ] = useState([]);
  const [ userPhases, setUserPhases ] = useState({});
  const [ pList, setPhaseList ] = useState([]);
  const [ phasesXY, setPhasesXY ] = useState([]);
  const [ maxHours, maxHoursSet ] = useState(0);
  
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
    const liveUsers = users.filter( x => Roles.userIsInRole(x._id, 'active') && 
                                        !Roles.userIsInRole(x._id, 'readOnly') );
    const eUsers = liveUsers.filter( x => x.engaged );
    eUsersSet( eUsers );
    const dUsers = liveUsers.filter( x => !x.engaged );
    dUsersSet( dUsers );
    
    Roles.userIsInRole(Meteor.userId(), 'debug') && console.log({eUsers});

    const tideBatches = batches.filter( x => 
      typeof x === 'object' && Array.isArray(x.tide) );
    
    const eBatches = eUsers.map( (user, index)=>{
      const acBatch = tideBatches.find( y =>
        y.tide.find( z => z.tKey === user.engaged.tKey ) );
      if(acBatch) {
        return acBatch;
      }  
    });
    Roles.userIsInRole(Meteor.userId(), 'debug') && console.log({tideBatches, eBatches});
    eBatchesSet(eBatches);
  },[batches, users]);
  
  useEffect( ()=>{
    const qBatches = eBatchesState.reduce( (allBatch, batch, index, array)=> { 
      const objkey = !batch ? false : batch.batch;
      objkey &&
        objkey in allBatch ? allBatch[objkey]++ : allBatch[objkey] = 1;
      return allBatch;
    }, {});
    const qBatchesClean = _.omit(qBatches, (value, key, object)=> {
      return key == false;
    });
    const itrXY = obj2xy(qBatchesClean);
  
    Roles.userIsInRole(Meteor.userId(), 'debug') && console.log({qBatchesClean, itrXY});
    xyBatchSet(itrXY);
  }, [eBatchesState]);
  
  
  useEffect( ()=>{
    const pQuant = pList.reduce( (allPhase, phase)=> { 
    phase &&
      phase in allPhase ? allPhase[phase]++ : allPhase[phase] = 1;
    return allPhase;
    }, {});
    const pXY = obj2xy(pQuant);
    setPhasesXY(pXY);
  }, [pList]);
  
  

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
          total={eUsersState.length}
          nums={[eUsersState.length, dUsersState.length ]}
          name={`${eUsersState.length == 1 ? 'Person Is' : 'People Are'} ${Pref.engaged}`} 
          title={`${eUsersState.length} people currently\n${Pref.engaged} with ${Pref.batches}`} 
          colour='blue'
        />
        
        <NumStatRing
          total={phasesXY.length}
          nums={phasesXY}
          name={`${phasesXY.length == 1 ? `${Pref.phase} Is` : `${Pref.phases} Are`} ${Pref.engaged}`} 
          title={`People currently ${Pref.engaged} in\n${phasesXY.length} ${Pref.phases}`} 
          colour='blue'
        />
        
        <NumStatRing
          total={xyBatchState.length}
          nums={xyBatchState}
          name={`${xyBatchState.length == 1 ? `${Pref.batch} Is` : `${Pref.batches} Are`} ${Pref.engaged}`}
          title={`${xyBatchState.length} ${Pref.batches} currently\n${Pref.engaged} by people`} 
          colour='blue'
        />
            
      </div>
    
      <div className='wide'>
         
        <PeoplePanel
          app={app}
          eUsers={eUsersState}
          dUsers={dUsersState}
          eBatches={eBatchesState}
          bCache={bCache}
          updatePhases={(id, ph)=>updatePhases(id, ph)}
          removePhaser={(id)=>removePhaser(id)}
          update={update} 
          potentialTime={maxHours * eUsersState.length} />
          
      </div>    
          
    </div>
  );
};

export default DashSlide;
  