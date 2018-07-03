import React, {Component} from 'react';
import moment from 'moment';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';
import CreateTag from '/client/components/uUi/CreateTag.jsx';

import UserNice from '../../../components/smallUi/UserNice.jsx';

import Tabs from '/client/components/smallUi/Tabs.jsx';

import HistoryTable from '../../../components/tables/HistoryTable.jsx';
import NCTable from '../../../components/tables/NCTable.jsx';
import RMALine from '../../../components/smallUi/RMALine.jsx';
import ScrapBox from '../../../components/smallUi/ScrapBox.jsx';
import SubItemLink from '/client/components/tinyUi/SubItemLink.jsx';

export default class ItemPanel extends Component	{
  //componentWillUnmount() {
    //Session.set('itemExPanelTabs', false);
  //}
  
  ncData() {
    const batch = this.props.batchData;
    const item = this.props.itemData;
    let relevant = batch.nonCon.filter( x => x.serial === item.serial);
    relevant.sort((n1, n2)=> {
      if (n1.ref < n2.ref) { return -1 }
      if (n1.ref > n2.ref) { return 1 }
      return 0;
    });
    return relevant;
  }
  
  flowSteps() {
    let allsteps = Array.from( this.props.app.trackOption, x => x.step );
    let cleansteps = new Set(allsteps);
    return [...cleansteps];
  }

  render() {

    const a = this.props.app;
    const b = this.props.batchData;
    const i = this.props.itemData;
    const w = this.props.widgetData;
    const g = this.props.groupData;
    
    const v = w.versions.find( x => x.versionKey === b.versionKey );
    
    const nc = this.ncData();
    
    const start = i.history.length > 0;
    const done = i.finishedAt !== false;
    const scrap = done ? i.history.find(x => x.type === 'scrap') : false;

    return (
      <AnimateWrap type='cardTrans'>
        <div className='section' key={i.serial}>
        
          <div className='titleSection'>
            <span>Units: {i.units}</span>
            <span>
              { !start ?
                <i className='fas fa-hourglass-start' aria-hidden='true' title='unstarted'></i>
                :
                done ? 
                <i className='fas fa-check-circle greenT' aria-hidden='true' title='finished'></i>
                : 
                <i className='fas fa-sync blueT' aria-hidden='true' title='in progress'></i>
              }
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
            <h1>
            { done ? scrap ? 
              <ScrapBox entry={scrap} />
              :
              <p>Finished <i>{moment(i.finishedAt).calendar()} by <UserNice id={i.finishedWho} /></i></p> 
              : 
              null }
            </h1>
            
            <br />
            
            <Tabs
              tabs={['Steps History', `${Pref.nonCon}s`, 'RMA']}
              wide={true}
              stick={false}
              hold={true}
              sessionTab='itemExPanelTabs'>
            
              <HistoryTable key={1} id={b._id} serial={i.serial} history={i.history} done={done} />
              
              <NCTable
                key={2}
                id={b._id}
                serial={i.serial}
                nc={nc}
                done={done}
                multi={false}
                ncOps={a.nonConOption}
                flowSteps={this.flowSteps()} />
              
              <RMALine
                key={3}
                id={b._id}
                bar={i.serial}
                data={i.rma}
                allRMA={b.cascade} />
              
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