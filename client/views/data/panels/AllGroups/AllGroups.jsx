import React from 'react';
import Pref from '/client/global/pref.js';

import SlidesNested from '/client/components/smallUi/SlidesNested.jsx';
import GroupLanding from './GroupLanding.jsx';
import GroupSlide from './GroupSlide.jsx';

const AllGroups = ({ 
  groupData, widgetData, 
  batchData, batchDataX, 
  app, specify 
}) => {
  
  const sortList = groupData.sort((g1, g2)=> {
                    if (g1.alias < g2.alias) { return -1 }
                    if (g1.alias > g2.alias) { return 1 }
                    return 0;
                  });
  const menuList = sortList.map( (entry, index)=> {
                    return <b>{entry.alias.toUpperCase()}</b>;
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
          batchData={batchData}
          batchDataX={batchDataX}
          widgetData={widgetData} />
      }
      defaultSlide={defaultSlide}>
    
      {sortList.map( (entry, index)=> {
        let widgetsList = widgetData.filter(x => x.groupId === entry._id);
        /*address={'/data/group?request=' + entry.alias}*/
        return(
          <GroupSlide
            key={index+entry._id}
            groupData={entry}
            widgetsList={widgetsList}
            batchData={batchData}
            batchDataX={batchDataX}
            app={app} />
        )})} 
    </SlidesNested>
  );
};

export default AllGroups;