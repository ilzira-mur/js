class PriceList {
  constructor(el) {
    this.$el = $(el)
    this.$searhForm = this.$el.find('.price-list__search')
    this.$preloader = this.$el.find('.price-list__preloader')
    this.$buttonDelete = this.$el.find('.search__btn-delete')

    this.dataSourceUrl = this.$el.data('srcUrl')
    this.list = null
    this.filteredList = null
    this.defaultUrl = this.dataSourceUrl
    this.searched = false

    this.$result = this.$el.find('.price-list__result')
    this.templateAjaxFail = this.$el
      .find('.price-list__ajax-fail')
      .remove()
      .removeAttr('style')[0].outerHTML
    this.templateNoItems = this.$el
      .find('.price-list__no-items')
      .remove()
      .removeAttr('style')[0].outerHTML

    this.ajaxSuccess = null

    this.modifiers = {
      inited: 'price-list--inited',
    }
  }

  init() {
    if (this.$el.hasClass(this.modifiers.inited)) return

    this.getData(this.updateResult.bind(this))
    this.bindEvents()

    this.$el.addClass(this.modifiers.inited)
  }

  updateResult() {
    this.$result.html('')

    if (!this.ajaxSuccess) {
      this.$result.html(this.templateAjaxFail)
      this.$preloader.hide()
      return
    }

    if (this.filteredList.length === 0) {
      this.$result.html(this.templateNoItems)
      this.$preloader.hide()
      return
    }

    if (this.list[0].length === 0) {
      this.$result.html(this.templateNoItems)
      this.$preloader.hide()
      return
    }

    const $rootNode = $(`<div class="node node--lvl-0">
      <div class="node__inner">
        <div class="node__items">
          <table class="node__table"></table>
        </div>
        <div class="node__children"></div>
      </div>
    </div>`)
    let $currentNode = $rootNode
    let currentLevel = 0

    this.traverseTree(
      this.filteredList,
      (node) => {
        if (!node.NAME) return

        const $node = $(`<div class="node node--lvl-${node.LEVEL}">
          <div class="node__self">${node.NAME}</div>
          <div class="node__description">${node.DESCRIPTION || ''}</div>
          <div class="node__inner"  style="display: ${this.searched ? 'block' : 'none'}">
            <div class="node__items">
              <table class="node__table"></table>
            </div>
            <div class="node__children"></div>
          </div>
        </div>`)

        if (node.LEVEL > currentLevel) {
          $currentNode.find(' > .node__inner > .node__children').append($node)
        } else {
          $currentNode
            .closest(`.node--lvl-${node.LEVEL - 1}`)
            .find(' > .node__inner > .node__children')
            .append($node)
        }

        $node.wrap('<div class="node__child"></div>')
        $currentNode = $node
        currentLevel = node.LEVEL
      },
      (leave) => {
        $currentNode.find('.node__table').append(`<tr>
          <td>${leave.SERVIES_CODE}</td>
          <td>${leave.NMU_CODE}</td>
          <td><b>${leave.NAME}</b></td>
          <td>${leave.PRICE}</td>
        </tr>`)
      },
    )

    this.$preloader.hide()
    this.$result.append($rootNode)
  }

  bindEvents() {
    this.$searhForm.on('submit', (event) => {
      event.preventDefault()
      this.$preloader.show()
      const query = this.$searhForm
        .find('input[name="query_services"]')
        .val()
        .trim()

      if (!query) {
        this.filteredList = this.list
        this.dataSourceUrl = this.defaultUrl
        this.getData(this.updateResult.bind(this))
      } else {
        // this.updateResult() // Before searching on the back
        this.searched = true
        this.dataSourceUrl = `${this.defaultUrl}&q=${query}`
        this.getData(this.updateResult.bind(this))
        // this.filterServicesByQuery(query)
      }
    })

    this.$buttonDelete.on('click', () => {
      this.dataSourceUrl = this.defaultUrl
      this.searched = false
      this.getData(this.updateResult.bind(this))
    })
  }

  getData(callback) {
    $.ajax({
      method: 'GET',
      url: this.dataSourceUrl,
      dataType: 'json',
    })
      .done((data) => {
        if (data) {
          this.list = data
          this.filteredList = JSON.parse(JSON.stringify(this.list))
        } else {
          this.list = []
          this.filteredList = []
        }
        this.ajaxSuccess = true
      })
      .fail((error) => {
        this.ajaxSuccess = false
        console.error(error)
      })
      .always(() => {
        callback()
      })
  }

  filterServicesByQuery(query) {
    this.filteredList = []

    this.traverseTree(
      this.list,
      () => {},
      (leave) => {
        if (
          leave.NAME.toLowerCase().includes(query.toLowerCase()) &&
          !this.filteredList.some((item) => item.SERVIES_CODE === leave.SERVIES_CODE)
        ) {
          this.filteredList.push(leave)
        }
      },
    )
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity, class-methods-use-this
  traverseTree(tree, nodeHandler = () => {}, leaveHandler = () => {}) {
    // ?????????? ???? ???????????? ??????????????????
    let current = tree
    const memory = [current]
    /* eslint-disable no-loops/no-loops */
    /* eslint-disable-next-line no-cond-assign */
    while ((current = memory.pop())) {
      while (true) {
        if (current && typeof current.NMU_CODE !== 'undefined') {
          leaveHandler(current)
          break
        } else if (current !== tree) {
          nodeHandler(current)
        }

        // ?????????????????? ???????????????? ??????????????
        const elementsArray = []
        if (current.ELEMENTS) {
          current.ELEMENTS.forEach((item) => {
            elementsArray.push(item)
          })
        }

        // ?????????????????? ???????????????? ??????????
        const childrenArray = []
        if (current.CHILD) {
          // eslint-disable-next-line no-loop-func
          Object.keys(current.CHILD).forEach((key) => {
            childrenArray.push(current.CHILD[key])
          })
        } else {
          // eslint-disable-next-line no-loop-func
          Object.keys(current).forEach((key) => {
            childrenArray.push(current[key])
          })
        }

        if (elementsArray.length > 0) {
          // eslint-disable-next-line prefer-destructuring
          current = elementsArray[0]
          for (let i = childrenArray.length - 1; i >= 0; i -= 1) {
            memory.push(childrenArray[i])
          }
          for (let i = elementsArray.length - 1; i > 0; i -= 1) {
            memory.push(elementsArray[i])
          }
        } else {
          // eslint-disable-next-line prefer-destructuring
          current = childrenArray[0]

          for (let i = childrenArray.length - 1; i > 0; i -= 1) {
            memory.push(childrenArray[i])
          }
        }
      }
    }
  }
}

/* eslint-disable func-names */
$.fn.priceList = function() {
  return this.each(function() {
    new PriceList(this).init()
  })
}

$(() => {
  $('.price-list').priceList()
})

$(() => {
  const context = document.querySelector('#myChart').getContext('2d')
  const chart = new Chart(context, {
    type: 'bar',

    // ???????????????? ????????????????
    data: {
      // ?????????? ????????????????
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      // ????????????
      datasets: [
        {
          label: '?????? Chart.js', // ????????????????
          backgroundColor: 'rgb(255, 99, 132)', // ???????? ????????????????
          borderColor: 'rgb(255, 99, 132)', // ???????? ??????????
          data: [2.3, 3.1, 4, 10.1, 4, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2], // ???????????? ???????????? ?????????? ??????????????
        },
      ],
    },

    // ?????????????????? ????????????????
    options: {},
  })
})

// ???????????????? ?????????????? ?????????? ????????????
const viewport = document.querySelector('#viewport').offsetWidth
// ???????????????? ???????????? ????????????
const buttonNext = document.querySelector('#next')
// ???????????????? ???????????? ??????????
const buttonPrevious = document.querySelector('#prev')
// ???????????????? ?????????????? ???? ?????????? ????????????????
const slider = document.querySelector('div.slider')
// ???????????????? ???????????????? ???????????? ????????????
const viewSliders = document.querySelectorAll('.viewSlide')
// ?????????????????? ???????????????????? ???????????? ????????????
let viewSlide = 0

// ?????????????????? ???????? ?????????????????? ???????????? ??????????????
viewSliders[0].style.backgroundColor = 'green'

// ?????????????????? ?????????? ???? ???????????? ????????????
buttonNext.addEventListener('click', () => {
  // ???????????? ?????????????????? ???????????? ??????????????
  viewSliders[viewSlide].style.backgroundColor = 'red'
  // ??????????????, ???????? ?????????? ???????????? ???????????? ??????????????
  if (viewSlide < 6) {
    // ???????? ?????????? ????
    // ?????????????????????? ?????????? ???????????? ???? ????????
    viewSlide++
  } else {
    // ??????????
    // ?????????? ???????????? ?????????? ????????
    viewSlide = 0
  }
  // ?????????????????????? ?????????????????? ???????????? ?? ??????????????
  viewSliders[viewSlide].style.backgroundColor = 'green'
  // ???????????? ?????????????? ?????????? ????????????
  slider.style.left = `${-viewSlide * viewport}px`
})

// ?????????????????? ?????????? ???? ???????????? ??????????
buttonPrevious.addEventListener('click', () => {
  // ???????????? ?????????????????? ???????????? ??????????????
  viewSliders[viewSlide].style.backgroundColor = 'red'
  // ??????????????, ???????? ?????????? ???????????? ???????????? ????????
  if (viewSlide > 0) {
    // ???????? ?????????? ????
    // ?????????????????? ?????????? ????????????
    viewSlide--
  } else {
    // ??????????
    // ?????????? ???????????? ?????????? ??????????????
    viewSlide = 6
  }
  // ?????????????????????? ?????????????????? ???????????? ?? ??????????????
  viewSliders[viewSlide].style.backgroundColor = 'green'
  // ???????????? ?????????????? ?????????? ????????????
  slider.style.left = `${-viewSlide * viewport}px`
})

const one =
  '{"img": "https://i0.wp.com/theverybesttop10.com/wp-content/uploads/2014/10/Top-10-Images-of-Angry-Wet-Cats-6.jpg?fit=586%2C404&ssl=1", "info": "??????????????", "title": "????????????????????: ?????? ???????????? ???????????????????? ?????????????? ?????????????? ???????????????????? ?????????? ?? ???????????? ????????"}'
const object = JSON.parse(one)

document.querySelector('#demo1').setAttribute('src', object.img)
document.querySelector('#demo').innerHTML = object.info
document.querySelector('#demo2').innerHTML = object.title

const two =
  '{"img": "https://www.boredpanda.com/blog/wp-content/uploads/2014/02/funny-wet-cats-1.jpg","info": "??????????????","title": "???????? ?????????? ???????????????????????????? ?????????? ???????????????? ?? ?????????????????? 20 ?????? ?? ???????????????????????? 50%"}'
const objtwo = JSON.parse(two)

document.querySelector('#demoimg').setAttribute('src', objtwo.img)
document.querySelector('#demoinfo').innerHTML = objtwo.info
document.querySelector('#demotitile').innerHTML = objtwo.title

const three =
  '{"img": "https://i.ytimg.com/vi/AsVQVKmI8pA/maxresdefault.jpg","info": "??????????????","title": "?????????????????????????? ?????? ???????????????? ?????????????? ?????????????????? ???????????? ?????? ?????????????????????????? ?????? ??????????????????"}'
const objthree = JSON.parse(three)

document.querySelector('#demoimgthree').setAttribute('src', objthree.img)
document.querySelector('#demoinfothree').innerHTML = objthree.info
document.querySelector('#demotitilethree').innerHTML = objthree.title

const four =
  '{"img": "https://cdn.shopify.com/s/files/1/0344/6469/files/Screen_Shot_2019-01-04_at_5.07.33_PM.png?v=1546639679", "info": "??????????????","title": "19FortyFive: ???????? ?????????????????????? ?? ?????????????????????? ?????? ?????????????????????? ?????????????? ???????????? ?? ????????????"}'
const objfour = JSON.parse(four)

document.querySelector('#demoimgfour').setAttribute('src', objfour.img)
document.querySelector('#demoinfofour').innerHTML = objfour.info
document.querySelector('#demotitilefour').innerHTML = objfour.title

const five =
  '{"img": "https://i.ytimg.com/vi/317jz-PU7Mg/maxresdefault.jpg", "info": "??????????????", "title": "??????-?????????????????????? ?????? ??????????????-?????????????????? ????????: ?????? ?????????????????? ???????????? ?????????????? ???????????? ???? ??????????????"}'
const objfive = JSON.parse(five)

document.querySelector('#demoimgfive').setAttribute('src', objfive.img)
document.querySelector('#demoinfofive').innerHTML = objfive.info
document.querySelector('#demotitileffive').innerHTML = objfive.title

const six =
  '{"img": "https://i.ytimg.com/vi/YSHDBB6id4A/maxresdefault.jpg", "info": "??????????????", "title": "Bloomberg: ???????????????????????? ???????????????????? ???????????????? ???????????? ???? ???????????????? ?????????? ???? ????????????????"}'
const objfsix = JSON.parse(five)

document.querySelector('#demoimgsix').setAttribute('src', objfsix.img)
document.querySelector('#demoinfosix').innerHTML = objfsix.info
document.querySelector('#demotitilefsix').innerHTML = objfsix.title

const seven =
  '{"img": "https://preview.redd.it/7aydec8cp6m41.jpg?width=640&crop=smart&auto=webp&s=22d2b330801f064094184eda733e2e6880c58809", "info": "??????????????", "title": "???????????????????? ???????????????? ?????????????????????? ?????????????? ?? ?????????? ?????????????????? ???? 6 ????????"}'
const objseven = JSON.parse(five)

document.querySelector('#demoimgseven').setAttribute('src', objfsix.img)
document.querySelector('#demoinfosseven').innerHTML = objfsix.info
document.querySelector('#demotitilefseven').innerHTML = objfsix.title

const ul = document.querySelector('#people')
const url = 'https://randomuser.me/api?results=6'

const createNode = (element) => document.createElement(element)
const append = (parent, el) => parent.append(el)

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    const people = data.results
    return people.map((person) => {
      const li = createNode('li')
      const img = createNode('img')
      const span = createNode('span')
      img.src = person.picture.medium
      span.innerHTML = `${person.name.first} ${person.name.last}`
      append(li, img)
      append(li, span)
      append(ul, li)
    })
  })
  .catch((error) => {
    console.log(error)
  })
