import React from 'react';
import Pref from '/client/global/pref.js';

function printTextThing(htmlString) {
  if( htmlString && typeof document !== 'undefined' ) {

    let printableElement = document.createElement('iframe');
    printableElement.setAttribute('id', "printFrame");

    document.body.appendChild(printableElement);

    let printframe = document.getElementById("printFrame");
    let printArea = printframe.contentWindow.document.getElementsByTagName("HTML")[0];

    printArea.innerHTML = htmlString;

    printframe.contentWindow.focus();
    printframe.contentWindow.print();

    printableElement.remove();
  }else{
    alert('document not found');
  }
}

const ItemExport = ({ group, widget, variant, batch, sales, itemData, noncon, short })=> {

  const handleExport = ()=> {
    
    const firsts = itemData.history.filter( x => x.type === 'first' );
    const frstAr = Array.from(firsts, x => 
                  [ new Date(x.time).toLocaleString(),
                    x.step,
                    x.info.buildMethod.join(', '),
                    x.info.buildConsume || '',
                    x.info.verifyMethod,
                    x.good ? 'PASS' : 'FAIL',
                  ]
                );
                  
    const histry = itemData.history.filter( x => x.type !== 'first' );
    const histAr = Array.from(histry, x => 
                  [ new Date(x.time).toLocaleString(),
                    x.step, x.type, x.good ? 'PASS' : 'FAIL']
                  );
    
    const ncFltr = noncon.filter( x => x.trash !== true );
    const ncArry = Array.from(ncFltr, x => 
                  [ new Date(x.time).toLocaleString(),
                    x.ref, x.type, x.where, x.multi || '1',
                    x.fix ? new Date(x.fix.time).toLocaleString() : '',
                    x.inspect ? new Date(x.inspect.time).toLocaleString() : '' ]
                  );
                  
    const shArry = Array.from(short, x => 
                  [ new Date(x.uTime).toLocaleString(),
                    x.partNum, x.refs.join(', '), x.where, x.multi || '1',
                    x.inEffect === null ? Pref.shortagePending : 
                    x.inEffect === true ? Pref.doOmit : 
                    x.reSolve === null ? Pref.shortageWaiting : 
                    x.reSolve === false ? Pref.notResolved : 
                    Pref.isResolved ]
                  );
   
  const rapid = itemData.altPath.filter( x => x.rapId !== false );
  const rtnAr = Array.from(rapid, x => new Date(x.assignedAt).toLocaleString() );

  
  const exportHTML =
    `<div style="font-family:Verdana, sans-serif;-webkit-print-color-adjust:exact;color-adjust:exact">
      <table style="width:100%;margin:0 auto;font-family:Verdana, sans-serif;line-height:1;border-collapse:collapse;table-layout:fixed;background-color:white">
        <tbody>
          <tr style="background-color:#007fff;height:50px;color:white">
            <td style="padding:0 10px">
              <div style="text-align:center">
                <span style="letter-spacing:1px;font-weight:900;font-size:30px">Neptune</span>
              </div>
            </td>
            <td style="text-align:center;padding:0 10px;font-size:16px;font-weight:600;letter-spacing:1px;line-height:30px">Data Export</td>
          </tr>
        </tbody>
      </table>     

      <p style="color:black;margin:1rem">Exported: ${new Date().toLocaleString()}, local time: America/Regina UTC-6</p>
      
      <table style="width:100%;margin:0 auto;line-height:1;border-collapse:collapse;table-layout:fixed;background-color:white">
        <tbody>
          <tr>
            <td colspan='2' class='body' style="padding:1% 5% 2% 5%;line-height: 1.5">
              <p style="color:black;margin:1rem 0;font-size:24pt"><b>${itemData.serial}</b></p>
              <p style="color:black;margin:1rem 0;font-size:14pt"><b>${itemData.subItems.join(', ')}</b></p>
              <p style="color:black;margin:1rem 0;font-size:13pt">Work Order: <b>${batch}</b></p>
              <p style="color:black;margin:1rem 0;font-size:13pt">Sales Order: <b>${sales}</b></p>
              <p style="color:black;margin:1rem 0">Included Units: <b>${itemData.units}</b></p>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div style="background-color:#007fff;width:100%;height:2px;margin:5px"></div>
      
      <table style="width:100%;margin:0 auto;line-height:1;border-collapse:collapse;table-layout:fixed;background-color:white">
        <tbody>
          <tr>
            <td class='body' style="padding:1% 5% 2% 5%;line-height: 1.5;vertical-align:top">
              <p style="color:black;margin:1rem 0">Issued: <b>${new Date(itemData.createdAt).toLocaleString()}</b></p>
              <p style="color:black;margin:1rem 0">Completed: <b>${itemData.completedAt ? new Date(itemData.completedAt).toLocaleString() : 'NO'}</b></p>
              <p style="color:black;margin:1rem 0">Scrapped: <b>${itemData.scrapped ? 'YES' : 'NO'}</b></p>
              <dl style="color:black;margin:1rem 0">
                <dt>Returned: <b>${rtnAr.length === 0 ? ' NO' : ''}</b></dt>
                ${rtnAr.length === 0 ? rtnAr.map(function (line) {
                  return `<dd>${line}</dd>`;
                }).join('')
                : null}
              </dl>
            </td>
            <td class='body' style="padding:1% 5% 2% 5%;line-height: 1.5;vertical-align:top">
              <p style="color:black;margin:1rem 0">Customer: <b>${group}</b></p>
              <p style="color:black;margin:1rem 0">Product: <b>${widget.toUpperCase()}</b></p>
              <p style="color:black;margin:1rem 0">Variation: <b>${variant}</b></p>
            </td>
          </tr>
        </tbody>
      </table>
      <div style="background-color:#007fff;width:100%;height:25px;margin-bottom:20px"></div>
      
      <div style="background-color:#007fff;width:100%;height:5px;margin-top:20px;page-break-before:always;break-before:always"></div>
        <p style="color:black;float:left"><b>${itemData.serial}</b></p>
        <p style="color:black;float:right"><b>${Pref.trackFirst.toUpperCase()}</b></p>
      <div style="background-color:#007fff;width:100%;height:5px;margin:20px 0;clear:both"></div>

      <table style="width:100%;table-layout:auto;border-collapse:collapse;page-break-inside:avoid;break-inside:avoid">
        <tr>
          <th style="text-align:left;border: 1px solid lightgray">Time</th>
          <th style="text-align:left;border: 1px solid lightgray">Step</th>
          <th style="text-align:left;border: 1px solid lightgray">Method</th>
          <th style="text-align:left;border: 1px solid lightgray">Consumables</th>
          <th style="text-align:left;border: 1px solid lightgray">Inspection</th>
          <th style="text-align:left;border: 1px solid lightgray">Status</th>
        </tr>
        ${frstAr.map(function (line, index) {
          return `<tr>
            ${line.map(function (cell) {
              return `<td style="border: 1px solid lightgray;line-height:1.7">${cell}</td>`;
            }).join('')
          }</tr>`;
        }).join('')
        }
      </table>
            
      <div style="background-color:#007fff;width:100%;height:5px;margin-top:20px;page-break-before:always;break-before:always"></div>
        <p style="color:black;float:left"><b>${itemData.serial}</b></p>
        <p style="color:black;float:right"><b>${Pref.buildStep.toUpperCase()}</b></p>
      <div style="background-color:#007fff;width:100%;height:5px;margin:20px 0;clear:both"></div>
          
      <table style="width:100%;table-layout:auto;border-collapse:collapse;page-break-inside:avoid;break-inside:avoid">
        <tr>
          <th style="text-align:left;border: 1px solid lightgray">Time</th>
          <th style="text-align:left;border: 1px solid lightgray">Step</th>
          <th style="text-align:left;border: 1px solid lightgray">Type</th>
          <th style="text-align:left;border: 1px solid lightgray">Status</th>
        </tr>
        ${histAr.map(function (line, index) {
          return `<tr>
            ${line.map(function (cell) {
              return `<td style="border: 1px solid lightgray;line-height:1.7">${cell}</td>`;
            }).join('')
          }</tr>`;
        }).join('')
        }
      </table>
      
      <div style="background-color:#007fff;width:100%;height:5px;margin-top:20px;page-break-before:always;break-before:always"></div>
        <p style="color:black;float:left"><b>${itemData.serial}</b></p>
        <p style="color:black;float:right"><b>${Pref.nonCons.toUpperCase()}</b></p>
      <div style="background-color:#007fff;width:100%;height:5px;margin:20px 0;clear:both"></div>
         
      <table style="width:100%;table-layout:auto;border-collapse:collapse;page-break-inside:avoid;break-inside:avoid">
        <tr>
          <th style="text-align:left;border: 1px solid lightgray">Time</th>
          <th style="text-align:left;border: 1px solid lightgray">Referance</th>
          <th style="text-align:left;border: 1px solid lightgray">Defect</th>
          <th style="text-align:left;border: 1px solid lightgray">Process</th>
          <th style="text-align:left;border: 1px solid lightgray">Quantity</th>
          <th style="text-align:left;border: 1px solid lightgray">Repair</th>
          <th style="text-align:left;border: 1px solid lightgray">Inspection</th>
        </tr>
        ${ncArry.map(function (line, index) {
          return `<tr>
            ${line.map(function (cell) {
              return `<td style="border: 1px solid lightgray;line-height:1.7">${cell}</td>`;
            }).join('')
          }</tr>`;
        }).join('')
        }
      </table>
           
      <div style="background-color:#007fff;width:100%;height:5px;margin-top:20px;page-break-before:always;break-before:always"></div>
        <p style="color:black;float:left"><b>${itemData.serial}</b></p>
        <p style="color:black;float:right"><b>${Pref.shortfalls.toUpperCase()}</b></p>
      <div style="background-color:#007fff;width:100%;height:5px;margin:20px 0;clear:both"></div>
      
      <table style="width:100%;table-layout:auto;border-collapse:collapse;page-break-inside:avoid;break-inside:avoid">
        <tr>
          <th style="text-align:left;border: 1px solid lightgray">Time</th>
          <th style="text-align:left;border: 1px solid lightgray">Part Number</th>
          <th style="text-align:left;border: 1px solid lightgray">Referances</th>
          <th style="text-align:left;border: 1px solid lightgray">Process</th>
          <th style="text-align:left;border: 1px solid lightgray">Quantity</th>
          <th style="text-align:left;border: 1px solid lightgray">Resolution</th>
        </tr>
        <tr>
        ${shArry.map(function (line, index) {
          return `<tr>
            ${line.map(function (cell) {
              return `<td style="border: 1px solid lightgray;line-height:1.7">${cell}</td>`;
            }).join('')
          }</tr>`;
        }).join('')
        }
      </table>
          
    </div>`;
  
  
     printTextThing(exportHTML);
  };
  
  return(
    <button
      id='itemdataexport'
      className='action clearBlack'
      onClick={()=>handleExport()}
    ><i className="fas fa-file-export gapR"></i>Export</button>
  );
};

export default ItemExport;