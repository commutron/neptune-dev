import React, {Component} from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import CreateTag from '/client/components/uUi/CreateTag.jsx';
import Tabs from '../../../components/smallUi/Tabs.jsx';

import JumpText from '../../../components/tinyUi/JumpText.jsx';
import FlowsList from '../../../components/bigUi/FlowsList.jsx';
import VersionsList from '../../../components/smallUi/VersionsList.jsx';

export default class WidgetPanel extends Component	{

  render() {

    const g = this.props.groupData;
    const w = this.props.widgetData;
    const b = this.props.batchRelated;
    const a = this.props.app;

    return (
      <AnimateWrap type='cardTrans'>
        <div className='section' key={w.widget}>
        
          <div className='titleSection'>
            <span><JumpText title={g.alias} link={g.alias} /></span>
            <span className='up'>{w.widget}</span>
            <span>{w.describe}</span>
          </div>
          
          <div className='space cap edit'>
            <p>
              {b.map( (entry, index)=>{
                let ac = entry.active ? 'greenT' : null;
                return (
                  <JumpText key={index} title={entry.batch} link={entry.batch} sty={ac} />
                )})}
            </p>
            <br />
            
            <Tabs
              tabs={[Pref.version + 's', Pref.flow + 's']}
              wide={true}
              stick={false}>
              
              <VersionsList widgetData={w} />
              
              <FlowsList id={w._id} flows={w.flows} />
              
            </Tabs>
  
          </div>

          <CreateTag when={w.createdAt} who={w.createdWho} whenNew={w.updatedAt} whoNew={w.updatedWho} />
        </div>
      </AnimateWrap>
    );
  }
} 