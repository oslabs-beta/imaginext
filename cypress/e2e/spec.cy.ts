/// <reference types="cypress" />

const path = Cypress.env("path")
context('login and signup testing', () => { 
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  })

  specify('page loading correctly', () => {
    cy.get('input').should('have.length', 2)
    cy.get('input').first().parent().should('be.visible')
    cy.get('input').last().parent().should('be.visible')
  })

  specify('test', () => {
    cy.get('input').last().parent().type(path)
    cy.get('button').click()
  })

})

// added this to fix error related to isolatedModules
export {}