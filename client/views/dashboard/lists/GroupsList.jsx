import React, {Component} from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';

import JumpButton from '../../../components/tinyUi/JumpButton.jsx';

export default class GroupsList extends Component	{

  render() {

    return (
      <AnimateWrap type='cardTrans'>
        <div className='section sidebar' key={1}>
          { this.props.groupData.map( (entry, index)=> {
            return (
              <JumpButton
                key={index}
                title={entry.group}
                sub=''
                sty='jumpBar'
              />
            )})}
  			</div>
			</AnimateWrap>
    );
  }
}