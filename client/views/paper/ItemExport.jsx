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
  
  console.log(rapid);
  
  const rtnAr = Array.from(rapid, x => new Date(x.assignedAt).toLocaleString() );
  
  console.log(rtnAr);
  
  const hsty = 'text-align:left;border: 1px solid lightgray;text-indent:0.5ch';
  const csty = 'border: 1px solid lightgray;line-height:1.7;text-indent:0.5ch';
  
  const exportHTML =
    `<div style="color:black;font-family:Verdana, sans-serif;-webkit-print-color-adjust:exact;color-adjust:exact">
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

      <table style="width:100%;margin:0 auto;line-height:1;border-collapse:collapse;table-layout:fixed;background-color:white">
        <tbody>
          <tr>
            <td colspan='2' class='body' style="padding:1% 5% 2% 5%;line-height: 1.5">
              <p style="margin:1rem 0;font-size:24pt"><b>${itemData.serial}</b></p>
              <p style="margin:1rem 0;font-size:14pt"><b>${itemData.subItems.join(', ')}</b></p>
            </td>
          </tr>
        </tbody>
      </table>
      
      <table style="width:100%;margin:0 auto;line-height:1;border-collapse:collapse;table-layout:fixed;background-color:white">
        <tbody>
          <tr>
            <td class='body' style="padding:1% 5% 2% 5%;line-height: 1.5;vertical-align:top">
              <p style="margin:1rem 0;font-size:13pt">Work Order: <b>${batch}</b></p>
              <p style="margin:1rem 0;font-size:13pt">Sales Order: <b>${sales}</b></p>
              <p style="margin:1rem 0">Included Units: <b>${itemData.units}</b></p>
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
              <p style="margin:1rem 0">Issued: <b>${new Date(itemData.createdAt).toLocaleString()}</b></p>
              <p style="margin:1rem 0">Completed: <b>${itemData.completedAt ? new Date(itemData.completedAt).toLocaleString() : 'NO'}</b></p>
            </td>
            <td class='body' style="padding:1% 5% 2% 5%;line-height: 1.5;vertical-align:top">
              <p style="margin:1rem 0">Scrapped: <b>${itemData.scrapped ? 'YES' : 'NO'}</b></p>
              <p style="margin:1rem 0">Returned: <b>${rtnAr.length === 0 ? ' NO' : ''}</b>
                ${rtnAr.length === 0 ? rtnAr.map(function (line) {
                  return `<b>${line}</b>`;
                }).join('')
                : ''}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div style="background-color:#007fff;width:100%;height:2px;margin:5px"></div>
      
      <p style="color:black;margin:1rem">Exported: ${new Date().toLocaleString()}, local time: America/Regina UTC-6</p>
      
      <div style="background-color:#007fff;width:100%;height:25px;margin:20px 0"></div>
      
      ${frstAr.length === 0 ? '' :
      `<div style="width:100%;page-break-inside:avoid;break-inside:avoid">

        <div style="background-color:#007fff;width:100%;height:5px;margin-top:20px"></div>
          <p style="float:left"><b>${itemData.serial}</b></p>
          <p style="float:right"><b>${Pref.trackFirst.toUpperCase()}</b></p>
        <div style="background-color:#007fff;width:100%;height:5px;margin:20px 0;clear:both"></div>
  
        <table style="width:100%;table-layout:auto;border-collapse:collapse">
          <tr>
            <th style="${hsty}">Time</th>
            <th style="${hsty}">Step</th>
            <th style="${hsty}">Method</th>
            <th style="${hsty}">Consumables</th>
            <th style="${hsty}">Inspection</th>
            <th style="${hsty}">Status</th>
          </tr>
          ${frstAr.map(function (line, index) {
            return `<tr>
              ${line.map(function (cell) {
                return `<td style="${csty}">${cell}</td>`;
              }).join('')
            }</tr>`;
          }).join('')
          }
        </table>
      
      </div>`
      }
      
      <div style="width:100%;page-break-inside:avoid;break-inside:avoid;page-break-before:always;break-before:always">
      
        <div style="background-color:#007fff;width:100%;height:5px;margin-top:20px"></div>
          <p style="color:black;float:left"><b>${itemData.serial}</b></p>
          <p style="color:black;float:right"><b>${Pref.buildStep.toUpperCase()}</b></p>
        <div style="background-color:#007fff;width:100%;height:5px;margin:20px 0;clear:both"></div>
            
        <table style="width:100%;table-layout:auto;border-collapse:collapse">
          <tr>
            <th style="${hsty}">Time</th>
            <th style="${hsty}">Step</th>
            <th style="${hsty}"}>Type</th>
            <th style="${hsty}">Status</th>
          </tr>
          ${histAr.map(function (line, index) {
            return `<tr>
              ${line.map(function (cell) {
                return `<td style="${csty}">${cell}</td>`;
              }).join('')
            }</tr>`;
          }).join('')
          }
        </table>
      
      </div>
      
      <div style="width:100%;page-break-inside:avoid;break-inside:avoid;page-break-before:always;break-before:always">
      
        <div style="background-color:#007fff;width:100%;height:5px;margin-top:20px"></div>
          <p style="color:black;float:left"><b>${itemData.serial}</b></p>
          <p style="color:black;float:right"><b>${Pref.nonCons.toUpperCase()}</b></p>
        <div style="background-color:#007fff;width:100%;height:5px;margin:20px 0;clear:both"></div>
           
        <table style="width:100%;table-layout:auto;border-collapse:collapse">
          <tr>
            <th style="${hsty}">Time</th>
            <th style="${hsty}">Reference</th>
            <th style="${hsty}">Defect</th>
            <th style="${hsty}">Process</th>
            <th style="${hsty}">Quantity</th>
            <th style="${hsty}">Repair</th>
            <th style="${hsty}">Inspection</th>
          </tr>
          ${ncArry.map(function (line, index) {
            return `<tr>
              ${line.map(function (cell) {
                return `<td style="${csty}">${cell}</td>`;
              }).join('')
            }</tr>`;
          }).join('')
          }
        </table>
      
      </div>
      
      <div style="width:100%;page-break-inside:avoid;break-inside:avoid;page-break-before:always;break-before:always">
      
        <div style="background-color:#007fff;width:100%;height:5px;margin-top:20px"></div>
          <p style="color:black;float:left"><b>${itemData.serial}</b></p>
          <p style="color:black;float:right"><b>${Pref.shortfalls.toUpperCase()}</b></p>
        <div style="background-color:#007fff;width:100%;height:5px;margin:20px 0;clear:both"></div>
        
        <table style="width:100%;table-layout:auto;border-collapse:collapse">
          <tr>
            <th style="${hsty}">Time</th>
            <th style="${hsty}">Part Number</th>
            <th style="${hsty}">References</th>
            <th style="${hsty}">Process</th>
            <th style="${hsty}">Quantity</th>
            <th style="${hsty}">Resolution</th>
          </tr>
          <tr>
          ${shArry.map(function (line, index) {
            return `<tr>
              ${line.map(function (cell) {
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
      id='itemdataexport'
      className='action clearBlack'
      onClick={()=>handleExport()}
    ><i className="fas fa-file-export gapR"></i>Export</button>
  );
};

export default ItemExport;