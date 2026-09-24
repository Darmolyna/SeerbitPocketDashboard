import { When } from "@badeball/cypress-cucumber-preprocessor";
import MailboxPage from "./mailboxPage";

// Shared across all send-money flows (single, subpocket, bulk):
// reads the latest Seerbit OTP from the mailbox over IMAP (cy.task runs in
// the Node process, the app page stays on screen the whole time) and types
// the code into the OTP fields.
When("I fetch the OTP from my email", () => {
    return MailboxPage.fetchLatestOtp("Seerbit").then(
        (otp) => {
            cy.log(`Using OTP from email: ${otp}`);
            cy.wrap(otp).as("otpFromMailbox");

            cy.get('input[inputmode="numeric"][maxlength="1"]', { timeout: 30000 })
                .should("be.visible")
                .each(($input, index) => {
                    cy.wrap($input).type(otp[index]);
                });
        },
        (reason) => {
            throw new Error(
                `Could not obtain the OTP from the mailbox: ${reason.message} ` +
                `(the test fails because no OTP email was received)`
            );
        }
    );
});