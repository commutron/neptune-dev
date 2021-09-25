import React from 'react';
import Pref from '/client/global/pref.js';

import { min2hr } from '/client/utility/Convert';
import printTextThing from '/client/utility/PrintGenerator';

const BatchExport = ({ group, widget, variant, batchData, seriesData })=> {

  const handleExport = ()=> {
    
    const itemArray = !seriesData ? [] : Array.from(seriesData.items, x => 
            [ x.serial, x.subItems.join(', '), 
              !x.history.find( h => h.type === 'first' ) ? '' :
               x.history.find( h => h.type === 'first' && h.good === true ) ? 'PASS' : 'FAIL',
              !x.history.find( h => h.type === 'test' ) ? '' :
               x.history.find( h => h.type === 'test' && h.good === true ) ? 'PASS' : 'FAIL',
              seriesData.nonCon.filter( n => n.serial === x.serial ).length || '',
              seriesData.shortfall.filter( n => n.serial === x.serial ).length || '',
              x.scrapped ? 'YES' : '',
              x.completed ? new Date(x.completedAt).toLocaleString() : '',
            ]
          );
   
  const tbdgt = batchData.quoteTimeBudget.length > 0 ? min2hr(batchData.quoteTimeBudget[0].timeAsMinutes) : '0';
  
  const hsty = 'text-align:left;border: 1px solid lightgray;padding:0.5ch';
  const csty = 'border: 1px solid lightgray;line-height:1.7;padding:0.5ch';
  
  const exportHTML =
    `<div style="color:black;font-family:Verdana, sans-serif;-webkit-print-color-adjust:exact;color-adjust:exact">
      <table style="width:100%;margin:0 auto;font-family:Verdana, sans-serif;line-height:1;border-collapse:separate;table-layout:fixed;background-color:white">
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

      <table style="width:100%;margin:0 auto;line-height:1;border-collapse:collapse;table-layout:fixed;background-color:white">
        <tbody>
          <tr>
            <td colspan='2' class='body' style="padding:1% 5% 2% 5%;line-height: 1.5">
              <p style="margin:1rem 0;font-size:24pt"><b>${batchData.batch}</b></p>
              <p style="margin:1rem 0;font-size:14pt"><b>${batchData.salesOrder}</b></p>
            </td>
          </tr>
        </tbody>
      </table>
      
      <table style="width:100%;margin:0 auto;line-height:1;border-collapse:collapse;table-layout:fixed;background-color:white">
        <tbody>
          <tr>
            <td class='body' style="padding:1% 5% 2% 5%;line-height: 1.5;vertical-align:top">
              <p style="margin:1rem 0">Quantity: <b>${batchData.quantity}</b></p>
              <p style="margin:1rem 0">Serialized: <b>${batchData.serialize ? 'YES' : 'NO'}</b></p>
              <p style="margin:1rem 0">Quoted Time: <b>${tbdgt} hours</b></p>
            </td>
            <td class='body' style="padding:1% 5% 2% 5%;line-height: 1.5;vertical-align:top">
              <p style="margin:1rem 0">Customer: <b>${group}</b></p>
              <p style="margin:1rem 0">Product: <b>${widget.toUpperCase()}</b></p>
              <p style="margin:1rem 0">Variation: <b>${variant}</b></p>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div style="background-color:#007fff;width:100%;height:2px;margin:5px"></div>
      
      <table style="width:100%;margin:0 auto;line-height:1;border-collapse:collapse;table-layout:fixed;background-color:white">
        <tbody>
          <tr>
            <td class='body' style="padding:1% 5% 2% 5%;line-height: 1.5;vertical-align:top">
              <p style="margin:1rem 0">Issued: <b>${new Date(batchData.createdAt).toLocaleString()}</b></p>
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
      
      <div style="background-color:#007fff;width:100%;height:2px;margin:5px"></div>
      
      <p style="color:black;margin:1rem">Exported: ${new Date().toLocaleString()}, local time: America/Regina UTC-6</p>
      
      <div style="background-color:#007fff;width:100%;height:25px;margin:20px 0"></div>
      
      <div style="width:100%;page-break-inside:avoid;break-inside:avoid;page-break-before:always;break-before:always">
      
        <div style="background-color:#007fff;width:100%;height:5px;margin-top:20px"></div>
          <p style="color:black;float:left"><b>${batchData.batch}</b></p>
          <p style="color:black;float:right"><b>SERIALIZED ${Pref.item.toUpperCase()}S</b></p>
        <div style="background-color:#007fff;width:100%;height:5px;margin:20px 0;clear:both"></div>
            
        <table style="width:100%;table-layout:auto;border-collapse:collapse">
          <tr>
            <th style="${hsty}">Serial</th>
            <th style="${hsty}">Sub-Serials</th>
            <th style="${hsty}">First-Off</th>
            <th style="${hsty}">Tested</th>
            <th style="${hsty}">Noncons</th>
            <th style="${hsty}">Shortfalls</th>
            <th style="${hsty}">Scrapped</th>
            <th style="${hsty}"}>Completed</th>
          </tr>
          ${itemArray.map(function (row) {
            return `<tr>
              ${row.map(function (cell) {
                return `<td style="${csty}">${cell}</td>`;
              }).join('')
            }</tr>`;
          }).join('')
          }
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