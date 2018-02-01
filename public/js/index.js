'use strict'
/* global fetch:false */

function radioHandler (event) {
  const filter = event.target.value
  const isLiveFilteredOut = filter !== 'all' && filter !== 'live'
  const isOfflineFilteredOut = filter !== 'all' && filter !== 'offline'
  const lives = document.querySelectorAll('article[data-live=true]')
  const offline = document.querySelectorAll('article[data-live=false]')
  lives.forEach(k => k.classList.toggle('-is-filtered', isLiveFilteredOut))
  offline.forEach(k => k.classList.toggle('-is-filtered', isOfflineFilteredOut))
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
    return showUserInformation({user: jsonValues[0], channel: jsonValues[1], stream: jsonValues[2]})
  })
}

function showUserInformation (streamer) {
  const main = document.getElementById('main_panel').querySelector('.content')
  if (streamer.user.hasOwnProperty('error')) return
  const twitch = document.getElementById('twitchuser').content.cloneNode(true)
  if (streamer.stream.stream) {    
    twitch.querySelector('article').setAttribute('data-live', true)
    twitch.querySelector('.streamer__logo').classList.add('-is-live')
    
    twitch.querySelector('.streamer__preview>img').setAttribute('src', streamer.stream.stream.preview.medium)
    twitch.querySelector('p').textContent = streamer.stream.stream.channel.status
  } else {
    twitch.querySelector('article').setAttribute('data-live', false)
    twitch.querySelector('p').textContent = 'Offline'
    if (streamer.channel.profile_banner) {
      twitch.querySelector('.streamer__preview>img').setAttribute('src', streamer.channel.profile_banner)
    }
  }
  twitch.querySelector('img').setAttribute('src', streamer.user.logo)
  twitch.querySelector('a').textContent = streamer.user.name
  twitch.querySelector('a').setAttribute('href', streamer.channel.url)
  twitch.querySelector('.streamer__preview').setAttribute('href', streamer.channel.url)
  main.appendChild(twitch)
  return twitch
}

function updateMain (selector) {
  const target = document.querySelector(selector)
  target.classList.add('-is-dismissed')
  target.addEventListener('animationend', function (e) {
    const main = document.querySelector('#main_panel')
    main.removeChild(e.target)
    document.querySelector('.nav').classList.remove('-is-hidden')
  })
}

document.addEventListener('DOMContentLoaded', (e) => {
  console.log('DOM Loaded')
  const filterRatios = document.querySelectorAll('[name=filter]')
  filterRatios.forEach(k => k.addEventListener('change', radioHandler))
  const users = ['freecodecamp', 'LowkoTV', 'iamextrememadness', 'FeelinkHS', 'ESL_SC2', 'OgamingSC2',
    'cretetion', 'storbeck', 'habathcx', 'RobotCaleb', 'noobs2ninjas', 'test_channel']
  Promise.race(users.map(u => fetchUserTwitchInfo(u))).then(() => {
    updateMain('.splash')
  })
  .catch(err => {
    console.log('ERROR: ' + err)
  })
})
