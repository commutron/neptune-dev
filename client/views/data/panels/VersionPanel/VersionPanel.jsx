import React from 'react';
// import moment from 'moment';
import Pref from '/client/global/pref.js';

import CreateTag from '/client/components/uUi/CreateTag.jsx';
import Tabs from '/client/components/bigUi/Tabs/Tabs.jsx';
import TagsModule from '/client/components/bigUi/TagsModule.jsx';
import NoteLine from '/client/components/smallUi/NoteLine.jsx';
//import WatchButton from '/client/components/bigUi/WatchModule/WatchModule.jsx';

const VersionPanel = ({ 
  versionData, widgetData, 
  groupData, batchRelated, 
  app, user
})=> {
  
  const v = versionData;
  const w = widgetData;
  const g = groupData;
  const b = batchRelated;
  const a = app;

  const vAssmbl = v.assembly.sort((p1, p2)=> {
                  if (p1.component < p2.component) { return -1 }
                  if (p1.component > p2.component) { return 1 }
                  return 0;
                });
  
  function removeComp(id, vKey, compPN) {
    const check = confirm('Are you sure you want to remove this ' + Pref.comp + '?');
    if(!check) {
      null;
    }else{
      Meteor.call('pullComp', id, vKey, compPN, (error)=>{
        if(error)
          console.log(error);
      });
    }
  }
  
  function downloadComp(id, vKey) {
    Meteor.call('componentExport', id, vKey, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        const name = w.widget + "_" + v.version;
        const outputLines = reply.join('\n');
        const outputComma = reply.toString();
        toast(
          <a href={`data:text/plain;charset=UTF-8,${outputLines}`}
          download={name + ".txt"}>Download seperated by new lines</a>
          , {autoClose: false, closeOnClick: false}
        );
        toast(
          <a href={`data:text/plain;charset=UTF-8,${outputComma}`}
          download={name + ".csv"}>Download seperated by commas</a>
          , {autoClose: false, closeOnClick: false}
        );
      }
    });
  }
  
  return(
    <div className='section'>
            
      <Tabs
        tabs={[Pref.version + 's', 'Components']}
        wide={true}
        stick={false}
        hold={true}
        sessionTab='versionExPanelTabs'>
        
        <div>
          <div className='oneTwoThreeContainer'>
            <div className='oneThirdContent'>
              
              <p>Status: <i className='big'>{v.live ? 'Live' : 'Archived'}</i></p>
            
              <TagsModule
                id={w._id}
                tags={v.tags}
                vKey={v.versionKey}
                tagOps={a.tagOption} />
              
              <p>
                <a className='clean wordBr' href={v.wiki} target='_blank'>{v.wiki}</a>
              </p>
              
              <p className='numFont'>default units: {v.units}</p>
              
            </div>
            
            <div className='twoThirdsContent'>
              <NoteLine
                entry={v.notes}
                id={w._id}
                versionKey={v.versionKey}
                plain={false}
                small={false} />
            </div>
            
          </div>
          
        </div>
          
        
        <div className='space'>
          <h3>{Pref.comp}s: {v.assembly.length}</h3>
          <dl>
            {vAssmbl.map((entry, index)=>{
              return(
                <dt key={index} className='letterSpaced'>
                  {entry.component}
                  <button
                    className='miniAction redT'
                    onClick={()=>removeComp(w._id, v.versionKey, entry.component)}
                    disabled={!Roles.userIsInRole(Meteor.userId(), 'remove')}>
                  <i className='fas fa-times fa-fw'></i></button>
                </dt>
            )})}
          </dl>
          <br />
          <button
            className='transparent'
            title='Download Parts List'
            onClick={()=>downloadComp(w._id, v.versionKey)}>
            <label className='navIcon actionIconWrap'>
              <i className='fas fa-download fa-fw'></i>
              <span className='actionIconText blackT'>Download</span>
            </label>
          </button>
        </div>
        
      </Tabs>


      <CreateTag
        when={v.createdAt}
        who={v.createdWho}
        whenNew={v.updatedAt}
        whoNew={v.updatedWho}
        dbKey={v.versionKey} />
    </div>
  );
};

export default VersionPanel;