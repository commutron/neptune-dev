import React from 'react';
import Pref from '/client/global/pref.js';

import SlidesNested from '/client/components/smallUi/SlidesNested';
import GroupLanding from './GroupLanding';
import GroupSlide from './GroupSlide';

const AllGroups = ({ 
  groupData, widgetData, variantData, batchDataX, app, specify 
}) => {
  
  const inter = groupData.find( g => g.internal );
  
  const groupS = groupData.sort((g1, g2)=>
                  g1.alias < g2.alias ? -1 : g1.alias > g2.alias ? 1 : 0 );
                  
  const sortList = groupS.sort((g1, g2)=>
                    g1.hibernate ? 1 : g2.hibernate ? -1 : 0 );
        
  const menuList = sortList.map( (entry, index)=> {
                    const clss = entry.hibernate ? 'strike fade' : '';
                    let it = entry.internal ? ' intrBlue' : '';
                    return [entry.alias, clss+it];
                  });
  
  const defaultSlide = specify ? 
    sortList.findIndex( x => x.alias === specify ) : false;
                                  
  return(
    <SlidesNested
      menuTitle={Pref.Group + 's'}
      menu={menuList}
      topPage={
        <GroupLanding
          groupData={groupData}
          widgetData={widgetData}
          variantData={variantData} />
      }
      defaultSlide={defaultSlide}
      textStyle='up'>
    
      {sortList.map( (entry, index)=> {
        let widgetsList = widgetData.filter(x => x.groupId === entry._id);
        /*address={'/data/group?request=' + entry.alias}*/
        return(
          <GroupSlide
            key={index+entry._id}
            groupData={entry}
            widgetsList={widgetsList}
            batchDataX={batchDataX}
            app={app}
            inter={!inter || inter._id === entry._id}
          />
        )})} 
    </SlidesNested>
  );
};

export default AllGroups;