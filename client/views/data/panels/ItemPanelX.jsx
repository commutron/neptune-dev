import React from 'react';
import Pref from '/client/global/pref.js';
import CreateTag from '/client/components/tinyUi/CreateTag';

import AnimateOnChange from 'react-animate-on-change';
  
import ScrapBox from '/client/components/bigUi/ItemFeedX/ScrapBox';
import SubItemLink from '/client/components/smallUi/SubItemLink';

import ItemFeedX from '/client/components/bigUi/ItemFeedX/ItemFeedX';

import ItemExport from '/client/views/paper/ItemExport';
import UnitSet from '/client/components/forms/ItemSerialsX/Child/UnitSet';
import PanelBreak from '/client/components/forms/ItemSerialsX/Child/PanelBreak';
import ItemIncomplete from '/client/components/forms/ItemSerialsX/Child/ItemIncomplete';
import UndoFinish from '/client/components/forms/ItemSerialsX/Child/UndoFinish';
import RapidSet from '/client/components/forms/ItemSerialsX/Child/RapidSet';
import ScrapItem from '/client/components/forms/ItemSerialsX/Child/ScrapItem';
import RemoveItem from '/client/components/forms/ItemSerialsX/Child/RemoveItem';

import { PopoverButton, PopoverMenu, PopoverAction } from '/client/layouts/Models/Popover';

const ItemPanelX = ({ 
  batchData, seriesData, rapidsData, itemData,
  widgetData, variantData, groupData, 
  app, brancheS, user,
  listTitle, flowData
})=> {
  
  const srs = seriesData;
  const i = itemData;
  const b = batchData;
  
  const openAction = (dialogId)=> {
    const dialog = document.getElementById(dialogId);
    dialog?.showModal();
  };
  
  const doCopy = ()=> {
    if(navigator.clipboard !== undefined) {
      var elmFa = document.getElementById("fa-"+i.serial);
      elmFa.classList.remove("invisible");
  
      navigator.clipboard.writeText(i.serial);
      
      Meteor.setTimeout(()=> elmFa.classList.add("invisible"), 2000);
    }
  };
  
  const nc = srs.nonCon.filter( x => x.serial === i.serial );
  
  const sh = srs.shortfall.filter( x => x.serial === i.serial);
  
  const start = i.history.length > 0;
  const rapid = i.altPath.find( a => a.rapId !== false && a.completed === false );
  const liverapid = rapidsData && rapidsData.find(r=> r.live === true);
  const itemrapid = liverapid && itemData && itemData.altPath.find(x=> x.rapId === liverapid._id);

  const scrap = !i.scrapped ? null :
                  i.history.find(x => x.type === 'scrap' && x.good === true);
  
  const done = i.completed;
  
  const accessE = Roles.userIsInRole(Meteor.userId(), 'edit');
  const accessR = Roles.userIsInRole(Meteor.userId(), 'run');
  const accessQ = Roles.userIsInRole(Meteor.userId(), 'qa');
  const accessQR = accessQ || accessR;
  const accessD = Roles.userIsInRole(Meteor.userId(), 'remove');
  
  const canCut = accessD && !done && i.units > 1;
  const canEnd = accessQR && !done;
  const canUdo = done && (!b.completed || liverapid) && Roles.userIsInRole(Meteor.userId(), 'BRKt3rm1n2t1ng8r2nch');
  const canExt = liverapid && !itemrapid && Roles.userIsInRole(Meteor.userId(), ['qa', 'run', 'inspect']);
  const canScp = accessQ && !scrap && !(done && !rapid);
  const canRmv = accessD && !b.completed && !i.completed;
  
  
  return(
    <div className='section' key={i.serial}>
    
      <UnitSet
  	    seriesId={srs._id}
  	    item={itemData}
  	    access={accessE || accessR}
  	  />
  	  <PanelBreak
        batchId={b._id}
        seriesId={srs._id}
        batchNum={b.batch}
  	    item={itemData}
  	    access={canCut}
  	  />
  	  <ItemIncomplete
        seriesId={srs._id}
        item={itemData}
        access={canEnd}
      />
      <UndoFinish
  	    batchId={b._id}
  	    seriesId={srs._id}
  	    serial={i.serial}
  	    completedAtI={i.completedAt}
  	    rapidData={rapidsData}
  	    rapids={i.altPath.filter(x=> x.rapId !== false)}
  	    access={canUdo}
  	  />
  	  <RapidSet
  	    seriesId={srs._id}
  	    serial={i.serial}
  	    rapidData={liverapid}
  	    access={canExt}
  	  />
  	  <ScrapItem
        seriesId={srs._id}
        item={itemData}
        ancillary={app.ancillaryOption}
        access={canScp}
      />
  	  <RemoveItem
        batchId={b._id}
        batch={b.batch}
        seriesId={srs._id}
        serial={i.serial}
        check={i.createdAt.toISOString()}
        verify={i.history.length > 0}
        access={canRmv}
      />
    	  
      <div className='floattaskbar light'>
        
        <PopoverButton 
          targetid='itemviewpop'
          attach='views'
          text='View'
          icon='fa-solid fa-sort gapR' 
        />
        <PopoverMenu 
          targetid='itemviewpop'
          attach='views'>
          <div>Process Flow</div>
			    <div>Cronological</div>
        </PopoverMenu>
        
        <PopoverButton 
          targetid='editspop'
          attach='edits'
          text='Edits'
          icon='fa-solid fa-file-pen gapR'
        />
        <PopoverMenu targetid='editspop' attach='edits'>
          <PopoverAction 
            doFunc={()=>openAction(i.serial+'_unit_form')}
            text={`Change ${Pref.unit}s`}
            icon='fa-solid fa-th'
            lock={!(accessE || accessR)}
          />
          <PopoverAction 
            doFunc={()=>openAction(i.serial+'_remove_form')}
            text='Delete'
            icon='fa-solid fa-minus-circle'
            lock={!canRmv}
          />
        </PopoverMenu> 
        
        <PopoverButton 
          targetid='poweractions'
          attach='actions'
          text='Actions'
          icon='fa-solid fa-star gapR'
        />
        <PopoverMenu targetid='poweractions' attach='actions'>
          <PopoverAction 
            doFunc={()=>openAction(i.serial+'_split_form')}
            text='Split Panel'
            icon='fa-solid fa-cut'
            lock={!canCut}
          />
    			{!done ?
    			 <PopoverAction 
            doFunc={()=>openAction(i.serial+'_incomplete_form')}
            text='Force Finish'
            icon='fa-solid fa-flag-checkered'
            lock={!canEnd}
          />
          :
    			<PopoverAction 
            doFunc={()=>openAction(i.serial+'_undofin_form')}
            text='Undo Finish'
            icon='fa-solid fa-backward'
            lock={!canUdo}
          />
          }
    			<PopoverAction 
            doFunc={()=>openAction(i.serial+'_rapid_form')}
            text={Pref.rapidEx}
            icon='fa-solid fa-sitemap'
            lock={!canExt}
          />
          <PopoverAction 
            doFunc={()=>openAction(i.serial+'_scrap_form')}
            text='Scrap'
            icon='fa-solid fa-trash-alt'
            lock={!canScp}
          />
    			
        </PopoverMenu>
        
        <span className='flexSpace' />
        
        <ItemExport
          group={groupData.group}
          widget={widgetData.widget}
          variant={variantData.variant}
          batch={batchData.batch}
          sales={batchData.salesOrder}
          itemData={itemData}
          noncon={nc}
          short={sh}
          extraClass='popbutton'
        />
      </div>
  
      <div className='balance'>
        <div className='numFont space2v' title={`${i.serial}\nclick to copy`}>
          <AnimateOnChange
            customTag='div'
            animationClassName="quick-bounce-change"
            animate={i.serial}
            ><button
              id={"copy"+i.serial}
              className='cap biggest'
              onClick={()=>doCopy()}
            >{i.serial}<span id={"fa-"+i.serial} className='gapL invisible'><i className="fa-regular fa-copy fa-xs"></i></span></button>
          </AnimateOnChange>
        </div>
        <div className='titleSection space2v'>
          <span>Units: {i.units}</span>
          <span>
            { !start ?
              <i className='fas fa-battery-empty' title='unstarted'></i>
              :
              i.completed ? 
              <i className='fas fa-battery-full greenT' title='complete'></i>
              : 
              <i className='fas fa-battery-half blueT' title='in progress'></i>
            }
          </span>
        </div>
        
      </div>
      
      <div className='uspace'>
        { i.subItems.length > 0 && 
          <p className='indent5v'>
            <i>Nested sub {Pref.item}s: </i>
            {i.subItems.map((ent, inx)=> { 
              return( 
                <i key={inx}>
                  <SubItemLink 
                    seriesId={srs._id}
                    serial={i.serial}
                    nestedSerial={ent} />,&ensp; 
                </i> 
              );
            })}
          </p>}
        {scrap && 
          <ScrapBox 
            seriesId={srs._id} 
            serial={i.serial} 
            entry={scrap}
            eX={!b.completed && b.live} />}
        
        <ItemFeedX
          widgetData={widgetData}
          batchId={b._id}
          batch={b.batch}
          seriesId={srs._id}
          serial={i.serial}
          units={i.units}
          createTime={i.createdAt}
          createBy={i.createdWho}
          history={i.history}
          altPath={i.altPath}
          noncons={nc}
          ncTypesCombo={flowData && flowData.ncTypesComboFlat}
          brancheS={brancheS}
          shortfalls={sh}
          done={i.completed}
          rapId={rapid ? rapid.rapId : false}
          rapidsData={rapidsData}
          user={user}
          app={app} />
            
        <br />
      </div>
      
      <CreateTag
        when={i.createdAt}
        who={i.createdWho}
        whenNew={i.createdAt}
        whoNew={i.createdWho}
        dbKey={i.serial} 
      />
		</div>
  );
};

export default ItemPanelX;