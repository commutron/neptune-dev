import React from 'react';
import Pref from '/client/global/pref.js';
import CreateTag from '/client/components/tinyUi/CreateTag';

import AnimateOnChange from 'react-animate-on-change';
  
import ScrapBox from '/client/components/bigUi/ItemFeedX/ScrapBox';
import SubItemLink from '/client/components/smallUi/SubItemLink';

import ItemFeedX from '/client/components/bigUi/ItemFeedX/ItemFeedX';

import ItemExport from '/client/views/paper/ItemExport';

import { PopoverButton, PopoverMenu } from '/client/layouts/Models/Popover';

const ItemPanelX = ({ 
  batchData, seriesData, rapidsData, itemData,
  widgetData, variantData, groupData, 
  app, brancheS, user,
  listTitle, flowData
})=> {
  
  const srs = seriesData;
  const i = itemData;
  const b = batchData;
  
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
  
  const scrap = !i.scrapped ? null :
                  i.history.find(x => x.type === 'scrap' && x.good === true);
  
  return(
    <div className='section' key={i.serial}>
    
      <div className='floattaskbar light'>
        
        <PopoverButton 
          targetid='testpop'
          attach='actions'
          text='Actions'
          icon='fa-solid fa-star gapR' />
        
        <PopoverMenu targetid='testpop' attach='actions'>
          <div>item 1</div>
    			<div>item 2</div>
    			<div>item 3</div>
    			<div>item 4</div>
    			<div>item 5</div>
    			<div>item 6</div>
        </PopoverMenu>
        
        <PopoverButton 
          targetid='itemviewpop'
          attach='views'
          text='View'
          icon='fa-solid fa-sort gapR' />
        
        <PopoverMenu 
          targetid='itemviewpop'
          attach='views'
          extraClass='rightedge'>
          <div>Process Flow</div>
			    <div>Cronological</div>
        </PopoverMenu>
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
      
      <div className='rowWrap'>
        <CreateTag
          when={i.createdAt}
          who={i.createdWho}
          whenNew={i.createdAt}
          whoNew={i.createdWho}
          dbKey={i.serial} 
        />
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
        />
      </div>
		</div>
  );
};

export default ItemPanelX;