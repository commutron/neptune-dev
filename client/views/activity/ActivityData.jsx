import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import Spin from '../../components/uUi/Spin.jsx';
import ActivityWrap from './ActivityWrap.jsx';

class View extends Component	{
  /*
  componentWillUnmount() {
    this.props.sub.stop();
  }
  */
  
  render() {
    
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

export default withTracker( () => {
  let login = Meteor.userId() ? true : false;
  let user = login ? Meteor.user() : false;
  let name = user ? user.username : false;
  let active = user ? Roles.userIsInRole(Meteor.userId(), 'active') : false;
  let org = user ? user.org : false;
  const sub = login ? Meteor.subscribe('shaddowData') : false;
  if(!login || !active) {
    return {
      ready: false
    };
  }else{
    return {
      login: Meteor.userId(),
      sub: sub,
      ready: sub.ready(),
      user: name,
      org: org,
      app: AppDB.findOne({org: org}),
      group: GroupDB.find().fetch(),
      widget: WidgetDB.find().fetch(),
      batch: BatchDB.find().fetch()
    };
  }
})(View);