class Search {
  constructor(el) {
    this.$el = $(el)
    this.$control = this.$el.find('.search__input')
    this.$buttonDelete = this.$el.find('.search__btn-delete')
    this.value = this.$control.val()

    this.modifiers = {
      inited: 'search--inited',
      hasValue: 'search--has-value',
    }
  }

  init() {
    if (this.$el.hasClass(this.modifiers.inited)) return

    this.setButtonDeleteVisibility()
    this.bindEvents()

    this.$el.addClass(this.modifiers.inited)
  }

  bindEvents() {
    this.$control.on('input', () => {
      this.value = this.$control.val()
      this.setButtonDeleteVisibility()
    })

    this.$buttonDelete.on('click', () => {
      this.$control.val('').trigger('input')
    })
  }

  setButtonDeleteVisibility() {
    this.$el.toggleClass(
      this.modifiers.hasValue,
      typeof this.value !== 'undefined' && this.value !== '',
    )
  }
}

/* eslint-disable func-names */
$.fn.search = function() {
  return this.each(function() {
    new Search(this).init()
  })
}

$(() => {
  $('.search').search()
})
