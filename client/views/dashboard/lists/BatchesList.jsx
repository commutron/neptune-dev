import React, {Component} from 'react';
import SlideDownWrap from '/client/components/tinyUi/SlideDownWrap.jsx';

import JumpButton from '../../../components/tinyUi/JumpButton.jsx';

export default class BatchesList extends Component	{

  render() {

    return (
      <SlideDownWrap>
        <div className='card'>
          { this.props.batchData.map( (entry, index)=> {
          const style = entry.finishedAt === false ? 'action clear wide greenT' : 'action clear wide';
            return (
              <JumpButton
                key={index}
                title={entry.batch} 
                sub={''}
                sty={style}
              />
            )})}
  			</div>
			</SlideDownWrap>
    );
  }
}