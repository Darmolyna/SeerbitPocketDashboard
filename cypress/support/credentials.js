const credentials = {
    primaryPocket: {
        email: "test@seerbit.com",
        password: "Test@12345",
        // Google Authenticator secret (base32) shown when 2FA was set up for
        // this account - NOT the rotating 6-digit code.
        totpSecret: "CPJLHEBLIWCUBTIDCU6DMMH7P3M63YBD",
    },
    subPocket: {
        email: "ayomide.afolabi@seerbit.com",
        password: "Password@@1",
        totpSecret: "",
    },
};

export default credentials;
