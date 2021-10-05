import React from 'react';
import Pref from '/client/global/pref.js';

import { min2hr, toCap } from '/client/utility/Convert';
import UserName from '/client/utility/Username';
import printTextThing from '/client/utility/PrintGenerator';

function getRel(brancheS, type) {
  if(type === 'floorRelease') {
    return 'Released to the Floor';
  }else if(type === 'pcbKitRelease') {
    return `Ready ${toCap(Pref.baseSerialPart)}s`;
  }else{
    const niceB = brancheS.find( b => ( 'BRK' + b.brKey ) === type );
    return `Ready ${toCap(niceB.common)}`;
  }
}

const BatchExport = ({ 
  group, widget, variant, brancheS,
  batchData, seriesData, rapidsData 
})=> {

  const handleExport = ()=> {
    
    const eventArray = [
      ...Array.from(batchData.events, x => 
            [ x.title, x.detail, x.time ] ),
      ...Array.from(batchData.releases, x => 
            [ getRel(brancheS, x.type), x.caution || '', x.time ] ),
      ...Array.from(batchData.altered, x => 
            [ 'Alter ' + x.changeKey, x.newValue, x.changeDate ] ),
      ...Array.from(batchData.quoteTimeBudget, x => 
            [ 'Set Quote Time Budget', ( x.timeAsMinutes || '0' ) + ' minutes', x.updatedAt ] )
    ];
    const eventS = eventArray.sort((a,b)=> a[2] > b[2] ? 1 : a[2] < b[2] ? -1 : 0);
        
    const tideArr = !batchData.tide ? [] : Array.from(batchData.tide, x => 
            [ toCap( UserName(x.who, true), true), x.task || '', 
              new Date(x.startTime).toLocaleString(),
              x.stopTime ? new Date(x.stopTime).toLocaleString() : '',
            ]
          ); 
    
    let countArr = [];
    for( let w of batchData.waterfall) {
      for( let x of w.counts ) { 
        countArr.push( [ w.gate, w.type, x.tick, x.time ] );
      }
    }
    const countS = [...countArr].sort((a,b)=> a[3] > b[3] ? 1 : a[3] < b[3] ? -1 : 0);

    const sub = !seriesData ? false : seriesData.items.some( y => y.subItems.length > 0 ); 
    const itemArray = !seriesData ? [] : Array.from(seriesData.items, x => 
            [ x.serial, sub ? x.subItems.join(', ') : null, 
              !x.history.find( h => h.type === 'first' ) ? '' :
               x.history.find( h => h.type === 'first' && h.good === true ) ? 'PASS' : 'FAIL',
              !x.history.find( h => h.type === 'test' ) ? '' :
               x.history.find( h => h.type === 'test' && h.good === true ) ? 'PASS' : 'FAIL',
              seriesData.nonCon.filter( n => n.serial === x.serial ).length || '',
              seriesData.shortfall.filter( n => n.serial === x.serial ).length || '',
              x.scrapped ? 'SCRAP' : '',
              x.completed ? new Date(x.completedAt).toLocaleString() : '',
            ]
          );
    
    let rapidArr = Array.from(rapidsData, x => 
                    [ x.rapid, x.issueOrder, x.type, x.quantity, 
                      new Date(x.createdAt).toLocaleString(),
                      x.closedAt ? new Date(x.closedAt).toLocaleString() : ''
                    ]
                  );

    const tbdgt = batchData.quoteTimeBudget.length > 0 ? min2hr(batchData.quoteTimeBudget[0].timeAsMinutes) : '0';
  
    const hsty = 'text-align:left;border: 1px solid lightgray;padding:0.5ch';
    const csty = 'border: 1px solid lightgray;line-height:1.7;padding:0.5ch';

  const exportHTML =
    `<div style="color:black;font-family:Verdana, sans-serif;-webkit-print-color-adjust:exact;color-adjust:exact;background-color:white">
     <table style="width:100%;margin:0 auto;font-family:Verdana, sans-serif;line-height:1;border-collapse:separate;table-layout:fixed">
        <tbody>
          <tr style="background-color:#007fff;height:50px;color:white">
            <td style="padding:0 10px">
              <div style="text-align:center">
                <span style="letter-spacing:1px;font-weight:900;font-size:22px">COMMUTRON</span>
                <br /><span style="font-weight:600;font-size:16px;letter-spacing:4px">Industries Ltd</span>
              </div>
            </td>
            <td style="text-align:center;padding:0 10px;font-size:16px;font-weight:600;letter-spacing:1px">
              <div style="text-align:center">
                <div style="text-align:center">
                  <span style="letter-spacing:1px;font-weight:900;font-size:22px">Neptune</span>
                  <br /><span style="font-weight:600;font-size:16px;letter-spacing:4px">Data Export</span>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>     

      <table style="width:100%;margin:0 auto;line-height:1;table-layout:fixed">
        <tbody>
          <tr>
            <td colspan='2' class='body' style="padding:1% 5% 2% 5%;line-height: 1.5">
              <p style="margin:1rem 0;font-size:24pt"><b>${batchData.batch}</b></p>
              <p style="margin:1rem 0;font-size:14pt">Sales Order: <b>${batchData.salesOrder}</b></p>
            </td>
          </tr>
        </tbody>
      </table>
      
      <table style="width:100%;margin:0 auto;line-height:1;table-layout:fixed">
        <tbody>
          <tr>
            <td class='body' style="padding:1% 5% 2% 5%;line-height: 1.5;vertical-align:top">
              <p style="margin:1rem 0">Quantity: <b>${batchData.quantity}</b></p>
              <p style="margin:1rem 0">Serialized: <b>${batchData.serialize ? 'YES' : 'NO'}</b></p>
              <p style="margin:1rem 0">Quoted Time: <b>${tbdgt} hours</b></p>
            </td>
            <td class='body' style="padding:1% 5% 2% 5%;line-height: 1.5;vertical-align:top">
              <p style="margin:1rem 0">Customer: <b>${toCap(group, true)}</b></p>
              <p style="margin:1rem 0">Product: <b>${widget.toUpperCase()}</b></p>
              <p style="margin:1rem 0">Variation: <b>${variant}</b></p>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div style="background-color:#007fff;width:100%;height:2px;margin:5px"></div>
      
      <table style="width:100%;margin:0 auto;line-height:1;border-collapse:collapse;table-layout:fixed">
        <tbody>
          <tr>
            <td class='body' style="padding:1% 5% 2% 5%;line-height: 1.5;vertical-align:top">
              <p style="margin:1rem 0">Created: <b>${new Date(batchData.createdAt).toLocaleString()}</b></p>
              <p style="margin:1rem 0">Completed: <b>${batchData.completedAt ? new Date(batchData.completedAt).toLocaleString() : 'NO'}</b></p>
            </td>
            <td class='body' style="padding:1% 5% 2% 5%;line-height: 1.5;vertical-align:top">
              <p style="margin:1rem 0">Sales Start: <b>${new Date(batchData.salesStart).toLocaleDateString()}</b></p>
              <p style="margin:1rem 0">Sales Fulfill: <b>${new Date(batchData.salesEnd).toLocaleDateString()}</b></p>
              </p>
            </td>
          </tr>
        </tbody>
      </table>
     
      <p style="color:black;margin:1rem"><small>Exported: ${new Date().toLocaleString()}, America/Regina UTC-6</small></p>
      
      <div style="background-color:#007fff;width:100%;height:25px;margin:20px 0"></div>
      
      <div style="width:100%;page-break-before:always;break-before:always">
        <table style="width:100%;table-layout:auto;border-collapse:collapse">
          <thead>
            <tr>
              <th colspan="3">
                <div style="background-color:#007fff;width:100%;height:5px;margin-top:20px"></div>
                  <p style="color:black;float:left"><b>${batchData.batch}</b></p>
                  <p style="color:black;float:right"><b>EVENTS</b></p>
                <div style="background-color:#007fff;width:100%;height:5px;margin:20px 0;clear:both"></div>
              </th>
            </tr>
            <tr>
              <th style="${hsty}">Title</th>
              <th style="${hsty}">Detail</th>
              <th style="${hsty}">Time</th>
            </tr>
          </thead>
          <tbody>
            ${eventS.map(function (row) {
              return `<tr>
                ${row.map(function (cell, index) {
                  if(index === 2) {
                    return `<td style="${csty}">${new Date(cell).toLocaleString()}</td>`;
                  }else{
                    return `<td style="${csty}">${cell}</td>`;
                }}).join('')
              }</tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
      
      ${rapidArr.length === 0 ? '' :
      `<div style="width:100%;page-break-before:always;break-before:always">
        <table style="width:100%;table-layout:auto;border-collapse:collapse">
          <thead>
            <tr>
              <th colspan="6">
                <div style="background-color:#007fff;width:100%;height:5px;margin-top:20px"></div>
                  <p style="color:black;float:left"><b>${batchData.batch}</b></p>
                  <p style="color:black;float:right"><b>${Pref.rapidExs.toUpperCase()}</b></p>
                <div style="background-color:#007fff;width:100%;height:5px;margin:20px 0;clear:both"></div>
              </th>
            </tr>
            <tr>
              <th style="${hsty}">Title</th>
              <th style="${hsty}">Issue</th>
              <th style="${hsty}">Type</th>
              <th style="${hsty}">Quantity</th>
              <th style="${hsty}">Created</th>
              <th style="${hsty}">Closed</th>
            </tr>
          </thead>
          <tbody>
            ${rapidArr.map(function (row) {
              return `<tr>
                ${row.map(function (cell) {
                  return `<td style="${csty}">${cell}</td>`;
                }).join('')
              }</tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>`
      }
      
      <div style="width:100%;page-break-before:always;break-before:always">
        <table style="width:100%;table-layout:auto;border-collapse:collapse">
          <thead>
            <tr>
              <th colspan="4">
                <div style="background-color:#007fff;width:100%;height:5px;margin-top:20px"></div>
                  <p style="color:black;float:left"><b>${batchData.batch}</b></p>
                  <p style="color:black;float:right"><b>PRODUCTION TIME</b></p>
                <div style="background-color:#007fff;width:100%;height:5px;margin:20px 0;clear:both"></div>
              </th>
            </tr>
            <tr>
              <th style="${hsty}">Person</th>
              <th style="${hsty}">Task</th>
              <th style="${hsty}">Start</th>
              <th style="${hsty}">Stop</th>
            </tr>
          </thead>
          <tbody>
            ${tideArr.map(function (row) {
              return `<tr>
                ${row.map(function (cell) {
                  return `<td style="${csty}">${cell}</td>`;
                }).join('')
              }</tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
      
      <div style="width:100%;page-break-before:always;break-before:always">
        <table style="width:100%;table-layout:auto;border-collapse:collapse">
          <thead>
            <tr>
              <th colspan="4">
                <div style="background-color:#007fff;width:100%;height:5px;margin-top:20px"></div>
                  <p style="color:black;float:left"><b>${batchData.batch}</b></p>
                  <p style="color:black;float:right"><b>COUNTERS</b></p>
                <div style="background-color:#007fff;width:100%;height:5px;margin:20px 0;clear:both"></div>
              </th>
            </tr>
            <tr>
              <th style="${hsty}">Step</th>
              <th style="${hsty}">Type</th>
              <th style="${hsty}">Increment</th>
              <th style="${hsty}">Time</th>
            </tr>
          </thead>
          <tbody>
            ${countS.map(function (row) {
              return `<tr>
                ${row.map(function (cell, index) {
                  if(index === 2) {
                    return `<td style="${csty}">${new Date(cell).toLocaleString()}</td>`;
                  }else{
                    return `<td style="${csty}">${cell}</td>`;
                }}).join('')
              }</tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
      
      <div style="width:100%;page-break-before:always;break-before:always">
        <table style="width:100%;table-layout:auto;border-collapse:collapse">
          <thead>
            <tr>
              <th colspan="${sub ? '8' : '7'}">
                <div style="background-color:#007fff;width:100%;height:5px;margin-top:20px"></div>
                  <p style="color:black;float:left"><b>${batchData.batch}</b></p>
                  <p style="color:black;float:right"><b>SERIALIZED ${Pref.item.toUpperCase()}S</b></p>
                <div style="background-color:#007fff;width:100%;height:5px;margin:20px 0;clear:both"></div>
              </th>
            </tr>
            <tr>
              <th style="${hsty}">Serial</th>
              ${sub ? `<th style="${hsty}">Sub-Serials</th>` : ''}
              <th style="${hsty}">First-Off</th>
              <th style="${hsty}">Tested</th>
              <th style="${hsty}">Noncons</th>
              <th style="${hsty}">Shortfalls</th>
              <th style="${hsty}">Scrapped</th>
              <th style="${hsty}">Completed</th>
            </tr>
          </thead>
          <tbody>
            ${itemArray.map(function (row) {
              return `<tr>
                ${row.map(function (cell) {
                  return cell === null ? '' : `<td style="${csty}">${cell}</td>`;
                }).join('')
              }</tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
      
    </div>`;
  
  
    printTextThing(exportHTML);
  };
  
  return(
    <button
      id='batchdataexport'
      className='smallAction blackT endSelf vmarginhalf'
      onClick={()=>handleExport()}
    >Export<i className="fas fa-file-export gapL"></i></button>
  );
};

export default BatchExport;