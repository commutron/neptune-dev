import React from 'react';
import Pref from '/client/global/pref.js';

import SlidesNested from '/client/components/smallUi/SlidesNested.jsx';
import GroupLanding from './GroupLanding.jsx';
import GroupSlide from './GroupSlide.jsx';

const AllGroups = ({ 
  groupData, widgetData, variantData, batchDataX, app, specify 
}) => {
  
  const inter = groupData.find( g => g.internal );
  
  const sortList = groupData.sort((g1, g2)=> {
                    //if (g1.hibernate) { return 1 }
                    //if (g2.hibernate) { return -1 }
                    if (g1.alias < g2.alias) { return -1 }
                    if (g1.alias > g2.alias) { return 1 }
                    return 0;
                  });
        
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