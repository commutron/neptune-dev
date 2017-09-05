import React, {Component} from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';

import JumpButton from '../../../components/tinyUi/JumpButton.jsx';

export default class BatchesList extends Component	{

  render() {

    return (
      <AnimateWrap type='cardTrans'>
        <div className='section sidebar' key={1}>
          { this.props.batchData.map( (entry, index)=> {
          const style = entry.finishedAt === false ? 'jumpBar gMark' : 'jumpBar';
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