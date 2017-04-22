import * as jar from '../helpers/login/jar';

class Providers {

    static settingsGet(url) {
        return {
            url: url,
            jar: jar.getJar(),
            headers: {"user-agent": "Crawler/1.0"},
            encoding: null
        };
    }

    static settingsPost(url, uname, pass) {
        let payload = "forum_id=0&redir=https%3A%2F%2Fforum.paticik.com%2Flist.php&forum_id=0&redir=https%3A%2F%2Fforum.paticik.com%2Flist.php&username=" + uname + "&password=" + pass;

        return {
            url: url,
            headers: {'content-type': 'application/x-www-form-urlencoded', "user-agent": "Crawler/1.0"},
            method: 'post',
            jar: jar.getJar(),
            body: payload,
            encoding: null
        };
    }
}

export default Providers;


