// B A S E
class User {
    constructor(id) {
        this.id = id;
    }

    get fullName() {
        return this.id;
    }
}

// A T T A C H M E N T S
class Photo {
    constructor(id, album, owner, uploader, text, date, sizes, props) {
        this.id = id;
        this.album = album;
        this.owner = new User(owner);
        this.uploader = new User(uploader);
        this.text = text;
        this.date = new UnixTimestamp(date);
        this.sizes = sizes;
        this.props = props;
    }

    get width() {
        return this.props.width;
    }

    get height() {
        return this.props.height;
    }

    get time() {
        return this.date.formattedString;
    }

    get largestImage() {
        let sizes = this.sizes;
        return sizes[sizes.length-1];
    }

    get smallestImage() {
        return this.sizes[0];
    }

    get ownerName() {
        return this.owner.fullName;
    }
}

class Video {
    constructor(id, owner, title, desc, duration, placeholder, date, views, comments, player) {
        this.id = id;
        this.owner = new User(owner);
        this.date = new UnixTimestamp(date);
        this.title = title;
        this.desc = desc;
        this.duration = new Duration(duration);
        this.placeholder = placeholder;
        this.views = views;
        this.comments = comments;
    }

    get formattedDuration() {
        return this.duration.formattedString();
    }

    get time() {
        return this.date.formattedString;
    }

    get ownerName() {
        return this.owner.fullName;
    }
}

// H E L P E R S
class UnixTimestamp {
    constructor(timestamp) {
        this.timestamp = timestamp;
    }

    get date() {
        return new Date(this.timestamp);
    }

    get formattedString() {
        return pad(this.date.getHours()) + pad(this.date.getMinutes());
    }
}

class Duration {
    constructor(seconds) {
        this.baseSeconds = seconds;
    }

    get minutes() {
        return Math.floor(this.baseSeconds / 60);
    }

    get seconds() {
        return this.baseSeconds - this.minutes * 60
    }

    get formattedString() {
        return this.minutes+":"+this.seconds;
    }
}