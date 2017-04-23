import iconv from 'iconv-lite';

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
                return "sticky";
            }
            else if (x.includes("message_sticky_locked.gif")) {
                return "sticky_locked";
            }
            else if (x.includes("message_locked.gif")) {
                return "locked";
            }
        }
    }

    static cleanMessageContent(x) {
        if (x) {
            // clear signature (so far so good lel)
            return x.substring(0, x.indexOf("<hr size"));
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

    static decode(body) {
        return iconv.decode(new Buffer(body), 'ISO-8859-9')
    }
}

export default Helpers;