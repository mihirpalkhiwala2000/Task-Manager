successmsgs = {
  sucesstext: "Successful",
  sucessfullogout: "You have successfully Logged out",
  sucessfullogoutall: "All users logged out",
  createdtext: "Created Sucessfully",
  loginmsg: "Logged in successfully",
};

errormsgs = {
  badrequestmsg: "Invalid request. Please try again!",
  servererrormsg: "There is an internal server error.",
  unauthorizedmsg: "Access denied, please login first",
  notfoundmsg: "Nothing relevant found. Please try again.",
};
statusCodes = {
  successcode: 200,
  createdcode: 201,
  badrequestcode: 400,
  unauthorizedcode: 401,
  notfoundcode: 404,
  servererrorcode: 500,
};
module.exports = {
  successmsgs,
  errormsgs,
  statusCodes,
};
