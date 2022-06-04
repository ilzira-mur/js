// Highlightjs - https://github.com/isagalaev/highlight.js (http://highlightjs.readthedocs.io/en/latest/)
// Подсветка синтаксиса
// Подключаем Scripts
import 'babel-loader!expose-loader?hljs!highlight.js'
// Подключаем Styles
import 'highlight.js/styles/github.css'

// подключение модуля для стилизации скроллбара
import PerfectScrollbar from 'perfect-scrollbar'

// функции для доступа к элементам
function qS(sel) {
  return document.querySelector(sel)
}

function qSA(sel) {
  return document.querySelectorAll(sel)
}
// класс для работы с группой элементов
class jQ {
  constructor(element) {
    this.elem = document.querySelectorAll(element)
  }

  on(event, callback) {
    for (let i = 0; i < this.elem.length; i++) {
      this.elem[i].addEventListener(event, callback)
    }
    return this
  }
}
;(function() {
  const page = qS('.UIpage')
  const pageSidebar = qS('.UIpage__sidebar')
  const header = qS('.UIheader')
  let headerHeight = header ? header.clientHeight : 0
  const inputFilter = qS('.UIinput-filter input')
  const sidebar = qS('.UIsidebar')
  window.addEventListener('load', () => {
    // отступы для сайдбара и контента начало
    if (page) indentPage()
    if (pageSidebar) indentSidebar()
    // fix высоты сайдбара для корректного отображение скроллбара
    if (sidebar) innerIndentSidebar()

    // отступы для сайдбара и контента конец

    // стилизация скроллбара доступ по классу e-scroll начало
    qSA('.e-scroll').forEach((block) => {
      const ps = new PerfectScrollbar(block)

      window.addEventListener('resize', () => ps.update())
    })

    // стилизация скроллбара доступ по классу e-scroll конец

    // фильтр компонентов сайта начало
    if (inputFilter) {
      inputFilter.addEventListener('keyup', filterComponent)
    }
    // фильтр компонентов сайта конец
  })

  // пересчитываем размеры при ресайзе
  window.addEventListener('resize', () => {
    if (header) headerHeight = header.clientHeight
    if (page) indentPage()
    if (pageSidebar) indentSidebar()
    if (sidebar) innerIndentSidebar()
  })

  // паддинг от фиксированного хедера начало
  function indentPage() {
    page.style.paddingTop = `${headerHeight}px`
  }
  // паддинг от фиксированного хедера конец

  // паддинг от фиксированного сайдбара
  function indentSidebar() {
    const pageContent = qS('.UIpage__content')
    const pageSidebarWidth = pageSidebar.clientWidth

    // if (window.innerWidth >= 1024) {
    //   pageContent.style.paddingLeft = pageSidebarWidth + 'px';
    // } else {
    //   pageContent.style.paddingLeft = '';
    // }

    pageSidebar.style.top = `${headerHeight}px`
  }
  // паддинг от фиксированного конец
  function innerIndentSidebar() {
    sidebar.style.bottom = `${headerHeight}px`
    sidebar.style.paddingTop = `${headerHeight}px`
  }
  // фильт по названию компонентов начало
  function filterComponent(e) {
    const text = e.target.value.toLowerCase()

    qSA('.UIlist--state .UIlist__item').forEach(function(item) {
      const itemText = item.firstChild.textContent

      if (itemText.toLowerCase().includes(text)) {
        item.style.display = 'block'
      } else {
        item.style.display = 'none'
      }
    })
  }
  // фильт по названию компонентов конец
})()

// jquery

// Табы
$(document).on('click', '.UItab__item-nav a', function() {
  const _self = $(this)
  const itemNav = _self.parent()
  const itemNavIndex = _self.parent().index()
  const itemContent = _self.parents('.UItab').find('.UItab__item-content')

  if (_self.parents('.UItab').hasClass('UItab--no-tab')) return true

  if (itemNav.hasClass('active')) return false

  if (itemContent.eq(itemNavIndex)[0]) {
    itemNav
      .addClass('active')
      .siblings()
      .removeClass('active')

    itemContent
      .eq(itemNavIndex)
      .addClass('active')
      .siblings()
      .removeClass('active')
  }

  return false
})
// табы конец

// адаптивное меню начало
$('.UIburger-menu').on('click', function(e) {
  e.preventDefault()
  const _self = $(this)
  const header = _self.closest('.UIheader')
  const slideMenu = header.find('.UIheader__top-right')
  const flag = slideMenu.is(':visible')

  if (!flag) {
    slideMenu.fadeIn(400)
    _self.addClass('is-active')
  } else {
    slideMenu.fadeOut(400, function() {
      if ($(this).css('display') === 'none') {
        $(this).removeAttr('style')
      }
    })
    _self.removeClass('is-active')
  }
})
// адаптивное меню конец

// открытие панели сайдбара начало
const showItemList = () => {
  const sidebar = $('.UIpage__sidebar')
  const pageContent = $('.UIpage__content')
  const container = pageContent.children()
  sidebar.toggleClass('hide')
  pageContent.toggleClass('show')
}

let hideItems = JSON.parse(localStorage.getItem('stateItems'))

if (hideItems) {
  showItemList()
}

$('.UIheader__bottom').on('click', function(e) {
  e.preventDefault()

  showItemList()

  hideItems = !hideItems

  localStorage.setItem('stateItems', hideItems)
})
// открытие панели сайдбара конец

function renderBlock(name) {
  $.ajax({
    url: `blocks/${name}/ui-template.html`,
    cache: false,
  })
    .done(function(html) {
      $('.UIpage__content').append(html)
      const div = document.createElement('div')
      const abv = function(html) {
        div.textContent = html
        return div.innerHTML
      }
      const item = $('.code-example')
      const dataHtml = item.find('.code-example__block-content').html()
      const itemHtmlCode = item.find('.code-example__code-content').find('.html')

      const dataJs = item.find('.code-example__block-script').html()
      const dataJsCode = item.find('.code-example__script-content').find('.javascript')
      console.log(dataHtml)
      if (dataHtml) {
        const regHtml = new RegExp(dataHtml.match(/^(\s+)</)[1], 'g')
        console.log(regHtml)
        itemHtmlCode.html(abv(dataHtml.replace(regHtml, '\n')))
      }
      if (dataJs) {
        const regJs = new RegExp(dataJs.match(/^(\s+)</)[1], 'g')
        dataJsCode.html(abv(dataJs.replace(regJs, '\n')))
      }
    })
    .always(function() {
      $('pre code').each(function(i, block) {
        hljs.highlightBlock(block)
      })
      $(document).on('click', '.code-example__toggle-header a', function() {
        const _self = $(this)
        _self
          .parents('.code-example__toggle')
          .toggleClass('open')
          .find('.code-example__toggle-main')
          .slideToggle()

        return false
      })
      $(document).on('click', 'input, textarea, .jcf-select, select', function() {
        const _self = $(this)
        _self.removeClass('is-invalid')
        _self.prev('select').removeClass('is-invalid')
        $(`input[type='radio'][name='${_self.attr('name')}']`).removeClass('is-invalid')
      })
    })
}

// сохраняем индекс элемента в localstorage
const setIndexStorage = function(index) {
  localStorage.setItem('indexItem', index)
}
// получение индекса элемента из localStorage
const getIndexStorage = function() {
  let index = JSON.parse(localStorage.getItem('indexItem'))

  if (index === null) {
    index = 0
  } else {
    index
  }
  return index
}

renderBlock(
  $('.UIlist--state .UIlist__item-link')
    .eq(getIndexStorage())
    .attr('href'),
)

$('.UIlist--state .UIlist__item-link')
  .eq(getIndexStorage())
  .parent()
  .addClass('active')
  .siblings()
  .removeClass('active')

$('.UIlist--state .UIlist__item-link').on('click', function(e) {
  e.preventDefault()
  const _self = $(this)
  const href = _self.attr('href')
  const item = _self.parent()
  const indexItem = item.index()

  setIndexStorage(indexItem)

  item
    .addClass('active')
    .siblings()
    .removeClass('active')
  $('.UIpage__content').empty()
  renderBlock(href)
})
