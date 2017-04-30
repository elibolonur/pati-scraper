class ReqSettings {

    static settingsGet(url, jar) {
        return {
            url: url,
            jar: jar,
            headers: {"user-agent": "Crawler/1.0"},
            encoding: null
        };
    }

    static loginPost(url, jar, uname, pass) {
        let payload = "forum_id=0&redir=https%3A%2F%2Fforum.paticik.com%2Flist.php&forum_id=0&redir=https%3A%2F%2Fforum.paticik.com%2Flist.php&username=" + uname + "&password=" + pass;

        return {
            url: url,
            headers: {'content-type': 'application/x-www-form-urlencoded', "user-agent": "Crawler/1.0"},
            method: 'post',
            jar: jar,
            body: payload,
            encoding: null
        };
    }

    static topicPost(url, jar, formData) {

        return {
            url: url,
            headers: {'content-type': 'application/x-www-form-urlencoded', "user-agent": "Crawler/1.0"},
            method: 'post',
            jar: jar,
            formData: formData,
            encoding: null
        };
    }
}

export { ReqSettings };


