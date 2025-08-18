describe("Popcorn Picks", () => {
  it("loads list and opens a movie", () => {
    cy.visit("/movies");
    cy.findAllByTestId("movie-card").should("exist");
    cy.findAllByTestId("movie-card").first().click();
    cy.url().should("include", "/movies/");
  });

  it("searches for a movie", () => {
    cy.visit("/movies");
    cy.findByPlaceholderText("Search movies").type("Inception");
    cy.contains(/Inception/i);
  });
});
