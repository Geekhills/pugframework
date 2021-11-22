import About from '../app/pages/About'
import Collections from '../app/pages/Collections'
import Home from '../app/pages/Home'
import Portfolio from '../app/pages/Portfolio'

class App {
  constructor() {
    this.createContent()
    this.createPages()
  }
  
    createContent () {
      this.content = document.querySelector(".content")
      this.template = this.content.getAttribute("data-template")
    }
    
    createPages () {
      this.pages = {
        about: new About(),
        collections: new Collections(),
        portfolio: new Portfolio(),
        home: new Home()
      }
       this.page = this.pages[this.template]
       this.page.create()
      console.log(this.page)
    } 
}

new App()