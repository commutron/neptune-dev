import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';

import Spin from '../../components/tinyUi/Spin.jsx';
import WikiOps from './WikiOps.jsx';

export class WikiIndie extends Component {
  
  
  render() {
    
    if(!this.props.ready || !this.props.app) {
      return (
        <Spin />
        );
    }
    
    return (
      <WikiOps
        widget='home'
        wi='home'
        root={this.props.app.instruct}
        brick='' 
        indie={true} />
      );
  }
}

export default createContainer( () => {
  let login = Meteor.userId() ? true : false;
  let usfo = login ? Meteor.user() : false;
  let org = usfo ? usfo.org : false;
  if(!login) {
    return {
      ready: false,
      app: false
    };
  }else{
    return {
      //ready: hotSub.ready(),
      ready: true,
      app: AppDB.findOne({org: org}),
    };
  }
  
}, WikiIndie);