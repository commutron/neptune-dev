import React from 'react';

import CreateTag from '/client/components/uUi/CreateTag.jsx';

import VersionForm from '../forms/VersionForm.jsx';
import { VersionRemove } from '../forms/VersionForm.jsx';
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
  return(
    <tbody className={live}>
      <tr>
        <td className='bigger'>{v.version}</td>
        <td><a className='clean' href={v.wiki} target='_blank'>{v.wiki}</a></td>
        <td>default units: {v.units}</td>
        <td>components: {v.assembly.length}</td>
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
        <td colSpan='3'>
          <CreateTag
            when={v.createdAt}
            who={v.createdWho}
            whenNew={v.updatedAt}
            whoNew={v.updatedWho}
            dbKey={v.versionKey} />
        </td>
        <td colSpan='1'>
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