import React, { useEffect, useState, useMemo }from 'react';
import Pref from '/client/global/pref.js';

import HomeIcon from '/client/layouts/HomeIcon';
import TideFollow from '/client/components/tide/TideFollow';

import SlidesNested from '/client/components/smallUi/SlidesNested';
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
        
  const menuList = equipS.map( (entry)=> {
                    const ttle = !entry.online && !entry.hibernate ? '・ ' + entry.alias : entry.alias;
                    const clss = entry.hibernate ? 'strike darkgrayT' : '';
                    const br = brancheS.find( b => b.brKey === entry.branchKey)?.branch || 'Facility';
                    return [ttle, clss, br];
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