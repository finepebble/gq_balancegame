export const UI = {
  home(q){
    return `
    <section class="hero">
      <div class="card">
        <h1>오늘의 밸런스 질문</h1>
        <p class="muted">두 가지 주제 중 하나! 당신의 선택은?</p>
        <div class="options">
          <div class="option">
            <div class="title">A. ${escapeHtml(q.aLabel)}</div>
            ${q.aImg ? `<img src="${escapeAttr(q.aImg)}" alt="옵션 A 이미지">` : `<div class="sketch">🅰️</div>`}
          </div>
          <div class="option">
            <div class="title">B. ${escapeHtml(q.bLabel)}</div>
            ${q.bImg ? `<img src="${escapeAttr(q.bImg)}" alt="옵션 B 이미지">` : `<div class="sketch">🅱️</div>`}
          </div>
        </div>
        <div class="cta">
          <button id="goPlay">지금 선택하기</button>
          <button class="ghost" id="shuffle">다른 질문 보기</button>
        </div>
      </div>
      <div class="card">
        <h3>게임 방법</h3>
        <ul class="list">
          <li>질문 화면에서 <span class="kbd">A</span> 또는 <span class="kbd">B</span>를 클릭/탭하세요.</li>
          <li>결과 페이지에서 전체 비율을 확인하세요.</li>
          <li>마음에 드는 질문을 직접 제출하고, 커뮤니티에서 반응을 받으세요!</li>
        </ul>
        <div class="muted">팁: 링크를 공유하면 친구들도 바로 참여할 수 있어요.</div>
      </div>
    </section>
    `
  },
  play(q){
    return `
    <section class="grid">
      <div class="card">
        <div class="flex">
          <h2 style="margin:0">${escapeHtml(q.title)}</h2>
          <span class="badge right">#${q.id.slice(-4)}</span>
        </div>
        <div class="options" role="group" aria-label="선택지">
          <button id="optA" class="option" aria-pressed="false">
            <div class="title">A. ${escapeHtml(q.aLabel)}</div>
            ${q.aImg ? `<img src="${escapeAttr(q.aImg)}" alt="옵션 A 이미지">` : `<div class="sketch">🍎</div>`}
            <div class="meta">클릭하면 A 선택</div>
          </button>
          <button id="optB" class="option" aria-pressed="false">
            <div class="title">B. ${escapeHtml(q.bLabel)}</div>
            ${q.bImg ? `<img src="${escapeAttr(q.bImg)}" alt="옵션 B 이미지">` : `<div class="sketch">🍌</div>`}
            <div class="meta">클릭하면 B 선택</div>
          </button>
        </div>
        <div class="center muted">키보드로도 가능: <span class="kbd">←/A</span> 또는 <span class="kbd">→/B</span></div>
      </div>
    </section>
    <script>
      document.addEventListener('keydown', (e)=>{
        if (e.key==='ArrowLeft' || e.key.toLowerCase()==='a'){ document.getElementById('optA')?.click() }
        if (e.key==='ArrowRight' || e.key.toLowerCase()==='b'){ document.getElementById('optB')?.click() }
      }, {once:true})
    </script>
    `
  },
  results(q){
    return `
    <section class="grid">
      <div class="card">
        <h2 style="margin:0">결과 · ${escapeHtml(q.title)}</h2>
        <div style="height:8px"></div>
        <div class="flex"><strong>A. ${escapeHtml(q.aLabel)}</strong><span class="right" id="pA">0%</span></div>
        <div class="bar good"><span id="barA"></span></div>
        <div style="height:10px"></div>
        <div class="flex"><strong>B. ${escapeHtml(q.bLabel)}</strong><span class="right" id="pB">0%</span></div>
        <div class="bar bad"><span id="barB"></span></div>
        <div style="height:10px"></div>
        <div class="flex muted">애니메이션은 실제 합산 결과에 맞춰 반영됩니다.<button class="right" id="toPlay">다시 투표</button></div>
      </div>
      <div class="card">
        <h3>친구에게 공유</h3>
        <div class="flex">
          <input class="input" id="shareUrl" readonly value="${location.href.replace(/#.*$/,'#/play')}">
          <button onclick="navigator.clipboard.writeText(document.getElementById('shareUrl').value).then(()=>toast('링크 복사 완료'))">복사</button>
        </div>
      </div>
    </section>`
  },
  submit(){
    return `
    <section class="grid">
      <form id="submitForm" class="card">
        <h2>나만의 밸런스 질문 제출</h2>
        <label>제목</label><input class="input" name="title" placeholder="예: 평생 라면 vs 평생 피자">
        <div class="grid grid-2">
          <div>
            <label>선택지 A</label><input class="input" name="aLabel" placeholder="라면">
            <label>이미지 URL(선택)</label><input class="input" name="aImg" placeholder="https://...">
          </div>
          <div>
            <label>선택지 B</label><input class="input" name="bLabel" placeholder="피자">
            <label>이미지 URL(선택)</label><input class="input" name="bImg" placeholder="https://...">
          </div>
        </div>
        <label>설명(선택)</label><textarea class="input" name="desc" rows="3" placeholder="설명을 적어주세요"></textarea>
        <div class="flex">
          <button type="submit">제출</button>
          <span class="muted">이미지 URL은 외부 호스팅을 사용하세요.</span>
        </div>
      </form>
    </section>
    `
  },
  community(list){
    return `
    <section class="grid">
      <div class="card">
        <h2>커뮤니티 인기 질문</h2>
        <div class="list">
        ${list.map(q=>`
          <article class="feed-item">
            <div class="avatar">${escapeHtml(q.aLabel[0]||'A')}${escapeHtml(q.bLabel[0]||'B')}</div>
            <div>
              <div class="flex">
                <strong>${escapeHtml(q.title)}</strong>
                <span class="badge right">♥ ${q.likes||0}</span>
              </div>
              <div class="muted">A: ${escapeHtml(q.aLabel)} · B: ${escapeHtml(q.bLabel)}</div>
              ${q.desc ? `<div class="muted">${escapeHtml(q.desc)}</div>`: ''}
              <div class="flex" style="margin-top:8px">
                <button id="like_${q.id}" class="ghost">추천</button>
                <a class="ghost" href="#/play" onclick="localStorage.setItem('todayId','${q.id}')">이걸로 플레이</a>
              </div>
              <div style="height:8px"></div>
              <form id="cform_${q.id}" class="flex">
                <input class="input" placeholder="댓글 달기">
                <button>등록</button>
              </form>
              <div class="list">
                ${(q.comments||[]).slice(-3).map(c=>`<div class="muted">· ${escapeHtml(c.text)} — <span class="badge">${escapeHtml(c.by)}</span></div>`).join('')}
              </div>
            </div>
          </article>
        `).join('')}
        </div>
      </div>
    </section>`
  },
  toast(msg){ toast(msg) }
}

function escapeHtml(s=''){ return s.replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m])) }
function escapeAttr(s=''){ return s.replace(/"/g,'&quot;') }

window.toast = (msg)=>{
  const t = document.getElementById('toast')
  t.textContent = msg; t.classList.add('show')
  setTimeout(()=>t.classList.remove('show'), 1600)
}
