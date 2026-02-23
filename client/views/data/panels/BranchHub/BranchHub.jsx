import React, { useState, Fragment } from 'react';
import Pref from '/public/pref.js';
import { toast } from 'react-toastify';

import SlidesNested from '/client/layouts/TaskBars/SlidesNested';
import BranchLanding from './BranchLanding';
import BranchSlide from './BranchSlide';

const BranchHub = ({ 
  brancheS, app, specify 
}) => {
  
  // const [ selectedBr, selectedBrSet ] = useState(false);
  const oBrancheS = brancheS.filter( b => b.open );
  const menuList = oBrancheS.map( (br)=> [br.branch, !br.pro, br.common, ''] );
  
  const defaultSlide = specify ? 
    oBrancheS.findIndex( x => x.branch === specify ) : false;
  
  const canRun = Roles.userIsInRole(Meteor.userId(), 'run');
  const canEdt = Roles.userIsInRole(Meteor.userId(), 'edit');
  const canCrt = Roles.userIsInRole(Meteor.userId(), 'create');
  const canRmv = Roles.userIsInRole(Meteor.userId(), 'remove');
  
  return(
    <Fragment>
     
    <SlidesNested
      menuTitle={Pref.branches}
      menu={menuList}
      topPage={
        <BranchLanding
         
          canEdt={canEdt}
        />
      }
      defaultSlide={defaultSlide}
      collapse='Not Pro'
      textStyle='up'>
    
      {oBrancheS.map( (entry, index)=> {
        return(
          <BranchSlide
            key={index+entry.brKey}
            brData={entry}
            app={app}
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

export default BranchHub;