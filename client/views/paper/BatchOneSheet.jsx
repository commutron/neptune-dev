import React from 'react';
import moment from 'moment';
import Pref from '/public/pref.js';
import { toast } from 'react-toastify';
import { toCap } from '/client/utility/Convert';
import printTextThing from '/client/utility/PrintGenerator';
import DATAMatrix from '/client/utility/datamatrix-svg/datamatrix.js';

function getInstructData(instructURL) {
  if(instructURL) { 
    const http = instructURL + ".json";
    if(http) {
      return new Promise((res, rej)=> {
        fetch(http, {})
        .catch( (e)=> { rej(e) })
        .then( (response)=> {
          if(response?.ok) { return response.json(); }
        })
        .then( (articles)=> {
          res(articles);
        });
      })
      .catch( ()=> {
        toast.error(Pref.docs + ' 404 Not Found');
      });
    }
  }
  return false;
}

const GenBarcode = (text)=> {
  let svgNode = DATAMatrix({
                  msg :  text,
                  dim :   64,
                  pal : ["#000000", "#fff"]
                });
  return svgNode.outerHTML;
};

const BatchOneSheet = ({ 
  group, widget, desc,
  variantData, batchData,
  riverTitle, rootURL,
  extraClass
})=> {
  
  
  const handleDataTest = async ()=> {
    toast('Generating Label...');
    
    const batch = batchData.batch;
    const so = batchData.salesOrder;
    const due = moment(batchData.salesEnd).format('dddd, MMMM D, YYYY'); // date
    const qty = batchData.quantity; // num
    const flow = riverTitle; 
    
    const ver = variantData.variant;
    const rad = variantData.radioactive; // false or text
    // const vnote = variantData.notes; // false or object [content(text), time(dateObj), who(userId)]
    
    const inst = variantData.instruct;
    const instructURL = inst && inst.includes('http') ? inst : rootURL + inst; 
    const neptuneURL = window.location.href;
    
    const outsource = await getInstructData(instructURL);
    
    
    const solder = outsource?.solder || '';
    const flux = outsource?.flux || '';
    const partstock = outsource?.partstock || ''; // null, 'stock', 'supply', 'both', 'other'
    
    const verify = outsource?.verified || ''; // bool
    const notice = outsource?.notice || ''; // ""

    const exportHTML =
    `<div style="size:letter;color:black;font-family:VarelaLocal,Verdana,system-ui,sans-serif;-webkit-print-color-adjust:exact;color-adjust:exact;background-color:white">
     
      <div style="background-color:#007fff;width:100%;height:5px;margin:5px"></div>
      
      <table style="width:100%;margin:0 auto;line-height:1;table-layout:fixed">
        <tbody>
          <tr>
            <td colspan='2' style="padding:25px;vertical-align:center;font-family:var(--styled-font);">
              <p style="margin:5px 0;font-size:600%"><b>${batch}</b></p>
            </td>
            <td colspan='1' rowspan='3' style="vertical-align:top;padding:none;">
              <table>
                <tbody>
                  <tr>${!solder ? GenSolder('??', 'white') :
                      solder === 'lead' ? GenSolder('PB', 'lightgray') :
                      solder === 'leadfree' ? GenSolder('PB FREE', 'rgb(46,204,113)') :
                      GenSolder('OTHER', 'yellow')
                  }</tr>
                  <tr>${!flux ? GenFlux('??', 'white') :
                      flux === 'noclean' ? GenFlux('NO-CLEAN', 'lightgray') :
                      flux === 'waterwash' ? GenFlux('WATER-WASH', 'rgb(52,152,219)') :
                      flux === 'both' ? GenFlux('WATER-WASH & NO-CLEAN', 'rgb(52,152,219)') :
                      GenFlux('OTHER', 'yellow')
                  }</tr>
                  <tr>${!partstock ? GenParts('??', 'white') :
                      partstock === 'stock' ? GenParts('Commutron Stock') :
                      partstock === 'supply' ? GenParts('Customer Supplied') :
                      partstock === 'both' ? GenParts('Commutron Stock & Customer Supplied') :
                      GenParts('OTHER')
                  }</tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td colspan='2' style="padding:1% 5% 2% 5%;line-height: 1.5;vertical-align:top;">
              ${ProdLine(toCap(group, true))}
              ${ProdLine(widget.toUpperCase())}
              ${ProdLine(ver)}
              ${ProdLine(desc)}
            </td>
          </tr>
          <tr>
            <td colspan='2' style="padding:1% 5% 2% 5%;line-height: 1.5;vertical-align:top;">
              <p style="margin:1rem 0">Due Date: <b>${due}</b></p>
              <p style="margin:1rem 0">Sales Order: <b>${so}</b></p>
              <p style="margin:1rem 0">Quantity: <b>${qty}</b></p>
              <p style="margin:1rem 0">Process: <b>${flow}</b></p>
              ${rad ? `<p style="margin:1rem 0">${toCap(Pref.radio,true)}: <b>${rad}</b></p>` : ''}
            </td>
          </tr>
        </tbody>
      </table>
      
      <table style="width:100%;margin:0 auto;line-height:1;border-collapse:collapse;table-layout:fixed">
        <tbody>
          <tr>${verify ? GenVerify('VERIFIED', 'lightgreen') : GenVerify('NOT VERIFIED', 'rgb(211,84,0)')}</tr>
          ${notice ? `<tr><td style="padding:15px;line-height:1.1;vertical-align:top;border:1px groove rgb(211,84,0)">
              <p>⚠ Notice: ${notice}</p>
            </td></tr>` : ''}
        </tbody>
      </table>
     
      <table style="width:100%;margin:20 auto;line-height:1;border-collapse:separate;table-layout:fixed">
        <tbody>
          <tr>
            <td style="text-align:center;padding:0 10px">
              ${GenBarcode(neptuneURL)}<br />Neptune
            </td>
            <td style="text-align:center;padding:0 10px">
              ${GenBarcode(instructURL)}<br />Pisces
            </td>
          </tr>
        </tbody>
      </table>
      
      <table style="width:100%;margin:0 auto;line-height:1;border-collapse:separate;table-layout:fixed">
        <tbody>
          <tr style="background-color:#007fff;height:25px;color:white">
            <td style="padding:0">
              <div style="text-align:center;letter-spacing:1px;">
                <span style="font-weight:900;font-size:12px">COMMUTRON</span>
                <br /><span style="font-weight:600;font-size:8px;">Industries Ltd</span>
              </div>
            </td>
            <td style="padding:0">
              <div style="text-align:center;letter-spacing:1px;">
                <div style="text-align:center">
                  <span style="font-weight:900;font-size:12px">Neptune</span>
                  <br /><span style="font-weight:600;font-size:8px;">Top Sheet</span>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <p style="color:black;margin:1rem;text-align:center"><small>Printed: ${new Date().toLocaleString()}</small></p>
      
    </div>`;
  
    printTextThing(exportHTML);
  };
  
  return(
    <button
      id='batchtopprint'
      className={extraClass}
      onClick={()=>handleDataTest()}
    ><i className="fas fa-newspaper gapR"></i>Print Top Sheet</button>
  );
};

export default BatchOneSheet;

const ProdLine = (text)=> `<p style="margin:1rem 0;font-size:125%;font-weight:bold">${text}</p>`;

const GenSolder = (text, color)=> {
  return `<td style="
            display:flex;justify-content:center;align-items:center;
            text-align:center;line-height:1.1;font-weight:600;font-size:300%;
            padding:25px;
            background-color:${color}"
          >${text}</td>`;
};

const GenFlux = (text, color)=> {
  return `<td style="
            display:flex;justify-content:center;align-items:center;
            text-align:center;line-height:1.1;font-weight:600;font-size:200%;
            padding:25px;
            background-color:${color}"
          >${text}</td>`;
};

const GenParts = (text)=> {
  return `<td style="
            display:flex;justify-content:center;align-items:center;
            text-align:center;line-height:1.1;font-weight:600;font-size:200%;
            padding:25px;
            background-color:whitesmoke"
          >${text}</td>`;
};

const GenVerify = (text, color)=> {
  return `<tr><td style="
            display:flex;justify-content:center;align-items:center;
            text-align:center;font-weight:600;font-size:125%;
            padding:10px;
            background-color:${color}"
          >Instructions ${text}</td></tr>`;
};
          