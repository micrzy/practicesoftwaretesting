import {test,expect} from "../page-objects/fixtures"

test.describe("contact form testing",()=>{
    test("should successfully upload a txt file as a guest",async({poManager,page})=>{
        await poManager.contactPage.navigateContact()
        await poManager.contactPage.enterNameAndEmail('Karina','Sue','test@test.com')
        await poManager.contactPage.enterMessage("This is a test message.This is a test message.This is a test message.")
        await poManager.contactPage.selectSubject()
        await poManager.contactPage.uploadAttachment('tests/fixtures/test.txt')
        await expect(page.locator('[formcontrolname="attachment"]')).toHaveValue(/test\.txt$/)
    })
})