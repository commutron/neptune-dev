import React, {Component} from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';

import JumpText from '../../../components/tinyUi/JumpText.jsx';
// import StatsSimple from '../../../components/smallUi/StatsSimple.jsx';

//////////// component is for an obsolete structure. should be rewriten

export default class BatchDoneCard extends Component {

  render() {

    let w = this.props.widgetData;
    let b = this.props.batchData;

    return (
      <AnimateWrap type='cardTrans'>
        <div className='card' key={1}>
          <div className='space'>
            <h1>{b.batch}</h1>
            <h3>
              <JumpText title={this.props.group} link={this.props.group} />
              <JumpText title={w.widget} link={w.widget} />
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
			</AnimateWrap>
    );
  }
}