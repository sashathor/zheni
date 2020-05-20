module.exports = function functionResponse({
  statusCode = 200,
  response = {},
}) {
  return {
    headers: {
      'Content-type': 'application/json',
    },
    statusCode,
    body: JSON.stringify(
      statusCode === 200 ? { response } : { error: statusCode },
    ),
  };
};
