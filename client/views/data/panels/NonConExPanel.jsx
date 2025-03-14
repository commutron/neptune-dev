import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';

import Spin from '/client/components/tinyUi/Spin';
import NumStat from '/client/components/tinyUi/NumStat';

import DateRangeSelect from '/client/components/smallUi/DateRangeSelect';
import ProblemReport from '/client/views/data/panels/Reports/ProblemReport';

import PagingSelect from '/client/components/tinyUi/PagingSelect';
import { chunkArray } from '/client/utility/Convert';


const NonConExPanel = ({ brancheS, request, app })=> {
  
  const [ start, startSet ] = useState(false);
  const [ end, endSet ] = useState(false);
  
  
  
  const [ radios, radiosSet ] = useState(false);
  
  const [ pageState, pageSet ] = useState(0);
  
  const [ workingList, workingListSet ] = useState([]);
  
  // useEffect( ()=> {
  //   Meteor.call('fetchRadioactiveThin', (error, reply)=> {
  //     error && console.log(error);
  //     radiosSet( JSON.parse(reply) );
  //   });
  // }, []);
  
  useEffect( ()=>{
    
    if(Array.isArray(radios)) {

      const sortList = radios.sort((s1, s2)=> {
              if (s1.widget + s1.variant > s2.widget + s1.variant) { return 1 }
              if (s1.widget + s1.variant < s2.widget + s1.variant) { return -1 }
              return 0;
            });
      
      pageSet(0);
      workingListSet(sortList);
    }
                    
  }, [radios]);
  
  
  return(
    <div className='centreBox'>
      
      
      <div className='space'>
        <h2 style={{marginBottom:'32px'}}>KPI Report</h2>
        <h4 className='noPrint'>WARNING: Long Time Ranges Can Delay Production Activities</h4>
        <div className='noPrint'>
          <p className='rowWrap'>
            <i>Within Date Range</i>
            <DateRangeSelect
              setFrom={startSet}
              setTo={endSet} />
          </p>
        </div>
        
        <ProblemReport 
          start={start} 
          end={end} 
          dataset='noncon'
        />
      </div>
      
      
    </div>
  );
  
  
  /*
  const inpieces = chunkArray(workingList, Pref.pagingSize);
  
  return(
    <div className='section overscroll' key={1}>
      <div className='space'>
        <div className='med vbreak comfort middle noPrint'>
        <span className='flexSpace' />
        <NumStat
          num={radios && radios.length}
          name={'Total ' + Pref.radio.toUpperCase()}
          color='darkOrangeT'
          size='bigger' 
        />
      </div>
      
        <PagingSelect 
          multiArray={inpieces}
          isSet={pageState}
          doChange={(e)=>pageSet(e)} />
        
        <RadioTableAll radioData={inpieces[pageState] || []} />
        
        <PagingSelect 
          multiArray={inpieces}
          isSet={pageState}
          doChange={(e)=>pageSet(e)} />
      
        <details className='footnotes'>
          <summary>Table Details</summary>
          <p className='footnote capFL'>
            All {Pref.widget} {Pref.variants} currently with the {Pref.radioactive} tag.
          </p>
          <p className='footnote'>
            Previously applied tags are not saved. 
          </p>
        </details>
      </div>
    </div>
  );
  */
};

export default NonConExPanel;