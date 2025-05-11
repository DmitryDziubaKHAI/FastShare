const userRepository = require('../repositories/UserRepository');
const crypto = require('crypto');

describe('Auth', () => {
    const hash = crypto.createHash('md5')
        .update((new Date()).toISOString())
        .digest('hex');
    const email = `${hash}@test.fastshare.localhost`
    const password = email + '_{dJsMN2}'

    async function getTestUser() {
        let user = await userRepository.getUserByEmail(email);
        if(user) {
            return user;
        }
        return await userRepository.createUser(hash, email, password);
    }

    test('Check creating a new user', async () => {
        const user = await getTestUser();
        expect(!!user).toEqual(true);
    });

    test('Check login wrong credentials', async () => {
        const user = await getTestUser();
        let passed = user && !await userRepository.verifyPassword(user, 'wrong password');
        expect(passed).toEqual(true);
    });

    test('Check login correct credentials', async () => {
        const user = await getTestUser();
        let passed = user && await userRepository.verifyPassword(user, password);
        expect(passed).toEqual(true);
    });
});
