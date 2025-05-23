"use strict"
/* Проверка поддержки webp, добавление класса webp или no-webp для HTML */
export function isWebp() {
  //Проверка поддержки webp
  function testWebP(callback) {
    var webP = new Image()
    webP.onload = webP.onerror = function () {
      callback(webP.height == 2)
    }
    webP.src =
      "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA"
  }
  //Добавление класса _webp или _nowebp для HTML
  testWebP(function (support) {
    if (support == true) {
      document.querySelector("body").classList.add("webp")
    } else {
      document.querySelector("body").classList.add("no-webp")
    }
  })
}
//Проверка открытого в мобильном устройсте браузера
export let isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i)
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i)
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i)
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i)
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i)
  },
  any: function () {
    return (
      isMobile.Android() ||
      isMobile.BlackBerry() ||
      isMobile.iOS() ||
      isMobile.Opera() ||
      isMobile.Windows()
    )
  },
}

//Динамический адаптив===============================================================================================================================================

export function DynamicAdapt(type) {
  this.type = type
}
DynamicAdapt.prototype.init = function () {
  const _this = this
  // массив объектов
  this.оbjects = []
  this.daClassname = "_dynamic_adapt_"
  // массив DOM-элементов
  this.nodes = document.querySelectorAll("[data-da]")
  // наполнение оbjects объктами
  for (let i = 0; i < this.nodes.length; i++) {
    const node = this.nodes[i]
    const data = node.dataset.da.trim()
    const dataArray = data.split(",")
    const оbject = {}
    оbject.element = node
    оbject.parent = node.parentNode
    оbject.destination = document.querySelector(dataArray[0].trim())
    оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767"
    оbject.place = dataArray[2] ? dataArray[2].trim() : "last"
    оbject.index = this.indexInParent(оbject.parent, оbject.element)
    this.оbjects.push(оbject)
  }
  this.arraySort(this.оbjects)
  // массив уникальных медиа-запросов
  this.mediaQueries = Array.prototype.map.call(
    this.оbjects,
    function (item) {
      return (
        "(" +
        this.type +
        "-width: " +
        item.breakpoint +
        "px)," +
        item.breakpoint
      )
    },
    this
  )
  this.mediaQueries = Array.prototype.filter.call(
    this.mediaQueries,
    function (item, index, self) {
      return Array.prototype.indexOf.call(self, item) === index
    }
  )
  // навешивание слушателя на медиа-запрос
  // и вызов обработчика при первом запуске
  for (let i = 0; i < this.mediaQueries.length; i++) {
    const media = this.mediaQueries[i]
    const mediaSplit = String.prototype.split.call(media, ",")
    const matchMedia = window.matchMedia(mediaSplit[0])
    const mediaBreakpoint = mediaSplit[1]
    // массив объектов с подходящим брейкпоинтом
    const оbjectsFilter = Array.prototype.filter.call(
      this.оbjects,
      function (item) {
        return item.breakpoint === mediaBreakpoint
      }
    )
    matchMedia.addEventListener("change", function () {
      _this.mediaHandler(matchMedia, оbjectsFilter)
    })
    this.mediaHandler(matchMedia, оbjectsFilter)
  }
}
DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
  if (matchMedia.matches) {
    for (let i = 0; i < оbjects.length; i++) {
      const оbject = оbjects[i]
      оbject.index = this.indexInParent(оbject.parent, оbject.element)
      this.moveTo(оbject.place, оbject.element, оbject.destination)
    }
  } else {
    //for (let i = 0; i < оbjects.length; i++) {
    for (let i = оbjects.length - 1; i >= 0; i--) {
      const оbject = оbjects[i]
      if (оbject.element.classList.contains(this.daClassname)) {
        this.moveBack(оbject.parent, оbject.element, оbject.index)
      }
    }
  }
}
// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
  element.classList.add(this.daClassname)
  if (place === "last" || place >= destination.children.length) {
    destination.insertAdjacentElement("beforeend", element)
    return
  }
  if (place === "first") {
    destination.insertAdjacentElement("afterbegin", element)
    return
  }
  destination.children[place].insertAdjacentElement("beforebegin", element)
}
// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
  element.classList.remove(this.daClassname)
  if (parent.children[index] !== undefined) {
    parent.children[index].insertAdjacentElement("beforebegin", element)
  } else {
    parent.insertAdjacentElement("beforeend", element)
  }
}
// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
  const array = Array.prototype.slice.call(parent.children)
  return Array.prototype.indexOf.call(array, element)
}
// Функция сортировки массива по breakpoint и place
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
  if (this.type === "min") {
    Array.prototype.sort.call(arr, function (a, b) {
      if (a.breakpoint === b.breakpoint) {
        if (a.place === b.place) {
          return 0
        }

        if (a.place === "first" || b.place === "last") {
          return -1
        }

        if (a.place === "last" || b.place === "first") {
          return 1
        }

        return a.place - b.place
      }

      return a.breakpoint - b.breakpoint
    })
  } else {
    Array.prototype.sort.call(arr, function (a, b) {
      if (a.breakpoint === b.breakpoint) {
        if (a.place === b.place) {
          return 0
        }

        if (a.place === "first" || b.place === "last") {
          return 1
        }

        if (a.place === "last" || b.place === "first") {
          return -1
        }

        return b.place - a.place
      }

      return b.breakpoint - a.breakpoint
    })
    return
  }
}
const da = new DynamicAdapt("max")
da.init()

//SPOLLERS=====================================================================================================================================================
export function spollers() {
  const spollersArray = document.querySelectorAll("[data-spollers]")
  if (spollersArray.length > 0) {
    // Получение обычных слойлеров
    const spollersRegular = Array.from(spollersArray).filter(function (
      item,
      index,
      self
    ) {
      return !item.dataset.spollers.split(",")[0]
    })
    // Инициализация обычных слойлеров
    if (spollersRegular.length) {
      initSpollers(spollersRegular)
    }

    // Получение слойлеров с медиа запросами
    let mdQueriesArray = dataMediaQueries(spollersArray, "spollers")
    if (mdQueriesArray && mdQueriesArray.length) {
      mdQueriesArray.forEach((mdQueriesItem) => {
        // Событие
        mdQueriesItem.matchMedia.addEventListener("change", function () {
          initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia)
        })
        initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia)
      })
    }
    // Инициализация
    function initSpollers(spollersArray, matchMedia = false) {
      spollersArray.forEach((spollersBlock) => {
        spollersBlock = matchMedia ? spollersBlock.item : spollersBlock
        if (matchMedia.matches || !matchMedia) {
          spollersBlock.classList.add("_spoller-init")
          initSpollerBody(spollersBlock)
          spollersBlock.addEventListener("click", setSpollerAction)
        } else {
          spollersBlock.classList.remove("_spoller-init")
          initSpollerBody(spollersBlock, false)
          spollersBlock.removeEventListener("click", setSpollerAction)
        }
      })
    }
    // Работа с контентом
    function initSpollerBody(spollersBlock, hideSpollerBody = true) {
      var spollerTitles = spollersBlock.querySelectorAll("[data-spoller]")
      if (spollerTitles.length) {
        spollerTitles = Array.from(spollerTitles).filter(
          (item) => item.closest("[data-spollers]") === spollersBlock
        )
        spollerTitles.forEach((spollerTitle) => {
          if (hideSpollerBody) {
            spollerTitle.removeAttribute("tabindex")
            if (!spollerTitle.classList.contains("_spoller-active")) {
              spollerTitle.nextElementSibling.hidden = true
            }
          } else {
            spollerTitle.setAttribute("tabindex", "-1")
            spollerTitle.nextElementSibling.hidden = false
          }
        })
      }
    }
    function setSpollerAction(e) {
      const el = e.target
      if (el.closest("[data-spoller]")) {
        const spollerTitle = el.closest("[data-spoller]")
        var spollersBlock = spollerTitle.closest("[data-spollers]")
        const oneSpoller = spollersBlock.hasAttribute("data-one-spoller")
        const spollerSpeed = spollersBlock.dataset.spollersSpeed
          ? parseInt(spollersBlock.dataset.spollersSpeed)
          : 500
        if (!spollersBlock.querySelectorAll("._slide").length) {
          if (
            oneSpoller &&
            !spollerTitle.classList.contains("_spoller-active")
          ) {
            hideSpollersBody(spollersBlock)
          }
          spollerTitle.classList.toggle("_spoller-active")
          _slideToggle(spollerTitle.nextElementSibling, spollerSpeed)
        }
        e.preventDefault()
      }
    }
    function hideSpollersBody(spollersBlock) {
      const spollerActiveTitle = spollersBlock.querySelector(
        "[data-spoller]._spoller-active"
      )
      const spollerSpeed = spollersBlock.dataset.spollersSpeed
        ? parseInt(spollersBlock.dataset.spollersSpeed)
        : 500
      if (
        spollerActiveTitle &&
        !spollersBlock.querySelectorAll("._slide").length
      ) {
        spollerActiveTitle.classList.remove("_spoller-active")
        _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed)
      }
    }
    // Закрытие при клике вне спойлера
    const spollersClose = document.querySelectorAll("[data-spoller-close]")
    if (
      spollersClose.length &&
      document
        .querySelector(".footer__list")
        .classList.contains("_spoller-init")
    ) {
      document.addEventListener("click", function (e) {
        const el = e.target
        if (!el.closest("[data-spollers]")) {
          spollersClose.forEach((spollerClose) => {
            const spollersBlock = spollerClose.closest("[data-spollers]")
            const spollerSpeed = spollersBlock.dataset.spollersSpeed
              ? parseInt(spollersBlock.dataset.spollersSpeed)
              : 500
            spollerClose.classList.remove("_spoller-active")
            _slideUp(spollerClose.nextElementSibling, spollerSpeed)
          })
        }
      })
    }
  }
}

export let _slideUp = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide")
    target.style.transitionProperty = "height, margin, padding"
    target.style.transitionDuration = duration + "ms"
    target.style.height = `${target.offsetHeight}px`
    target.offsetHeight
    target.style.overflow = "hidden"
    target.style.height = showmore ? `${showmore}px` : `0px`
    target.style.paddingTop = 0
    target.style.paddingBottom = 0
    target.style.marginTop = 0
    target.style.marginBottom = 0
    window.setTimeout(() => {
      target.hidden = !showmore ? true : false
      !showmore ? target.style.removeProperty("height") : null
      target.style.removeProperty("padding-top")
      target.style.removeProperty("padding-bottom")
      target.style.removeProperty("margin-top")
      target.style.removeProperty("margin-bottom")
      !showmore ? target.style.removeProperty("overflow") : null
      target.style.removeProperty("transition-duration")
      target.style.removeProperty("transition-property")
      target.classList.remove("_slide")
      // Создаем событие
      document.dispatchEvent(
        new CustomEvent("slideUpDone", {
          detail: {
            target: target,
          },
        })
      )
    }, duration)
  }
}
export let _slideDown = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide")
    target.hidden = target.hidden ? false : null
    showmore ? target.style.removeProperty("height") : null
    let height = target.offsetHeight
    target.style.overflow = "hidden"
    target.style.height = showmore ? `${showmore}px` : `0px`
    target.style.paddingTop = 0
    target.style.paddingBottom = 0
    target.style.marginTop = 0
    target.style.marginBottom = 0
    target.offsetHeight
    target.style.transitionProperty = "height, margin, padding"
    target.style.transitionDuration = duration + "ms"
    target.style.height = height + "px"
    target.style.removeProperty("padding-top")
    target.style.removeProperty("padding-bottom")
    target.style.removeProperty("margin-top")
    target.style.removeProperty("margin-bottom")
    window.setTimeout(() => {
      target.style.removeProperty("height")
      target.style.removeProperty("overflow")
      target.style.removeProperty("transition-duration")
      target.style.removeProperty("transition-property")
      target.classList.remove("_slide")
      // Создаем событие
      document.dispatchEvent(
        new CustomEvent("slideDownDone", {
          detail: {
            target: target,
          },
        })
      )
    }, duration)
  }
}
export let _slideToggle = (target, duration = 500) => {
  if (target.hidden) {
    return _slideDown(target, duration)
  } else {
    return _slideUp(target, duration)
  }
}

// Уникализация массива
export function uniqArray(array) {
  return array.filter(function (item, index, self) {
    return self.indexOf(item) === index
  })
}

export function dataMediaQueries(array, dataSetValue) {
  // Получение объектов с медиа запросами
  const media = Array.from(array).filter(function (item, index, self) {
    if (item.dataset[dataSetValue]) {
      return item.dataset[dataSetValue].split(",")[0]
    }
  })
  // Инициализация объектов с медиа запросами
  if (media.length) {
    const breakpointsArray = []
    media.forEach((item) => {
      const params = item.dataset[dataSetValue]
      const breakpoint = {}
      const paramsArray = params.split(",")
      breakpoint.value = paramsArray[0]
      breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max"
      breakpoint.item = item
      breakpointsArray.push(breakpoint)
    })
    // Получаем уникальные брейкпоинты
    let mdQueries = breakpointsArray.map(function (item) {
      return (
        "(" +
        item.type +
        "-width: " +
        item.value +
        "px)," +
        item.value +
        "," +
        item.type
      )
    })
    mdQueries = uniqArray(mdQueries)
    const mdQueriesArray = []

    if (mdQueries.length) {
      // Работаем с каждым брейкпоинтом
      mdQueries.forEach((breakpoint) => {
        const paramsArray = breakpoint.split(",")
        const mediaBreakpoint = paramsArray[1]
        const mediaType = paramsArray[2]
        const matchMedia = window.matchMedia(paramsArray[0])
        // Объекты с нужными условиями
        const itemsArray = breakpointsArray.filter(function (item) {
          if (item.value === mediaBreakpoint && item.type === mediaType) {
            return true
          }
        })
        mdQueriesArray.push({
          itemsArray,
          matchMedia,
        })
      })
      return mdQueriesArray
    }
  }
}

//===============================================================================================================================================
// Убрать класс из всех элементов массива
export function removeClasses(array, className) {
  for (var i = 0; i < array.length; i++) {
    array[i].classList.remove(className)
  }
}
//===============================================================================================================================================

// Scrolling-animation
export function animationOnScroll() {
  const animItems = document.querySelectorAll("[data-anim-on-scroll]")

  animItems.forEach((animItem) => {
    const datasetValue = animItem.dataset.animOnScroll || "0"
    let offsetPx = 0
    let isSingle = false

    if (datasetValue.includes(",")) {
      const [offsetPart, mode] = datasetValue.split(",")
      offsetPx = parseInt(offsetPart.trim(), 10)
      isSingle = mode.trim() === "single"
    } else {
      offsetPx = parseInt(datasetValue.trim(), 10)
    }

    const observer = new IntersectionObserver(
      ([entry], obs) => {
        const data_delay = parseInt(animItem.dataset.animDelay?.trim(), 10)
        const delay = Number.isNaN(data_delay) ? 0 : data_delay
        if (entry.isIntersecting) {
          setTimeout(() => {
            animItem.classList.add("_anim")
          }, delay || 0)
          if (isSingle) {
            obs.unobserve(animItem)
          }
        } else {
          if (!isSingle) {
            setTimeout(() => {
              animItem.classList.remove("_anim")
            }, delay || 0)
          }
        }
      },
      {
        root: null,
        rootMargin: `${offsetPx * -1}px 0px`, // Важно: инвертируем знак!
        threshold: 0,
      }
    )

    observer.observe(animItem)
  })
}

//===============================================================================================================================================
