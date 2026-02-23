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
  
  const menuList = brancheS.map( (br)=> {
                    const strk = !br.open;
                    const sub = br.pro ? 'Pro' : '';
                    return [br.common, strk, sub, ''];
                  });
  
  const defaultSlide = specify ? 
    brancheS.findIndex( x => x.common === specify ) : false;
  
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
      collapse='Closed'
      textStyle='up'>
    
      {brancheS.map( (entry, index)=> {
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