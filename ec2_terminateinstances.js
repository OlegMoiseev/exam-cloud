// Load the AWS SDK for Node.js

var AWS = require('aws-sdk');
var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
AWS.config.credentials = credentials;
// Load credentials and set region from JSON file
AWS.config.update({region: 'eu-north-1'});

// Create EC2 service object
var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});



var params = {
  InstanceIds: [ /* required */
    'i-0a85808b91292d5e0'
    /* more items */
  ]
};

ec2.terminateInstances(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});