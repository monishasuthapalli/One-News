let userMethods = require('../models/user');
const createTables = require('../config/sqllite3').createTables;
const deleteTables = require('../config/sqllite3').deleteTables;

beforeAll(async () => {
    await createTables();
    return;
});

afterAll(async () => {
    await deleteTables();
    return;
});

test('test createUser if not present', async () => {
    try {
        let testUser = {};
        testUser.username = 'rchepu2';
        testUser.email = 'rchepu2@uic.edu';
        let createdUser = await userMethods.createUser('rchepu2', 'rchepu2@uic.edu', 'rchepu2');
        let expectedUser = {};
        expectedUser.username = createdUser.getUserName();
        expectedUser.email = createdUser.getEmail();
        expect(expectedUser).toStrictEqual(testUser);
    }
    catch (err) {
        console.log(err);
    }
});

test('test createUser if already present', async () => {
    try {
        let createdUser = await userMethods.createUser('rchepu2', 'rchepu2@uic.edu', 'rchepu2');
        expect(createdUser).toStrictEqual("user already present");
    }
    catch (err) {
        console.log(err);
    }
});

test('test getUser', async () => {
    try {
        let testUser = {};
        testUser.username = 'rchepu2';
        testUser.email = 'rchepu2@uic.edu';
        let createdUser = await userMethods.getUser("rchepu2");
        let expectedUser = {};
        expectedUser.username = createdUser.getUserName();
        expectedUser.email = createdUser.getEmail();
        expect(expectedUser).toStrictEqual(testUser);
    }
    catch (err) {
        console.log(err);
    }
});

test('test getUser if not present', async () => {
    try {
        let testUser = null;
        let expectedUser =await userMethods.getUser("chraghuram5");
        expect(expectedUser).toStrictEqual(testUser);
    }
    catch (err) {
        console.log(err);
    }
});

test('test updateUser', async () => {
    try {
        let testUser = {};
        testUser.username = "rchepu2";
        testUser.email = "ch.raghuram5@gmail.com";
        let updatedUser = await userMethods.updateUser("rchepu2","ch.raghuram5@gmail.com","chraghuram5");
        let expectedUser = {};
        expectedUser.username = updatedUser.getUserName();
        expectedUser.email = updatedUser.getEmail();
        expect(expectedUser).toStrictEqual(testUser);
    }
    catch (err) {
        console.log(err);
    }
});

test('test deleteUser', async () => {
    try {
        await userMethods.deleteUser("rchepu2");
        let user = await userMethods.getUser("rchepu2");
        expect(user).toStrictEqual(null);
    }
    catch (err) {
        console.log(err);
    }
});