//POST route handler
const postHandler = async (url = ' ', pData = {}) => {
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(pData),
  });
  try {
    const getPData = await response.json();
    return getPData;
  } catch (error) {
    console.log(error);
  };
};

export {
  postHandler
}
