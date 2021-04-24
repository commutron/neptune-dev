import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import Spin from '/client/components/tinyUi/Spin.jsx';

import { FocusSelect, FilterSelect } from '/client/components/smallUi/ToolBarTools';
import NumBox from '/client/components/tinyUi/NumBox.jsx';
import PagingSelect from '/client/components/tinyUi/PagingSelect.jsx';
import RapidExTable from '/client/components/tables/RapidExTable';

import { chunkArray } from '/client/utility/Convert';


const RextendPanel = ({ batchData, app })=> {
  
  const [ rapex, rapexSet ] = useState(false);
  
  const [ groupState, groupSet ] = useState(false);
  const [ yearState, yearSet ] = useState(false);
  const [ typeState, typeSet ] = useState(false);
  
  const [ pageState, pageSet ] = useState(0);
  
  const [ workingList, workingListSet ] = useState([]);
  
  useEffect( ()=> {
    Meteor.call('fetchRapidsThin', (error, reply)=> {
      error && console.log(error);
      rapexSet( JSON.parse(reply) );
    });
  }, []);
  
  useEffect( ()=>{
    if(Array.isArray(rapex)) {
      
      const byGroup = !groupState || groupState === 'false' ? rapex :
                rapex.filter( r => r.group === groupState );
      
      const byYear = !yearState || yearState === 'false' ? byGroup :
                byGroup.filter( r => moment(r.createdAt).year() == yearState );
      
      const byType = !typeState || typeState === 'false' ? byYear :
                byYear.filter( r => r.type === typeState );
      
      pageSet(0);
      workingListSet(byType);
    }
                    
  }, [rapex, groupState, yearState, typeState]);
  
  if(!rapex) {
    return(
      <div className='centreBox'>
        <Spin />
      </div>
    );
  }
  
  const gList = _.uniq( Array.from(rapex, r => r.group ).sort() );
  const yList = _.uniq( Array.from(rapex, r => moment(r.createdAt).year() )
                  .sort((a, b)=>b-a) );
  const tList = _.uniq( Array.from(rapex, r => r.type ).sort() );
  
  const inpieces = chunkArray(workingList, Pref.pagingSize);
  
  return(
    <div className='section space overscroll'>
      
      <div className='comfort middle overscroll'>
        <span className='balancer gapsC'>
          <FocusSelect
            gList={gList}
            focusState={groupState}
            changeFunc={(e)=>groupSet(e.target.value)}
          />
          <FilterSelect
            unqID='fltrTYPE'
            title='Filter Type'
            selectList={tList}
            selectState={typeState}
            falsey='All Types'
            changeFunc={(e)=>typeSet(e.target.value)}
          />
          <FilterSelect
            unqID='fltrYEAR'
            title='Filter Year'
            selectList={yList}
            selectState={yearState}
            falsey='All Years'
            changeFunc={(e)=>yearSet(e.target.value)} 
          />
        </span>
        
        <span>
          <NumBox
            num={workingList.length}
            name={Pref.rapidExs}
            color='darkOrangeT' />
        </span>
            
      </div>
      
      <PagingSelect 
        multiArray={inpieces}
        isSet={pageState}
        doChange={(e)=>pageSet(e)} />
        
      <RapidExTable
        dataObj={inpieces[pageState] || []} />
      
      <PagingSelect 
        multiArray={inpieces}
        isSet={pageState}
        doChange={(e)=>pageSet(e)} />
      
    </div>
  );
};

export default RextendPanel;

