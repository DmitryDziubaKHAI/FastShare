class User {
    constructor(id, username, email, passwordHash, createdAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.createdAt = createdAt;
    }
}

module.exports = User;
