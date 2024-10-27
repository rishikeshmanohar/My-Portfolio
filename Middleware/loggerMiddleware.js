// loggerMiddleware.js
function loggerMiddleware(req, res, next) {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next(); // Calls the next middleware in the stack
}

export default loggerMiddleware;
