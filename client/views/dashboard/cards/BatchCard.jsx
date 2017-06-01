import React, {Component} from 'react';
import moment from 'moment';
import SlideDownWrap from '/client/components/tinyUi/SlideDownWrap.jsx';
import Pref from '/client/global/pref.js';

import JumpFind from '../../../components/smallUi/JumpFind.jsx';
import Progress from '../../../components/bigUi/Progress.jsx';
import ScrapList from '../../../components/smallUi/ScrapList.jsx';
import NoteLine from '../../../components/smallUi/NoteLine.jsx';
import ShortNotes from '../../../components/smallUi/ShortNotes.jsx';

export default class BatchCard extends Component	{

  /// this could be rewritten using the es5 .filter() method
  filter() {
    const data = this.props.batchData.items;
    let scList = [];
    data.map( (entry)=>{
      // check history for scraps
      if(this.props.batchData.scrap > 0) {
        for(let value of entry.history) {
          // scraps
          if(value.type === 'scrap') {
            scList.push(entry.barcode);
          // other
          }else{null}
        }
      }
    });
    return scList;
  }

  render() {

    const b = this.props.batchData;
    const w = this.props.widgetData;
    const g = this.props.groupData;
    
    const v = w.versions.find( x => x.versionKey === b.versionKey );
    
    const flow = w.flows.find( x => x.flowKey === b.river);
    
    let filter = this.filter();

    return (
      <SlideDownWrap>
        <div className='card'>
          <div className='space cap'>
            <h1>{b.batch}</h1>
            <hr />
            <h2><JumpFind title={g.group} sub='' /><JumpFind title={w.widget} sub='' /></h2>
            
            <h3>{Pref.version}: {v.version}</h3>
            
            {b.finishedAt !== false ?
              <p>finished: {moment(b.finishedAt).calendar()}</p>
            : null}
            
            <ScrapList data={filter} count={b.scrap} />
    
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