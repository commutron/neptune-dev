export default function printTextThing(htmlString) {
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