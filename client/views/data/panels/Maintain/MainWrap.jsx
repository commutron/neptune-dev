import React from 'react';
import Pref from '/client/global/pref.js';

import SlidesNested from '/client/components/smallUi/SlidesNested';
import Landing from './Landing';
import EquipSlide from './EquipSlide';

const MainWrap = ({ 
  equipData, maintainData,
  app, brancheS, specify 
}) => {
  
  const equipS = equipData.sort((e1, e2)=>
                  e1.alias < e2.alias ? -1 : e1.alias > e2.alias ? 1 : 0 );
                  
  const sortList = equipS.sort((e1, e2)=>
                    e1.online ? 1 : e2.online ? -1 : 0 );
        
  const menuList = sortList.map( (entry, index)=> {
                    const clss = entry.online ? '' : 'strike fade';
                    return [entry.alias, clss];
                  });
  
  const defaultSlide = specify ? 
    sortList.findIndex( x => x.alias === specify ) : false;
    
  const isERun = Roles.userIsInRole(Meteor.userId(), ['edit','run']);
     
     
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
    
      {sortList.map( (entry, index)=> {
        // let widgetsList = widgetData.filter(x => x.groupId === entry._id);
        return(
          <EquipSlide
            key={index+entry._id}
            equipData={entry}
            app={app}
            brancheS={brancheS}
            isERun={isERun}
          />
        )})} 
    </SlidesNested>
  );
};

export default MainWrap;