import React from 'react';
import Pref from '/client/global/pref.js';

import SlidesNested from '/client/components/smallUi/SlidesNested';
import Landing from './Landing';
import EquipSlide from './EquipSlide';

const EquipWrap = ({ 
  equipData, maintainData,
  app, users, isDebug, brancheS, specify 
}) => {
  
  const equipS = equipData.sort((e1, e2)=>
                  e1.alias < e2.alias ? -1 : 
                  e1.alias > e2.alias ? 1 : 0 );
        
  const menuList = equipS.map( (entry)=> {
                    const ttle = !entry.online && !entry.hibernate ? '・ ' + entry.alias : entry.alias;
                    const clss = entry.hibernate ? 'strike darkgrayT' : '';
                    return [ttle, clss];
                  });
  
  const defaultSlide = specify ? 
    equipS.findIndex( x => x.alias === specify ) : false;
  
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
          isDebug={isDebug}
          brancheS={brancheS}
        />
      ))} 
    </SlidesNested>
  );
};

export default EquipWrap;