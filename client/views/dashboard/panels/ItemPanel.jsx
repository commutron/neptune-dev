import React, {Component} from 'react';
import moment from 'moment';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';
import CreateTag from '/client/components/uUi/CreateTag.jsx';

import UserNice from '../../../components/smallUi/UserNice.jsx';

import Tabs from '../../../components/smallUi/Tabs.jsx';

import JumpText from '../../../components/tinyUi/JumpText.jsx';
import HistoryTable from '../../../components/tables/HistoryTable.jsx';
import NCTable from '../../../components/tables/NCTable.jsx';
import RMALine from '../../../components/smallUi/RMALine.jsx';
import ScrapBox from '../../../components/smallUi/ScrapBox.jsx';

export default class ItemPanel extends Component	{

  ncData() {
    let relevant = [];
    for (let value of this.props.batchData.nonCon) {
      if(value.serial === this.props.itemData.serial) {
        relevant.push(value);
      }else{null}
    }
    relevant.sort((n1, n2)=> {
      if (n1.ref < n2.ref) { return -1 }
      if (n1.ref > n2.ref) { return 1 }
      return 0;
    });
    return relevant;
  }

  render() {

    const a = this.props.app;
    const b = this.props.batchData;
    const i = this.props.itemData;
    const w = this.props.widgetData;
    const g = this.props.groupData;
    
    const v = w.versions.find( x => x.versionKey === b.versionKey );
    
    const nc = this.ncData();
  
    const done = i.finishedAt !== false;
    const scrap = done ? i.history.find(x => x.type === 'scrap') : false;

    return (
      <AnimateWrap type='cardTrans'>
        <div className='section' key={i.serial}>
        
          <div className='titleSection'>
            <span><JumpText title={b.batch} link={b.batch} /></span>
            <span><JumpText title={g.alias} link={g.alias} /></span>
            <span><JumpText title={w.widget} link={w.widget} /></span>
            <span><i className='clean'>v.</i>{v.version}</span>
            <span>
              { done ? 
                <i className='fa fa-check-circle greenT' aria-hidden='true'></i>
                : 
                <i className='fa fa-refresh blueT' aria-hidden='true'></i>
              }
            </span>
          </div>
        
          <div className='space cap'>
            <h1>
              {i.serial}
              <span className='rAlign'>
                units: {i.units}
              </span>
            </h1>
          
            { done ? scrap ? 
              <ScrapBox entry={scrap} />
              :
              <p>Finished <i>{moment(i.finishedAt).calendar()} by <UserNice id={i.finishedWho} /></i></p> 
              : 
              null
            }
            
            <br />
            
            <Tabs
              tabs={['Steps History', Pref.nonCon + 's', 'RMA']}
              wide={true}
              stick={false}>
            
              <HistoryTable key={1} id={b._id} serial={i.serial} history={i.history} done={done} />
              
              <NCTable
                key={2}
                id={b._id}
                serial={i.serial}
                nc={nc}
                done={done}
                multi={false}
                ncOps={a.nonConOption} />
              
              <RMALine key={3} id={b._id} bar={i.serial} data={i.rma} />
              
            </Tabs>
            
            <br />
          </div>
          
          <CreateTag when={i.createdAt} who={i.createdWho} whenN={i.createdAt} whoN={i.createdWho} />
  			</div>
			</AnimateWrap>
    );
  }
}