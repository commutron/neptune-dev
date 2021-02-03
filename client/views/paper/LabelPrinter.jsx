import React from 'react';


const LabelPrinter = ({ 
  batch, group, widget, ver, desc, sales, quant, 
  icon, color, lock 
})=> {
  
  const printThing = (htmlString)=> {
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
    
  };
  
  function labelFormater() {
    
    const printLabel = "box-sizing:content-box;font-family:sans-serif;width:900px;height:600px;margin:auto;padding:0;background-color:white;color:black;font-weight:900;font-stretch:semi-expanded;vertical-align:middle;";
    const halfPageFlip = "position:absolute;top:-5%;left:0;margin: 0;border:none;transform:rotate(180deg);";
    
    const printLabelDiv = "margin:20px 10px 10px 10px;padding:0;alignItems:center;";
    
    const centre = "display:flex;flex-direction:column;align-items:center;padding:0;text-transform:uppercase;";
    const centreRow = "display:flex;flex-direction:row;justify-content:space-evenly;align-items:center";
    const centreText = "text-align:center;";

    const pxlg = "font-size: 9rem; line-height: 1.1;";
    const plg = "font-size: 6rem;line-height: 1.2;";
    const pmd = "font-size: 3rem;";
    const psm = "font-size: 1.5rem;";
    
    const lblHTML =
      `<div style="${printLabel} ${halfPageFlip}">
        <div style="${centreRow} ${printLabelDiv}">
          <div style="${centreRow} ${printLabelDiv}>
            <div style="${centreText} ${printLabelDiv}">
              <i style="${pxlg}">${batch}</i>
            </div>
            <div style="${centreText} ${printLabelDiv}">
              <i style="${psm}">Qty</i><br />
              <i style="${plg}">${quant}</i>
            </div>
          </div>
          <div style="${centre} ${printLabelDiv}">
            <i style="${plg}">${group}</i>
            <i style="${pmd}">${widget} Rev. ${ver}</i>
            <i style="${pmd}">${desc}</i>
            <!--<i style="${pmd}">${sales}</i>-->
          </div>
        </div>
      </div>`;

    printThing(lblHTML);
  }
  
  return(
    <button
      title="One-Click Print"
      className='transparent'
      onClick={()=>labelFormater()}
      disabled={lock}>
      <label className='navIcon actionIconWrap'>
        <i className={`fas ${icon} fa-fw ${color}`}></i>
        <span className={'actionIconText ' + color}>Print</span>
      </label>
    </button>
  );
};
      
export default LabelPrinter;