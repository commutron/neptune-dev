import React, {Component} from 'react';
import moment from 'moment';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';
import CreateTag from '/client/components/uUi/CreateTag.jsx';

import UserNice from '../../../components/smallUi/UserNice.jsx';

import Tabs from '/client/components/smallUi/Tabs.jsx';

import NCTable from '../../../components/tables/NCTable.jsx';
import ShortTable from '../../../components/tables/ShortTable.jsx';
import ScrapBox from '../../../components/smallUi/ScrapBox.jsx';
import SubItemLink from '/client/components/tinyUi/SubItemLink.jsx';
//import WatchButton from '/client/components/bigUi/WatchModule/WatchModule.jsx';

import ItemFeed from '../../../components/bigUi/ItemFeed/ItemFeed.jsx';

export default class ItemPanel extends Component	{
  //componentWillUnmount() {
    //Session.set('itemExPanelTabs', false);
  //}
  
  ncData() {
    const batch = this.props.batchData;
    const item = this.props.itemData;
    let relevant = batch.nonCon.filter( x => x.serial === item.serial);
    return relevant;
  }
  
  shData() {
    const batch = this.props.batchData;
    const item = this.props.itemData;
    const shortfalls = batch.shortfall || [];
    let relevant = shortfalls.filter( x => x.serial === item.serial);
    return relevant;
  }
  
  flowSteps() { // don't really need to send all the steps?
    let allsteps = Array.from( this.props.app.trackOption, x => x.step + ' ' + x.type );
    let cleansteps = new Set(allsteps);
    return [...cleansteps];
  }

  render() {

    const a = this.props.app;
    const b = this.props.batchData;
    const i = this.props.itemData;
    //const w = this.props.widgetData;
    //const g = this.props.groupData;
    //const user = this.props.user;
    
    //const v = w.versions.find( x => x.versionKey === b.versionKey );
    
    const nc = this.ncData();
    const sh = this.shData();
    
    const start = i.history.length > 0;
    const done = i.finishedAt !== false;
    const scrap = i.history.find(x => x.type === 'scrap' && x.good === true);

    return (
      <AnimateWrap type='cardTrans'>
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
            
            <Tabs
              tabs={['feed', `${Pref.nonCon}s`, `${Pref.shortfalls}`]}
              wide={true}
              stick={false}
              hold={true}
              sessionTab='itemExPanelTabs'>
              
              <ItemFeed
                key={1}
                id={b._id}
                serial={i.serial}
                createTime={i.createdAt}
                createBy={i.createdWho}
                history={i.history}
                noncons={nc}
                shortfalls={sh}
                rmas={i.rma}
                allRMA={b.cascade}
                done={done}
                app={a} />
                
                
              <NCTable
                key={2}
                id={b._id}
                serial={i.serial}
                nc={nc}
                done={done}
                multi={false}
                ncOps={a.nonConOption}
                flowSteps={this.flowSteps()}
                app={a} />
                
              <ShortTable
                key={3}
                id={b._id}
                serial={i.serial}
                shortfalls={sh}
                done={done}
                app={a} />
              
            </Tabs>
            
            <br />
          </div>
          
          <CreateTag
            when={i.createdAt}
            who={i.createdWho}
            whenNew={i.createdAt}
            whoNew={i.createdWho}
            dbKey={i.serial} />
  			</div>
			</AnimateWrap>
    );
  }
}