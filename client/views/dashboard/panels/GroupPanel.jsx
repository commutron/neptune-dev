import React, {Component} from 'react';
import SlideDownWrap from '/client/components/tinyUi/SlideDownWrap.jsx';
import moment from 'moment';

import UserNice from '../../../components/smallUi/UserNice.jsx';

export default class GroupPanel extends Component	{

  render() {

    let g = this.props.groupData;

    return (
      <SlideDownWrap>
        <div className='card' key={g.alias}>
          <div className='space cap edit'>
            <h1>{g.group}</h1>
            <h2>{g.alias}</h2>
            <hr />
            <p>created: {moment(g.createdAt).calendar()} by: <UserNice id={g.createdWho} /></p>
          </div>
        </div>
      </SlideDownWrap>
    );
  }
}