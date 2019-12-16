fs = require('fs');
path = require('path');
node_ssh = require('node-ssh');
ssh = new node_ssh();

ssh.connect({
    host: 'ec2-13-48-204-14.eu-north-1.compute.amazonaws.com',
    username: 'ec2-user',
    privateKey: '.ssh/my_aws'
})
    .then(function() {
        ssh.execCommand('sudo yum install git -y')
    .then(function () {
        ssh.execCommand('git clone https://github.com/OlegMoiseev/files-for-grid.git')
    .then(function () {
        ssh.execCommand('python files-for-grid/hello.py')
    .then(function (result) {
        console.log('STDOUT: ' + result.stdout)
    })
    })
    })
    });
