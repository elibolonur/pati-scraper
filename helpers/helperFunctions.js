import iconv from 'iconv-lite';
import { areaList } from "./areaList";

class Helpers {

    static getAfterChar(id, char) {

        if (id) {
            return id.split(char).pop();
        }
        return id;
    }

    static getBetween(x, start, end) {

        return x ? x.substring(x.lastIndexOf(start) + 1, x.lastIndexOf(end) + 1).trim() : x;
    }

    static getBetweenFirst(x, start, end) {

        return x ? x.substring(x.lastIndexOf(start) + 1, x.indexOf(end)).trim() : x;
    }

    static getBetweenSecond(x, start, end) {

        return x ? x.substring(x.lastIndexOf(start) + 1, x.lastIndexOf(end)).trim() : x;
    }

    static getTime(x) {
        if (x) {
            return x.match(/([01]\d|2[0-3]):([0-5]\d)/)[0];
        }
        return x;
    }

    static getDateRegex(x) {
        if (x) {
            return x.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/)[0];
        }
    }

    static getTopicType(x) {
        if (x) {
            if (x.includes("message_sticky.gif")) {
                return "message_sticky";
            }
            else if (x.includes("message_sticky_new.gif")) {
                return "message_sticky_new";
            }
            else if (x.includes("message_sticky_locked.gif")) {
                return "message_sticky_locked";
            }
            else if (x.includes("message_locked.gif")) {
                return "message_locked";
            }
            else if (x.includes("message_new.gif")) {
                return "message_new";
            }
            else {
                return null;
            }

        }
    }

    static countMedals(x) {
        if (x) {
            if (x.includes("medal_10k.gif")) {
                return [1, 2, 3];
            }
            else if (x.includes("medal_5k.gif")) {
                return [1, 2];
            }
            else if (x.includes("medal_1k.gif")) {
                return [1];
            }
            else return [];
        }
    }

    static getUserTitle(x) {
        if (x) {
            if (x.includes("Y&#xF6;r&#xFC;nge Disi")) {
                return {isSpecial: false, name: "Yörünge Disi"};
            }
            else if (x.includes("&#xDC;ye")) {
                return {isSpecial: false, name: "Üye"};
            }
            else {
                let cheerio = require('cheerio');
                let $ = cheerio.load(x);
                return {isSpecial: true, name: $('span').text()};
            }
        }
    }

    static getMsgCountFromProfile(x) {
        if (x) {
            // match <dd>number</dd> tag, remove tags with replace
            return x.match(/(?:(<dd>))[1-9]\d{0,5}(?:(<\/dd>))/g)[0].replace(/(<([^>]+)>)/ig, "");
        }
    }

    static parseMsgBody(x) {
        if (x) {
            let cheerio = require('cheerio');
            let $ = cheerio.load(x);

            return $('.body').html();
        }
    }

    static parsePmBody(x) {
        if (x) {
            let cheerio = require('cheerio');
            let $ = cheerio.load(x);

            return $.html();
        }
    }

    static hasTopicNewMessage(x) {
        if (x) return (x.includes("message_new.gif") || x.includes("message_sticky_new.gif"));
        return false;
    }

    static isPostNew(x) {
        if (x) return x.includes("yeni");
        return false;
    }

    static isMessageNew(x) {
        if (x) return x.includes("strong");
        return false;
    }

    static getAreaParent(x) {
        if (x) {
            if (x.includes("favorites")) {
                return "favorites";
            }
            else if (x) {
                return areaList.find(a => a.link.includes(x)).parent;
            }
        }
    }

    static getAreaID(x) {
        if (x) {
            return x.replace(/[^\d]*/g, '');
        }
        return x;
    }

    static getMaxPageValue(x) {
        if (x) {
            return x.match(/\d+/g).map(Number)[1];
        }
        return x;
    }

    static getCookieValue(cookie) {
        if (cookie) {
            return cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";") + 1);
        }
        return "";
    }

    static decode(body) {
        return iconv.decode(new Buffer(body), 'ISO-8859-9')
    }
}

export default Helpers;