import React, {Component} from 'react';
import moment from 'moment';
import SlideDownWrap from '/client/components/tinyUi/SlideDownWrap.jsx';
import Pref from '/client/global/pref.js';

import JumpFind from '../../../components/smallUi/JumpFind.jsx';
import Progress from '../../../components/bigUi/Progress.jsx';
import NoteLine from '../../../components/smallUi/NoteLine.jsx';
import ShortNotes from '../../../components/smallUi/ShortNotes.jsx';

export default class BatchCard extends Component	{

  render() {

    const b = this.props.batchData;
    const w = this.props.widgetData;
    const g = this.props.groupData;
    
    const v = w.versions.find( x => x.versionKey === b.versionKey );
    
    const flow = w.flows.find( x => x.flowKey === b.river);

    return (
      <SlideDownWrap>
        <div className='card'>
          <div className='space cap'>
            <h1>{b.batch}</h1>
            <hr />
            <h2><JumpFind title={g.alias} sub='' /><JumpFind title={w.widget} sub='' /></h2>
            
            <h3>{Pref.version}: {v.version}</h3>
            
            {b.finishedAt !== false ?
              <p>finished: {moment(b.finishedAt).calendar()}</p>
            : null}
    
            <NoteLine entry={b.notes} id={b._id} versionKey={false} />
            
            <NoteLine entry={v.notes} id={w._id} versionKey={v.versionKey} />
            
            <ShortNotes shData={b.short} />
  
          </div>
  				
  				<Progress batchData={b} flow={flow} detail={false} />
  				
  				<br />
  
  			</div>
			</SlideDownWrap>
    );
  }
}