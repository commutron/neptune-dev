import React from 'react';
import Pref from '/client/global/pref.js';

  
import ScrapBlock from '/client/components/bigUi/ItemFeedX/ScrapBlock';
import SubItemLink from '/client/components/smallUi/SubItemLink';

import ItemFeedX from '/client/components/bigUi/ItemFeedX/ItemFeedX';


const ItemPanelX = ({ 
  batchData, seriesData, rapidsData, itemData,
  widgetData,
  app, brancheS, user,
  flowData
})=> {
  
  const srs = seriesData;
  const i = itemData;
  const b = batchData;
  
  const nc = srs.nonCon.filter( x => x.serial === i.serial );
  
  const sh = srs.shortfall.filter( x => x.serial === i.serial);
  
  const start = i.history.length > 0;
  const rapid = i.altPath.find( a => a.rapId !== false && a.completed === false );

  const scrap = !i.scrapped ? null : i.history.find(x => x.type === 'scrap' && x.good === true);
  
  
  const accessI = false;
  const accessE = false;
  const accessR = false;
  const accessQ = false;
  const accessD = false;

  
  return(
    <div className='section' key={i.serial}>
    
      <div className='balance'>
        <div className='numFont space2v'>
          <b>{i.serial}</b>
        </div>
        <div className='titleSection space2v'>
          <span>Units: <n-num>{i.units}</n-num></span>
          <span>
            { !start ?
              <i className='fa-regular fa-circle' title='unstarted'></i>
              :
              i.scrapped ? 
              <i className='fa-solid fa-circle-minus redT' title='scrapped'></i>
              :
              i.completed ? 
              <i className='fa-solid fa-circle greenT' title='complete'></i>
              : 
              <i className='fa-solid fa-circle-half-stroke blueT' title='in progress'></i>
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
          <ScrapBlock 
            seriesId={srs._id} 
            serial={i.serial} 
            entry={scrap}
            eX={!b.completed && b.live} 
            isQA={accessQ}
          />
        }
        
        <ItemFeedX
          widgetData={widgetData}
          batchFlow={flowData && flowData.riverFlow}
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
          canInspect={accessI}
          canQAFin={accessQ || accessR}
          canQARmv={accessQ || accessD}
          canEdit={accessE || accessR}
          app={app}
          cronofeed={true}  
        />
      </div>
		</div>
  );
};

export default ItemPanelX;