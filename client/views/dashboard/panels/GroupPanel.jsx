import React, {Component} from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import moment from 'moment';

import UserNice from '../../../components/smallUi/UserNice.jsx';

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
            <p>created: {moment(g.createdAt).calendar()} by: <UserNice id={g.createdWho} /></p>
          </div>
        </div>
      </AnimateWrap>
    );
  }
}