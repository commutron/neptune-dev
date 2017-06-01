import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';

import Spin from '../../components/tinyUi/Spin.jsx';
import FindOps from './FindOps.jsx';

class DashView extends Component	{
  
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
      <FindOps
        orb={this.props.orb}
        snap={this.props.snap}
        brick={this.props.brick}
        org={this.props.org}
        admin={this.props.admin}
        power={this.props.power}
        users={this.props.users}
        app={this.props.app}
        allGroup={this.props.allGroup}
        allWidget={this.props.allWidget}
        allBatch={this.props.allBatch}
        allArchive={this.props.allArchive}
        />
    );
  }
}

export default createContainer( () => {
  let login = Meteor.userId() ? true : false;
  let usfo = login ? Meteor.user() : false;
  let active = usfo ? usfo.active : false;
  let org = usfo ? usfo.org : false;
  let admin = usfo ? usfo.admin : false;
  let power = usfo ? usfo.power : false;
  let path = Session.get('allData') ? 'allData' : 'liveData';
  let hotSub = login ? Meteor.subscribe(path) : false;
  if(!login) {
    return {
      login: Meteor.userId(),
    };
  }else if(!active) {
    return {
      ready: hotSub.ready(),
      login: Meteor.userId(),
    };
  }else{
    return {
      ready: hotSub.ready(),
      orb: Session.get('now'),
      bolt: Session.get('allData'),
      snap: Session.get('ikyView'),
      brick: Session.get('nowWanchor'),
      login: Meteor.userId(),
      org: org,
      admin: admin,
      power: power,
      users: Meteor.users.find().fetch(),
      app: AppDB.findOne({org: org}),
      allGroup: GroupDB.find({}, {sort: {group:1}}).fetch(),
      allWidget: WidgetDB.find({}, {sort: {widget:1}}).fetch(),
      allBatch: BatchDB.find({}, {sort: {batch:-1}}).fetch(),
      allArchive: ArchiveDB.find({}, {sort: {year:-1}}).fetch()
    };
  }
}, DashView);