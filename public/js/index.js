'use strict'
/* global fetch:false */

function ratioHandler (event) {
  const selector = event.target.value
  const lives = document.querySelectorAll('article[data-live=true]')
  const offline = document.querySelectorAll('article[data-live=false]')

  if (lives.length === 0 && offline.length) return

  const liveStatus = selector === 'all' || selector === 'live'
  const offlineStatus = selector === 'all' || selector === 'offline'

  lives.forEach(k => k.classList.toggle('-is-hidden', !liveStatus))
  offline.forEach(k => k.classList.toggle('-is-hidden', !offlineStatus))
}

function fecthJSON (url) {
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok.')
    }
    return response.json()
  })
}

function fetchUserTwitchInfo (user) {
  const urlUser = 'https://wind-bow.glitch.me/twitch-api/users/' + user
  const urlChannel = 'https://wind-bow.glitch.me/twitch-api/channels/' + user
  const urlStream = 'https://wind-bow.glitch.me/twitch-api/streams/' + user

  const userPromise = fecthJSON(urlUser)
  const channelPromise = fecthJSON(urlChannel)
  const streamPromise = fecthJSON(urlStream)

  return Promise.all([userPromise, channelPromise, streamPromise]).then((jsonValues) => {
    return new Promise(function (resolve, reject) {
      if (jsonValues.length < 3) {
        reject(Error('Incompleted Information'))
      } else {
        resolve({user: jsonValues[0], channel: jsonValues[1], stream: jsonValues[2]})
      }
    })
  })
}

function showUserInformation (users) {
  const content = document.createElement('div')
  content.classList.add('content')

  users.forEach(k => {
    console.log(k)
    if (k.user.hasOwnProperty('error')) return
    const twitch = document.getElementById('twitchuser').content.cloneNode(true)
    if (k.stream.stream) {
      twitch.querySelector('article').setAttribute('data-live', true)
      twitch.querySelector('.streamer__logo').classList.add('-is-live')
    } else {
      twitch.querySelector('article').setAttribute('data-live', false)
    }
    twitch.querySelector('img').setAttribute('src', k.user.logo)
    twitch.querySelector('a').textContent = k.user.name
    twitch.querySelector('a').setAttribute('href', k.channel.url)   
    twitch.querySelector('p').textContent = k.user.bio
    content.appendChild(twitch)
  })
  updateMain('.splash', content)
}

function updateMain (selector, panel) {
  const target = document.querySelector(selector)
  target.classList.add('-is-dismissed')
  target.addEventListener('animationend', function () {
    const main = document.querySelector('#main_panel')   
    main.replaceChild(panel, main.firstElementChild)
    document.querySelector('.nav').classList.remove('-is-hidden');
  })
}

document.addEventListener('DOMContentLoaded', (e) => {
  console.log('DOM Loaded')
  const filterRatios = document.querySelectorAll('[name=filter]')
  filterRatios.forEach(k => k.addEventListener('change', ratioHandler))  
  const users = ['esl_sc2', 'LowkoTV', 'iamextrememadness', 'FeelinkHS', 'freecodecamp', 'test_channel']
  Promise.all(users.map(u => fetchUserTwitchInfo(u))).then(values => {
    showUserInformation(values)
  })
  .catch(err => {
    console.log('ERROR: ' + err)
  })  
})
