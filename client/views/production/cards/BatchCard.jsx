import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import Tabs from '/client/components/smallUi/Tabs/Tabs.jsx';

import GeneralChunk from '/client/views/data/panels/BatchPanel/GeneralChunk.jsx';
import ReleaseAction from '/client/components/bigUi/ReleasesModule.jsx';
import StepsProgress from '/client/components/bigUi/StepsProgress/StepsProgress.jsx';

const BatchCard = ({ 
  batchData, widgetData, groupData, 
  user, app, brancheS,
  floorReleased,
  progCounts
})=> {

  const b = batchData;
  // const w = widgetData;
  //const g = groupData;
  // const u = user;
  const a = app;
  
  const done = b.finishedAt !== false;

  let iNoready = b.items.length === 0;
  
  let warn = b.blocks.filter( x => x.solve === false ).length;
  iNoready ? warn++ : null;
  
  let tabOps = [
    <i className='fas fa-info-circle fa-fw' data-fa-transform='down-2' title='Info'></i>, 
    <i className='fas fa-tasks fa-fw' data-fa-transform='down-2' title='Progress'></i>
  ];

  return(
    <div key={b.batch} className='proPrimeSingle'>
        {iNoready &&
          <div className='centre centreText space'>
            <p><i className="fas fa-exclamation-triangle fa-4x orangeT"></i></p>
            <p className='medBig'>
              No {Pref.itemSerial}s created
            </p>
            <br />
          </div>
        }
        
        {!floorReleased && 
          <ReleaseAction 
            id={b._id} 
            rType='floorRelease'
            actionText='release'
            contextText='to the floor'
            isX={false} />}
            
        {b.finishedAt !== false &&
          <div className='finishBanner wide'>
            <div className='purpleBorder space centreText cap'>
              <h2>{Pref.batch} Finished:</h2>
              <h3>{moment(b.finishedAt).calendar()}</h3>
            </div>
          </div>}
      
        <Tabs
          tabs={tabOps}
          names={false}
          wide={true}
          stick={false}
          hold={true}
          sessionTab='batchProPanelTabs'>
          
          <div className='space cap'>
            <GeneralChunk a={a} b={b} done={done} />
          </div>
          
          <div className='space cap'>
            {progCounts && 
              <StepsProgress 
                progCounts={progCounts}
                riverTitle=''
                riverAltTitle=''
                truncate={true} />
            }
          </div>
          
        </Tabs>
			
		<br />

		</div>
  );
};

export default BatchCard;