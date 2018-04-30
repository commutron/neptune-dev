import React from 'react';

const MetaPanel = ()=> {
  let sty = {
    fontFamily: 'monospace',
    textAlign: 'center',
    width: '50vw',
    margin: '25vh auto'
  };
  return(
    <div style={sty}>
      <p>Neptune 1.0.0-RC1</p>
      <p>Copyright (c) 2016-present Commutron Industries, https://www.commutron.ca</p>
      <p>Author 2016-present Matthew Andreas https://github.com/mattandwhatnot</p>
      <p>All Rights Reserved</p>
      <p>No License</p>
      <p>Source avaliable, limited to Github and the "Github Terms of Service"</p>
    </div>
  );
};

export default MetaPanel;