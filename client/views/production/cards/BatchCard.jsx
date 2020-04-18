import React from 'react';
import moment from 'moment';
//import TideLock from '/client/components/tide/TideLock.jsx';
import Pref from '/client/global/pref.js';
import Tabs from '/client/components/bigUi/Tabs/Tabs.jsx';

import GeneralChunk from '/client/views/data/panels/BatchPanel/GeneralChunk.jsx';
//import JumpText from '../../../components/tinyUi/JumpText.jsx';
import ReleaseAction from '/client/components/bigUi/ReleasesModule.jsx';
import StepsProgress from '../../../components/bigUi/StepsProgress/StepsProgress.jsx';

const BatchCard = ({ 
  batchData, itemSerial, widgetData, groupData, 
  user, app, brancheS,
  flow, flowAlt, floorReleased,
  progCounts, currentLive
})=> {

  const b = batchData;
  // const iS = itemSerial;
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
    <div className='sidebar' key={b.batch}>
      {/*<TideLock currentLive={currentLive}></TideLock>*/}
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
          <h2 className='actionBox centreText green'>
            Finished: {moment(b.finishedAt).calendar()}
          </h2>}
      
        <Tabs
          tabs={tabOps}
          names={false}
          wide={true}
          stick={false}
          hold={true}
          sessionTab='batchProPanelTabs'>
          
          <div className='space cap'>
            <GeneralChunk a={a} b={b} done={done} expand={false} />
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