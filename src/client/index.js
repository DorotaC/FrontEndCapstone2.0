import {init} from './js/app.js'
import {generateAndPost} from './js/app.js'
import {postHandler} from './js/postHandler.js'
import {getHandler} from './js/getHandler.js'
import {updateUI} from './js/app.js'
import './styles/style.scss'

export {
  init,
  generateAndPost,
  postHandler,
  updateUI,
  getHandler
}

window.addEventListener('DOMContentLoaded', init)
