export class Store{
  constructor(){
    this.key = 'balancefun_v1'
    this.state = JSON.parse(localStorage.getItem(this.key) || '{}')
    this.state.questions ??= []
    this.state.votes ??= {}
    this.state.counts ??= {}
    this.state.community ??= []
    this.state.nick ??= this._makeNick()
    localStorage.setItem(this.key, JSON.stringify(this.state))
  }
  _save(){ localStorage.setItem(this.key, JSON.stringify(this.state)) }
  _makeNick(){
    const animals = ['고양이','토끼','너구리','사자','곰','수달','코끼리','다람쥐']
    return animals[Math.floor(Math.random()*animals.length)] + '#' + Math.floor(100+Math.random()*900)
  }
  getNick(){ return this.state.nick }
  seed(list){
    this.state.questions = list
    this.state.community = list.slice(1, 6).map(q=>({...q, likes: Math.floor(Math.random()*50)+10, comments:[{text:'이건 무조건 A', by:'게스트'},{text:'B가 국룰',by:'익명'}]}))
    this._save()
  }
  getQuestions(){ return this.state.questions }
  getTodaysQuestion(){
    const id = localStorage.getItem('todayId')
    const found = id && this.state.questions.find(q=>q.id===id)
    if(found) return found
    return this.state.questions[0]
  }
  shuffleToday(){
    if(this.state.questions.length > 1){
      const idx = Math.floor(Math.random()*this.state.questions.length)
      localStorage.setItem('todayId', this.state.questions[idx].id)
    }
  }
  saveVote(qid, which){
    this.state.votes[qid] = which
    this.state.counts[qid] ??= {A:0, B:0}
    this.state.counts[qid][which]++
    this._save()
  }
  getMyVote(qid){ return this.state.votes[qid] }
  getCounts(qid){
    const c = this.state.counts[qid] || {A:0,B:0}
    return {...c}
  }
  addQuestion(q){
    this.state.questions.unshift(q)
    this.state.community.unshift({...q, likes:0, comments:[]})
    localStorage.setItem('todayId', q.id)
    this._save()
  }
  getCommunity(){
    return [...this.state.community].sort((a,b)=>(b.likes||0)-(a.likes||0)).slice(0, 20)
  }
  like(qid){
    const it = this.state.community.find(q=>q.id===qid); if(!it) return
    it.likes = (it.likes||0)+1
    this._save()
  }
  comment(qid, text){
    const it = this.state.community.find(q=>q.id===qid); if(!it) return
    it.comments = it.comments || []
    it.comments.push({text, by:this.getNick()})
    this._save()
  }
}
