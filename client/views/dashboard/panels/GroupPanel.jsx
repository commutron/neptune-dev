import React, {Component} from 'react';
import moment from 'moment';
import SlideDownWrap from '/client/components/tinyUi/SlideDownWrap.jsx';

import UserNice from '../../../components/smallUi/UserNice.jsx';
import GroupForm from '../../../components/forms/GroupForm.jsx';
import WidgetNewForm from '../../../components/forms/WidgetNewForm.jsx';
import Remove from '../../../components/forms/Remove.jsx';

export default class GroupPanel extends Component	{

  render() {

    let g = this.props.groupData;

    return (
      <SlideDownWrap>
        <div className='card'>
          <div className='space cap edit'>
            <h1>{g.group}</h1>
            <h2>{g.alias}</h2>
            <hr />
            <p>created: {moment(g.createdAt).calendar()} by: <UserNice id={g.createdWho} /></p>
          </div>
          
          <GroupForm id={g._id} name={g.group} alias={g.alias} />
          <WidgetNewForm groupId={g._id} end={this.props.end} rootWI={this.props.root} />
          <Remove action='group' title={g.group} check={g.createdAt.toISOString()} entry={g._id} />
        </div>
      </SlideDownWrap>
    );
  }
}