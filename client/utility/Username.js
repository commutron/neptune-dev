const UserName = (id, nice) => {
  const user = Meteor.users.findOne({_id : id})?.username || 'not found';
  return nice ? user.replace('.', ' ').replace('_', ' ') : user;
};

export default UserName;