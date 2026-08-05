const http=require('http')
const server=http.createServer((req,res)=>{
    res.setHeader('Content-type','text/html')
    if(req.url==='/'|| req.url==='home'){
        res.statusCode=200
        res.end("<h1>Welcome Home</h1>")
    }else if (req.url === '/pizza') {
        res.statusCode = 200;
        res.end('<h1>This is your pizza</h1>');
    } else if (req.url === '/about') {
        res.statusCode = 200;
        res.end('<h1>Welcome to About Us</h1>');
    } else if (req.url === '/node') {
        res.statusCode = 200;
        res.end('<h1>Welcome to my Node Js project</h1>');
    } else {
        res.statusCode = 404;
        res.end('<h1>Page Not Found</h1>');
    }
});
let port=3000
server.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`);
})