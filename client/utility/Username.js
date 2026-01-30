const UserName = (id, nice) => {
  const user = Meteor.users.findOne({_id : id})?.username || 'not found';
  return nice ? user.replace(/[._]/g, ' ').replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))) : user;
};

export default UserName;