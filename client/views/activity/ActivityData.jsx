import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';

import Spin from '../../components/tinyUi/Spin.jsx';
import ActivityWrap from './ActivityWrap.jsx';

class View extends Component	{
  componentWillUnmount() {
    this.props.sub.stop();
  }
  
  render() {

    if(!this.props.login) {
      return (
        <div></div>
        );
    }
    
    if(!this.props.ready || !this.props.app) {
      return (
        <Spin />
        );
    }

    return (
      <ActivityWrap 
        g={this.props.group}
        w={this.props.widget}
        b={this.props.batch}
        a={this.props.app} />
    );
  }
}

export default createContainer( () => {
  let login = Meteor.userId() ? true : false;
  let usfo = login ? Meteor.user() : false;
  let user = usfo ? usfo.username : false;
  let active = usfo ? Roles.userIsInRole(Meteor.userId(), 'active') : false;
  let org = usfo ? usfo.org : false;
  const sub = usfo ? Meteor.subscribe('shaddowData') : false;
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
      sub: sub,
      ready: sub.ready(),
      user: user,
      org: org,
      app: AppDB.findOne({org: org}),
      group: GroupDB.find().fetch(),
      widget: WidgetDB.find().fetch(),
      batch: BatchDB.find().fetch()
    };
  }
}, View);