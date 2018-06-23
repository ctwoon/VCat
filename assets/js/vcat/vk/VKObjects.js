// https://vk.com/dev/objects made in JS classes
// made by iTaysonLab in 2018
// modified to be easier to read/use

// B A S E
// User with only ID. this.user is complete User object.
class BasicUser {
    constructor(id) {
        this.id = id;
        this.user = getUserByID(id);
    }

    get fullName() {
        return this.user.fullName();
    }
}

// A user.
class User {
    constructor(id, first_name, last_name, deleted, last_seen, online, online_app_id, online_mobile, placeholder, verified, status) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.deleted = deleted;
        this.last_seen = last_seen;
        this.online = online;
        if (online_app_id) {
            this.online_app = new Application(online_app_id);
        }
        if (online_mobile) {
            this.online_mobile = online_mobile;
        }
        this.placeholder = placeholder;
        this.verified = verified;
        this.status = status;
    }

    get fullName() {
        return this.first_name + " " + this.last_name;
    }
}

// An application.
class Application {
    constructor(id, title, type) {
        this.id = id;
        this.title = title;
        this.type = type;
    }

    set appTitle(title) {
        this.title = title;
    }

    set appType(type) {
        this.type = type;
    }
}

// A group.
class Group {
    constructor(id, title, screen_name, type, closed, deleted, is_member, placeholder, desc) {
        this.id = id;
        this.title = title;
        this.screen_title = screen_name;
        this.type = type;
        this.closed = closed;
        this.deleted = deleted;
        this.is_member = is_member;
        this.placeholder = placeholder;
        this.desc = desc;
    }

    set member(is_member) {
        this.is_member = is_member;
    }
}

// A post.
class Post {
    constructor(id, owner, date, text, comments, likes, reposts, views, attachments, marked_as_ad) {
        this.id = id;
        // TODO: make full Post
    }
}
// A T T A C H M E N T S
// Basic attachment with an owner ID, creation/post date and attachment ID.
class Attachment {
    constructor(id, owner, date) {
        this.id = id;
        this.owner = new BasicUser(owner);
        this.date = new UnixTimestamp(date);
    }

    get ownerName() {
        return this.owner.fullName;
    }

    get time() {
        return this.date.formattedString;
    }
}

// A photo.
class Photo extends Attachment {
    constructor(id, album, owner, uploader, text, date, sizes, props) {
        super(id, owner, date);
        this.album = album;
        this.uploader = new BasicUser(uploader);
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


// A video. Can be locked via access_key or be hosted on YouTube/other platforms.
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

// A documents. Can have a preview or filetype (defined by VK).
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

// A simple link.
class Link {
    constructor(title, caption, url) {
        this.title = title;
        this.caption = caption;
        this.url = url;
    }
}

// An album. Has a cover Photo.
class Album extends Attachment{
    constructor(id, owner, date, placeholder, title, desc) {
        super(id, owner, date);
        this.title = title;
        this.desc = desc;
        this.placeholder = new Photo(placeholder["id"], id, placeholder["owner_id"], placeholder["user_id"], placeholder["text"], placeholder["date"], placeholder["sizes"], placeholder["props"]);
    }

    get cover() {
        return this.placeholder.smallestImage;
    }
}

// A sticker. Has a transparent and normal variant.
class Sticker {
    constructor(id, pack, images, images_bg) {
        this.id = id;
        this.pack = pack;
        this.images = images;
        this.images_bg = images_bg;
    }

    get smallestSticker() {
        return this.images[0];
    }

    get largestSticker() {
        let sizes = this.images;
        return sizes[sizes.length-1];
    }

    get smallestBGSticker() {
        return this.images_bg[0];
    }

    get largestBGSticker() {
        let sizes = this.images_bg;
        return sizes[sizes.length-1];
    }
}

// A gift. Has only ID and image.
class Gift {
    constructor(id, img48, img96, img256) {
        this.id = id;
        this.img48 = img48;
        this.img96 = img96;
        this.img256 = img256;
    }
}

// A poll.
class Poll extends Attachment {
    constructor(id, owner, create, title, votes, current_answer, answers, is_anonymous) {
        super(id, owner, create);
        this.title = title;
        this.votes = votes;
        this.current_answer = current_answer;
        this.answers = answers;
        this.is_anonymous = is_anonymous;
    }
}

// H E L P E R S
// Helpful Unix timestamp utils.
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

// Media duration parser.
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

// Document size parser.
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