import mockUser from '../../test-utils/mockGenerators/mockUser';

describe('register', function() {
  const newUser = mockUser();

  it('should be able to register with valid data', () => {
    cy.server();
    cy.route('POST', '/api/v1/users').as('postRegister');

    cy.clearCookies();
    cy.visitAndWaitFor('/join');

    cy.getCookies().should('have.length', 0);
    cy.get('h1').should('have.text', 'Join');
    cy.get('input#email').type(newUser.email);
    cy.get('input#confirm-email').type(newUser.email);
    cy.get('input#password').type(newUser.password);
    cy.get('input#confirm-password').type(newUser.password);
    cy.get('input#firstName').type(newUser.firstName);
    cy.get('input#lastName').type(newUser.lastName);
    cy.get('input#zipcode').type(newUser.zipcode);
    cy.get('button[type="submit"]').click();

    cy.wait('@postRegister');

    cy.url().should('contain', '/profile');
    cy.get('h1').should('have.text', 'Profile');
    cy.get('p').contains(`Hello ${newUser.firstName} ${newUser.lastName}!`);

    cy.getCookies().then(cookies => {
      expect(cookies.some(({ value }) => value === newUser.firstName)).to.be.true;
      expect(cookies.some(({ value }) => value === newUser.lastName)).to.be.true;
      expect(cookies.some(({ value }) => value === newUser.zipcode.toString())).to.be.true;
    });
  });
});
