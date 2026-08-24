import React from 'react'
import RadioPlayer from '../RadioPlayer/RadioPlayer.jsx'
import './Header.css'

export default function Header({ radio }) {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a href="#/" className="site-header__brand">
          <span className="site-header__mark">{radio.logoText || 'ON'}</span>
          <span className="site-header__wordmark">{radio.stationName}</span>
        </a>

        <div className="site-header__radio">
          <RadioPlayer radio={radio} variant="mini" />
        </div>

        <a href="#/admin" className="site-header__admin">
          Panel admin
        </a>
      </div>
      <div className="dial-rule" aria-hidden="true" />
    </header>
  )
}
