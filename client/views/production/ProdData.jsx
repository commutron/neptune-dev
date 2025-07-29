import React, { useMemo } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Pref from '/client/global/pref.js';

import { SpinWrap } from '/client/components/tinyUi/Spin';
import { branchesOpenSort } from '/client/utility/Arrays.js';
import ProductionFindOps from './ProductionFindOps';
import { ProWindow } from '/client/layouts/ProLayout';

const ProdData = ({
  coldReady, hotReady,
  orb, eqS, anchor, user, time, org, users, app,
  allEquip, allMaint,
  allGroup, allWidget, allVariant,
  allxBatch,
  hotxBatch, hotxSeries, hotxRapids
})=> {
  
  const activeUsers = useMemo( ()=> users?.filter( x => 
                        Roles.userIsInRole(x._id, 'active') === true &&
                        Roles.userIsInRole(x._id, 'readOnly') === false),
                        [users]);
  
  const brancheS = useMemo( ()=> branchesOpenSort(app?.branches || []), [app]);
  
  const canMulti = useMemo( ()=> Roles.userIsInRole(Meteor.userId(), 'multitask_time'), [user]);
  const canSerial = useMemo( ()=> Roles.userIsInRole(Meteor.userId(), ['admin', 'kitting']), [user]);
    
  const plainBatchS = useMemo( ()=> {
          const plain = [];
          if(canMulti && allxBatch?.length > 0) {
            for(let b of allxBatch) {
              plain.push(b.batch);
            }
          }
          return plain.sort((b1, b2)=> b1 < b2 ? 1 : b1 > b2 ? -1 : 0);
        }, [coldReady]);
    
  if( !coldReady || !hotReady || !user || !app ) {
    return( 
      <ProWindow 
        brancheS={[]} 
        plainBatchS={[]}
        user={null}
        allEquip={[]}
      >
        <SpinWrap />
      </ProWindow>
    );
  }
  
  return (
    <ProductionFindOps
      orb={orb}
      eqS={eqS}
      anchor={anchor}
      user={user}
      time={time}
      org={org}
      canMulti={canMulti}
      canSerial={canSerial}
      activeUsers={activeUsers}
      plainBatchS={plainBatchS}
      brancheS={brancheS}
      app={app}
      allEquip={allEquip}
      allMaint={allMaint}
      allGroup={allGroup}
      allWidget={allWidget}
      allVariant={allVariant}
      allxBatch={allxBatch}
      hotxBatch={hotxBatch}
      hotxSeries={hotxSeries}
      hotxRapids={hotxRapids}
    />
  );
};


export default withTracker( () => {

  const orb = Session.get('now');
  const eqS = Session.get('nowSV');
  
  let login = Meteor.userId() ? true : false;
  let user = login ? Meteor.user() : false;
  let org = user ? user.org : false;
  let readOnly = user ? Roles.userIsInRole(Meteor.userId(), 'readOnly') : false;
  const coldSub = login ? Meteor.subscribe('thinData') : false;
  
  let hotxBatch = false;
  let hotxSeries = false;
  let hotxRapids = [];
  
  let keyMatch = false;
  let subBatch = false;
  let subEquip = false;
  let subMaint = false;
  
  if( coldSub && !subBatch ) {
    
    if( Pref.regex5.test(orb) ) {

      onexBatch = XBatchDB.find({ batch: orb },{fields:{'batch':1}},{limit:1}).count();
      if(onexBatch) {
        keyMatch = true;
        subBatch = orb;
      }else{
        subBatch = orb;
      }
      hotxBatch = XBatchDB.findOne({ batch: orb });
      hotxSeries = XSeriesDB.findOne({ batch: orb });
      hotxRapids = XRapidsDB.find({ extendBatch: orb }).fetch();
      
    }else if( Pref.regexSN.test(orb) ) {
  		
      const itemsxSeries = XSeriesDB.findOne( { 'items.serial': orb } );
      if( itemsxSeries ) {
        hotxSeries = itemsxSeries;
        hotxBatch = XBatchDB.findOne( { batch: itemsxSeries.batch } );
        hotxRapids = XRapidsDB.find( { extendBatch: itemsxSeries.batch } ).fetch();
        keyMatch = true;
        subBatch = itemsxSeries.batch;
      }else{
        subBatch = orb;
      }
    }else if(orb?.startsWith('EqFx')) {
      subEquip = eqS;
    }else if(orb?.startsWith('Eq')) {
      subMaint = eqS;
    }else{
      null;
    }
  }

  const hotSub = subEquip ? Meteor.subscribe('hotProEquip', subEquip) :
                 subMaint ? Meteor.subscribe('hotProMaint', subMaint) :
                  Meteor.subscribe('hotDataPlus', subBatch, keyMatch);

  if( !login ) {
    return {
      coldReady: false,
      hotReady: false
    };
  }else if( readOnly ) {
    FlowRouter.go('/');
    return {
      coldReady: coldSub.ready(), 
      hotReady: hotSub.ready(),
    };
  }else{
    return {
      coldReady: coldSub.ready(),
      hotReady: hotSub.ready(),
      orb: orb,
      eqS: eqS,
      anchor: Session.get( 'nowWanchor' ),
      user: user,
      org: org,
      users: Meteor.users.find( {}, { sort: { username: 1 } } ).fetch(),
      time: TimeDB.findOne({stopTime: false}),
      app: AppDB.findOne({org: org}),
      allEquip: EquipDB.find( {}, { sort: { alias: 1 } } ).fetch(),
      allMaint: MaintainDB.find( {}, { sort: { name: -1 } } ).fetch(),
      allGroup: GroupDB.find( {}, { sort: { group: 1 } } ).fetch(),
      allWidget: WidgetDB.find( {}, { sort: { widget: 1 } } ).fetch(),
      allVariant: VariantDB.find( {} ).fetch(),
      allxBatch: XBatchDB.find( {}, { sort: { batch: -1 } } ).fetch(),
      hotxBatch: hotxBatch,
      hotxSeries: hotxSeries,
      hotxRapids: hotxRapids
    };
  }
})(ProdData);