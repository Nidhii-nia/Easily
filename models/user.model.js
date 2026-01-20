

const users = [];

export default class userModel{

    static addUser(userObj){
        users.push(userObj);
        console.log(users);
        
    }

  static auth(mail, pass) {
  const user = users.find(
    user => user.email === mail && user.password === pass
  );

  if (!user) {
    return null;
  }

  return {
    name: user.name,
    email: user.email
  };
}

}