import React from 'react';
// import moment from 'moment';
// import Pref from '/client/global/pref.js';
import Tabs from '/client/components/bigUi/Tabs/Tabs.jsx';

//import JumpText from '../../../components/tinyUi/JumpText.jsx';
import WaterfallSelect from '/client/components/river/waterfall/WaterfallSelect.jsx';
import ReleaseAction from '/client/components/bigUi/ReleasesModule.jsx';
//import StepsProgress from '../../../components/bigUi/StepsProgress.jsx';
//import NonConMiniSatus from '/client/components/charts/NonConMiniStatus.jsx';
//import NonConMiniTops from '/client/components/bigUi/NonConMiniTops.jsx';
import TagsModule from '/client/components/bigUi/TagsModule.jsx';
import NoteLine from '/client/components/smallUi/NoteLine.jsx';
import BlockList from '/client/components/bigUi/BlockList.jsx';

const BatchCardX = ({ 
  itemSerial, batchData, widgetData, groupData, 
  user, app, expand, flow, progCounts
})=> {

    const b = batchData;
    //const iS = itemSerial;
    // const w = widgetData;
    //const g = groupData;
    // const u = user;
    const a = app;
    
    const done = b.completed === true;

    //let iready = b.items.length === 0;

    //iready ? warn++ : null;
    
    let released = b.releases.find( x => x.type === 'floorRelease');

  return(
    <div className='proPrimeSingle' key={b.batch}>
      
      {!released ?
        <ReleaseAction 
          id={b._id} 
          rType='floorRelease'
          actionText='release'
          //contextText='to the floor'
          isX={true} />
      :
        <WaterfallSelect batchData={b} app={a} />
      }
      
        <Tabs
          tabs={[
            <i className='fas fa-info-circle fa-fw' data-fa-transform='down-2' title='Info'></i>, 
            <i className='fas fa-tasks fa-fw' data-fa-transform='down-2' title='Progress'></i>,
          ]}
          names={false}
          wide={true}
          stick={false}
          hold={true}
          sessionTab='batchExPanelTabs'>
          
          <div className='space cap'>
            <TagsModule
              action='xBatch'
              id={b._id}
              tags={b.tags}
              tagOps={a.tagOption} />
            <br />
            <NoteLine 
              action='xBatch'
              id={b._id}
              entry={b.notes} />
            <BlockList id={b._id} data={b.blocks} xbatch={true} lock={done} expand={expand} />
          </div>
          

          <div className='space cap'>
          {/*
            <StepsProgress
              mini={true}
              expand={expand}
              progCounts={progCounts} />
            */}
          </div>
          
        </Tabs>
			
		  <br />
  
  	</div>
  );
};

export default BatchCardX;