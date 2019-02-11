import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
//import Pref from '/client/global/pref.js';

import { ScanListenerUtility } from '/client/components/utilities/ScanListener.js';
import { ScanListenerOff } from '/client/components/utilities/ScanListener.js';
import InboxToast from '/client/components/utilities/InboxToast.js';
import Spin from '/client/components/uUi/Spin.jsx';
import ProductionFindOps from './ProductionFindOps.jsx';

class ProdData extends Component	{

  componentDidUpdate(prevProps) {
    InboxToast(prevProps, this.props);
  }

  render() {
    
    if(
       !this.props.appReady ||
       !this.props.usersReady ||
       !this.props.coldReady || 
       !this.props.hotReady ||
       !this.props.user ||
       !this.props.app
      ) {
      return (
        <div className='centreContainer'>
          <div className='centrecentre'>
            <Spin />
          </div>
        </div>
      );
    }
    
    ScanListenerUtility(this.props.user);
    
    return (
      <ProductionFindOps
        orb={this.props.orb}
        anchor={this.props.anchor}
        user={this.props.user}
        org={this.props.org}
        users={this.props.users}
        app={this.props.app}
        allGroup={this.props.allGroup}
        allWidget={this.props.allWidget}
        allBatch={this.props.allBatch}
        allxBatch={this.props.allxBatch}
        hotBatch={this.props.hotBatch}
        hotxBatch={this.props.hotxBatch}
      />
    );
  }
  componentWillUnmount() {
    ScanListenerOff();
  }
}

export default withTracker( () => {
  
  const orb = Session.get('now');
  let login = Meteor.userId() ? true : false;
  let user = login ? Meteor.user() : false;
  let org = user ? user.org : false;
  let active = user ? Roles.userIsInRole(Meteor.userId(), 'active') : false;
  const appSub = login ? Meteor.subscribe('appData') : false;
  const usersSub = login ? Meteor.subscribe('usersData') : false;
  const coldSub = login ? Meteor.subscribe('thinData') : false;

  let hotSub = Meteor.subscribe('hotDataPlus', false);
  let hotBatch = false;
  let hotxBatch = false;
  
  if( coldSub ) {
    
    if( !isNaN(orb) && orb.length === 5 ) {
      const oneBatch = BatchDB.findOne( { batch: orb } );
      const onexBatch = XBatchDB.findOne( { batch: orb } );
      
      if( oneBatch ) {
        hotSub = Meteor.subscribe( 'hotDataPlus', orb );
        hotBatch = oneBatch;
      
      }else if(onexBatch) {
        hotSub = Meteor.subscribe( 'hotDataPlus', orb );
        hotxBatch = onexBatch;
      
      }else{
        null;
      }
    }
    else if( !isNaN(orb) && orb.length >= 9 && orb.length <= 10 ) {
      
  		const itemsBatch = BatchDB.findOne( { 'items.serial': orb } );
      
      if( itemsBatch ) {
        hotSub = Meteor.subscribe( 'hotDataPlus', itemsBatch.batch );
        hotBatch = itemsBatch;
      
      }else{
        Meteor.call( 'serialLookup', orb, ( err, reply )=>{
          err && console.log(err);
          const serverItemsBatch = BatchDB.findOne( { batch: reply } );
          hotSub = Meteor.subscribe( 'hotDataPlus', reply );
          hotBatch = serverItemsBatch;
        });
      }
    
    }else{
      null;
    }
  
  }else{
    null;
  }
  
  if( !login ) {
    return {
      appReady: false,
      usersReady: false,
      coldReady: false,
      hotReady: false
    };
  }else if( !active ) {
    return {
      appReady: appSub.ready(),
      usersReady: usersSub.ready(),
      coldReady: coldSub.ready(), 
      hotReady: hotSub.ready(),
    };
  }else{
    return {
      appReady: appSub.ready(),
      usersReady: usersSub.ready(),
      coldReady: coldSub.ready(),
      hotReady: hotSub.ready(),
      orb: orb,
      anchor: Session.get( 'nowWanchor' ),
      user: user,
      org: org,
      users: Meteor.users.find( {}, { sort: { username: 1 } } ).fetch(),
      app: AppDB.findOne({org: org}),
      allGroup: GroupDB.find( {}, { sort: { group: 1 } } ).fetch(),
      allWidget: WidgetDB.find( {}, { sort: { widget: 1 } } ).fetch(),
      allBatch: BatchDB.find( {}, { sort: { batch: -1 } } ).fetch(),
      allxBatch: XBatchDB.find( {}, { sort: { batch: -1 } } ).fetch(),
      hotBatch: hotBatch,
      hotxBatch: hotxBatch,
    };
  }
})(ProdData);