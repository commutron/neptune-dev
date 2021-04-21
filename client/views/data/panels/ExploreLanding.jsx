import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import Pref from '/client/global/pref.js';
import TrendLine from '/client/components/charts/Trends/TrendLine.jsx';
import { TrendBarCache } from '/client/components/charts/Trends/TrendBar.jsx';
import NumStatBox from '/client/components/charts/Dash/NumStatBox';
import BatchNewList from '../lists/BatchNewList';

import ToggleSearch from '/client/components/bigUi/MultiSearch/ToggleSearch';
import SerialResult from '/client/components/bigUi/MultiSearch/SerialResult';
import BatchResult from '/client/components/bigUi/MultiSearch/BatchResult';

const ExploreLanding = ({ 
  groupData, widgetData, variantData, xBatchData, 
  app, isDebug
}) => {
  
  const [ tggl, tgglSet ] = useState( true );
  const [ queryState, querySet ] = useState( null );
	const [ resultState, resultSet ] = useState( null );
  
  const xTotal = xBatchData.length;
  const xlive = xBatchData.filter( x => x.live === true ).length;
  const xProcess = xBatchData.filter( x => x.completed === false ).length;
  
  const xlocked = xBatchData.filter( x => x.lock === true ).length;
  
  return(
    <section className='space1v'>

      <ToggleSearch
        tggl={tggl}
        tgglSet={tgglSet}
        queryState={queryState}
        queryUP={(v)=>querySet(v)}
        resultUP={(r)=>resultSet(r)}
        batchData={xBatchData}
        widgetData={widgetData}
        variantData={variantData}
        groupData={groupData}
        app={app}
      />
    
      {!queryState || resultState === null ? null
        : resultState === undefined ?
          <p className='centreText'><i className="far fa-compass fa-2x fa-spin"></i></p>
        : resultState === false || resultState.length === 0 ?
          <p className='centreText'><b>NO SEARCH RESULT</b></p>
        : null
      }
      
      {resultState && resultState.length > 0 &&
        <div className='fixedResults forceScrollStyle wide max875'>
          {tggl ?
            <BatchResult
              queryState={queryState}
              resultState={resultState}
              app={app} />
          :
          <SerialResult
            queryState={queryState}
            resultState={resultState}
            app={app} />
          }
        </div>}
      
      <div 
        hidden={
          resultState === undefined || 
          (resultState && resultState.length > 0)
          ? 'hidden' : ''
        }
      >
        
        <div className='centreRow vspacehalf'>
          <TrendLine 
            title={`new ${Pref.batches}`}
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
            title={`completed ${Pref.batches}`}
            statType='doneBatchLiteWeeks'
            cycleCount={4}
            cycleBracket='week'
            isDebug={isDebug}
          />
        </div>
        
        <div className='centreRow vspacehalf'>
          <NumStatBox
            number={xlive}
            name='WIP'
            borderColour='blue'
          />
          <NumStatBox
            number={xlive - xProcess}
            name='RMA'
            borderColour='red'
          />
          <NumStatBox
            number={xTotal - xProcess}
            name='Completed'
            borderColour='green'
          />
           <NumStatBox
            number={xTotal}
            name='Total'
          />
          <NumStatBox
            number={xlocked}
            name='Locked'
            borderColour='rgb(155, 89, 182)'
          />
        </div>
       
        <div className='wide max875 vspacehalf'>
          <h3>New from the Last 7 Days</h3>
          <BatchNewList
            batchData={xBatchData}
            widgetData={widgetData}
            variantData={variantData}
            groupData={groupData}
            daysBack={7}
          />
        </div>
        
      </div>
    </section>
  );
};

export default ExploreLanding;


/*  
  <div className='centreRow'>
      
    <TrendLine 
      title={`completed ${Pref.items}`}
      statType='doneItem'
      cycleCount={isDebug ? 26 : 4}
      cycleBracket='week'
      lineColor='rgb(46, 204, 113)' />
    
    <TrendLine 
      title={`discovered ${Pref.shortfall}s`}
      statType='newSH'
      cycleCount={isDebug ? 26 : 4}
      cycleBracket='week'
      lineColor='rgb(230, 126, 34)' />
      
    <TrendLine 
      title={`discovered ${Pref.nonCons}`}
      statType='newNC'
      cycleCount={isDebug ? 26 : 4}
      cycleBracket='week'
      lineColor='rgb(231, 76, 60)' />
    
  </div>
  
  <details className='footnotes'>
    <summary>Chart Details</summary>
    <p className='footnote'>
      Trends include {isDebug ? 26 : 4} weeks, including the current week. 
      Read left to right as past to current.
    </p>
    <p className='footnote'>
      Completed on time {Pref.batches} are indicated in green.
      Completed late {Pref.batches} are indicated in yellow.
    </p>
  </details>
  */