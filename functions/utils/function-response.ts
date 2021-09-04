const functionResponse = ({ statusCode = 200, response = {}, error = {} }) => ({
  headers: {
    'Content-type': 'application/json',
  },
  statusCode,
  body: JSON.stringify(statusCode === 200 ? { response } : { error }),
});

export { functionResponse };
