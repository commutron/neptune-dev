import { Meteor } from 'meteor/meteor';
import React from 'react';

const CookieBar = ({ groupData, widgetData, versionData, batchData, itemData, action }) => {
  
  function goPro(location) {
    Session.set('now', location);
    FlowRouter.go('/production');
  } 
  
  return(
    <div className='cookieRow'>
      {groupData && 
        <span className='cookieCrumb'>
          <button 
            className='cookie up'
            onClick={()=>FlowRouter.go('/data/group?request=' + groupData.alias)}>
            {groupData.alias.length < 10 ? 
              groupData.alias :
              groupData.alias.substring(0, 9) + '...'}
          </button>
        </span>}
      {widgetData && 
        <span className='cookieCrumb'>
          <span className='crumb'><i className='fas fa-chevron-right fa-lg'></i></span>
          <button 
            className='cookie up'
            onClick={()=>FlowRouter.go('/data/widget?request=' + widgetData.widget)}>
            {widgetData.widget.length < 16 ? 
              widgetData.widget :
              widgetData.widget.substring(0, 15) + '...'}
            {versionData && <i className='clean'> v.{versionData.version}</i>}
          </button>
        </span>}
      {/*versionData && 
        <span className='cookieCrumb'>
          <span className='crumb'><i className='fas fa-chevron-right fa-lg'></i></span>
          <button 
            className='cookie'
            onClick={()=>FlowRouter.go('/data/version?request=' + versionData.version)}>
            v.{versionData.version}
          </button>
        </span>*/}
      {batchData && 
        <span className='cookieCrumb'>
          <span className='crumb'><i className='fas fa-chevron-right fa-lg'></i></span>
          <button 
            className='cookie'
            onClick={()=>FlowRouter.go('/data/batch?request=' + batchData.batch)}>
            {batchData.batch}
          </button>
        </span>}
      {itemData && 
        <span className='cookieCrumb'>
          <span className='crumb'><i className='fas fa-chevron-right fa-lg'></i></span>
          <button 
            className='cookie'
            onClick={()=>FlowRouter.go('/data/serial?request=' + itemData.serial)}>
            {itemData.serial}
          </button>
        </span>}
      <span className='navSpacer'></span>
      {itemData ? 
        <span className='cookieCrumb'>
          <button 
            className='cookie'
            title='view in production'
            onClick={()=>goPro(itemData.serial)}>
            <i className='fas fa-paper-plane'></i>
          </button>
        </span>
      :
        batchData ? 
        <span className='cookieCrumb'>
          <button 
            className='cookie'
            title='view in production'
            onClick={()=>goPro(batchData.batch)}>
            <i className='fas fa-paper-plane'></i>
          </button>
        </span>
      :null}
     
    </div>
  );
};

export default CookieBar;