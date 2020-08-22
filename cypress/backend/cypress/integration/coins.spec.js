beforeEach(() => {
  cy.server();
});

describe('Test suite', () => {
  it('Test should return true', () => {
    expect(true).equal(true);
  });
});
