import React, { useState, Fragment } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import SlidesNested from '/client/layouts/TaskBars/SlidesNested';
import GroupLanding from './GroupLanding';
import GroupSlide from './GroupSlide';
import GroupForm from '/client/components/forms/Group/GroupForm';
import GroupEmails from '/client/components/forms/Group/GroupEmails';
import WidgetNew from '/client/components/forms/WidgetForm';

const AllGroups = ({ 
  groupData, widgetData, variantData, batchDataX, app, specify 
}) => {
  
  const [ selectedGroup, selectedGroupSet ] = useState(false);
  
  const openActions = (model, select)=> {
    selectedGroupSet(select);
    if(model === 'groupform') {
      document.getElementById('multifuncion_group_form')?.showModal();
    }else if(model === 'groupemail') {
      document.getElementById('multifuncion_gemail_form')?.showModal();
    }else if(model === 'widgetform') {
      const dialog = document.getElementById('multi_widget_new_form');
      dialog?.showModal();
    }
  };
  
  function handleInterize(gID) {
    Meteor.call('internalizeGroup', gID, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        toast.success('Saved');
      }else{
        toast.warning('Not internalized');
      }
    });
  }
  function handleHibernate(gID) {
    Meteor.call('hibernateGroup', gID, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        toast.success('Saved');
      }else{
        toast.warning(`Not ${Pref.hibernatated}. Live ${Pref.variants} found`);
      }
    });
  }
  function handleEnableEmail(gID, val) {
    Meteor.call('groupEmailOptIn', gID, val, (error, reply)=>{
      error && console.log(error);
      // reply && toast.success('Saved');
    });
  }
  
  const inter = groupData.filter( g => g.internal );
  
  const groupS = groupData.sort((g1, g2)=>
                  g1.alias < g2.alias ? -1 : g1.alias > g2.alias ? 1 : 0 );
                  
  const menuList = groupS.map( (entry)=> {
                    const strk = entry.hibernate;
                    let clss = entry.internal ? ' intrBlue' : '';
                    let sub = entry.internal ? 'Internal' : '';
                    return [entry.alias, strk, sub, clss];
                  });
  
  const defaultSlide = specify ? 
    groupS.findIndex( x => x.alias === specify ) : false;
  
  const canRun = Roles.userIsInRole(Meteor.userId(), 'run');
  const canEdt = Roles.userIsInRole(Meteor.userId(), 'edit');
  const canCrt = Roles.userIsInRole(Meteor.userId(), 'create');
  const canRmv = Roles.userIsInRole(Meteor.userId(), 'remove');
  
  return(
    <Fragment>
     <GroupForm
        gObj={selectedGroup}
        clearOnClose={()=>selectedGroupSet(false)}
        rootURL={app.instruct}
      />
      <GroupEmails
        gObj={selectedGroup}
        clearOnClose={()=>selectedGroupSet(false)}
      />
      <WidgetNew 
        groupId={selectedGroup?._id || null}
        clearOnClose={()=>selectedGroupSet(false)}
      />
     
    <SlidesNested
      menuTitle={Pref.Group + 's'}
      menu={menuList}
      topPage={
        <GroupLanding
          groupData={groupData}
          widgetData={widgetData}
          variantData={variantData}
          openActions={openActions}
          canEdt={canEdt}
        />
      }
      defaultSlide={defaultSlide}
      collapse={Pref.hibernatated}
      textStyle='up'>
    
      {groupS.map( (entry, index)=> {
        let widgetsList = widgetData.filter(x => x.groupId === entry._id);
        return(
          <GroupSlide
            key={index+entry._id}
            groupData={entry}
            widgetsList={widgetsList}
            batchDataX={batchDataX}
            app={app}
            inter={!inter || inter.length < Pref.interMax || inter.find( x=> x._id === entry._id )}
            openActions={openActions}
            handleInterize={handleInterize}
            handleHibernate={handleHibernate}
            handleEnableEmail={handleEnableEmail}
            canRun={canRun}
            canEdt={canEdt}
            canCrt={canCrt}
            canRmv={canRmv}
          />
        )})}
    </SlidesNested>
    </Fragment>
  );
};

export default AllGroups;