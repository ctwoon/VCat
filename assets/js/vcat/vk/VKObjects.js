// vk.com/dev/objects made in JS classes
// made by iTaysonLab in 2018

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
class Attachment {
    constructor(id, owner, date) {
        this.id = id;
        this.owner = new User(owner);
        this.date = new UnixTimestamp(date);
    }

    get ownerName() {
        return this.owner.fullName;
    }

    get time() {
        return this.date.formattedString;
    }
}

class Photo extends Attachment {
    constructor(id, album, owner, uploader, text, date, sizes, props) {
        super(id, owner, date);
        this.album = album;
        this.uploader = new User(uploader);
        this.text = text;
        this.sizes = sizes;
        this.props = props;
    }

    get width() {
        return this.props.width;
    }

    get height() {
        return this.props.height;
    }

    get largestImage() {
        let sizes = this.sizes;
        return sizes[sizes.length-1];
    }

    get smallestImage() {
        return this.sizes[0];
    }

    get fullID() {
        return this.owner.id + "_" + this.id
    }
}

class Video extends Attachment {
    constructor(id, owner, title, desc, duration, placeholder, date, views, comments, player, access_key) {
        super(id, owner, date);
        this.title = title;
        this.desc = desc;
        this.duration = new Duration(duration);
        this.placeholder = placeholder;
        this.views = views;
        this.comments = comments;
        this.access_key = access_key;
    }

    get formattedDuration() {
        return this.duration.formattedString();
    }

    get fullID() {
        if (this.access_key) {
            return this.owner.id + "_" + this.id + "_" + this.access_key;
        } else {
            return this.owner.id + "_" + this.id;
        }
    }
}

class Document extends Attachment {
   constructor(id, owner, title, ext, size, url, date, type) {
       super(id, owner, date);
       this.title = title;
       this.ext = ext;
       this.size = new ByteSize(size);
       this.url = url;
       this.type = type;
   }

   get fileName() {
       return this.title + "." + this.ext;
   }
}

class Link {
    constructor(title, caption, url) {
        this.title = title;
        this.caption = caption;
        this.url = url;
    }
}

class Album extends Attachment{
    constructor(id, owner, date, placeholder, title, desc) {
        super(id, owner, date);
        this.placeholder = new Photo();
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

class ByteSize {
    constructor(bytes) {
        this.bytes = bytes;
    }

    get kilobytes() {
        let kb = this.bytes / 1024;
        return kb.toFixed(2);
    }

    get megabytes() {
        let mb = this.bytes / 1024 / 1024;
        return mb.toFixed(2);
    }
}