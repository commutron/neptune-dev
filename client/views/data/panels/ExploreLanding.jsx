import { Meteor } from 'meteor/meteor';
import React from 'react';
import Pref from '/client/global/pref.js';
import NumBox from '/client/components/uUi/NumBox.jsx';
import TrendLine from '/client/components/charts/Trends/TrendLine.jsx';
import TrendBar from '/client/components/charts/Trends/TrendBar.jsx';

const ExploreLanding = ({ groupData, widgetData, batchData, xBatchData, app }) => {
  
  const total = batchData.length;
  const xTotal = xBatchData.length;
  const live = batchData.filter( x => x.live === true ).length;
  const xlive = xBatchData.filter( x => x.live === true ).length;
  const process = batchData.filter( x => x.finishedAt === false ).length;
  const xProcess = xBatchData.filter( x => x.completed === false ).length;
  const verAdd = Array.from(widgetData, x => x.versions.length).reduce((x, y) => x + y, 0);
  
  return(
    <div className=''>
      <div className='centre wide'>
        
        <div className='centreRow'>
          <NumBox
            num={groupData.length}
            name={Pref.group + 's'}
            color='blueT' />
          <NumBox
            num={widgetData.length}
            name={Pref.widget + 's'}
            color='blueT' />
          <NumBox
            num={verAdd}
            name={Pref.version + 's'}
            color='blueT' />
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
        </div>
        
        <div className='vspace wide'>
          
          <div className='centreRow'>
            <TrendLine 
              title={`new ${Pref.batches}`}
              statType='newBatch'
              lineColor='rgb(52, 152, 219)' />
            <TrendBar
              title={`completed ${Pref.batches}`}
              statType='doneBatch' />
            <TrendLine 
              title={`completed ${Pref.items}`}
              statType='doneItem'
              lineColor='rgb(46, 204, 113)' />
          </div>
          
          <div className='centreRow'>  
            <TrendLine 
              title={`discovered ${Pref.nonCons}`}
              statType='newNC' 
              lineColor='rgb(231, 76, 60)' />
            <TrendLine 
              title={`discovered ${Pref.shortfall}s`}
              statType='newSH' 
              lineColor='rgb(230, 126, 34)' />
            <TrendLine 
              title='scrapped items'
              statType='scrapItem' 
              lineColor='rgb(192, 57, 43)' />
          </div>
        
          <details className='footnotes'>
            <summary>Chart Details</summary>
            <p className='footnote'>
              Trends include six (6) weeks, including the current week. 
            </p>
            <p className='footnote'>
              Completed on time {Pref.batches} are indicated in green.
              Completed late {Pref.batches} are indicated in yellow.
            </p>
          </details>
      
        </div>
        
      </div>
    </div>
  );
};

export default ExploreLanding;