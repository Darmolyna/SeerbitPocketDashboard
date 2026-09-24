// Mailbox access via Microsoft Graph (cy.task runs in the Node process, so no
// browser navigation is needed and the app page is never left). Credentials are
// kept in the environment (MAIL_USERNAME / MAIL_PASSWORD / MAIL_CLIENT_ID),
// never in test code.
class MailboxPage {

    fetchLatestOtp(term, timeout = 90000) {
        return cy.task("fetchLatestOtp", { term, timeout });
    }

}

export default new MailboxPage();