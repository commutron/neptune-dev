import React from 'react';
import moment from 'moment';

import RapidExtendCreate from './RapidExtendCreate';
import RapidExtendCard from './RapidExtendCard';

const RapidExtendTab = ({ 
  batchData, seriesData, rapidsData, 
  widgetData, vassembly, urlString,
  released, done, nowater,
  app, user, brancheS, ncTypesCombo, isDebug
})=> {
  
  const rapidSdata = rapidsData.sort((r1, r2)=> 
        r1.createdAt > r2.createdAt ? 1 : r1.createdAt < r2.createdAt ? -1 : 0 );
  
  const rOpenid = rapidsData.find( r => r.live === true );
  
  const calString = "ddd, MMM D /YY, h:mm A";
  const calFunc = (d)=> moment(d).calendar(null, {sameElse: calString});
  
  const editAuth = Roles.userIsInRole(Meteor.userId(), ['run', 'qa']);
  
  return(
    <div className='cardify autoFlex'>
      {rapidSdata.map( (r, ix)=> {
        const setItems = !seriesData ? 0 : seriesData.items.filter( 
                        i => i.altPath.find( a => a.rapId === r._id) ).length;
        return(
          <RapidExtendCard 
            key={r._id+'rEx'+ix}
            batchData={batchData}
            hasSeries={seriesData ? true : false}
            rSetItems={setItems}
            widgetData={widgetData}
            vassembly={vassembly}
            urlString={urlString}
            rapid={r}
            rOpenid={rOpenid}
            app={app}
            ncTypesCombo={ncTypesCombo}
            user={user}
            editAuth={editAuth}
            cal={calFunc}
          />
      )})}
      
      <RapidExtendCreate
        rOpenid={rOpenid}
        batchData={batchData}
        editAuth={editAuth}
        cal={calFunc}
      />
      
    </div>
  );
};

export default RapidExtendTab;