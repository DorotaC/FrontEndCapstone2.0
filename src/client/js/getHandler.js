//GET route handler
const getHandler = async (url = ' ', gData = {}) => {
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'same-origin',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(gData),
  });
  try {
    const getGData = await response.json();
    return getGData;
  } catch (error) {
    console.log(error);
  };
};

export {
  getHandler
}
