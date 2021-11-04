// special thanks to Ionut Daniel - https://codepen.io/thenutz/pen/VwYeYEE
export default function Grabber(scrollDiv) {
  var slider = document.querySelector(scrollDiv);

  var isDown = false;
  var startX;
  var scrollLeft;
  
  const move = (e)=> {
    if(isDown) {
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      slider.scrollLeft = scrollLeft - (x - startX);
    }
  };
    
  const down = (e)=> {
    isDown = true;
    slider.classList.add('grabber');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  };
  
  const turnoff = ()=> {
    isDown = false;
    slider.classList.remove('grabber');
  };


  slider.addEventListener('mousedown', down);
  slider.addEventListener('mouseup', turnoff);
  slider.addEventListener('mouseleave', turnoff);
  
  slider.addEventListener('mousemove', move);
}

// export function GrabberOFF(scrollDiv) {
//   var slider = document.querySelector(scrollDiv);
  
//   slider.removeEventListener('mousedown', down);
//   slider.removeEventListener('mouseleave', turnoff);
//   slider.removeEventListener('mouseup', turnoff);
//   slider.removeEventListener('mousemove', move);
// }