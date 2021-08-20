const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "tutorialradix",
  api_key: "915743227468817",
  api_secret: "Swisvb29nHSx9H04W3Si2Q7BuVY",
});

module.exports = cloudinary;
