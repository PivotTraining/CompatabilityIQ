'use client'

import { useEffect } from 'react'
import { inView } from 'framer-motion'

export default function LandingAnimations() {
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('[data-animate="fade-up"]')

    sections.forEach((el) => {
      const delay = parseInt(el.getAttribute('data-delay') || '0', 10)

      // Set initial state
      el.style.opacity = '0'
      el.style.transform = 'translateY(30px)'
      el.style.transition = `opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms, transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`

      inView(el, () => {
        el.style.opacity = '1'
        el.style.transform = 'translateY(0px)'
      }, { margin: '0px 0px -80px 0px' })
    })
  }, [])

  return null
}
