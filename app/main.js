import 'regenerator-runtime/runtime'

import each from 'lodash/each'

import Preloader from 'components/Preloader'
import Navigation from 'components/Navigation'
import About from 'pages/About'
import Collections from 'pages/Collections'
import Details from 'pages/Details'
import Home from 'pages/Home'
import Portfolio from 'pages/Portfolio'

class App {
  constructor() {
    this.createContent()

    this.createPerloader()
    this.createNavigation()
    this.createPages()

    this.addEvenListeners()
    this. addLinkListeners()

    this.update()
  }
  
  createNavigation() {
    this.navigation = new Navigation({
      template: this.template
    })
  }
//Events...
  createPerloader() {
    this.preloader = new Preloader()
    this.preloader.once('completed', this.onPreloaded.bind(this))
  }

    createContent () {
      this.content = document.querySelector(".content")
      this.template = this.content.getAttribute("data-template")
    }
    
    createPages () {
      this.pages = {
        about: new About(),
        collections: new Collections(),
        detail: new Details(),
        home: new Home()
      }
       this.page = this.pages[this.template]
       this.page.create()


    } 

     onPreloaded () {
      this.preloader.destroy()
       
      this.onResize()

      this.page.show()

    }
    //request content on clientSide without calling the whole page
    async onChange(url) {
      await this.page.hide()

      const request = await window.fetch(url)

      if(request.status===200) {
        const html = await request.text()
        console.log(html)

        const div = document.createElement('div')
        div.innerHTML = html

        const divContent = div.querySelector('.content')

        this.template = divContent.getAttribute('data-template')

        this.navigation.onChange(this.template)

        this.content.setAttribute('data-template', this.template)
        this.content.innerHTML = divContent.innerHTML

        this.page = this.pages[this.template]
        
        this.page.create()
        
        this.onResize()
        this.page.show()

        this.addLinkListeners()
      }else{
        console.log('Error')
      }
    }
    onResize() {
      if (this.page && this.page.onResize) {
        this.page.onResize()
      }
    }
//Loop....
    update() {
      if (this.page && this.page.update) {
        this.page.update()
      }
      this.frame = window.requestAnimationFrame(this.update.bind(this))
    }
// Listeners...
    addEvenListeners() {
      window.addEventListener('resize', this.onResize.bind(this))
    }
    
    addLinkListeners() {
      const links = document.querySelectorAll('a')

      each(links, link => {
        link.onclick = event => {
          event.preventDefault()

          const {href} = link
          this.onChange(href)

        // console.log(event,href)
        }
      })
    }
}

new App()