import React from 'react';
import Pref from '/client/global/pref.js';

import SlidesNested from '/client/components/smallUi/SlidesNested';
import Landing from './Landing';
import EquipSlide from './EquipSlide';

const MainWrap = ({ 
  groupData, widgetData, variantData, batchDataX, app, brancheS, specify 
}) => {
  
  const inter = groupData.filter( g => g.internal );
  
  const equipS = [].sort((g1, g2)=>
                  g1.alias < g2.alias ? -1 : g1.alias > g2.alias ? 1 : 0 );
                  
  const sortList = equipS.sort((g1, g2)=>
                    g1.hibernate ? 1 : g2.hibernate ? -1 : 0 );
        
  const menuList = sortList.map( (entry, index)=> {
                    const clss = entry.hibernate ? 'strike fade' : '';
                    let it = entry.internal ? ' intrBlue' : '';
                    return [entry.alias, clss+it];
                  });
  
  const defaultSlide = specify ? 
    sortList.findIndex( x => x.alias === specify ) : false;
    
  const isERun = Roles.userIsInRole(Meteor.userId(), ['edit','run']);
                                  
  return(
    <SlidesNested
      menuTitle={Pref.equip}
      menu={menuList}
      topPage={
        <Landing
          groupData={groupData}
          widgetData={widgetData}
          variantData={variantData}
          app={app}
        />
      }
      defaultSlide={defaultSlide}
      textStyle='up'>
    
      {sortList.map( (entry, index)=> {
        let widgetsList = widgetData.filter(x => x.groupId === entry._id);
        return(
          <EquipSlide
            key={index+entry._id}
            groupData={entry}
            widgetsList={widgetsList}
            batchDataX={batchDataX}
            app={app}
            inter={!inter || inter.length < Pref.interMax || inter.find( x=> x._id === entry._id )}
            isERun={isERun}
          />
        )})} 
    </SlidesNested>
  );
};

export default MainWrap;