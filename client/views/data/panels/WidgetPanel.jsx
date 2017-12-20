import React, {Component} from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import CreateTag from '/client/components/uUi/CreateTag.jsx';
import Tabs from '../../../components/smallUi/Tabs.jsx';

import JumpText from '../../../components/tinyUi/JumpText.jsx';
import FlowTable from '../../../components/tables/FlowTable.jsx';
import VersionTable from '../../../components/tables/VersionTable.jsx';
import NonConRate from '../../../components/charts/NonConRate.jsx';

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
          
          <div className='space edit'>
            
            <br />
            
            <Tabs
              tabs={[Pref.version + 's', Pref.flow + 's', Pref.nonCon + 's']}
              wide={true}
              stick={false}>
              
              <VersionTable widgetData={w} />
              
              <FlowTable id={w._id} flows={w.flows} app={a} />
              
              <NonConRate batches={Array.from( b, x => x.batch )} />
              
            </Tabs>
  
          </div>

          <CreateTag
            when={w.createdAt}
            who={w.createdWho}
            whenNew={w.updatedAt}
            whoNew={w.updatedWho}
            dbKey={w._id} />
        </div>
      </AnimateWrap>
    );
  }
} 