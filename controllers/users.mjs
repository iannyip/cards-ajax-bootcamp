export default function initUsersController(db) {
  const index = async () => {
    console.log('test');
  };

  const login = async (request, response) => {
    try {
      console.log('login check!');
      console.log(request.body);

      const user = await db.User.findOne({
        where: { email: request.body.email },
      });
      console.log(user);
      if (user === null) {
        response.send('invalid');
      } else {
        response.send('valid');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    index,
    login,
  };
}
