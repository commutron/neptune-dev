import React from 'react';
import Pref from '/client/global/pref.js';

import SlidesNested from '/client/components/smallUi/SlidesNested';
import Landing from './Landing';
import EquipSlide from './EquipSlide';

const MainWrap = ({ 
  equipData, maintainData,
  app, users, brancheS, specify 
}) => {
  
  const equipS = equipData.sort((e1, e2)=>
                  e1.alias < e2.alias ? -1 : 
                  e1.alias > e2.alias ? 1 : 0 );
        
  const menuList = equipS.map( (entry)=> {
                    const clss = entry.online ? '' : 'strike darkgrayT';
                    return [entry.alias, clss];
                  });
  
  const defaultSlide = specify ? 
    equipS.findIndex( x => x.alias === specify ) : false;
    
  // const isERun = Roles.userIsInRole(Meteor.userId(), ['edit','run']);
     
     
     console.log({equipData, maintainData});
     
     
  return(
    <SlidesNested
      menuTitle={Pref.equip}
      menu={menuList}
      topPage={
        <Landing
          equipData={equipData}
          maintainData={maintainData}
          app={app}
          brancheS={brancheS}
        />
      }
      defaultSlide={defaultSlide}
      textStyle='up'>
    
      {equipS.map( (entry, index)=> (
        <EquipSlide
          key={index+entry._id}
          equipLite={entry}
          app={app}
          users={users}
          brancheS={brancheS}
        />
      ))} 
    </SlidesNested>
  );
};

export default MainWrap;