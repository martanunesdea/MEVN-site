module.exports = {
    devServer: {
        proxy: 'http://localhost:8000', // tells front end that all request going to localhost 8000 should be treated as if they were going to same origin front end is running
    }
}