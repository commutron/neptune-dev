import { Meteor } from 'meteor/meteor';
import React, { useState, useLayoutEffect } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import TrendLine from '/client/components/charts/Trends/TrendLine';
import { TrendBarCache } from '/client/components/charts/Trends/TrendBar';
import NumStatBox from '/client/components/charts/Dash/NumStatBox';
import BatchNewList from '../lists/BatchNewList';

import ToggleSearch from '/client/components/bigUi/MultiSearch/ToggleSearch';
import ScrollWrap from '/client/components/bigUi/MultiSearch/ScrollWrap';

const ExploreLanding = ({ app, isDebug }) => {
  
  const [ tggl, tgglSet ] = useState( true );
  const [ queryState, querySet ] = useState( null );
	const [ resultState, resultSet ] = useState( null );
	
	const [ xtop, xtopSet ] = useState( [ null, null, null, null ] );
  
  useLayoutEffect( ()=>{
    Meteor.call('exploreTops', (err, re)=>{
      err && console.log(err);
      re && xtopSet(re);
    });
  }, []);
  
  const xTotal = xtop[0];
  const xlive = xtop[1];
  const xDone = xtop[2];
  const xlocked = xtop[3];
  const xRapid = xtop[4];
  
  const start = `Since records began on ${moment(app.createdAt).format('MMM Do YYYY')}`;
  const now = `As of ${moment().format('hh:mm a on MMM Do YYYY')}`;
  
  return(
    <section className='space1v'>

      <ToggleSearch
        tggl={tggl}
        tgglSet={tgglSet}
        queryState={queryState}
        queryUP={(v)=>querySet(v)}
        resultUP={(r)=>resultSet(r)}
      />
    
      {!queryState || resultState === null ? null
        : resultState === undefined ?
          <p className='centreText'>
            <n-fa0><i className="far fa-compass fa-2x fa-spin"></i></n-fa0>
          </p>
        : resultState === false || resultState.length === 0 ?
          <p className='centreText'><b>NO SEARCH RESULT</b></p>
        : null
      }
      
      <div className='relativeWrap'>
        {resultState && resultState.length > 0 ?
          <ScrollWrap
            tggl={tggl}
            queryState={queryState}
            resultState={resultState}
            app={app}
          />
        : null}
      </div>
      
      <div 
        hidden={
          resultState === undefined || 
          (resultState && resultState.length > 0)
          ? 'hidden' : ''
        }
      >
        
        <div className='centreRow vspacehalf'>
          <NumStatBox
            number={xlive || "0"}
            name={Pref.live}
            title={now}
            borderColour="var(--peterriver)"
          />
          
          <NumStatBox
            number={xlive ? xRapid : "0"}
            name={`${Pref.live} ${Pref.rapidEx}`}
            title={now}
            borderColour="var(--carrot)"
          />
          
          <NumStatBox
            number={xTotal ? xDone : "0"}
            name='Completed'
            title={start}
            borderColour="var(--emerald)"
          />
           <NumStatBox
            number={xTotal || "0"}
            name='Total'
            title={start}
            borderColour="var(--concrete)"
          />
          <NumStatBox
            number={xlocked || "0"}
            name='Locked'
            title={start}
            borderColour="var(--amethyst)"
          />
        </div>
        
        <div className='centreRow vspacehalf'>
          <TrendLine 
            title={`new ${Pref.xBatchs}`}
            statType='newBatch'
            cycleCount={4}
            cycleBracket='week'
            lineColor='rgb(52, 152, 219)'
          />
          <TrendLine 
            title='new items'
            statType='newItem'
            cycleCount={4}
            cycleBracket='week'
            lineColor='rgb(52, 152, 219)' 
          />
          <TrendBarCache
            title={`completed ${Pref.xBatchs}`}
            statType='doneBatchLiteWeeks'
            cycleCount={4}
            cycleBracket='week'
            isDebug={isDebug}
          />
        </div>
        
        <div className='wide max875 vspacehalf'>
          <h3>New from the Last 7 Days</h3>
          <BatchNewList daysBack={7} />
        </div>
        
      </div>
    </section>
  );
};

export default ExploreLanding;