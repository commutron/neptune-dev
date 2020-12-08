import { Meteor } from 'meteor/meteor';
import React from 'react';
import Pref from '/client/global/pref.js';
import TrendLine from '/client/components/charts/Trends/TrendLine.jsx';
import TrendBar from '/client/components/charts/Trends/TrendBar.jsx';
import NumBox from '/client/components/tinyUi/NumBox.jsx';
import SerialLookup from '/client/components/bigUi/SerialLookup/SerialLookup.jsx';
import BatchesListWide from '../lists/BatchesListWide.jsx';

const ExploreLanding = ({ 
  groupData, widgetData, variantData, 
  batchData, xBatchData, 
  app, isDebug
}) => {
  
  const total = batchData.length;
  const xTotal = xBatchData.length;
  const live = batchData.filter( x => x.live === true ).length;
  const xlive = xBatchData.filter( x => x.live === true ).length;
  const process = batchData.filter( x => x.finishedAt === false ).length;
  const xProcess = xBatchData.filter( x => x.completed === false ).length;
  
  const locked = batchData.filter( x => x.lock === true ).length;
  const xlocked = xBatchData.filter( x => x.lock === true ).length;
  
  return(
    
  <section>
    <div className='centre wide'>
      
      <div className='vspace wide'>
        
        <div className='centreRow'>
          <NumBox
            num={total + xTotal}
            name={'Total ' + Pref.batch + 's'}
            color='blueT' />
          <NumBox
            num={live + xlive}
            name={'live ' + Pref.batch + 's'}
            color='blueT' />
          <NumBox
            num={process + xProcess}
            name={'In Process ' + Pref.batch + 's'}
            color='blueT' />
          <NumBox
            num={(total + xTotal) - (process + xProcess)}
            name={'Finished ' + Pref.batch + 's'}
            color='greenT' />
          {isDebug &&
            <NumBox
              num={locked + xlocked}
              name={'Locked ' + Pref.batches}
              title={`Non-Active,\nYear Old Finished Date\nperformance optimization`}
              color='purpleT' />}
      </div>
      
        <div className='centreRow'>
          
          <TrendLine 
            title={`new ${Pref.batches}`}
            statType='newBatch'
            cycleCount={isDebug ? 26 : 4}
            cycleBracket='week'
            lineColor='rgb(52, 152, 219)' />
          
          <TrendLine 
            title='new items'
            statType='newItem'
            cycleCount={isDebug ? 26 : 4}
            cycleBracket='week'
            lineColor='rgb(52, 152, 219)' />
          
          <TrendBar
            title={`completed ${Pref.batches}`}
            statType='doneBatch'
            cycleCount={isDebug ? 26 : 4}
            cycleBracket='week' />
          
        </div>
        
        <SerialLookup app={app} />
        
        
        
        <BatchesListWide
          batchData={[...batchData, ...xBatchData]}
          widgetData={widgetData}
          variantData={variantData}
          groupData={groupData}
          app={app} />
        
        {/*  
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
        */}
        
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
      
        </div>
        
      </div>
    </section>
  );
};

export default ExploreLanding;