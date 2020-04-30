import React from 'react';
//import moment from 'moment';
import Pref from '/client/global/pref.js';
import CreateTag from '/client/components/tinyUi/CreateTag.jsx';

import AnimateOnChange from 'react-animate-on-change';
  
import ScrapBox from '../../../components/smallUi/ScrapBox.jsx';
import SubItemLink from '/client/components/tinyUi/SubItemLink.jsx';
//import WatchButton from '/client/components/bigUi/WatchModule/WatchModule.jsx';

import ItemFeed from '/client/components/bigUi/ItemFeed/ItemFeed.jsx';

const ItemPanel = ({ 
  batchData, itemData,
  widgetData, versionData, groupData, 
  app, user, 
  listTitle, flowData
})=>	{
  
  function ncData() {
    const batch = batchData;
    const item = itemData;
    let relevant = batch.nonCon.filter( x => x.serial === item.serial);
    return relevant;
  }
  
  function shData() {
    const batch = batchData;
    const item = itemData;
    const shortfalls = batch.shortfall || [];
    let relevant = shortfalls.filter( x => x.serial === item.serial);
    return relevant;
  }

  const a = app;
  const b = batchData;
  const i = itemData;
  //const w = widgetData;
  //const g = groupData;
  //const v = w.versions.find( x => x.versionKey === b.versionKey );
  
  const nc = ncData();
  const sh = shData();
  
  const start = i.history.length > 0;
  const done = i.finishedAt !== false;
  const scrap = i.history.find(x => x.type === 'scrap' && x.good === true);
  
  return(
    <div className='section' key={i.serial}>
    
      <div className='balance'>
        <div className='numFont space2v'>
          <AnimateOnChange
            customTag='div'
            baseClassName='cap biggest'
            animationClassName="quick-bounce-change"
            animate={i.serial}
            >{i.serial}
          </AnimateOnChange>
        </div>
        <div className='titleSection space2v'>
          <span>Units: {i.units}</span>
          <span>
            { !start ?
              <i className='fas fa-hourglass-start' title='unstarted'></i>
              :
              done ? 
              <i className='fas fa-check-circle greenT' title='finished'></i>
              : 
              <i className='fas fa-sync blueT' title='in progress'></i>
            }
          </span>
        </div>
        
      </div>
      
      <div className='uspace'>
        { i.subItems.length > 0 && 
          <p> 
            <i>Nested sub {Pref.item}s: </i>
            {i.subItems.map((ent, inx)=> { 
              return( <i key={inx}><SubItemLink serial={ent} />, </i> ) } ) }
          </p>}
        { i.panelCode !== false && <p>Panel: {i.panelCode}</p> }
        {scrap && 
          <ScrapBox 
            id={b._id} 
            serial={i.serial} 
            entry={scrap}
            eX={b.finishedAt !== false && b.live} />}
        
        <br />
        
        <ItemFeed
          id={b._id}
          batch={b.batch}
          serial={i.serial}
          createTime={i.createdAt}
          createBy={i.createdWho}
          history={i.history}
          noncons={nc}
          ncTypesCombo={flowData && flowData.ncTypesComboFlat}
          brancheS={flowData.branchesSort}
          shortfalls={sh}
          rmas={i.rma}
          allRMA={b.cascade}
          done={done}
          user={user}
          app={a} />
            
        <br />
      </div>
      
      <CreateTag
        when={i.createdAt}
        who={i.createdWho}
        whenNew={i.createdAt}
        whoNew={i.createdWho}
        dbKey={i.serial} />
		</div>
  );
};

export default ItemPanel;