import {test,expect} from "../../page-objects/fixtures"

test.describe("contact form testing @regression",()=>{
    test("should successfully upload a txt file as a guest",async({poManager,page})=>{
        await poManager.contactPage.navigateContact()
        await poManager.contactPage.enterNameAndEmail('Karina','Sue','test@test.com')
        await poManager.contactPage.enterMessage("This is a test message.This is a test message.This is a test message.")
        await poManager.contactPage.selectSubject()
        await poManager.contactPage.uploadAttachment('tests/ui/fixtures/test.txt')
        await expect(page.locator('[formcontrolname="attachment"]')).toHaveValue(/test\.txt$/)
    })

    test("should open the file chooser from the contact attachment field @SCRUM-5",async({poManager,page})=>{

        await test.step("Navigate to the home page", async()=>{
            await poManager.navBar.navigate()
        })

        await test.step("Click Contact in the navigation bar", async()=>{
            await poManager.navBar.contactLink.click()
        })

        await test.step("Verify the contact page loads", async()=>{
            await expect(page).toHaveURL(/\/contact$/)
            await expect(poManager.contactPage.heading).toBeVisible()
        })

        await test.step("Locate and click the Attachment input field", async()=>{
            await expect(poManager.contactPage.attachmentInput).toBeVisible()
            await expect(poManager.contactPage.attachmentInput).toBeEnabled()
            const fileChooser = await poManager.contactPage.openAttachmentChooser()
            expect(await fileChooser.element().getAttribute('data-test')).toBe('attachment')
        })
    })
})