import React from 'react';
import Pref from '/client/global/pref.js';

import CreateTag from '/client/components/uUi/CreateTag.jsx';

import VersionForm from '../forms/VersionForm.jsx';
import { VersionRemove } from '../forms/VersionForm.jsx';
import CompForm from '../forms/CompForm.jsx';
import NoteLine from '../smallUi/NoteLine.jsx';
import TagsModule from '../bigUi/TagsModule.jsx';

const VersionTable = ({ widgetData, app })=> {
  let v = widgetData.versions.sort((v1, v2)=> {
            if (v1.version < v2.version) { return 1 }
            if (v1.version > v2.version) { return -1 }
            return 0;
          });
  return(
    <div>
      <br />
      <table className='wide'>
        {v.map( (entry, index)=>{
          return (
            <VersionRow
              key={index}
              entry={entry}
              widgetData={widgetData}
              app={app} />
          )})}
      </table>
    </div>
  );
};

const VersionRow = ({ widgetData, app, entry })=> {
  let w = widgetData;
  let a = app;
  let v = entry;
  let live = v.live ? 'popTbody' : 'fade popTbody';
  
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
                  
  return(
    <tbody className={live}>
      <tr>
        <td className='bigger'>{v.version}</td>
        <td>
          <a className='clean wordBr' href={v.wiki} target='_blank'>{v.wiki}</a>
        </td>
        <td colSpan='2' className='numFont'>default units: {v.units}</td>
      </tr>
      <tr>
        <td colSpan='2' className='clean'>
          <NoteLine
            entry={v.notes}
            id={w._id}
            versionKey={v.versionKey}
            plain={true}
            small={true} />
        </td>
        <td colSpan='2'>
          <TagsModule
            id={w._id}
            tags={v.tags}
            vKey={v.versionKey}
            tagOps={a.tagOption} />
        </td>
      </tr>
      <tr>
        <td colSpan='2' className='fill'>
          <details className='up textSelect'>
            <summary>{Pref.comp}s: {v.assembly.length}</summary>
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
          </details>
        </td>
        <td colSpan='2'>
          <CompForm id={w._id} versionKey={v.versionKey} />
        </td>
      </tr>
      <tr>
        <td colSpan='2'>
          <CreateTag
            when={v.createdAt}
            who={v.createdWho}
            whenNew={v.updatedAt}
            whoNew={v.updatedWho}
            dbKey={v.versionKey} />
        </td>
        <td colSpan='2'>
          <VersionForm
            widgetData={w}
            version={v}
            rootWI={v.wiki}
            small={true} />
          <VersionRemove
            widgetId={w._id}
            versionKey={v.versionKey}
            lock={v.createdAt.toISOString()}
            small={true} />
        </td>
      </tr>
    </tbody>
  );
};

export default VersionTable;