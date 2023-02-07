/// <reference types="cypress" />

const path = Cypress.env("path")
const testingPath = path + 'test'
context('Testing loads correctly', () => { 
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  })

  specify('Page loads correctly', () => {
    cy.get('input').should('have.length', 2)
    cy.get('input').first().parent().should('be.visible')
    cy.get('input').last().parent().should('be.visible')
  })

  specify('Diagram loads correctly', () => {
    cy.get('input').last().parent().type(testingPath)
    cy.get('button').click()
    cy.get('svg')
  })
})

context('Test for Data Rendering Methods', () => { 
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
    cy.get('input').last().parent().type(testingPath)
    cy.get('button').click()
  })
  specify('SSG - default (no getStaticProps or getServerSideProps)', () => {
    cy.contains('first-post.js').click()
    cy.get('div').contains('Data Render Method').contains('SSG')
  })

  specify('SSG - getStaticProps', () => {
    cy.contains('index.js').click()
    cy.get('div').contains('Data Render Method').contains('SSG')
  })

  specify('SSR - getServerSideProps', () => {
    cy.contains('about.js').click()
    cy.get('div').contains('Data Render Method').contains('SSR')
  })
})

context.only('Test for Fetch Endpoints', () => { 
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
    cy.get('input').last().parent().type(testingPath)
    cy.get('button').click()
  })

  specify('Endpoint Shown Correctly)', () => {
    cy.contains('testclientside.js').click()
    cy.get('div').contains('Fetch Endpoint').contains('/api/profile-data')
  })
})

// added this to fix error related to isolatedModules
export {}