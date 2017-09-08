import React, {Component} from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import CreateTag from '/client/components/uUi/CreateTag.jsx';

export default class GroupPanel extends Component	{

  render() {

    let g = this.props.groupData;

    return (
      <AnimateWrap type='cardTrans'>
        <div className='section' key={g.alias}>
        
          <div className='titleSection'>
            <span className='cap'>{g.group}</span>
            <span className='up'>{g.alias}</span>
          </div>
          
          <div className='space cap edit'>
          </div>
          
          <CreateTag when={g.createdAt} who={g.createdWho} />
        </div>
      </AnimateWrap>
    );
  }
}