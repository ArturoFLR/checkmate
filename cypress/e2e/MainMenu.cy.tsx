
beforeEach(() => {
	// GET ALL THE MENU BUTTONS AND ASSIGNS ALIASES TO THEM

	cy.visit("http://localhost:5173/checkmate/");
	cy.get("._btnNewGame_1sei5_24").as("NuevaPartidaBtn");
	cy.get("._btnLoadGame_1sei5_24").as("CargarBtn");

	cy.get("@CargarBtn").click();

	cy.get("#slot2").as("Slot1");
	cy.get("#slot3").as("Slot2");
	cy.get("#slot1").as("Slot3");
	cy.get("._btnSelect_1sei5_24").as("EstaBtn");

	cy.get("@NuevaPartidaBtn").click();

	cy.get("._btnPlayerVsComputer_1sei5_24").as("JugadorVsOrdenadorBtn");
	cy.get("._btnOnePlayer_1sei5_24").as("2JugadoresBtn");
	cy.get("._btnBack_1sei5_24").as("AtrasBtn");

	cy.get("@AtrasBtn").click();
});

describe("Main Menu - Nueva Partida checks", () => {
	it("Clicking 'Nueva Partida' option shows correct new options", () => {
		cy.get("@NuevaPartidaBtn").click();

		cy.get("@JugadorVsOrdenadorBtn").should("be.visible");
		cy.get("@2JugadoresBtn").should("be.visible");
		cy.get("@AtrasBtn").should("be.visible");
		cy.get("@NuevaPartidaBtn").should("not.exist");
		cy.get("@CargarBtn").should("not.exist");
	});

	it("Clicking 'Jugador VS Ordenador' button shows 'SelectPlayer' component", () => {
		cy.get("._playerInfoContainer_x8fo7_23").should("not.exist");

		cy.get("@NuevaPartidaBtn").click();
		cy.get("@JugadorVsOrdenadorBtn").click();

		cy.get("._playerInfoContainer_x8fo7_23").should("be.visible");
	});

	it("Clicking '2 Jugadores' button shows 'SelectPlayer' component", () => {
		cy.get("._playerInfoContainer_x8fo7_23").should("not.exist");

		cy.get("@NuevaPartidaBtn").click();
		cy.get("@2JugadoresBtn").click();

		cy.get("._playerInfoContainer_x8fo7_23").should("be.visible");
	});

	it("Clicking 'Atrás' button shows initial menu options", () => {
		cy.get("@NuevaPartidaBtn").click();
		cy.get("@AtrasBtn").click();

		cy.get("@JugadorVsOrdenadorBtn").should("not.exist");
		cy.get("@2JugadoresBtn").should("not.exist");
		cy.get("@AtrasBtn").should("not.exist");
		cy.get("@NuevaPartidaBtn").should("be.visible");
		cy.get("@CargarBtn").should("be.visible");

	});
});