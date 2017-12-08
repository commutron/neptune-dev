import React, {Component} from 'react';
import moment from 'moment';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';

import Tabs from '../../../components/smallUi/Tabs.jsx';

import JumpText from '../../../components/tinyUi/JumpText.jsx';
import StepsProgress from '../../../components/bigUi/StepsProgress.jsx';
import NoteLine from '../../../components/smallUi/NoteLine.jsx';
import BlockNotes from '../../../components/smallUi/BlockNotes.jsx';
import TagsModule from '../../../components/bigUi/TagsModule.jsx';

export default class BatchCard extends Component	{

  render() {

    const b = this.props.batchData;
    const w = this.props.widgetData;
    const g = this.props.groupData;
    const a = this.props.app;
    
    const v = w.versions.find( x => x.versionKey === b.versionKey );
    
    const flow = w.flows.find( x => x.flowKey === b.river);
    const riverFlow = flow ? flow.flow : [];
    
    const flowAlt = w.flows.find( x => x.flowKey === b.riverAlt );
    const riverAltFlow = flowAlt ? flowAlt.flow : [];
    
    let iready = b.items.length === 0;
    
    let warn = b.blocks.filter( x => x.solve === false ).length;
    iready ? warn++ : null;
    const showWarn = warn === 0 ? 'hide' : 'alertCount';

    return (
      <AnimateWrap type='cardTrans'>
        <div className='section sidebar' key={b.batch}>
          
          <h1 className='centreText'>
            {b.batch}
            <i className='breath'></i>
            <i className={showWarn}>{warn}</i>
          </h1>
          
          {iready ?
            <h2 className='actionBox centreText yellow'>
              No {Pref.itemSerial}s created
            </h2>
          :null}
          
          {b.finishedAt !== false ?
            <h2 className='actionBox centreText green'>
              Finished: {moment(b.finishedAt).calendar()}
            </h2>
          :null}
          
          <Tabs
            tabs={['Info', 'Progress']}
            wide={true}
            stick={false}>
            
            <div className='space cap'>
              <TagsModule
                id={b._id}
                tags={b.tags}
                vKey={false}
                tagOps={a.tagOption} />
              <NoteLine entry={b.notes} id={b._id} versionKey={false} />
              <BlockNotes data={b.blocks} />
            </div>
            
            <div className='space cap'>
              <StepsProgress batchData={b} flow={riverFlow} flowAlt={riverAltFlow} mini={true} />
            </div>
            
          </Tabs>
  				
  			<br />
  
  			</div>
			</AnimateWrap>
    );
  }
}