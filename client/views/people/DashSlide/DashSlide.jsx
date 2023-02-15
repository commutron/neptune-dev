import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import NumStatRing from '/client/components/charts/Dash/NumStatRing';
import PeoplePanel from './PeoplePanel';


const DashSlide = ({ users, loggedIn, traceDT, brancheS, isDebug })=> {
  
  const [ update, forceUpdate] = useState(false);
  
  const [ eUsersState, eUsersSet ] = useState([]);
  const [ lUsersState, lUsersSet ] = useState([]);
  const [ dUsersState, dUsersSet ] = useState([]);
  
  const [ openTBlockState, openTBlockSet ] = useState("[]");
  const [ xyBatchState, xyBatchSet ] = useState([]);
  const [ xyEqState, xyEqSet ] = useState([]);
  
  const [ userBranches, setUserBranches ] = useState({});
  const [ brList, setBranchList ] = useState([]);
  const [ branchesXY, setBranchesXY ] = useState([]);
  
  const updateBranches = (uID, newBranch)=>{
    let currBranches = userBranches;
    currBranches[uID] = newBranch;
    setUserBranches(currBranches);
    const smpList = _.values(currBranches);
    setBranchList(smpList);
  };
  
  const removeBranch = (uID)=>{
    const indexes = Object.keys(brancheS); // just a list of [0,1,2...]
    const rmvKeys = Array.from(indexes, x => uID+x ); // person in multiple
    
    let currBranches = userBranches;
    const lessBranch = _.omit(currBranches, rmvKeys);
    setUserBranches(lessBranch);
    const smpList = _.values(lessBranch);
    setBranchList(smpList);
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
    const lUsers = liveUsers.filter( x => !x.engaged && loggedIn.includes(x._id) );
    lUsersSet( lUsers );
    const dUsers = liveUsers.filter( x => !x.engaged && !loggedIn.includes(x._id) );
    dUsersSet( dUsers );
    
    isDebug && console.log({eUsers});
    
    const userTkeys = Array.from(eUsers, e => e.engaged.tKey);
    Meteor.call('getEngagedBlocks', userTkeys, (err, re)=>{
      err && console.log(err);
      if(re) { openTBlockSet(re); }
    });
  },[users]);
  
  useEffect( ()=>{
    const openTBlocks = JSON.parse(openTBlockState);
    
    const qBatches = _.countBy(openTBlocks.filter(a=>a.batch), x => x?.batch);
    const qBatchesClean = _.omit(qBatches, (val, key, obj)=> key == false );
    const itrXY = obj2xy(qBatchesClean);
    
    const qEquip = _.countBy(openTBlocks.filter(a=>a.project), x => x?.project);
    const qEquipClean = _.omit(qEquip, (v, key, obj)=> key == false );
    const eqXY = obj2xy(qEquipClean);
    
    isDebug && console.log({qBatches, itrXY, eqXY});
    
    xyBatchSet(itrXY);
    xyEqSet(eqXY);
  }, [openTBlockState]);
  
  
  useEffect( ()=>{
    const qBranch = _.countBy(brList, x => x);
    const qBranchClean = _.omit(qBranch, (value, key, object)=> {
      return key == false;
    });

    const brXY = obj2xy(qBranchClean);
    
    setBranchesXY(brXY);
  }, [brList]);

  return(
    <div className='space5x5 overscroll'>
      
      <p className='rightText nomargin'>
        <button
          title='refresh data'
          className='iconAction transparent grayT'
          onClick={()=>forceUpdate(!update)}>
          <i className="fas fa-sync-alt fa-2x"></i>
        </button>
      </p>
      
      <div className='balance'>
            
        <NumStatRing
          total={eUsersState.length}
          nums={[eUsersState.length, dUsersState.length ]}
          name={`${eUsersState.length == 1 ? 'Person Is' : 'People Are'} ${Pref.engaged}`} 
          title={`${eUsersState.length} people currently\n${Pref.engaged} with ${Pref.xBatchs}`} 
          colour='greenBi'
        />
        
        <NumStatRing
          total={branchesXY.length}
          nums={branchesXY}
          name={`${branchesXY.length == 1 ? `${Pref.branch} Is` : `${Pref.branches} Are`} ${Pref.engaged}`} 
          title={`People currently ${Pref.engaged} in\n${branchesXY.length} ${Pref.branches}`} 
          colour='blue'
        />
        
        <NumStatRing
          total={xyBatchState.length}
          nums={xyBatchState}
          name={`${xyBatchState.length == 1 ? `${Pref.xBatch} Is` : `${Pref.xBatchs} Are`} ${Pref.engaged}`}
          title={`${xyBatchState.length} ${Pref.xBatchs} currently\n${Pref.engaged} by people`} 
          colour='blue'
        />
        
        <NumStatRing
          total={xyEqState.length}
          nums={xyEqState}
          name={`${Pref.equip} servicing`}
          title={`${xyEqState.length} ${Pref.equip} currently\nundergoing service`} 
          colour={[ "#2c3e50", "#34495e" ]}
        />
            
      </div>
    
      <div className='wide'>
         
        <PeoplePanel
          eUsers={eUsersState}
          lUsers={lUsersState}
          dUsers={dUsersState}
          openTBlockState={openTBlockState}
          traceDT={traceDT}
          updateBranches={(id, br)=>updateBranches(id, br)}
          removeBranch={(id)=>removeBranch(id)}
          update={update}
          isDebug={isDebug} />
          
      </div>    
          
    </div>
  );
};

export default DashSlide;