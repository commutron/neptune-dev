import React, {Component} from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';

import JumpButton from '../../../components/tinyUi/JumpButton.jsx';

export default class BatchesList extends Component	{

  render() {

    return (
      <AnimateWrap type='cardTrans'>
        <div className='card' key={1}>
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
			</AnimateWrap>
    );
  }
}