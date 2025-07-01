import React, { useEffect, useState, useMemo }from 'react';
import Pref from '/public/pref.js';

import HomeIcon from '/client/layouts/HomeIcon';
import TideFollow from '/client/components/tide/TideFollow';

import SlidesNested from '/client/layouts/TaskBars/SlidesNested';
import Landing from '/client/views/equipment/Landing';
import EquipSlide from '/client/views/equipment/EquipSlide';

const EquipLayout = ({ 
  equipData, maintainData,
  app, users, isDebug, brancheS, specify 
}) => {
  
  const [ issues, issueSet ] = useState(0);
  
  useEffect( ()=> {
    Meteor.call('countOpenEqIssue', (err, re)=> {
      err && console.log(err);
      re && issueSet(re);
    }); 
  },[]);
  
  const isRO = useMemo( ()=> Roles.userIsInRole(Meteor.userId(), 'readOnly'), [users]);
  
  const equipS = equipData.sort((e1, e2)=>
                  e1.alias < e2.alias ? -1 : 
                  e1.alias > e2.alias ? 1 : 0 );
        
  const menuList = equipS.map( (e)=> {
                    const ttle = !e.online && !e.hibernate ? `・ ${e.alias}` :
                                 e.hibernate ? `✕ ${e.alias}` : e.alias;
                    const strk = e.nullify;
                    const clss = e.hibernate ? 'darkgrayT' : '';
                    const br = brancheS.find( b => b.brKey === e.branchKey)?.branch || 'Facility';
                    return [ttle, strk, br, clss];
                  });
  
  const defaultSlide = specify ? equipS.findIndex( x => x.alias === specify ) : false;
  
  return(
    <div className='simpleContainer'>
      <div className='tenHeader noPrint'>
        <div className='topBorder' />
        <HomeIcon />
        
        <div className='frontCenterTitle cap'>Equipment</div>
          
        <div className='auxRight'>
          {isRO ? null 
          :
            <button 
              aria-label='Production'
              className='taskLink auxTipScale'
              onClick={()=>FlowRouter.go('/production')}>
              <i className='fa-regular fa-paper-plane' data-fa-transform='left-1'></i>
            </button>
          }
        </div>
        
        <TideFollow />
        
      </div>
      
      <div className='simpleContent'>
        <SlidesNested
          menuTitle={Pref.equip}
          menu={menuList}
          topPage={
            <Landing
              equipData={equipData}
              maintainData={maintainData}
              issues={issues}
              app={app}
              brancheS={brancheS}
            />
          }
          defaultSlide={defaultSlide}
          collapse='Decommissioned'
          menuClass='darkMenu'
          textStyle='up'>
        
          {equipS.map( (entry, index)=> (
            <EquipSlide
              key={index+entry._id}
              equipLite={entry}
              app={app}
              users={users}
              isDebug={isDebug}
              brancheS={brancheS}
            />
          ))} 
        </SlidesNested>
      </div>
    </div>
  );
};

export default EquipLayout;