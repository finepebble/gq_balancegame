import { UI } from './ui.js'
import { Store } from './store.js'
import { Net } from './net.js'
import { defaultQuestions } from './data.js'

const routes = {
  '/': renderHome,
  '/play': renderPlay,
  '/results': renderResults,
  '/submit': renderSubmit,
  '/community': renderCommunity,
}

const appEl = document.getElementById('app')
document.getElementById('year').textContent = new Date().getFullYear()

const themeBtn = document.getElementById('themeToggle')
const prefer = localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: light)').matches ? 'light':'dark')
document.documentElement.classList.toggle('light', prefer==='light')
themeBtn.onclick = ()=>{
  const now = document.documentElement.classList.toggle('light')
  localStorage.setItem('theme', now ? 'light':'dark')
}

const StoreInst = new Store()
const NetInst = await Net.create()
if (!StoreInst.getQuestions().length){
  StoreInst.seed(defaultQuestions)
}

window.addEventListener('hashchange', renderRoute)
renderRoute()

function renderRoute(){
  const path = location.hash.replace('#','') || '/'
  const route = routes[path] ? path : '/'
  routes[route]()
}

function renderHome(){
  const q = StoreInst.getTodaysQuestion()
  appEl.innerHTML = UI.home(q)
  document.getElementById('goPlay').onclick = ()=>{ location.hash = '/play' }
  document.getElementById('shuffle').onclick = ()=>{
    StoreInst.shuffleToday()
    renderHome()
  }
}

function wireOptions(q){
  const aEl = document.getElementById('optA')
  const bEl = document.getElementById('optB')
  aEl.onclick = async ()=>{ await vote('A', q) }
  bEl.onclick = async ()=>{ await vote('B', q) }
  function select(which){
    aEl.classList.toggle('selected', which==='A')
    bEl.classList.toggle('selected', which==='B')
  }
  select(StoreInst.getMyVote(q.id))
}

async function vote(which, q){
  StoreInst.saveVote(q.id, which)
  UI.toast(`선택 완료! (${which})`)
  await NetInst.publishVote(q.id, which)
  location.hash = '/results'
}

function renderPlay(){
  const q = StoreInst.getTodaysQuestion()
  appEl.innerHTML = UI.play(q)
  wireOptions(q)
}

async function renderResults(){
  const q = StoreInst.getTodaysQuestion()
  appEl.innerHTML = UI.results(q)
  const barA = document.getElementById('barA')
  const barB = document.getElementById('barB')
  const counts = StoreInst.getCounts(q.id)
  try{
    const remote = await NetInst.getAggregate(q.id)
    if (remote) { counts.A += remote.A||0; counts.B += remote.B||0 }
  }catch{}
  const total = Math.max(1, counts.A + counts.B)
  const pA = Math.round(counts.A/total*100)
  const pB = 100 - pA
  barA.style.width = pA + '%'
  barB.style.width = pB + '%'
  document.getElementById('pA').textContent = pA + '%'
  document.getElementById('pB').textContent = pB + '%'
  document.getElementById('toPlay').onclick = ()=> location.hash = '/play'
}

function renderSubmit(){
  appEl.innerHTML = UI.submit()
  const form = document.getElementById('submitForm')
  form.addEventListener('submit', async (e)=>{
    e.preventDefault()
    const fd = new FormData(form)
    const q = {
      id: 'q_' + Math.random().toString(36).slice(2,8),
      title: fd.get('title').toString().trim(),
      aLabel: fd.get('aLabel').toString().trim(),
      bLabel: fd.get('bLabel').toString().trim(),
      aImg: fd.get('aImg').toString().trim(),
      bImg: fd.get('bImg').toString().trim(),
      desc: fd.get('desc').toString().trim(),
      createdAt: Date.now(),
      submittedBy: StoreInst.getNick()
    }
    if (!q.title || !q.aLabel || !q.bLabel){ return UI.toast('제목/선택지를 채워주세요') }
    StoreInst.addQuestion(q)
    await NetInst.submitQuestion(q)
    UI.toast('질문 제출 완료! 커뮤니티에서 확인해보세요')
    location.hash = '/community'
  })
}

function renderCommunity(){
  const list = StoreInst.getCommunity()
  appEl.innerHTML = UI.community(list)
  list.forEach(q=>{
    const likeBtn = document.getElementById(`like_${q.id}`)
    likeBtn.onclick = ()=>{ StoreInst.like(q.id); renderCommunity() }
    const commentForm = document.getElementById(`cform_${q.id}`)
    commentForm.addEventListener('submit', (e)=>{
      e.preventDefault()
      const txt = commentForm.querySelector('input').value.trim()
      if(!txt) return
      StoreInst.comment(q.id, txt)
      renderCommunity()
    })
  })
}
