import React, {Component} from 'react';
import moment from 'moment';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';

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

    const status = done ? <i className='greenT'>Finished</i> : <i className='blueT'>In Process</i>;

    const end = done ? scrap ? 
                <ScrapBox entry={scrap} />
                :
                <i className='clean'>{moment(i.finishedAt).calendar()} by <UserNice id={i.finishedWho} /></i> 
                : 
                <i></i>;

    return (
      <AnimateWrap type='cardTrans'>
        <div className='card' key={i.serial}>
          <div className='space cap'>
            <h1>
              {i.serial}
              <span className='rAlign'>
                {status}
              </span>
            </h1>
            
            <hr />
          
            <div className='space comfort'>
  
              
              <span><h2><JumpText title={b.batch} link={b.batch} /></h2></span>
              
              <hr />
              
              <span><h2><JumpText title={g.alias} link={g.alias} /></h2></span>
              
              
              <hr />
              
              <span><h2>
                <JumpText title={w.widget} link={w.widget} />
                {Pref.version}: {v.version}
              </h2></span>
              
              <hr />
              
              <span><h2>units: {i.units}</h2></span>
            
            </div>
            
            
            <hr />
            
            <p>created: {moment(i.createdAt).calendar()} by <UserNice id={i.createdWho} /></p>
              
            <p>finished: {end}</p>
            
            <hr />
            
            <Tabs
              tabs={['Steps History', Pref.nonCon + 's', 'RMA']}
              stick={false}>
            
              <HistoryTable key={1} id={b._id} serial={i.serial} history={i.history} done={done} />
              
              <NCTable key={2} id={b._id} serial={i.serial} nc={nc} done={done}  multi={false} />
              
              <RMALine key={3} id={b._id} bar={i.serial} data={i.rma} />
              
            </Tabs>
  
            <br />
          </div>
  			</div>
			</AnimateWrap>
    );
  }
}