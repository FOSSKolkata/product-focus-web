export const b2cPolicies = {
  names: {
    signUpSignIn: 'B2C_1_susi',
    forgotPassword: 'B2C_1_reset',
    editProfile: 'B2C_1_edit_profile',
  },
  authorities: {
    signUpSignIn: {
      authority:
        'https://dumanhillb2c.b2clogin.com/dumanhillb2c.onmicrosoft.com/b2c_1_susi',
    },
    forgotPassword: {
      authority:
        'https://dumanhillb2c.b2clogin.com/dumanhillb2c.onmicrosoft.com/b2c_1_reset',
    },
    editProfile: {
      authority:
        'https://dumanhillb2c.b2clogin.com/dumanhillb2c.onmicrosoft.com/b2c_1_edit_profile',
    },
  },
  authorityDomain: 'dumanhillb2c.b2clogin.com',
};

export const apiConfig: { scopes: string[]; uri: string } = {
  scopes: ['https://dumanhillb2c.onmicrosoft.com/api/demo.read'],
  // uri: 'https://productfocusapi.azurewebsites.net',
  uri: 'https://localhost:44388'
};
