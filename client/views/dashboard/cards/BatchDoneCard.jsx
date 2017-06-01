import React, {Component} from 'react';
import SlideDownWrap from '/client/components/tinyUi/SlideDownWrap.jsx';

import JumpFind from '../../../components/smallUi/JumpFind.jsx';
// import StatsSimple from '../../../components/smallUi/StatsSimple.jsx';

//////////// component is for an obsolete structure. should be rewriten for -
/////////////////////// - new archive structure

export default class BatchDoneCard extends Component {

  render() {

    let b = this.props.batchData;

    return (
      <SlideDownWrap>
        <div className='card'>
          <div className='space'>
            <h1>{b.batch}</h1>
            <h3>
              <JumpFind title={this.props.group} sub='' />
              <JumpFind title={this.props.widgetData.wIdget} sub='' />
            </h3>
            <p>tags:</p>
            <br />
  
            <div className='centre greenT big'>
              <i className='clean'>{b.finishedAt.toLocaleString()}</i>
              <progress className='prog' value='1' max='1'></progress>
              <i className='clean'>Tracked Items: {b.items}</i>
              <i className='clean'>Tracked Steps: {b.steps}</i>
              <i className='clean'>Total Units: {b.units}</i>
            </div>
  
            {/*<StatsSimple report={b} />*/}
  
          </div>
  			</div>
			</SlideDownWrap>
    );
  }
}