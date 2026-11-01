import React, { useEffect, useState }from 'react';
import Pref from '/public/pref.js';

import HomeIcon from '/client/layouts/HomeIcon';
import TideFollow from '/client/components/tide/TideFollow';

import SlidesNested from '/client/layouts/TaskBars/SlidesNested';
import Landing from '/client/views/equipment/Landing';
import EquipSlide from '/client/views/equipment/EquipSlide';

const EquipLayout = ({ 
  equipData, maintainData,
  app, users, liveUsers,
  isRO, isDebug, brancheS, specify 
}) => {
  
  const [ issues, issueSet ] = useState(0);
  
  useEffect( ()=> {
    Meteor.call('countOpenEqIssue', (err, re)=> {
      err && console.log(err);
      re && issueSet(re);
    }); 
  },[]);
  
  const equipS = equipData.sort((e1, e2)=>
                  e1.alias < e2.alias ? -1 : 
                  e1.alias > e2.alias ? 1 : 0 );
        
  const menuList = equipS.map( (e)=> {
                    const O = e.online;
                    const F = e.fault;
                    const H = e.hibernate;
                    const N = e.nullify;
                    const name = (F ? '⚠ ' : '') + e.alias;
                    const ttle = !O && !H ? `・ ${name}` :
                                 H ? `✕ ${name}` : name;
                    const clss = H ? 'darkgrayT' : '';
                    const br = brancheS.find( b => b.brKey === e.branchKey)?.branch || 'Facility';
                    const tip = `${!O && !H ? 'Offline' : H ? 'Hibernated' : 'Online'}\n${F ? 'WIP Issues' : 'No Issues'}\n${N ? 'Decommissioned' : ''}`;
                    return [ttle, N, br, clss, tip];
                  });
  
  const defaultSlide = specify ? equipS.findIndex( x => x.alias === specify ) : false;
  
  const weekday = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday',
    startOf: 'start',
    endOf: 'end'
  };
  
  const monthday = {
    1:"1st", 2:"2nd", 3:"3rd", 4:"4th", 5:"5th",
    6:"6th", 7:"7th", 8:"8th", 9:"9th", 10:"10th",
    11:"11th", 12:"12th", 13:"13th", 14:"14th", 15:"15th",
    16:"16th", 17:"17th", 18:"18th", 19:"19th", 20:"20th",
    21:"21st", 22:"22nd", 23:"23rd", 24:"24th", 25:"25th",
    26:"26th", 27:"27th", 28:"28th", 29:"29th", 30:"30th", 31:"31st",
    startOf: 'start', endOf: 'end'
  };
  
  const month = {
    0: "January", 1: "Febuary", 2: "March",
    3: "April", 4: "May", 5: "June",
    6: "July", 7: "August", 8: "September",
    9: "October", 10: "November", 11: "December",
    startOf: 'start', endOf: 'end'
  };
  
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
              equipData={equipS}
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
              liveUsers={liveUsers}
              isDebug={isDebug}
              brancheS={brancheS}
              weekday={weekday}
              monthday={monthday}
              month={month}
            />
          ))} 
        </SlidesNested>
      </div>
    </div>
  );
};

export default EquipLayout;