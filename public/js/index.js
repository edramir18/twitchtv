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
  const oldContent = document.getElementById('main_panel').children[0]
  const content = document.createElement('div')
  content.classList.add('content')

  users.forEach(k => {
    const twitch = document.getElementById('twitchuser').content.cloneNode(true)
    if (k.stream.stream) {
      twitch.querySelector('article').setAttribute('data-live', true)
      twitch.querySelector('span').textContent = 'LIVE'
    } else {
      twitch.querySelector('article').setAttribute('data-live', false)
      twitch.querySelector('span').textContent = 'Offline'
    }
    twitch.querySelector('a').textContent = k.user.name
    twitch.querySelector('a').setAttribute('href', k.channel.url)    
    twitch.querySelector('p').textContent = k.user.bio
    content.appendChild(twitch)
  })
  oldContent.parentNode.replaceChild(content, oldContent)
}

document.addEventListener('DOMContentLoaded', (e) => {
  console.log('DOM Loaded')

  const filterRatios = document.querySelectorAll('[name=filter]')
  filterRatios.forEach(k => k.addEventListener('change', ratioHandler))

  const eslSc2 = fetchUserTwitchInfo('esl_sc2')
  const freeCodeCamp = fetchUserTwitchInfo('freecodecamp')
  const test = fetchUserTwitchInfo('test_channel')
  Promise.all([eslSc2, freeCodeCamp, test]).then(values => {
    showUserInformation(values)
  })
  .catch(err => {
    console.log('ERROR: ' + err)
  })  
})
