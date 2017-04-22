import request from 'request';

let jar;

module.exports = {

    getJar: () => {
        if(jar) {
            return jar;
        }
        else {
            jar = request.jar();
            return jar;
        }
    },

    setJar: (jarParam) => {
        jar = jarParam;
    }
};
