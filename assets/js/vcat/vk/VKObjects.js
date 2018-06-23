class Attachment {

}

class UnixTimestamp {
    constructor(timestamp) {
        this.timestamp = timestamp;
    }

    returnTimestamp() {
        return this.timestamp;
    }

    returnDate() {
        return new Date(this.timestamp);
    }
}

class Photo {
    constructor(id, album, owner, user, text, date, sizes, props) {
        this.id = id;
        this.album = album;
        this.owner = owner;
        this.user = new User(user);
        this.text = text;
        this.date = new UnixTimestamp(date);
        this.sizes = sizes;
        this.props = props;
    }
}

class User {
    constructor(id) {
        this.id = id;
    }
}