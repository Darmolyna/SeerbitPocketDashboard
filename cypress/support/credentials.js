const credentials = {
    primaryPocket: {
        email: "test@seerbit.com",
        password: "Test@123",
        // Google Authenticator secret (base32) shown when 2FA was set up for
        // this account - NOT the rotating 6-digit code.
        totpSecret: "5OU6FN6C5JZ6KWXLQWP4ZY5EXG3HOEAV",
    },
    subPocket: {
        email: "ayomide.afolabi@seerbit.com",
        password: "Password@@1",
        totpSecret: "",
    },
};

export default credentials;
