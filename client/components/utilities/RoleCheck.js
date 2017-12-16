import React from 'react';
import PropTypes from 'prop-types';

// to use 
// import RoleCheck from '/client/components/utilities/RoleCheck.js';
// <RoleCheck role='admin'>{children}</RoleCheck>

const RoleCheck = ({role, children}) => {
  if(Roles.userIsInRole(Meteor.userId(), role)) {
    return children;
  }
  return null;
};

RoleCheck.propTypes = {
  role: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ]).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]).isRequired
};

export default RoleCheck;