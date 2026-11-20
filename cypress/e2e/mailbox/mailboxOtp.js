import { When } from "@badeball/cypress-cucumber-preprocessor";
import MailboxPage from "./mailboxPage";
import LoginPage from "../login/loginPage";

// Pocket now authorises transactions with Google Authenticator (TOTP) instead
// of an emailed OTP. The secret resolved during login is reused here, so the
// step works for whichever account logged in (primary or sub pocket).
When("I enter the authenticator code", () => {
    const secret = LoginPage.currentTotpSecret;

    if (!secret) {
        throw new Error(
            "No authenticator secret is available for this session. Make sure the " +
            "scenario logs in first so the account's TOTP secret can be resolved."
        );
    }

    cy.task("generateTotp", secret).then((code) => {
        // Do not log the actual OTP code.
        cy.log("Using authenticator code (value hidden)");
        cy.wrap(code).as("otpFromAuthenticator");

        cy.get('input[inputmode="numeric"][maxlength="1"]', { timeout: 30000 })
            .should("be.visible")
            .each(($input, index) => {
                cy.wrap($input).type(code[index]);
            });
    });
});

// Shared across all send-money flows (single, subpocket, bulk):
// reads the latest Seerbit OTP from the mailbox over IMAP (cy.task runs in
// the Node process, the app page stays on screen the whole time) and types
// the code into the OTP fields.
When("I fetch the OTP from my email", () => {
    return MailboxPage.fetchLatestOtp("Seerbit").then(
        (otp) => {
            // Do not log the actual OTP code.
            cy.log("Using OTP from email (value hidden)");
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