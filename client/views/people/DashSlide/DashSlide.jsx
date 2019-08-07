import React from 'react';
//import { toast } from 'react-toastify';
import Pref from '/client/global/pref.js';
import Tabs from '/client/components/bigUi/Tabs/Tabs.jsx';

import NumStatRing from '/client/components/charts/Dash/NumStatRing.jsx';
import PeoplePanel from './PeoplePanel.jsx';


const DashSlide = ({ app, user, users, batchEvents, bCache })=> {
  
  const liveUsers = users.filter( x => x.roles.includes('active') && !x.roles.includes('readOnly') );
  const eUsers = liveUsers.filter( x => x.engaged );
  const userArr = [eUsers.length, ( liveUsers.length - eUsers.length ) ];
  const styleArr = Array.from(eUsers, (arr)=> { return {x: 1, y: 1} } );

  const eBatches = Array.from(eUsers,
    x => batchEvents.find( 
      y => y.tide && y.tide.find(  z => z.tKey === x.engaged.tKey )
    )
  );
  
  const qBatches = eBatches.reduce( (allBatch, batch)=> { 
    if (batch in allBatch) { allBatch[batch.batch]++; }
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
          nums={userArr}
          name={`People Are ${Pref.engaged}`} 
          title={`${eUsers.length} people currently\n${Pref.engaged} with ${Pref.batches}`} 
          colour='blue'
        />
        
        <NumStatRing
          total={itrNums.length}
          nums={itrXY}
          name={`${Pref.batches} Are ${Pref.engaged}`} 
          title={`${itrNums.length} ${Pref.batches} currently\n${Pref.engaged} by people`} 
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
            liveUsers={liveUsers}
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
  