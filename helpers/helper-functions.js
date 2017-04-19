class Helpers {

    static getID(id) {

        if (id) {
            return id.split("?").pop();
        }
        return id;
    }

    static getBetween(x, start, end) {

        if (x) {
            return x.substring(x.lastIndexOf(start) + 1, x.lastIndexOf(end)).trim();
        }
        return x;
    }

    static getTime(x) {
        if (x) {
            let match = x.match(/([01]\d|2[0-3]):([0-5]\d)/)[0];
            return match;
        }
        return x;
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
}

export default Helpers;