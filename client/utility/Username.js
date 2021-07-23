function find(id) {
  const user = Meteor.users.findOne({_id : id});
  let nice = 'not found';
  user ? nice = user.username : false;
  return nice;
}
    
const UserName = (id, nice) => {
  const user = find(id);
  return nice ? user.replace('.', ' ').replace('_', ' ') : user;
};

export default UserName;