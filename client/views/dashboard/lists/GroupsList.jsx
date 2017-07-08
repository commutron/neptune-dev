import React, {Component} from 'react';
import SlideDownWrap from '/client/components/tinyUi/SlideDownWrap.jsx';

import JumpButton from '../../../components/tinyUi/JumpButton.jsx';
import GroupForm from '../../../components/forms/GroupForm.jsx';

export default class GroupsList extends Component	{

  render() {

    return (
      <SlideDownWrap>
        <div className='card'>
          { this.props.groupData.map( (entry, index)=> {
            return (
              <JumpButton
                key={index}
                title={entry.group}
                sub=''
                sty='action clear wide'
              />
            )})}
          <br />
          <br />
          <GroupForm id='new' name='new' alias='new' />
  			</div>
			</SlideDownWrap>
    );
  }
}