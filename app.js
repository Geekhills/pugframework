require('dotenv').config()

// const logger = require('morgan')
const express = require('express')
const app = express()

const Prismic = require('@prismicio/client');
const PrismicDOM = require('prismic-dom');



const initApi = req => {
  return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req
  });
}

const handleLinkResolver = doc => {
  if (doc.type === 'project') {
    return `/project/${doc.slug}`
  }

  if (doc.type === 'about') {
    return '/about'
  }

  if (doc.type === 'collections') {
    return '/cases'
  }
  // Define the url depending on the document type
  // if (doc.type === 'page') {
  //   return '/page/' + doc.uid;
  // } else if (doc.type === 'blog_post') {
  //   return '/blog/' + doc.uid;
  // }
  
  // Default to homepage
  return '/';
}
app.use(express.static('public'))


// Middleware to inject prismic context
app.use((req, res, next) => {
  // res.locals.ctx = {
  //   endpoint: process.env.PRISMIC_ENDPOINT,
  //   linkResolver: handleLinkResolver,
  // };

  res.locals.Links = handleLinkResolver;
  res.locals.PrismicDOM = PrismicDOM;
  res.locals.Numbers = index => {
    return index == 0 ? 'One' : index == 1 ? 'Two' : index == 2 ? 'Three' : index == 3 ? 'Four' : '' ;
  }
  next();
});

const path = require('path')
const port = 3000

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

const handleResquest = async api => {
  const meta = await api.getSingle('meta')
  const preloader = await api.getSingle('preloader')
  const navigation = await api.getSingle('navigation')

      return {
        meta,
        navigation,
        preloader
      }
}

app.get('/', async(req, res) => {
  const api = await initApi(req)
  const defaults = await handleResquest(api)
    const home = await api.getSingle('home')

    const { results: work } = await api.query(Prismic.Predicates.at('document.type','work'), {
      fetchLinks : 'project.image'
    })

      res.render('pages/home', {
        ...defaults,
        home,
        work
        
        });
  }),


app.get('/about', async(req, res) => {

      const api = await initApi(req)
      const defaults = await handleResquest(api)
      const about = await api.getSingle('about')

        res.render('pages/about', {
         ...defaults,
          about,
          
          });
})
app.get('/cases', async(req, res) => {
    const api = await initApi(req)
    const defaults = await handleResquest(api)
    const home = await api.getSingle('home')

    const { results: work } = await api.query(Prismic.Predicates.at('document.type','work'), {
      fetchLinks : 'project.image'
    })
    // console.log(work[0].data.title)
      res.render('pages/collections', {
       ...defaults,
       home,
       work
        
        });
})

app.get('/project/:uid', async(req, res) => {
  const uid = req.params.uid

  const api = await initApi(req)
  const meta = await api.getSingle('meta')
  const preloader = await api.getSingle('preloader')
  const navigation = await api.getSingle('navigation')

  // const defaults = await handleRequest(api)
  const project = await api.getByUID('project', uid, {
    fetchLinks: 'work.title'
  })

  res.render('pages/detail', {
    meta,
    preloader,
    navigation,
    project
  })
})


app.get('/portfolio', async(req, res) => {

  const api = await initApi(req)
  const defaults = await handleResquest(api)
  const portfolio = await api.getSingle('portfolio')

    res.render('pages/portfolio', {
     ...defaults,
     portfolio 
      
      });
})
app.get('/portfolio', (req, res) => {
  res.render('pages/portfolio')
})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})