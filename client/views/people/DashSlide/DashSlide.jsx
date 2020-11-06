import React, { useState, useEffect } from 'react';
//import { toast } from 'react-toastify';
import Pref from '/client/global/pref.js';
//import Tabs from '/client/components/bigUi/Tabs/Tabs.jsx';
import NumStatRing from '/client/components/charts/Dash/NumStatRing.jsx';
import PeoplePanel from './PeoplePanel.jsx';


const DashSlide = ({ app, user, users, bCache, brancheS, isDebug })=> {
  
  const [ update, forceUpdate] = useState(false);
  
  const [ eUsersState, eUsersSet ] = useState([]);
  const [ dUsersState, dUsersSet ] = useState([]);
  
  const [ openTBlockState, openTBlockSet ] = useState("[]");
  const [ xyBatchState, xyBatchSet ] = useState([]);
  
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
    const dUsers = liveUsers.filter( x => !x.engaged );
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
    const qBatches = _.countBy(openTBlocks, x => x && x.batch);
    const qBatchesClean = _.omit(qBatches, (value, key, object)=> {
      return key == false;
    });
    
    const itrXY = obj2xy(qBatchesClean);
    
    isDebug && console.log({qBatches, itrXY});
    
    xyBatchSet(itrXY);
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
    <div className='space5x5 invert overscroll'>
      
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
          title={`${eUsersState.length} people currently\n${Pref.engaged} with ${Pref.batches}`} 
          colour='blue'
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
          openTBlockState={openTBlockState}
          bCache={bCache}
          updateBranches={(id, br)=>updateBranches(id, br)}
          removeBranch={(id)=>removeBranch(id)}
          update={update}
          isDebug={isDebug} />
          
      </div>    
          
    </div>
  );
};

export default DashSlide;
  