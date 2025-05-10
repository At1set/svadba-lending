window.onload = () => {
  const form = document.querySelector(".registration-form")
  const nameInput = document.getElementById("name")
  const surnameInput = document.getElementById("surname")
  const alcoholInput = document.getElementById("alcohol")
  const radioInputs = form.querySelectorAll('input[name="visit"]')

  form.addEventListener("submit", async function (e) {
    e.preventDefault()

    let valid = true

    // Очистка ошибок
    clearError()
    clearError()
    clearError()
    radioInputs.forEach((r) => r.parentElement.classList.remove("btn--error"))

    // Валидация полей
    if (nameInput.value.trim().length < 3) {
      showError("Пожалуйста, введите ваше имя")
      valid = false
    } else if (surnameInput.value.trim().length < 3) {
      showError("Пожалуйста, введите вашу фамилию")
      valid = false
    } else if (alcoholInput.value.trim().length < 2) {
      showError("Пожалуйста, укажите ваш любимый алкоголь")
      valid = false
    }

    let selected = [...radioInputs].find((r) => r.checked)
    if (!selected && valid) {
      radioInputs.forEach((r) => r.parentElement.classList.add("btn--error"))
      valid = false
      showError("Пожалуйста, укажите, сможете ли вы прийти")
    }

    if (!valid) return

    form.classList.add("form--loading")

    const text = `<b>Новый ответ на приглашение:</b>%0A<b>Имя:</b> ${nameInput.value.trim()}%0A<b>Фамилия:</b> ${surnameInput.value.trim()}%0A<b>Алкоголь:</b> ${alcoholInput.value.trim()}%0A<b>${
      selected.id === "will-go" ? "Смогу" : "Не смогу"
    }</b>`

    try {
      // await fetch(`https://your-api-or-telegram-bot-link?text=${text}`)
      await new Promise((resolve) => setTimeout(resolve, 3000)) // Заглушка
      form.innerHTML =
        '<p class="registration-form__result-message">Ответ отправлен. Спасибо!</p>'
      console.log(text)
    } catch (error) {
      console.error(error)
      form.innerHTML = "<p>Произошла ошибка. Попробуйте позже.</p>"
    } finally {
      form.classList.remove("form--loading")
    }
  })

  // Функции для показа / очистки ошибок
  function showError(message) {
    const errorBlock = document.querySelector(".form-input__error")
    if (errorBlock) {
      errorBlock.textContent = message
    }
  }

  function clearError() {
    const errorBlock = document.querySelector(".form-input__error")
    if (errorBlock) {
      errorBlock.textContent = ""
    }
  }

  // Сброс ошибки при вводе
  ;[nameInput, surnameInput, alcoholInput].forEach((input) => {
    input.addEventListener("input", () => clearError())
  })

  // Анимация при скролле
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
