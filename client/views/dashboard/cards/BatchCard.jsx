import React, {Component} from 'react';
import moment from 'moment';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';

import JumpText from '../../../components/tinyUi/JumpText.jsx';
import Progress from '../../../components/bigUi/Progress.jsx';
import NoteLine from '../../../components/smallUi/NoteLine.jsx';
import BlockNotes from '../../../components/smallUi/BlockNotes.jsx';

export default class BatchCard extends Component	{

  render() {

    const b = this.props.batchData;
    const w = this.props.widgetData;
    const g = this.props.groupData;
    
    const v = w.versions.find( x => x.versionKey === b.versionKey );
    
    const flow = w.flows.find( x => x.flowKey === b.river);
    
    let iready = b.items.length === 0;
    
    let warn = b.blocks.filter( x => x.solve === false ).length;
    iready ? warn++ : null;
    const showWarn = warn === 0 ? 'hide' : 'alertCount clean rAlign';

    return (
      <AnimateWrap type='cardTrans'>
        <div className='card' key={b.batch}>
          <div className='space cap'>
            <h1>
              <JumpText title={b.batch} link={b.batch} />
              <i className={showWarn}>
                {warn}
              </i>
            </h1>
            <hr />
            
            {/*
            <h2>
              <JumpText title={g.alias} link={g.alias} />
              <JumpText title={w.widget} link={w.widget} />
            </h2>
            <h3>{Pref.version}: {v.version}</h3>
            */}
            
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
    
            <NoteLine entry={b.notes} id={b._id} versionKey={false} />
            
            <NoteLine entry={v.notes} id={w._id} versionKey={v.versionKey} />
            
            <BlockNotes data={b.blocks} />
  
          </div>
          
  				<Progress batchData={b} flow={flow} detail={false} />
  				
  				<br />
  
  			</div>
			</AnimateWrap>
    );
  }
}