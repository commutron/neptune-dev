import React, { useMemo, useState } from 'react';
import Pref from '/public/pref.js';
import CreateTag from '/client/components/tinyUi/CreateTag';
import WidgetsDepth from '../../lists/WidgetsDepth';
import TagsModule from '/client/components/bigUi/TagsModule';
import { PopoverButton, PopoverMenu, PopoverAction } from '/client/layouts/Models/Popover';

import Remove from '/client/components/forms/Remove';
import GroupTops from '/client/components/charts/GroupTops';
import DumbFilter from '/client/components/tinyUi/DumbFilter';

function groupActiveWidgets(widgetsList, allXBatch) {
  
  let activeBatch = allXBatch.filter( b => b.completed === false);

  const hasBatch = (id)=> activeBatch.find( b => b.widgetId === id) ? true : false;
  
  let activeWidgets = widgetsList.filter( w => hasBatch(w._id) == true );
  
  const activeList = Array.from(activeWidgets, w => w._id);
  return activeList;
}

const GroupSlide = ({ 
  groupData, widgetsList, batchDataX, app, 
  inter, openActions, 
  handleInterize, handleHibernate, handleEnableEmail,
  canRun, canEdt, canCrt, canRmv 
})=>{
  
  const [ filterString, filterStringSet ] = useState( '' );
  
  const g = groupData;
  const active = useMemo(()=>groupActiveWidgets(widgetsList, batchDataX), [widgetsList, batchDataX]);
  const shrtI = g.wiki && !g.wiki.includes('http');
  
  const doNew = canCrt && !g.hibernate;
  const doRmv = (!widgetsList || widgetsList.length === 0) && g.hibernate && canRmv;
  
  return(
    <div className='section overscroll' key={g.alias}>
      {doRmv &&
        <Remove
          action='group'
          title={g.group}
          check={g.createdAt.toISOString()}
          entry={g._id}
          access={doRmv}
        />
      }
          
      <h1 className='cap bigger centreText bottomLine'>{g.group}</h1>

      <div className='floattaskbar light'>
        <PopoverButton 
          targetid='editspop'
          attach='edits'
          text='Edits'
          icon='fa-solid fa-file-pen gapR'
        />
        <PopoverMenu targetid='editspop' attach='edits'>
          <PopoverAction 
            doFunc={()=>openActions('groupform', g)}
            text={`edit ${Pref.group}`}
            icon='fa-solid fa-industry'
            lock={g.hibernate || !canEdt}
          />
          <PopoverAction 
            doFunc={()=>openActions('widgetform', g)}
            text={`New ${Pref.widget}`}
            icon='fa-solid fa-cube'
            lock={!doNew}
          />
          <PopoverAction 
            doFunc={()=>openActions('groupemail', g)}
            text={`Setup Emails`}
            icon='fa-solid fa-at'
            lock={!canEdt}
          />
          <PopoverAction 
            doFunc={()=>document.getElementById('group_multi_delete_form')?.showModal()}
            text={`Delete ${Pref.group}`}
            icon='fa-solid fa-minus-circle'
            lock={!doRmv}
          />
        </PopoverMenu>
        
        <PopoverButton 
          targetid='actionspop'
          attach='actions'
          text='Actions'
          icon='fa-solid fa-star gapR'
        />
        <PopoverMenu targetid='actionspop' attach='actions'>
          <PopoverAction 
            doFunc={()=>handleEnableEmail(g._id, !g.emailOptIn)}
            text={`${g.emailOptIn ? 'Disable' : 'Enable'} Automated Emails`}
            icon='fa-solid fa-envelope-circle-check'
            lock={!canEdt}
          />
          {inter &&
          <PopoverAction 
            doFunc={()=>handleInterize(g._id)}
            text={`${g.internal ? 'Unset' : 'Set'} Internal`}
            icon='fa-solid fa-home'
            lock={!(canRun || canEdt)}
          />}
          <PopoverAction 
            doFunc={()=>handleHibernate(g._id)}
            text={`${g.hibernate ? 'Un' : ''}${Pref.hibernatate} ${Pref.group}`}
            icon='fa-solid fa-archive'
            lock={!canEdt}
          />
        </PopoverMenu>
        
        <span className='flexSpace' />
        
        <div>
          <DumbFilter
            id='groupwidgettextfilter'
            inputClass='miniIn24 smTxt'
            styleOv={{minHeight:'0',height:'calc(var(--sm9)* 1.75)'}}
            onTxtChange={(e)=>filterStringSet(e)}
          />
        </div>
      </div>
        
      <div className='wide comfort'>
      
        {g.internal &&
          <Gbanner 
            title={'Internal ' + Pref.group}
            sub='For in-house use, one-off projects, prototypes, or training.'
            icon='fa-home'
            icon2='fa-globe-americas'
            colour='nT'
            bcolour='intrBlueSq'
          />
        }
          
        {g.hibernate &&
          <Gbanner 
            title={Pref.hibernatated + ' ' + Pref.group}
            icon='fa-archive'
            colour='wetasphaltT'
            bcolour='wetasphaltBorder'
          />
        }
        
        <div className='centreRow'>
          <TagsModule
            action='group'
            id={g._id}
            tags={g.tags}
            tagOps={app.tagOption}
            canRun={canRun || canEdt} 
          />
        </div>
        
      </div>
      
      {g.emailOptIn &&
        <p className='w100 indenText'>
        <span className='mockTag'>
          <i className="fa-solid fa-envelope-circle-check fa-lg gapR"></i>{Pref.Group} Emails Enabled
        </span>
        </p>
      }
      {g.emailPrime ?
        <p className='indenText'>Emails sent to {g.emailPrime} and {g.emailSecond?.length || 0} others</p>
        :
        g.emailOptIn && !g.emailPrime ?
        <p className='indenText bold'>No Primary Email Address set</p>
        : null
      }
      
      <p className='w100 capFL indenText wordBr'>
        {Pref.instruct} Index: {shrtI ? app.instruct : null
        }<a className='clean wordBr' href={shrtI ? app.instruct + g.wiki : g.wiki} target='_blank'>{g.wiki}</a>
      </p>
      
      <GroupTops groupId={g._id} alias={g.alias} />
        
      <WidgetsDepth
        filterString={filterString}
        groupAlias={g.alias}
        widgetData={widgetsList}
        active={active} />
      
      <div className='wide'>
        <CreateTag
          when={g.createdAt}
          who={g.createdWho}
          whenNew={g.updatedAt}
          whoNew={g.updatedWho}
          dbKey={g._id} />
      </div>
    </div>
  );
};

export default GroupSlide;

const Gbanner = ({ title, sub, icon, icon2, colour, bcolour })=> (
  <div className={'centreText comfort beside w100 vmargin cap ' + bcolour}>
    <i className={`fa-solid ${icon} fa-fw fa-2x gapL ${colour}`}></i>
    <span>
      <h3>{title}</h3>
      <p>{sub || ''}</p>
    </span>
    <i className={`fa-solid ${icon2 || icon} fa-fw fa-2x gapR ${colour}`}></i>
  </div>
);