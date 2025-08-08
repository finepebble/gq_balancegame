export class Net{
  static async create(){
    const inst = new Net()
    try{
      const cfg = await import('./firebase-config.js')
      await inst._initFirebase(cfg.firebaseConfig)
      console.log('[Net] Firebase enabled')
    }catch(e){
      console.log('[Net] Offline mode (no firebase-config.js).')
      inst.online = false
    }
    return inst
  }
  constructor(){ this.online = false }
  async _initFirebase(config){
    const scripts = [
      'https://www.gstatic.com/firebasejs/10.12.3/firebase-app-compat.js',
      'https://www.gstatic.com/firebasejs/10.12.3/firebase-auth-compat.js',
      'https://www.gstatic.com/firebasejs/10.12.3/firebase-database-compat.js',
    ]
    for (const src of scripts){
      await new Promise((res,rej)=>{
        const s=document.createElement('script'); s.src=src; s.onload=res; s.onerror=rej; document.head.appendChild(s)
      })
    }
    // @ts-ignore
    const app = firebase.initializeApp(config)
    // @ts-ignore
    await firebase.auth().signInAnonymously()
    // @ts-ignore
    this.db = firebase.database()
    this.online = true
  }
  async publishVote(qid, which){
    if(!this.online) return
    const ref = this.db.ref('balance/votes/'+qid+'/'+which)
    await ref.transaction(cur => (cur||0)+1)
  }
  async getAggregate(qid){
    if(!this.online) return null
    const snap = await this.db.ref('balance/votes/'+qid).get()
    return snap.exists() ? snap.val() : null
  }
  async submitQuestion(q){
    if(!this.online) return
    const ref = this.db.ref('balance/submissions/'+q.id)
    await ref.set(q)
  }
}
