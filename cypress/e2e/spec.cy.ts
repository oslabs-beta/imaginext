/// <reference types="cypress" />

context('login and signup testing', () => { 
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  })

  specify('page loading correctly', () => {
    cy.get('input').should('have.length', 2)
    cy.get('input').first().parent().should('be.visible')
    cy.get('input').last().parent().should('be.visible')
  })

})