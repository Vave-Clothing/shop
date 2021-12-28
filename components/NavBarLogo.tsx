import styles from '@/styles/NavBarLogo.module.scss'

interface navBarLogoProps {
  inverted?: boolean
}

const NavBarLogo = ({ inverted }: navBarLogoProps) => {
  return (
    <svg width="80" height="25" viewBox="0 0 80 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path id="background" d="M6 0H80L74 25H0L6 0Z" fill={inverted ? 'white' : 'black'} className={styles.background} />
      <g id="foreground" className={styles.foreground}>
        <g id="vave">
          <path d="M29.754 4.454L25.02 17H23.13L18.396 4.454H20.142L24.084 15.272L28.026 4.454H29.754Z" fill={inverted ? 'black' : 'white'}/>
          <path d="M38.9661 14.21H33.4941L32.4861 17H30.7581L35.2941 4.526H37.1841L41.7021 17H39.9741L38.9661 14.21ZM38.4981 12.878L36.2301 6.542L33.9621 12.878H38.4981Z" fill={inverted ? 'black' : 'white'}/>
          <path d="M54.047 4.454L49.313 17H47.423L42.689 4.454H44.435L48.377 15.272L52.319 4.454H54.047Z" fill={inverted ? 'black' : 'white'}/>
          <path d="M57.481 5.786V9.98H62.053V11.33H57.481V15.65H62.593V17H55.843V4.436H62.593V5.786H57.481Z" fill={inverted ? 'black' : 'white'}/>
        </g>
        <g id="clothing">
          <path d="M27.24 20.25C27.24 19.9067 27.315 19.6 27.465 19.33C27.615 19.0567 27.82 18.845 28.08 18.695C28.34 18.5417 28.63 18.465 28.95 18.465C29.34 18.465 29.6733 18.5583 29.95 18.745C30.23 18.9283 30.4333 19.1883 30.56 19.525H30.15C30.05 19.2883 29.8967 19.1033 29.69 18.97C29.4867 18.8367 29.24 18.77 28.95 18.77C28.6933 18.77 28.4617 18.83 28.255 18.95C28.0517 19.07 27.8917 19.2433 27.775 19.47C27.6583 19.6933 27.6 19.9533 27.6 20.25C27.6 20.5467 27.6583 20.8067 27.775 21.03C27.8917 21.2533 28.0517 21.425 28.255 21.545C28.4617 21.665 28.6933 21.725 28.95 21.725C29.24 21.725 29.4867 21.66 29.69 21.53C29.8967 21.3967 30.05 21.2133 30.15 20.98H30.56C30.4333 21.3133 30.23 21.5717 29.95 21.755C29.67 21.9383 29.3367 22.03 28.95 22.03C28.63 22.03 28.34 21.955 28.08 21.805C27.82 21.6517 27.615 21.44 27.465 21.17C27.315 20.9 27.24 20.5933 27.24 20.25Z" fill={inverted ? 'black' : 'white'}/>
          <path d="M31.6074 21.715H32.8624V22H31.2574V18.505H31.6074V21.715Z" fill={inverted ? 'black' : 'white'}/>
          <path d="M34.9319 22.035C34.6086 22.035 34.3152 21.96 34.0519 21.81C33.7886 21.6567 33.5802 21.445 33.4269 21.175C33.2769 20.9017 33.2019 20.5933 33.2019 20.25C33.2019 19.9067 33.2769 19.6 33.4269 19.33C33.5802 19.0567 33.7886 18.845 34.0519 18.695C34.3152 18.5417 34.6086 18.465 34.9319 18.465C35.2586 18.465 35.5536 18.5417 35.8169 18.695C36.0802 18.845 36.2869 19.0567 36.4369 19.33C36.5869 19.6 36.6619 19.9067 36.6619 20.25C36.6619 20.5933 36.5869 20.9017 36.4369 21.175C36.2869 21.445 36.0802 21.6567 35.8169 21.81C35.5536 21.96 35.2586 22.035 34.9319 22.035ZM34.9319 21.73C35.1919 21.73 35.4252 21.67 35.6319 21.55C35.8386 21.43 36.0019 21.2583 36.1219 21.035C36.2419 20.8083 36.3019 20.5467 36.3019 20.25C36.3019 19.9533 36.2419 19.6933 36.1219 19.47C36.0019 19.2467 35.8386 19.075 35.6319 18.955C35.4252 18.835 35.1919 18.775 34.9319 18.775C34.6719 18.775 34.4386 18.835 34.2319 18.955C34.0252 19.075 33.8619 19.2467 33.7419 19.47C33.6219 19.6933 33.5619 19.9533 33.5619 20.25C33.5619 20.5467 33.6219 20.8083 33.7419 21.035C33.8619 21.2583 34.0252 21.43 34.2319 21.55C34.4386 21.67 34.6719 21.73 34.9319 21.73Z" fill={inverted ? 'black' : 'white'}/>
          <path d="M39.3473 18.505V18.795H38.3773V22H38.0273V18.795H37.0523V18.505H39.3473Z" fill={inverted ? 'black' : 'white'}/>
          <path d="M42.495 18.505V22H42.145V20.365H40.25V22H39.9V18.505H40.25V20.075H42.145V18.505H42.495Z" fill={inverted ? 'black' : 'white'}/>
          <path d="M43.6436 18.505V22H43.2936V18.505H43.6436Z" fill={inverted ? 'black' : 'white'}/>
          <path d="M47.0711 22H46.7211L44.7861 19.06V22H44.4361V18.505H44.7861L46.7211 21.44V18.505H47.0711V22Z" fill={inverted ? 'black' : 'white'}/>
          <path d="M50.6139 19.525C50.5139 19.295 50.3605 19.115 50.1539 18.985C49.9505 18.8517 49.7105 18.785 49.4339 18.785C49.1739 18.785 48.9405 18.845 48.7339 18.965C48.5272 19.085 48.3639 19.2567 48.2439 19.48C48.1239 19.7 48.0639 19.9567 48.0639 20.25C48.0639 20.5433 48.1239 20.8017 48.2439 21.025C48.3639 21.2483 48.5272 21.42 48.7339 21.54C48.9405 21.66 49.1739 21.72 49.4339 21.72C49.6772 21.72 49.8955 21.6683 50.0889 21.565C50.2855 21.4583 50.4422 21.3083 50.5589 21.115C50.6789 20.9183 50.7472 20.69 50.7639 20.43H49.2939V20.145H51.1339V20.4C51.1172 20.7067 51.0339 20.985 50.8839 21.235C50.7339 21.4817 50.5322 21.6767 50.2789 21.82C50.0289 21.9633 49.7472 22.035 49.4339 22.035C49.1105 22.035 48.8172 21.96 48.5539 21.81C48.2905 21.6567 48.0822 21.445 47.9289 21.175C47.7789 20.9017 47.7039 20.5933 47.7039 20.25C47.7039 19.9067 47.7789 19.6 47.9289 19.33C48.0822 19.0567 48.2905 18.845 48.5539 18.695C48.8172 18.5417 49.1105 18.465 49.4339 18.465C49.8072 18.465 50.1339 18.5583 50.4139 18.745C50.6939 18.9317 50.8972 19.1917 51.0239 19.525H50.6139Z" fill={inverted ? 'black' : 'white'}/>
        </g>
      </g>
    </svg>
  )
}

export default NavBarLogo