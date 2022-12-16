import React from 'react';
import Pref from '/client/global/pref.js';

import SlidesNested from '/client/components/smallUi/SlidesNested';
import GroupLanding from './GroupLanding';
import GroupSlide from './GroupSlide';

const AllGroups = ({ 
  groupData, widgetData, variantData, batchDataX, app, specify 
}) => {
  
  const inter = groupData.filter( g => g.internal );
  
  const groupS = groupData.sort((g1, g2)=>
                  g1.alias < g2.alias ? -1 : g1.alias > g2.alias ? 1 : 0 );
                  
  const menuList = groupS.map( (entry)=> {
                    const clss = entry.hibernate ? 'strike darkgrayT' : '';
                    let it = entry.internal ? ' intrBlue' : '';
                    let nl = entry.internal && 'Internal';
                    return [entry.alias, clss+it, nl];
                  });
  
  const defaultSlide = specify ? 
    groupS.findIndex( x => x.alias === specify ) : false;
    
  const isERun = Roles.userIsInRole(Meteor.userId(), ['edit','run']);
                                  
  return(
    <SlidesNested
      menuTitle={Pref.Group + 's'}
      menu={menuList}
      topPage={
        <GroupLanding
          groupData={groupData}
          widgetData={widgetData}
          variantData={variantData}
          app={app}
        />
      }
      defaultSlide={defaultSlide}
      textStyle='up'>
    
      {groupS.map( (entry, index)=> {
        let widgetsList = widgetData.filter(x => x.groupId === entry._id);
        return(
          <GroupSlide
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

export default AllGroups;