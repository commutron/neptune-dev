import React from 'react';
//import { toast } from 'react-toastify';
import Pref from '/client/global/pref.js';
import Tabs from '/client/components/bigUi/Tabs/Tabs.jsx';

import NumStatRing from '/client/components/charts/Dash/NumStatRing.jsx';
import PeoplePanel from './PeoplePanel.jsx';


const DashSlide = ({ app, user, users, batchEvents, bCache })=> {
  
  const eUsers = users.filter( x => x.engaged );
  const styleArr = Array.from(eUsers, (arr)=> { return {x: 1, y: 1} } );

  const eBatches = Array.from(eUsers,
    x => batchEvents.find( 
      y => y.tide.find(  z => z.tKey === x.engaged.tKey )
    )
  );
  const qBatches = eBatches.reduce( (allBatch, batch)=> { 
    if (batch.batch in allBatch) { allBatch[batch.batch]++; }
    else { allBatch[batch.batch] = 1; } 
    return allBatch;
  }, {});
  
  const itrNums = Object.entries(qBatches);
  const itrXY = Array.from(itrNums, (arr)=> { return {x: arr[0], y: arr[1]} } );
  
  Roles.userIsInRole(Meteor.userId(), 'debug') && 
    console.log({eUsers,styleArr,eBatches});
  Roles.userIsInRole(Meteor.userId(), 'debug') && 
    console.log({qBatches,itrNums,itrXY});
  

  return(
    <div className='invert overscroll'>
     
     
      <div className='balance'>
            
        <NumStatRing
          total={eUsers.length}
          nums={styleArr}
          name='People Are Engaged' 
          title={`${eUsers.length} people currently\nengaged with ${Pref.batches}`} 
          colour='blue'
        />
        
        <NumStatRing
          total={itrNums.length}
          nums={itrXY}
          name={`${Pref.batches} Are Engaged` } 
          title={`${itrNums.length} ${Pref.batches} currently\nengaged by people`} 
          colour='blue'
        />
        
        <NumStatRing
          total='??'
          nums={styleArr}
          name='_______ ____' 
          title={`${1} extra \n but blank data`} 
          colour='false'
        />
            
      </div>
    
      <div className='wide'>
        <Tabs
          tabs={ [ 'People', 'Events', 'other' ] }
          wide={true}
          stick={false}
          hold={true}
          sessionTab='peopleDashPanelTabs'
        >
          
          <PeoplePanel
            app={app}
            eUsers={eUsers}
            eBatches={eBatches}
            bCache={bCache} />
          
          <div></div>
           
          <div></div>
            
        </Tabs>
      </div>    
          
    </div>
  );
};

export default DashSlide;
  