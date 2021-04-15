import {init} from './js/app.js'
import {generateAndPost} from './js/app.js'
import {postHandler} from './js/postHandler.js'
import {updateUI} from './js/app.js'
import './styles/style.scss'
import './styles/layouts.scss'
import './styles/styles.scss'

export {
  init,
  generateAndPost,
  postHandler,
  updateUI
}

window.addEventListener('DOMContentLoaded', init)
