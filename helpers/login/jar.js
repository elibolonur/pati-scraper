import request from 'request';

let jar;

module.exports = {

    getJar: function () {
        if(jar) {
            return jar;
        }
        else {
            jar = request.jar();
            return jar;
        }
    },

    setJar: function (jarParam) {
        jar = jarParam;
    }
};
