import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import Pref from '/client/global/pref.js';
import TrendLine from '/client/components/charts/Trends/TrendLine.jsx';
import TrendBar from '/client/components/charts/Trends/TrendBar.jsx';
import NumStatBox from '/client/components/charts/Dash/NumStatBox';
import BatchNewList from '../lists/BatchNewList';

import ToggleSearch from '/client/components/bigUi/MultiSearch/ToggleSearch';
import SerialResult from '/client/components/bigUi/MultiSearch/SerialResult';
import BatchResult from '/client/components/bigUi/MultiSearch/BatchResult';

const ExploreLanding = ({ 
  groupData, widgetData, variantData, 
  batchData, xBatchData, 
  app, isDebug
}) => {
  
  const [ tggl, tgglSet ] = useState( true );
  const [ queryState, querySet ] = useState( null );
	const [ resultState, resultSet ] = useState( null );
	
  const total = batchData.length;
  const xTotal = xBatchData.length;
  const live = batchData.filter( x => x.live === true ).length;
  const xlive = xBatchData.filter( x => x.live === true ).length;
  const process = batchData.filter( x => x.finishedAt === false ).length;
  const xProcess = xBatchData.filter( x => x.completed === false ).length;
  
  const locked = batchData.filter( x => x.lock === true ).length;
  const xlocked = xBatchData.filter( x => x.lock === true ).length;
  
  return(
    <section className='space1v'>
    
      <div className='wide'>
          
        <ToggleSearch
          tggl={tggl}
          tgglSet={tgglSet}
          queryState={queryState}
          queryUP={(v)=>querySet(v)}
          resultUP={(r)=>resultSet(r)}
          batchData={[...batchData, ...xBatchData]}
          widgetData={widgetData}
          variantData={variantData}
          groupData={groupData}
          app={app}
        />
      
      </div>
    
      {queryState ? 
      
        <div className='fixedResults forceScrollStyle wide max750'>
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
        </div> 
        
      :
        <div> 
          
          <div className='centreRow'>
            <TrendLine 
              title={`new ${Pref.batches}`}
              statType='newBatch'
              cycleCount={6}
              cycleBracket='month'
              lineColor='rgb(52, 152, 219)'
            />
            <TrendLine 
              title='new items'
              statType='newItem'
              cycleCount={6}
              cycleBracket='month'
              lineColor='rgb(52, 152, 219)' 
            />
            <TrendBar
              title={`completed ${Pref.batches}`}
              statType='doneBatch'
              cycleCount={6}
              cycleBracket='month'
            />
          </div>
        
          <div className='centreRow vspacehalf'>
            <NumStatBox
              number={live + xlive}
              name='WIP'
              borderColour='blue'
            />
            <NumStatBox
              number={( (live + xlive) - (process + xProcess) )}
              name='RMA'
              borderColour='red'
            />
            <NumStatBox
              number={(total + xTotal) - (process + xProcess)}
              name='Completed'
              borderColour='green'
            />
             <NumStatBox
              number={(total + xTotal)}
              name='Total'
            />
            <NumStatBox
              number={locked + xlocked}
              name='Locked'
              borderColour='rgb(155, 89, 182)'
            />
          </div>
       
          <div className='wide max750'>
            <BatchNewList
              batchData={[...batchData, ...xBatchData]}
              widgetData={widgetData}
              variantData={variantData}
              groupData={groupData}
            />
          </div>
          
        </div>
      }
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