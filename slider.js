const tools = {
  getPix(num) {
    return `${num}px`
  },
  setStyles(dom, styles) {
    Object.assign(dom.style, styles)
  }
}
const { getPix, setStyles } = tools

class MiniSlider {
  constructor(opts) {
    this.container = opts.container
    this.wrapper = opts.wrapper
    this.sliderItems = opts.sliderItems
 
    this.duration = opts.duration || 200
    this.timeout = opts.timeout || 2000

    this.index = 0
    this.autoPlayInterval = null

    this.count = this.sliderItems.length
    this.realCount = this.count + 1

    this.isAnimated = true
    this.isBack = true

    this.initSize(true)

    this.bindTransitionEndHandler = this.transitionEndHandler.bind(this)
  }



  initSize (appendNode) {
    this.width = this.container.clientWidth
    
    const width = this.width * this.realCount
    
    setStyles(this.wrapper, {
      width: getPix(width),
      transform: `translateX(-${getPix(this.width * this.index)})`,
      transition: 'transform 0ms'
    })

    appendNode && this.wrapper.append(this.sliderItems[0].cloneNode())

    for(let i = 0; i < this.wrapper.children.length; i++) {
      const dom = this.wrapper.children[i]
      dom.style.width = getPix(this.width)
    }
  }

  prev() {
    // TODO
  }
  
  next() {
    const { wrapper, duration } = this
    
    this.index++
    this.isAnimated = false
    
    const trans = this.index * this.width

    setStyles(wrapper, {
      transform: `translateX(-${getPix(trans)})`,
      transition: `transform ${duration}ms ease-in-out`
    })

    if (this.index == this.count) {
      this.index = 0
      this.isBack = false
    }
    wrapper.addEventListener('transitionend', this.bindTransitionEndHandler, false)
  }

  pause() {
    this.clearInterval()
  }

  autoplay() {
    const _this = this
    
    this.clearInterval()
    
    this.autoPlayInterval = setInterval(function() {
      _this.next()
    }, this.timeout)
  }

  resize() {
    if (!this.isAnimated) return
    const playFn = this.autoPlayInterval ? 'autoplay' : 'play'
    this.pause()
    this.initSize()
    this[playFn]()
  }

  clearInterval() {
    if (this.autoPlayInterval) clearInterval(this.autoPlayInterval)
    this.autoPlayInterval = null
  }


  transitionEndHandler() {
    const { wrapper } = this
    if (this.index == 0) {
      setStyles(wrapper, {
        transform: `translateX(0px)`,
        transition: `transform 0ms ease-in-out`
      })
      this.isBack = true
    }

    wrapper.removeEventListener('transitionend',  this.bindTransitionEndHandler, false)

    this.isAnimated = true
  }
}