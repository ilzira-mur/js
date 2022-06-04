$(() => {
  $(document).on('click', '.node__self', (event) => {
    const $this = $(event.currentTarget)
    $this
      .closest('.node')
      .find(' > .node__inner')
      .slideToggle(200)
  })
})
