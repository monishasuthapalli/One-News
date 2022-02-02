let bookmarkMethods = require('../models/bookmark');
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

test('test add Bookmarks and getBookMarks', async () => {
    try {
        let testBookmark = {};
        testBookmark.source = "testBookMarkSource";
        testBookmark.username = "testBookMarkUsername";
        testBookmark.title = "testBookMarkTitle";
        testBookmark.imageUrl="testBookMarkImageUrl";
        testBookmark.url="testBookMarkUrl";
        testBookmark.description="testBookMarkDescription";
        await bookmarkMethods.addBookmark(testBookmark.username, testBookmark.title, testBookmark.imageUrl, testBookmark.description, testBookmark.url, testBookmark.source);
        let expectedBookmarks = await bookmarkMethods.getBookMarks(testBookmark.username);
        expect(expectedBookmarks[0]).toEqual(testBookmark);
    }
    catch (err){
        console.log(err);
    }
});