import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';

import OverviewChart from './components/charts/OverviewChart.jsx';


class StartView extends Component	{
  
  render() {

    if(!this.props.login || !this.props.ready) {
      return (
        <div></div>
        );
    }

    return (
      <div className='space cap'>
        <p>user: {this.props.user}</p>
        <p>organization: {this.props.org}</p>
        <br />
        <div className='centre centreTrue'>
          <OverviewChart
            g={this.props.group}
            w={this.props.widget}
            b={this.props.batch} />
        </div>
      </div>
    );
  }
}

export default createContainer( () => {
  let login = Meteor.userId() ? true : false;
  let usfo = login ? Meteor.user() : false;
  let user = usfo ? usfo.username : false;
  let active = usfo ? Roles.userIsInRole(Meteor.userId(), 'active') : false;
  let org = usfo ? usfo.org : false;
  const sub = usfo ? Meteor.subscribe('skinnyData') : false;
  if(!login) {
    return {
      login: Meteor.userId(),
    };
  }else if(!active) {
    return {
      login: Meteor.userId()
    };
  }else{
    return {
      login: Meteor.userId(),
      ready: sub.ready(),
      user: user,
      org: org,
      group: GroupDB.find().fetch(),
      widget: WidgetDB.find().fetch(),
      batch: BatchDB.find().fetch()
    };
  }
}, StartView);