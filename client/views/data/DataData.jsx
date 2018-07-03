import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
//import Pref from '/client/global/pref.js';

import Spin from '../../components/uUi/Spin.jsx';
import DataViewOps from './DataViewOps.jsx';

class ExploreView extends Component	{
  
  render() {
    
    if(
      !this.props.appReady ||
      !this.props.coldReady || 
      !this.props.hotReady ||
      !this.props.user ||
      !this.props.app 
    ) {
      return(
        <div className='centreContainer'>
          <div className='centrecentre'>
            <Spin />
          </div>
        </div>
      );
    }
    
    return (
      <DataViewOps
        //orb={this.props.orb}
        user={this.props.user}
        org={this.props.org}
        users={this.props.users}
        app={this.props.app}
        allGroup={this.props.allGroup}
        allWidget={this.props.allWidget}
        allBatch={this.props.allBatch}
        allXBatch={this.props.allXBatch}
        hotBatch={this.props.hotBatch}
        hotXBatch={this.props.hotXBatch}
        view={this.props.view}
        request={this.props.request}
        specify={this.props.specify}
        subLink={this.props.subLink}
      />
    );
  }
}

export default withTracker( (props) => {
  
  //const orb = Session.get('now');
  let login = Meteor.userId() ? true : false;
  let user = login ? Meteor.user() : false;
  let org = user ? user.org : false;
  let active = user ? Roles.userIsInRole(Meteor.userId(), 'active') : false;
  const appSub = login ? Meteor.subscribe('appData') : false;
  const coldSub = login ? Meteor.subscribe('skinnyData') : false;
  
  const batchRequest = props.view === 'batch' ? props.request : false;
  let hotSubEx = Meteor.subscribe('hotDataEx', batchRequest);
  let hotBatch = BatchDB.findOne( { batch: batchRequest } ) || false;
  let hotXBatch = XBatchDB.findOne( { batch: batchRequest } ) || false;

  if( !login || !active ) {
    return {
      appReady: false,
      coldReady: false,
      hotReady: false
    };
  }else{
    return {
      appReady: appSub.ready(),
      coldReady: coldSub.ready(),
      hotReady: hotSubEx.ready(),
      user: user,
      org: org,
      users: Meteor.users.find( {}, { sort: { username: 1 } } ).fetch(),
      app: AppDB.findOne({org: org}),
      allGroup: GroupDB.find( {}, { sort: { group: 1 } } ).fetch(),
      allWidget: WidgetDB.find( {}, { sort: { widget: 1 } } ).fetch(),
      allBatch: BatchDB.find( {}, { sort: { batch: -1 } } ).fetch(),
      allXBatch: XBatchDB.find( {}, { sort: { batch: -1 } } ).fetch(),
      hotBatch: hotBatch,
      hotXBatch: hotXBatch,
      view: props.view,
      request: props.request,
      specify: props.specify
    };
  }
})(ExploreView);

    /*
    // Out of context serial search
    if( !isNaN(orb) && orb.length >= 9 && orb.length <= 10 ) {
  		const itemsBatch = BatchDB.findOne( { 'items.serial': orb } );
      if( itemsBatch ) {
        hotSub = Meteor.subscribe( 'hotData', itemsBatch.batch );
        hotBatch = itemsBatch;
      }else{
        Meteor.call( 'serialLookup', orb, ( err, reply )=>{
          err ? console.log( err ) : null;
          const serverItemsBatch = BatchDB.findOne( { batch: reply } );
          hotSub = Meteor.subscribe( 'hotData', reply );
          hotBatch = serverItemsBatch;
        });
      }
    }
    */