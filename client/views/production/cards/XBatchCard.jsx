import React, { useState, useEffect, Fragment } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import Tabs from '/client/components/bigUi/Tabs/Tabs.jsx';

//import JumpText from '../../../components/tinyUi/JumpText.jsx';
//import StepsProgress from '../../../components/bigUi/StepsProgress.jsx';
//import NonConMiniSatus from '/client/components/charts/NonConMiniStatus.jsx';
//import NonConMiniTops from '/client/components/bigUi/NonConMiniTops.jsx';
import TagsModule from '/client/components/bigUi/TagsModule.jsx';
import NoteLine from '/client/components/smallUi/NoteLine.jsx';
import BlockList from '/client/components/bigUi/BlockList.jsx';

const BatchCardX = ({ 
  itemSerial, batchData, bOpen, 
  
  widgetData, groupData, 
  user, app, 
  
  ncTypesCombo, tideKey,
  
  tideFloodGate,
  expand, handleExpand,
  
  flow, flowCounts, fallCounts
})=> {
    
  // const [ brancheState, brancheSortSet ] = useState([]);

  // const [ flowData, flowDataSet ] = useState(false);

  // useEffect( ()=>{
  //   const branches = app.branches.filter( b => b.open === true );
  //   const branchesSort = branches.sort((b1, b2)=> {
  //     return b1.position < b2.position ? 1 : 
  //           b1.position > b2.position ? -1 : 0 });
  //   brancheSortSet(branchesSort);
  //   const pBS = Array.from(brancheState, b => b.branch);
  //   plainBrancheSet(pBS);
  // }, [app]);
  
  const b = batchData;
  //const iS = itemSerial;
  // const w = widgetData;
  //const g = groupData;
  // const u = user;
  const a = app;
  
  const bComplete = b.completed === true;


  return(
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
          <BlockList id={b._id} data={b.blocks} xbatch={true} lock={bComplete} expand={expand} />
        </div>
  
        <div className='space cap'>
        {/*<StepsProgress
            mini={true}
            expand={expand}
            flowCounts={flowCounts} />*/}
        </div>
        
      </Tabs>
  );
};

export default BatchCardX;