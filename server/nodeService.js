const Service = require('node-windows').Service;

const svc = new Service({
    name: "College DB Management Server",
    description: "Node-Windows Service for starting every bootup time",
    script: "C:\\Users\\Lenovo\\Desktop\\app\\College-student-management\\server\\app.js"
});

svc.on('install', function(){
    svc.start();
});

svc.install();
