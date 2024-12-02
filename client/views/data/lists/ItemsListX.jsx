import React, { Fragment, useState, useEffect } from 'react';

import LeapButton from '/client/components/tinyUi/LeapButton';
import FilterItemsX from '/client/components/bigUi/FilterItemsX';

const SeriesListWrap = ({ 
  seriesData, batchData, rapidsData, flowData, isDebug
})=> {
  
  if(!seriesData) {
    return(
      <div className='centre'>
        <h4>Non-Serialized</h4>
      </div>
    );
  }
  
  const emptySeries = seriesData.items.length === 0 &&
                      seriesData.nonCon.length === 0 &&
                      seriesData.shortfall.length === 0;
  if(emptySeries) {
    return(
      <div className='centre'>
        <h4>Empty Series</h4>
      </div>
    );
  }
  
  return(
    <ItemsListX
      seriesData={seriesData}
      batchData={batchData}
      rapidsData={rapidsData}
      flowData={flowData} 
      isDebug={isDebug}
    />
  );
};

export default SeriesListWrap;

const ItemsListX = ({ 
  seriesData, batchData, rapidsData, flowData, isDebug
})=> {
  
  const sessionSticky = batchData.batch + 'batchXItemFilter' ;
  
  const [ scrollY, scrollYSet ] = useState(200);
  const [ itemLimit, itemLimitSet ] = useState(200);
  
  const [ stateList, setList ] = useState([]);
  const [ keyword, setKeyword ] = useState( Session.get(sessionSticky+'keyword') || false);
  const [ timeModifyer, setTime ] = useState( Session.get(sessionSticky+'time') || false);
  const [ notModifyer, setMod ] = useState( Session.get(sessionSticky+'toggle') || false);

  function setKeywordFilter(keyword) {
    itemLimitSet(200);
    setKeyword( keyword );
    Session.set((sessionSticky+'keyword'), keyword);
  }
  function setTimeFilter(rule) { 
    itemLimitSet(200);
    setTime( rule );
    Session.set((sessionSticky+'time'), rule);
  }
  function setToggle(rule) { 
    itemLimitSet(200);
    setMod( rule );
    Session.set((sessionSticky+'toggle'), rule);
  }

  // Sort Filters
  const wndw = (t, mod)=> new Date(t).toDateString() === mod;
  
  function fDone(items, timeMod, notMod) {
    if(!timeMod || timeMod === '') {
      if(notMod === true) {
        return items.filter( x => x.completed === false );
      }else{
        return items.filter( x => x.completed === true );
      }
    }else{
      const tmod = new Date(timeMod+'T00:00:00').toDateString();
      
      if(notMod === true) {
        return items.filter( x => x.completed === false ||
                !wndw(x.completedAt, tmod) );
      }else{
        return items.filter( x => x.completed === true &&
                wndw(x.completedAt, tmod) );
      }
    }
  }
  
  function fInproc(items, timeMod, notMod) {
    if(!timeMod || timeMod === '') {
      if(notMod === true) {
        return items.filter( x => x.completed === true );
      }else{
        return items.filter( x => x.completed === false );
      }
    }else{
      const tmod0 = new Date(timeMod+'T00:00:00');
      const tmod1 = new Date(timeMod+'T23:59:59');
      
      if(notMod === true) {
        return items.filter( x => new Date(x.createdAt) > tmod1
                  || ( x.completed === true && new Date(x.completedAt) <= tmod0 ) );
      }else{
        return items.filter( x => new Date(x.createdAt) <= tmod1
                  && ( x.completed === false || new Date(x.completedAt) >= tmod0 ) );
      }
    }
  }
  
  function fFirsts(items, timeMod, notMod) {
    let filtered = [];
    if(!timeMod || timeMod === '') {
      if(notMod === true) {
        filtered = items.filter( 
                    x => x.history.filter( y => y.type === 'first' )
                      .length === 0 );
      }else{
        filtered = items.filter( 
                  x => x.history.filter( y => y.type === 'first' )
                    .length > 0 );
      }
    }else{
      const tmod = new Date(timeMod+'T00:00:00').toDateString();
      
      if(notMod === true) {
        filtered = items.filter( 
                    x => x.history.filter( y => y.type === 'first' &&
                          wndw(y.time, tmod) )
                            .length === 0 );
      }else{
        filtered = items.filter( 
                  x => x.history.filter( y => y.type === 'first' &&
                        wndw(y.time, tmod) )
                          .length > 0 );
      }
    }
    return filtered; 
  }
  
  function fNoncons(items, nonCon, timeMod, notMod) {
    let filtered = [];
    if(!timeMod || timeMod === '') {
      if(notMod === true) {
        filtered = items.filter( 
                    x => nonCon.filter( y => y.serial === x.serial )
                      .length === 0 );
      }else{
        filtered = items.filter( 
                  x => nonCon.filter( y => y.serial === x.serial )
                    .length > 0 );
      }
    }else{
      const tmod = new Date(timeMod+'T00:00:00').toDateString();
      
      if(notMod === true) {
        filtered = items.filter( 
                    x => nonCon.filter( y => y.serial === x.serial &&
                          wndw(y.time, tmod) )
                            .length === 0 );
      }else{
        filtered = items.filter(
                  x => nonCon.filter( y => y.serial === x.serial &&
                        wndw(y.time, tmod) )
                          .length > 0 );
      }
    }
    return filtered;
  }
  
  function fShortfalls(items, short, timeMod, notMod) {
    let filtered = [];
    if(!timeMod || timeMod === '') {
      if(notMod === true) {
        filtered = items.filter( 
                    x => short.filter( y => y.serial === x.serial )
                      .length === 0 );
      }else{
        filtered = items.filter( 
                  x => short.filter( y => y.serial === x.serial )
                    .length > 0 );
      }
    }else{
      const tmod = new Date(timeMod+'T00:00:00').toDateString();
      
      if(notMod === true) {
        filtered = items.filter( 
                    x => short.filter( y => y.serial === x.serial &&
                          wndw(y.cTime, tmod) )
                            .length === 0 );
      }else{
        filtered = items.filter(
                  x => short.filter( y => y.serial === x.serial &&
                        wndw(y.cTime, tmod) )
                          .length > 0 );
      }
    }
    return filtered;
  }
  
  function fAlt(items, notMod) {
    if(notMod === true) {
      return items.filter( i => i.altPath.length === 0 || 
                                i.altPath.every( a => a.river === false) );
    }else{
      return items.filter( i => i.altPath.find( a => a.river !== false) );
    }
  }
  
  function fExt(items, notMod) {
    if(notMod === true) {
      return items.filter( i => i.altPath.length === 0 ||
                                i.altPath.every( a => a.rapId === false) );
    }else{
      return items.filter( i => i.altPath.find( a => a.rapId !== false) );
    }
  }
  
  function fScrap(items, timeMod, notMod) {
    let iList = [];
    if(!timeMod || timeMod === '') {
      if(notMod === true) {
        iList = items.filter( 
                    x => x.history.filter( y => y.type === 'scrap' )
                      .length === 0 );
      }else{
        iList = items.filter( 
                  x => x.history.filter( y => y.type === 'scrap' )
                    .length > 0 );
      }
    }else{
      const tmod = new Date(timeMod+'T00:00:00').toDateString();
      
      if(notMod === true) {
        iList = items.filter( 
                    x => x.history.filter( y => y.type === 'scrap' &&
                          wndw(y.time, tmod) )
                            .length === 0 );
      }else{
        iList = items.filter( 
                  x => x.history.filter( y => y.type === 'scrap' &&
                        wndw(y.time, tmod) )
                          .length > 0 );
      }
    }
    return iList;
  }
  
  function fStep(items, flowKey, timeMod, notMod) {
    const key = flowKey.slice(1);
    let filtered = [];
    if(!flowKey) {
      filtered = items;
    }else if(!timeMod || timeMod === '') {
      if(notMod === true) {
        filtered = items.filter( 
                    x => x.history.filter( y => y.key === key && y.good === true )
                      .length === 0 );
      }else{
        filtered = items.filter( 
                  x => x.history.filter( y => y.key === key && y.good === true )
                    .length > 0 );
      }
    }else{
      const tmod = new Date(timeMod+'T00:00:00').toDateString();
      
      if(notMod === true) {
        filtered = items.filter( 
                    x => x.history.filter( y => y.key === key && y.good === true &&
                          wndw(y.time, tmod) )
                            .length === 0 );
      }else{
        filtered = items.filter( 
                  x => x.history.filter( y => y.key === key && y.good === true &&
                        wndw(y.time, tmod) )
                          .length > 0 );
      }
    }
    return filtered;                                 
  }
  
  const srs = seriesData;
  const nonCon = srs.nonCon;
  const short = srs.shortfall || [];
  
  function handleScroll(e) {
    if(e.target.scrollTop > scrollY) {
      scrollYSet(e.target.scrollTop);
    }
  }
  
  useEffect( ()=> {
    if(itemLimit < stateList.length) {
      const newLimit = itemLimit + 25;
      itemLimitSet(newLimit);
    }
  }, [scrollY]);
  
  useEffect( ()=> {
    if(srs.items.length > 200) {
      document.getElementById('exItemList')
        ?.addEventListener('scroll', handleScroll);
    }
    return ()=> {
      if(srs.items.length > 200) {
        document.getElementById('exItemList')
                    ?.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);
  
  
  useEffect( ()=> { 
    const K = keyword;
    
    const items = srs ? srs.items : [];
    
    isDebug && console.log({ K, timeModifyer, notModifyer });
    
    let filteredList = 
    !K ?
      items :
    K.startsWith('@') ?
      fStep(items, K, timeModifyer, notModifyer) :
    K === 'complete' ?
      fDone(items, timeModifyer, notModifyer) :
    K === 'in progress' ?
      fInproc(items, timeModifyer, notModifyer) :
    K === 'first offs' ?
      fFirsts(items, timeModifyer, notModifyer) :
    K === 'nonconformances' ?
      fNoncons(items, nonCon, timeModifyer, notModifyer) :
    K === 'shortfalls' ?
      fShortfalls(items, short, timeModifyer, notModifyer) :
    K === 'alternative' ?
      fAlt(items, notModifyer) :
    K === 'scrap' ? 
      fScrap(items, timeModifyer, notModifyer) :
    K === 'extended' ? 
      fExt(items, notModifyer) :
    items;

    const orderedList = filteredList.sort((x, y)=> 
                      x.serial < y.serial ? -1 : x.serial > y.serial ? 1 : 0 );
     
    setList(orderedList);
  }, [ seriesData, keyword, timeModifyer, notModifyer ]);
  
  const bttnClss = 'leapBar numFont';
  
  const steps = [ 
    (flowData.riverFlow || []),
    {key: "adhocxray", step: "x-ray", type: "option"},
    Array.from(rapidsData, r=> r.whitewater).flat(),
  ].flat();

  return(
    <Fragment>
      <FilterItemsX
        title={batchData.batch}
        total={stateList.length}
        advancedList={steps}
        selectedKeyword={keyword}
        selectedTime={timeModifyer}
        selectedToggle={notModifyer}
        onKeywordChange={(e)=>setKeywordFilter(e)}
        onTimeChange={(e)=>setTimeFilter(e)}
        onNotChange={(e)=>setToggle(e)} />
      <div>
        {stateList.map( (entry, index)=> {
          if(index < itemLimit) {
            let style = entry.history.length === 0 ? bttnClss :
                        entry.completed === false ? `${bttnClss} activeMark` :
                        entry.scrapped ? `${bttnClss} ngMark` : 
                        entry.altPath.find( a => a.rapId !== false) ? `${bttnClss} exMark` : 
                        `${bttnClss} gMark`;
            return(
              <LeapButton
                key={entry.serial} 
                title={entry.serial} 
                sub='' 
                sty={style}
                address={`/data/batch?request=${batchData.batch}&specify=${entry.serial}`}
              />
              );
        }})}
      </div>
		</Fragment>
  );
};