//This is only example how to write function
const stringToObject = (inputString: string) => {
  try {
    const resultObject = JSON.parse(inputString);
    return resultObject;
  } catch (error) {
    return error;
  }
};

export { stringToObject };
