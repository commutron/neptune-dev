import React from 'react';
        
const IkyToggle = ()=> {
  function toggle() {
    const choice = this.ikyToggle.checked;
    Session.set('ikyView', choice);
    let findBox = document.getElementById('find');
  	findBox ? findBox.focus() : null;
  }
  return(
    <span>
      <input
        type='checkbox'
        id='ikyToggle'
        defaultChecked={Session.get('ikyView')}
        onChange={toggle}
        readOnly />
        <label htmlFor='ikyToggle' id='snapSwitch' className='navIcon dataFlip'>
          <span className='actionIconText'>Switch View</span>
        </label>
    </span>
  );
};

export default IkyToggle;