import React from 'react';
//import moment from 'moment';
import Pref from '/client/global/pref.js';
import CreateTag from '/client/components/tinyUi/CreateTag';

import AnimateOnChange from 'react-animate-on-change';
  
import ScrapBox from '/client/components/bigUi/ItemFeedX/ScrapBox';
import SubItemLink from '/client/components/smallUi/SubItemLink';

import ItemFeedX from '/client/components/bigUi/ItemFeedX/ItemFeedX';

const ItemPanelX = ({ 
  batchData, seriesData, rapidsData, itemData,
  widgetData, variantData, groupData, 
  app, brancheS, user, 
  listTitle, flowData
})=> {
  
  const srs = seriesData;
  const i = itemData;
  const b = batchData;
  
  const nc = srs.nonCon.filter( x => x.serial === i.serial );
  
  const sh = srs.shortfall.filter( x => x.serial === i.serial);
  
  const start = i.history.length > 0;
  const rapid = i.altPath.find( a => a.rapId !== false && a.completed === false );
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
              <i className='fas fa-battery-empty' title='unstarted'></i>
              :
              i.completed ? 
              <i className='fas fa-battery-full greenT' title='complete'></i>
              : 
              <i className='fas fa-battery-half blueT' title='in progress'></i>
            }
          </span>
        </div>
        
      </div>
      
      <div className='uspace'>
        { i.subItems.length > 0 && 
          <p className='indent5v'>
            <i>Nested sub {Pref.item}s: </i>
            {i.subItems.map((ent, inx)=> { 
              return( <i key={inx}><SubItemLink serial={ent} />, </i> ) } ) }
          </p>}
        {scrap && 
          <ScrapBox 
            seriesId={srs._id} 
            serial={i.serial} 
            entry={scrap}
            eX={!b.completed && b.live} />}
        
        <ItemFeedX
          batchId={b._id}
          batch={b.batch}
          seriesId={srs._id}
          serial={i.serial}
          createTime={i.createdAt}
          createBy={i.createdWho}
          history={i.history}
          altPath={i.altPath}
          noncons={nc}
          ncTypesCombo={flowData && flowData.ncTypesComboFlat}
          brancheS={brancheS}
          shortfalls={sh}
          done={i.completed}
          rapId={rapid ? rapid.rapId : false}
          rapidsData={rapidsData}
          user={user}
          app={app} />
            
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

export default ItemPanelX;