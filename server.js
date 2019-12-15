const express = require("express");
const { join } = require("path");
const app = express();


var AWS = require('aws-sdk');
var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
AWS.config.credentials = credentials;
// Load credentials and set region from JSON file
AWS.config.update({region: 'eu-north-1'});

// Create EC2 service object
var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});


// Serve static assets from the /public folder
app.use(express.static(join(__dirname, "public")));

// Endpoint to serve the configuration file
app.get("/auth_config.json", (req, res) => {
  res.sendFile(join(__dirname, "auth_config.json"));
});

// Serve the index page for all other requests
app.get("/", (_, res) => {
  res.sendFile(join(__dirname, "index.html"));
});




app.get("/addInstance", (_, res) => {
  // AMI is amzn-ami-2011.09.1.x86_64-ebs
  var instanceParams = {
     ImageId: 'ami-006cda581cf39451b',
     InstanceType: 't3.micro',
     KeyName: 'KEY_PAIR_NAME',
     MinCount: 1,
     MaxCount: 1
  };
// Create a promise on an EC2 service object
  var instancePromise = new AWS.EC2({apiVersion: '2016-11-15'}).runInstances(instanceParams).promise();

  // Handle promise's fulfilled/rejected states
  instancePromise.then(
    function(data) {
      console.log(data);
      var instanceId = data.Instances[0].InstanceId;
      console.log("Created instance", instanceId);

      // Add tags to the instance
      tagParams = {Resources: [instanceId], Tags: [
         {
            Key: 'Name',
            Value: 'SDK Sample'
         }
      ]};
      // Create a promise on an EC2 service object
      var tagPromise = new AWS.EC2({apiVersion: '2016-11-15'}).createTags(tagParams).promise();
      // Handle promise's fulfilled/rejected states
      tagPromise.then(
        function(data) {
          console.log("Instance tagged");
          res.send(instanceId);
        }).catch(
          function(err) {
          console.error(err, err.stack);
        });
    }).catch(
      function(err) {
      console.error(err, err.stack);
    });
});


app.post("/deleteInstance", (req, res) => {
  var inst_id = req.query.id;
  console.log(inst_id);

    // Create a promise on an EC2 service object
  var params = {
    InstanceIds: [ /* required */
      inst_id
      /* more items */
    ]
  };

  ec2.terminateInstances(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });

  // res.sendFile(join(__dirname, "index.html"));
});







// Listen on port 3000
app.listen(3000, () => console.log("Application running on port 3000"));