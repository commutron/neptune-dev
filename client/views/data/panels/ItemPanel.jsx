import React from 'react';
//import moment from 'moment';
import Pref from '/client/global/pref.js';
import CreateTag from '/client/components/uUi/CreateTag.jsx';

import ScrapBox from '../../../components/smallUi/ScrapBox.jsx';
import SubItemLink from '/client/components/tinyUi/SubItemLink.jsx';
//import WatchButton from '/client/components/bigUi/WatchModule/WatchModule.jsx';

import ItemFeed from '/client/components/bigUi/ItemFeed/ItemFeed.jsx';

const ItemPanel = (props)=>	{
  
  function ncData() {
    const batch = props.batchData;
    const item = props.itemData;
    let relevant = batch.nonCon.filter( x => x.serial === item.serial);
    return relevant;
  }
  
  function shData() {
    const batch = props.batchData;
    const item = props.itemData;
    const shortfalls = batch.shortfall || [];
    let relevant = shortfalls.filter( x => x.serial === item.serial);
    return relevant;
  }
  
  function getFlows() {
    const b = props.batchData;
    const w = props.widgetData;
    let ncListKeys = [];
    if( b && w ) {
      const river = w.flows.find( x => x.flowKey === b.river);
      const riverAlt = w.flows.find( x => x.flowKey === b.riverAlt );
      if(river) {
        river.type === 'plus' && ncListKeys.push(river.ncLists);
      }
      if(riverAlt) {
        riverAlt.type === 'plus' && ncListKeys.push(riverAlt.ncLists);
      }
    }
    return { ncListKeys };
  }

  const a = props.app;
  const b = props.batchData;
  const i = props.itemData;
  //const w = this.props.widgetData;
  //const g = this.props.groupData;
  const user = props.user;
  //const v = w.versions.find( x => x.versionKey === b.versionKey );
  
  const nc = ncData();
  const sh = shData();
  
  const start = i.history.length > 0;
  const done = i.finishedAt !== false;
  const scrap = i.history.find(x => x.type === 'scrap' && x.good === true);
  
  const path = !b ? { ncListKeys: [] } : getFlows();


  return(
    <div className='section' key={i.serial}>
    
      <div className='titleSection'>
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
        <span>
        {/*
          <WatchButton 
            list={user.watchlist}
            type='item'
            keyword={`${i.serial}+${b.batch}`} />
        */}
        </span>
      </div>
      
      <div className='space'>
        { i.subItems.length > 0 && 
          <p> 
            <i>Nested sub {Pref.item}s: </i>
            {i.subItems.map((ent, inx)=> { 
              return( <i key={inx}><SubItemLink serial={ent} />, </i> ) } ) }
          </p>}
        { i.panelCode !== false && <p>Panel: {i.panelCode}</p> }
        {scrap && <ScrapBox entry={scrap} />}
        
        <br />
        
        <ItemFeed
          id={b._id}
          batch={b.batch}
          serial={i.serial}
          createTime={i.createdAt}
          createBy={i.createdWho}
          history={i.history}
          noncons={nc}
          ncListKeys={path.ncListKeys.flat()}
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