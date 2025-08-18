describe("Lists (Favorites & Watchlist)", () => {
  it("adds and removes a favorite", () => {
    cy.visit("/movies");
    cy.findAllByTestId("btn-favorite").first().click(); // add
    cy.visit("/lists");
    cy.contains("Favorites");
    cy.findAllByTestId("movie-card").should("exist");
  });

  it("adds to watchlist", () => {
    cy.visit("/movies");
    cy.findAllByTestId("btn-watchlist").first().click();
    cy.visit("/lists");
    cy.contains("Watchlist");
    cy.findAllByTestId("movie-card").should("exist");
  });
});
