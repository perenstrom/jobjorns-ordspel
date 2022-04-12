export const addUser = (user) => {
  console.log('nu kör vi addUser');

  const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  };
  const url = '/api/users';
  const options = {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify({
      name: user.name,
      picture: user.picture,
      email: user.email
    })
  };
  fetch(url, options)
    .then((response) => {
      if (response.status === 200) {
        response.json().then((data) => console.log(data));
      } else {
        console.error(response.status);
      }
    })
    .catch((error) => {
      console.error(error);
    });
};
