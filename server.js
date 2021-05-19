const http = require('http');
const app = require('./app');
const server = http.createServer(app);


const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

function CRON(){
    setInterval(function(){
        let options={
            host:'hostals-iiitm.herokuapp.com',
            path:'/'
        };
        http.get(options,function(res){
            res.on('data',function(chunk){})
        }).on('error',function(err){})
    },20*60*1000);
}

CRON();

server.listen(PORT, HOST, function() {
    console.log('===============================================');
    console.log('Listening on\t:\thttp://'+HOST+':'+PORT);
    console.log('===============================================');
});
