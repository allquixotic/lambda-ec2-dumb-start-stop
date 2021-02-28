exports.handler = async (event) => {
    var AWS = require('aws-sdk');
    AWS.config.update({region: 'us-east-1'});
    var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});
    
    const argumentNames = ["op", "pass"];
    const arg = (ee) => {
      return event['queryStringParameters'][ee];
    };
    const good = (ar) => {
      return (typeof ar !== 'undefined' && ar);
    };
    const bad = (ar) => {return !good(ar);}
    const op = arg("op");
    const inst = process.env["inst"];
    const pass = arg("pass");
    
    var params = {
      InstanceIds: [inst],
      DryRun: false
    };
    
    var retval = "nothing";
    
    if(bad(op) || bad(pass)) {
        retval = `Invalid number/content of arguments. Should be: op=START/STOP&pass=password but ${JSON.stringify(event['queryStringParameters']).slice(0, 255)}`;
    }
    else {
    
    if(pass == process.env["pass"]) {
    
    if (op.toUpperCase() === "START") {
  // Call EC2 to start the selected instances
  try {
    retval = await ec2.startInstances(params).promise();
  }
  catch(err) {
    retval = err;
  }
} else if (op.toUpperCase() === "STOP") {
  // Call EC2 to stop the selected instances
  try {
    retval = await ec2.stopInstances(params).promise();
  }
  catch(err) {
    retval = err;
  }
}
else {
  retval = `Didn't understand operation ${op.slice(0, 255)}.`;
}

}
else {
    retval = "Invalid Password."
}
}
    
    const response = {
        statusCode: 200,
        body: JSON.stringify(retval),
    };
    return response;
};
