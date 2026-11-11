/**
 * CERMAT ARCADE - Main Application Controller
 * Handles Auth, Quiz Engine, Gamification (XP, Levels, Streak),
 * Avatar Shop, Noticeboard & Homework, and Teacher Admin Matrix.
 */

class CermatArcadeApp {
  constructor() {
    this.currentUser = null;
    this.currentScreen = 'auth';
    this.authTab = 'login';
    this.selectedRegisterRole = 'student';
    this.selectedRegisterClass = '9.A';

    // Teacher Security PIN
    this.TEACHER_PIN = '5231';
    this.teacherUnlocked = false;
    this.currentPinInput = '';
    this.onPinSuccessCallback = null;

    // Active Quiz Session state
    this.quizState = {
      subject: 'czech',
      setId: 1,
      currentQuestionIndex: 0,
      questions: [],
      lives: 3,
      streak: 0,
      answered: false,
      correctCount: 0,
      xpEarnedThisSession: 0,
      isShortPractice: false
    };

    // Active Shop subtab: 'avatars' | 'items'
    this.shopTab = 'avatars';

    // Teacher Controlled Settings (competitionEnabled, short practice config)
    this.competitionEnabled = true;
    this.shortPracticeConfig = {
      count: 10,
      subject: 'random',
      set: 'any'
    };

    // Initialize Database
    this.initDatabase();
  }

  // =========================================================================
  // INITIALIZATION & LOCALSTORAGE MANAGEMENT
  // =========================================================================
  initDatabase() {
    if (!localStorage.getItem('cermat_users')) {
      localStorage.setItem('cermat_users', JSON.stringify(window.CERMAT_DATA.users));
    }
    if (!localStorage.getItem('cermat_questions')) {
      localStorage.setItem('cermat_questions', JSON.stringify(window.CERMAT_DATA.questions));
    }
    if (!localStorage.getItem('cermat_announcements')) {
      localStorage.setItem('cermat_announcements', JSON.stringify(window.CERMAT_DATA.announcements));
    }
    if (!localStorage.getItem('cermat_homework')) {
      localStorage.setItem('cermat_homework', JSON.stringify(window.CERMAT_DATA.homework));
    }

    // Load teacher battle competition toggle setting
    const savedBattle = localStorage.getItem('cermat_competition_enabled');
    if (savedBattle !== null) {
      this.competitionEnabled = (savedBattle === 'true');
    }

    // Load teacher short practice config
    const savedShortCfg = localStorage.getItem('cermat_short_practice_cfg');
    if (savedShortCfg) {
      try {
        this.shortPracticeConfig = JSON.parse(savedShortCfg);
      } catch (e) {
        console.error('Failed to parse short practice config', e);
      }
    }

    // Ensure all stored users have a password (fallback to heslo123 for legacy users)
    const users = this.getUsers();
    let usersUpdated = false;
    users.forEach(u => {
      if (!u.password) {
        u.password = 'heslo123';
        usersUpdated = true;
      }
    });
    if (usersUpdated) {
      this.saveUsers(users);
    }

    // Check stored user session
    const storedUser = localStorage.getItem('cermat_active_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const freshUser = this.getUserById(parsed.id);
        if (freshUser) {
          this.currentUser = freshUser;
        }
      } catch (e) {
        console.error('Failed to parse user session', e);
      }
    }
  }

  getUsers() {
    return JSON.parse(localStorage.getItem('cermat_users') || '[]');
  }

  saveUsers(users) {
    localStorage.setItem('cermat_users', JSON.stringify(users));
  }

  getUserById(id) {
    return this.getUsers().find(u => u.id === id);
  }

  updateCurrentUser(updaterFn) {
    if (!this.currentUser) return;

    // In anonymous mode, achievements and progress are NEVER saved to localStorage!
    if (this.currentUser.isAnonymous) {
      updaterFn(this.currentUser);
      this.updateHud();
      return;
    }

    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === this.currentUser.id);
    if (idx !== -1) {
      updaterFn(users[idx]);
      this.currentUser = users[idx];
      this.saveUsers(users);
      localStorage.setItem('cermat_active_user', JSON.stringify(this.currentUser));
      this.updateHud();
    }
  }

  getQuestions() {
    return JSON.parse(localStorage.getItem('cermat_questions') || '[]');
  }

  saveQuestions(qList) {
    localStorage.setItem('cermat_questions', JSON.stringify(qList));
  }

  getAnnouncements() {
    return JSON.parse(localStorage.getItem('cermat_announcements') || '[]');
  }

  saveAnnouncements(list) {
    localStorage.setItem('cermat_announcements', JSON.stringify(list));
  }

  getHomework() {
    return JSON.parse(localStorage.getItem('cermat_homework') || '[]');
  }

  saveHomework(list) {
    localStorage.setItem('cermat_homework', JSON.stringify(list));
  }

  // =========================================================================
  // BOOTSTRAP APP
  // =========================================================================
  start() {
    this.initAudioAndCrt();

    if (this.currentUser) {
      if (this.currentUser.role === 'teacher') {
        // Teacher requires PIN authorization to enter dashboard
        this.navigateTo('auth');
      } else {
        this.navigateTo('lobby');
      }
    } else {
      this.navigateTo('auth');
    }
  }

  initAudioAndCrt() {
    const btnAudio = document.getElementById('btnToggleAudio');
    const isMuted = window.retroAudio.isMuted();
    btnAudio.innerHTML = isMuted ? '🔇' : '🔊';
    btnAudio.classList.toggle('active', !isMuted);

    btnAudio.addEventListener('click', () => {
      const muted = window.retroAudio.toggleMute();
      btnAudio.innerHTML = muted ? '🔇' : '🔊';
      btnAudio.classList.toggle('active', !muted);
      if (!muted) window.retroAudio.playClick();
    });

    const btnCrt = document.getElementById('btnToggleCrt');
    const crtOff = localStorage.getItem('cermat_crt_off') === 'true';
    if (crtOff) {
      document.body.classList.add('crt-off');
      btnCrt.classList.remove('active');
    }
    btnCrt.addEventListener('click', () => {
      document.body.classList.toggle('crt-off');
      const isOff = document.body.classList.contains('crt-off');
      localStorage.setItem('cermat_crt_off', isOff);
      btnCrt.classList.toggle('active', !isOff);
      window.retroAudio.playClick();
    });

    // Listen for physical keyboard when PIN modal is active
    window.addEventListener('keydown', (e) => {
      const pinModal = document.getElementById('modalTeacherPin');
      if (pinModal && pinModal.classList.contains('active')) {
        if (e.key >= '0' && e.key <= '9') {
          this.pressPinKey(e.key);
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
          this.clearPin();
        } else if (e.key === 'Enter') {
          this.submitPin();
        } else if (e.key === 'Escape') {
          this.closeTeacherPinModal();
        }
      }
    });
  }

  // =========================================================================
  // AUTHENTICATION SYSTEM
  // =========================================================================
  setAuthTab(tab) {
    this.authTab = tab;
    window.retroAudio.playClick();

    document.querySelectorAll('.auth-tab').forEach((el, idx) => {
      el.classList.toggle('active', (tab === 'login' && idx === 0) || (tab === 'register' && idx === 1));
    });

    document.getElementById('formLogin').style.display = tab === 'login' ? 'block' : 'none';
    document.getElementById('formRegister').style.display = tab === 'register' ? 'block' : 'none';

    const hint = document.getElementById('loginSelectedHint');
    if (hint && tab === 'register') {
      hint.style.display = 'none';
    }
  }

  selectRegisterRole(role) {
    this.selectedRegisterRole = role;
    window.retroAudio.playClick();

    document.getElementById('roleStudentCard').classList.toggle('selected', role === 'student');
    document.getElementById('roleTeacherCard').classList.toggle('selected', role === 'teacher');
    document.getElementById('regClassContainer').style.display = role === 'student' ? 'block' : 'none';
    document.getElementById('regTeacherPinContainer').style.display = role === 'teacher' ? 'block' : 'none';
  }

  selectRegisterClass(className) {
    this.selectedRegisterClass = className;
    window.retroAudio.playClick();

    document.getElementById('btnClass9A').classList.toggle('selected', className === '9.A');
    document.getElementById('btnClass9B').classList.toggle('selected', className === '9.B');
  }

  handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;
    const users = this.getUsers();
    const user = users.find(u => u.username.toLowerCase() === username);

    if (!user) {
      window.retroAudio.playWrong();
      alert(`Uživatel se jménem "${username}" nebyl nalezen. Zkontrolujte prosím jméno nebo se zaregistrujte.`);
      return;
    }

    // STRICT PASSWORD VERIFICATION:
    // Only access profiles with the password set by the user during registration!
    const expectedPassword = user.password || 'heslo123';
    if (expectedPassword !== password) {
      window.retroAudio.playWrong();
      alert('❌ Chybné heslo! Do cizích profilů se lze přihlásit pouze se správným heslem nastaveným při registraci.');
      return;
    }

    // Require teacher PIN if accessing a teacher account
    if (user.role === 'teacher' && !this.teacherUnlocked) {
      this.promptTeacherPin(() => {
        this.teacherUnlocked = true;
        this.loginUser(user);
      });
      return;
    }

    this.loginUser(user);
  }

  handleRegister(e) {
    e.preventDefault();
    const fullName = document.getElementById('regFullName').value.trim();
    const username = document.getElementById('regUsername').value.trim().toLowerCase();
    const password = document.getElementById('regPassword').value;
    const passwordConfirm = document.getElementById('regPasswordConfirm').value;
    const role = this.selectedRegisterRole;
    const studentClass = role === 'student' ? this.selectedRegisterClass : null;

    if (!fullName || !username) {
      alert('Vyplňte prosím všechna povinná pole.');
      return;
    }

    // Password validation
    if (!password || password.length < 3) {
      window.retroAudio.playWrong();
      alert('❌ Heslo musí mít alespoň 3 znaky.');
      return;
    }

    if (password !== passwordConfirm) {
      window.retroAudio.playWrong();
      alert('❌ Zadaná hesla se neshodují! Zkontrolujte prosím obě pole.');
      return;
    }

    // PIN check for teacher registration
    if (role === 'teacher') {
      const pinVal = (document.getElementById('regTeacherPin').value || '').trim();
      if (pinVal !== this.TEACHER_PIN) {
        window.retroAudio.playWrong();
        alert('❌ Neplatný bezpečnostní PIN učitele! Přístup odepřen.');
        return;
      }
    }

    const users = this.getUsers();
    if (users.find(u => u.username.toLowerCase() === username)) {
      window.retroAudio.playWrong();
      alert('Toto uživatelské jméno je již obsazené. Zvolte prosím jiné.');
      return;
    }

    const newUser = {
      id: 'user_' + Date.now(),
      username: username,
      password: password, // Saved during registration!
      fullName: fullName,
      role: role,
      studentClass: studentClass,
      avatarId: 'avatar_pixel_cadet',
      xp: role === 'student' ? 100 : 9999, // Starting gift XP
      inventory: ['avatar_pixel_cadet'],
      completedQuestions: {},
      streak: 0
    };

    users.push(newUser);
    this.saveUsers(users);

    if (role === 'teacher') {
      this.teacherUnlocked = true;
    }

    window.retroAudio.playLevelUp();
    this.loginUser(newUser);
  }

  // Pre-fill profile username for demo testing without bypassing password authentication
  selectProfileToLogin(username) {
    window.retroAudio.playClick();
    this.setAuthTab('login');
    const user = this.getUsers().find(u => u.username === username);
    if (user) {
      document.getElementById('loginUsername').value = username;
      const pwdInput = document.getElementById('loginPassword');
      pwdInput.value = '';
      pwdInput.focus();

      const hint = document.getElementById('loginSelectedHint');
      if (hint) {
        hint.style.display = 'block';
        hint.innerHTML = `🔑 Vybrán účet <strong>${user.fullName}</strong> (@${username}). Zadejte jeho heslo (pro demo účty výchozí: <strong>heslo123</strong>).`;
      }
    }
  }

  loginUser(user) {
    this.currentUser = user;
    if (!user.isAnonymous) {
      localStorage.setItem('cermat_active_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cermat_active_user');
    }
    window.retroAudio.playCorrect();

    this.updateHud();

    if (user.role === 'teacher') {
      this.navigateTo('teacher');
    } else {
      this.navigateTo('lobby');
    }
  }

  logout() {
    window.retroAudio.playClick();
    this.currentUser = null;
    this.teacherUnlocked = false;
    localStorage.removeItem('cermat_active_user');
    this.navigateTo('auth');
  }

  // =========================================================================
  // NAVIGATION & SCREEN CONTROLLER
  // =========================================================================
  navigateTo(screenId) {
    // Check PIN protection when navigating to teacher screen
    if (screenId === 'teacher' && !this.teacherUnlocked) {
      this.promptTeacherPin(() => {
        this.teacherUnlocked = true;
        this.navigateTo('teacher');
      });
      return;
    }

    window.retroAudio.playClick();
    this.currentScreen = screenId;

    // Toggle HUD & Navigation visibility based on Auth status
    const isLoggedIn = !!this.currentUser;
    document.getElementById('hudPlayerStats').style.display = isLoggedIn ? 'flex' : 'none';
    document.getElementById('mainNav').style.display = isLoggedIn ? 'flex' : 'none';
    document.getElementById('btnLogout').style.display = isLoggedIn ? 'inline-flex' : 'none';

    // Show/hide teacher nav tab
    const teacherTab = document.getElementById('teacherNavTab');
    if (teacherTab) {
      teacherTab.style.display = (this.currentUser && this.currentUser.role === 'teacher') ? 'flex' : 'none';
    }

    // Hide all screens
    document.querySelectorAll('.screen-view').forEach(screen => {
      screen.classList.remove('active');
    });

    // Update active nav button
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-target') === screenId);
    });

    // NavTab Souboj tříd zůstává vždy viditelný, pouze aktualizujeme popisek nebo styl dle stavu online/offline
    const navTabBattle = document.getElementById('navTabBattle');
    if (navTabBattle) {
      navTabBattle.style.display = 'inline-block';
      if (this.competitionEnabled) {
        navTabBattle.innerHTML = '⚔️ Souboj tříd';
        navTabBattle.title = 'Souboj tříd je aktivní';
        navTabBattle.style.opacity = '1';
      } else {
        navTabBattle.innerHTML = '🛡️ Souboj (OFFLINE)';
        navTabBattle.title = 'Režim soupeření je offline';
        navTabBattle.style.opacity = '0.75';
      }
    }
    const btnLobbyBattle = document.getElementById('btnLobbyBattle');
    if (btnLobbyBattle) {
      btnLobbyBattle.style.display = 'inline-block';
      if (this.competitionEnabled) {
        btnLobbyBattle.innerHTML = '⚔️ Souboj tříd';
        btnLobbyBattle.className = 'arcade-btn arcade-btn-pink';
      } else {
        btnLobbyBattle.innerHTML = '🛡️ Souboj (OFFLINE)';
        btnLobbyBattle.className = 'arcade-btn arcade-btn-ghost';
      }
    }

    // Show requested screen
    let targetElId = 'screenAuth';
    if (screenId === 'lobby') targetElId = 'screenLobby';
    else if (screenId === 'sets') targetElId = 'screenSets';
    else if (screenId === 'quiz') targetElId = 'screenQuiz';
    else if (screenId === 'shop') targetElId = 'screenShop';
    else if (screenId === 'board') targetElId = 'screenBoard';
    else if (screenId === 'teacher') targetElId = 'screenTeacher';
    else if (screenId === 'leaderboard') targetElId = 'screenLeaderboard';
    else if (screenId === 'battle') targetElId = 'screenBattle';

    const targetEl = document.getElementById(targetElId);
    if (targetEl) {
      targetEl.classList.add('active');
      window.scrollTo(0, 0);
    }

    // Trigger screen-specific rendering
    if (screenId === 'lobby') this.renderLobby();
    if (screenId === 'shop') this.renderShop();
    if (screenId === 'board') this.renderNoticeboard();
    if (screenId === 'teacher') this.renderTeacherDashboard();
    if (screenId === 'leaderboard') this.renderLeaderboard();
    if (screenId === 'battle') this.renderBattleScreen();

    this.updateHud();
  }

  // =========================================================================
  // GAMIFICATION & HUD (XP, LEVELS, STREAK)
  // =========================================================================
  getLevelInfo(xp) {
    const levels = [
      { lvl: 1, title: 'Začátečník', min: 0, max: 150 },
      { lvl: 2, title: 'Pixelový Poutník', min: 150, max: 350 },
      { lvl: 3, title: 'Větný Alchymista', min: 350, max: 700 },
      { lvl: 4, title: 'Pán Rovnic', min: 700, max: 1200 },
      { lvl: 5, title: 'Geometrický Rytíř', min: 1200, max: 1800 },
      { lvl: 6, title: 'Cermat Architekt', min: 1800, max: 2500 },
      { lvl: 7, title: 'Kybernetický Šampión', min: 2500, max: 3500 },
      { lvl: 8, title: 'Cermat Legenda', min: 3500, max: 99999 }
    ];

    for (let i = levels.length - 1; i >= 0; i--) {
      if (xp >= levels[i].min) {
        return levels[i];
      }
    }
    return levels[0];
  }

  updateHud() {
    if (!this.currentUser) return;

    const user = this.currentUser;
    document.getElementById('hudUserName').innerText = user.fullName;

    // Show/hide anonymous mode badge
    const anonBadge = document.getElementById('hudAnonymousBadge');
    if (anonBadge) {
      anonBadge.style.display = user.isAnonymous ? 'inline-flex' : 'none';
    }

    const roleClassText = user.isAnonymous
      ? 'Host (Anonymní režim - bez ukládání)'
      : (user.role === 'teacher' ? 'Učitel (Admin)' : `Žák (${user.studentClass || '9.A'})`);
    document.getElementById('hudUserRoleClass').innerText = roleClassText;

    // Render Avatar in HUD
    const avatar = window.CERMAT_DATA.avatars.find(a => a.id === user.avatarId) || window.CERMAT_DATA.avatars[0];
    document.getElementById('hudAvatarContainer').innerHTML = avatar.svg;

    // XP & Level
    const lvlInfo = this.getLevelInfo(user.xp);
    document.getElementById('hudLevelTitle').innerText = `LVL ${lvlInfo.lvl}: ${lvlInfo.title}`;

    const range = lvlInfo.max - lvlInfo.min;
    const progress = Math.min(100, Math.max(0, ((user.xp - lvlInfo.min) / range) * 100));
    document.getElementById('hudXpFill').style.width = `${progress}%`;
    document.getElementById('hudXpNumbers').innerText = `${user.xp} / ${lvlInfo.max} XP`;

    // Streak
    document.getElementById('hudStreakCount').innerText = `${user.streak || 0}x`;
  }

  addXp(amount) {
    if (!this.currentUser) return;

    // In anonymous mode, XP only exists in memory during the current session
    if (this.currentUser.isAnonymous) {
      this.currentUser.xp = (this.currentUser.xp || 0) + amount;
      this.updateHud();
      return;
    }

    const oldLvl = this.getLevelInfo(this.currentUser.xp).lvl;
    const newXp = this.currentUser.xp + amount;

    this.updateCurrentUser(u => {
      u.xp = newXp;
    });

    const newLvlInfo = this.getLevelInfo(newXp);
    if (newLvlInfo.lvl > oldLvl) {
      this.triggerLevelUp(newLvlInfo);
    }
  }

  triggerLevelUp(levelInfo) {
    window.retroAudio.playLevelUp();
    document.getElementById('modalLevelUpTitle').innerText = `LEVEL ${levelInfo.lvl}: ${levelInfo.title}`;
    document.getElementById('modalLevelUp').classList.add('active');
  }

  closeLevelUpModal() {
    window.retroAudio.playClick();
    document.getElementById('modalLevelUp').classList.remove('active');
  }

  showFloatingXp(amount, multiplier = 1) {
    const container = document.getElementById('xpPopupContainer');
    const el = document.createElement('div');
    el.className = 'floating-xp-popup';
    el.innerText = multiplier > 1 ? `+${amount} XP! (${multiplier}x COMBO!)` : `+${amount} XP!`;
    container.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  }

  // =========================================================================
  // SCREEN 2: STUDENT LOBBY
  // =========================================================================
  renderLobby() {
    if (!this.currentUser) return;
    document.getElementById('lobbyUserName').innerText = this.currentUser.fullName.toUpperCase();

    // Toggle anonymous notice banner
    const anonNotice = document.getElementById('lobbyAnonymousNotice');
    if (anonNotice) {
      anonNotice.style.display = this.currentUser.isAnonymous ? 'flex' : 'none';
    }

    // Render latest announcement
    const announcements = this.getAnnouncements();
    const filtered = announcements.filter(a => 
      a.targetClass === 'all' || 
      (this.currentUser.studentClass && a.targetClass === this.currentUser.studentClass) ||
      this.currentUser.role === 'teacher'
    );

    const recentContainer = document.getElementById('lobbyRecentAnnouncement');
    if (filtered.length > 0) {
      const top = filtered[0];
      recentContainer.innerHTML = `
        <div style="background: #090818; border-left: 3px solid ${top.tagColor || 'var(--neon-pink)'}; padding: 12px 16px; border-radius: 6px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <strong style="color: #fff; font-size: 14px;">${top.title}</strong>
            <span class="pixel-badge" style="background: rgba(255, 0, 127, 0.2); color: ${top.tagColor || '#ff007f'};">${top.tag}</span>
          </div>
          <p style="color: #94a3b8; font-size: 13px; margin: 0;">${top.content}</p>
        </div>
      `;
    } else {
      recentContainer.innerHTML = `<div style="color: #64748b; font-size: 13px;">Žádná nová oznámení.</div>`;
    }
  }

  // =========================================================================
  // SCREEN 3: TEST SETS SELECTION SCREEN
  // =========================================================================
  openSubjectSets(subjectKey) {
    this.quizState.subject = subjectKey;
    const subject = window.CERMAT_DATA.subjects[subjectKey];
    document.getElementById('setsSubjectTitle').innerText = subject.name.toUpperCase();
    document.getElementById('setsSubjectTitle').style.color = subject.themeColor;

    this.renderSetsList(subjectKey);
    this.navigateTo('sets');
  }

  renderSetsList(subjectKey) {
    const subject = window.CERMAT_DATA.subjects[subjectKey];
    const container = document.getElementById('setsListContainer');
    container.innerHTML = '';

    const allQuestions = this.getQuestions().filter(q => q.subject === subjectKey);

    subject.sets.forEach(set => {
      const setQuestions = allQuestions.filter(q => q.setId === set.id);
      const totalQ = set.totalQuestions || 50;

      // Count completed
      let completedCount = 0;
      if (this.currentUser && this.currentUser.completedQuestions) {
        for (let i = 1; i <= totalQ; i++) {
          const key = `${subjectKey}_${set.id}_${i}`;
          if (this.currentUser.completedQuestions[key]) {
            completedCount++;
          }
        }
      }

      const progressPct = Math.round((completedCount / totalQ) * 100);

      const card = document.createElement('div');
      card.className = `arcade-card set-item-card ${completedCount > 0 ? 'active-cyan' : ''}`;
      card.innerHTML = `
        <div class="set-item-info">
          <div class="set-level-badge" style="border-color: ${subject.themeColor}; color: ${subject.themeColor};">
            <small>LEVEL</small>
            <span>0${set.id}</span>
          </div>
          <div class="set-details">
            <h4>${set.title}</h4>
            <p>${set.description}</p>
            <div class="set-progress-row">
              <div class="set-progress-track">
                <div class="set-progress-bar" style="width: ${progressPct}%; background: ${subject.themeColor};"></div>
              </div>
              <div class="set-stats-text">${completedCount} / ${totalQ} ÚLOH SPLNĚNO (${progressPct}%)</div>
            </div>
          </div>
        </div>
        <div>
          <button class="arcade-btn ${subjectKey === 'czech' ? 'arcade-btn-pink' : 'arcade-btn-cyan'}" onclick="app.startQuiz('${subjectKey}', ${set.id})">
            ⚔️ SPUSTIT MISI
          </button>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // =========================================================================
  // SCREEN 4: INTERACTIVE QUIZ ENGINE
  // =========================================================================
  startQuiz(subjectKey, setId, startQuestionIndex = 0) {
    const allQuestions = this.getQuestions();
    const setQuestions = allQuestions.filter(q => q.subject === subjectKey && q.setId === setId);

    if (setQuestions.length === 0) {
      alert('V této sadě zatím nejsou žádné otázky.');
      return;
    }

    // Check if user has bought the gold shield powerup (extra life)
    const hasShield = (this.currentUser && (this.currentUser.inventory || []).includes('power_shield'));
    const initialLives = hasShield ? 4 : 3;

    this.quizState = {
      subject: subjectKey,
      setId: setId,
      currentQuestionIndex: startQuestionIndex,
      questions: setQuestions,
      lives: initialLives,
      maxLives: initialLives,
      streak: this.currentUser ? (this.currentUser.streak || 0) : 0,
      answered: false,
      correctCount: 0,
      xpEarnedThisSession: 0,
      isShortPractice: false
    };

    // Populate Jump selector with 1 to N
    const jumpSelect = document.getElementById('selectJumpQuestion');
    jumpSelect.innerHTML = '';
    setQuestions.forEach((_, idx) => {
      const opt = document.createElement('option');
      opt.value = idx;
      opt.innerText = `Úloha ${idx + 1}`;
      jumpSelect.appendChild(opt);
    });

    this.renderCurrentQuestion();
    this.navigateTo('quiz');
  }

  // =========================================================================
  // SHORT PRACTICE MODE (ZKRÁCENÉ PROCVIČOVÁNÍ)
  // =========================================================================
  openShortPracticeModal() {
    window.retroAudio.playClick();
    const cfg = this.shortPracticeConfig;
    const subjLabel = cfg.subject === 'random' ? '🎲 Náhodný mix ČJ + MAT' : (cfg.subject === 'czech' ? '📚 Český jazyk' : '📐 Matematika');
    const setLabel = cfg.set === 'any' ? 'Všechny úrovně (náhodný mix 1-5)' : `Level ${cfg.set}`;

    const summaryEl = document.getElementById('modalShortPracticeSummary');
    if (summaryEl) {
      summaryEl.innerHTML = `
        <div>🎯 <strong>Délka sprintu:</strong> <span style="color: var(--neon-yellow);">${cfg.count} úloh</span></div>
        <div>📖 <strong>Předmět:</strong> <span style="color: var(--neon-cyan);">${subjLabel}</span></div>
        <div>⚔️ <strong>Obtížnost:</strong> <span style="color: #fff;">${setLabel}</span></div>
        <div style="margin-top: 6px; font-size: 11px; color: var(--text-dim);">
          * Učitel může tuto konfiguraci kdykoli upravit v Učitelském velínu (záložka Pravidla).
        </div>
      `;
    }
    document.getElementById('modalShortPractice').classList.add('active');
  }

  closeShortPracticeModal() {
    window.retroAudio.playClick();
    document.getElementById('modalShortPractice').classList.remove('active');
  }

  startShortPracticeSession() {
    this.closeShortPracticeModal();
    window.retroAudio.playClick();

    const cfg = this.shortPracticeConfig;
    const allQuestions = this.getQuestions();

    let pool = allQuestions.filter(q => {
      const matchSubj = (cfg.subject === 'random' || q.subject === cfg.subject);
      const matchSet = (cfg.set === 'any' || q.setId === parseInt(cfg.set, 10));
      return matchSubj && matchSet;
    });

    if (pool.length === 0) {
      pool = allQuestions;
    }

    // Shuffle pool
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const targetQuestions = shuffled.slice(0, Math.min(cfg.count, shuffled.length));

    const hasShield = (this.currentUser && (this.currentUser.inventory || []).includes('power_shield'));
    const initialLives = hasShield ? 4 : 3;

    this.quizState = {
      subject: cfg.subject === 'random' ? 'czech' : cfg.subject,
      setId: 1,
      currentQuestionIndex: 0,
      questions: targetQuestions,
      lives: initialLives,
      maxLives: initialLives,
      streak: this.currentUser ? (this.currentUser.streak || 0) : 0,
      answered: false,
      correctCount: 0,
      xpEarnedThisSession: 0,
      isShortPractice: true
    };

    // Jump selector
    const jumpSelect = document.getElementById('selectJumpQuestion');
    jumpSelect.innerHTML = '';
    targetQuestions.forEach((_, idx) => {
      const opt = document.createElement('option');
      opt.value = idx;
      opt.innerText = `Sprint #${idx + 1}`;
      jumpSelect.appendChild(opt);
    });

    this.renderCurrentQuestion();
    this.navigateTo('quiz');
  }

  renderCurrentQuestion() {
    const qState = this.quizState;
    const currentQ = qState.questions[qState.currentQuestionIndex];
    if (!currentQ) return;

    qState.answered = false;

    // Update HUD
    document.getElementById('quizQuestionCounter').innerText = `ÚLOHA ${qState.currentQuestionIndex + 1} / ${qState.questions.length}`;
    document.getElementById('selectJumpQuestion').value = qState.currentQuestionIndex;

    // Lives display
    const maxLives = qState.maxLives || 3;
    let hearts = '';
    for (let i = 0; i < maxLives; i++) {
      hearts += i < qState.lives ? '❤️' : '🖤';
    }
    document.getElementById('quizLives').innerHTML = hearts;

    // Combo streak badge
    const comboMultiplier = Math.min(3, 1 + Math.floor(qState.streak / 3) * 0.5);
    const comboEl = document.getElementById('quizComboBadge');
    comboEl.innerText = `COMBO x${comboMultiplier}`;
    comboEl.style.display = qState.streak > 1 ? 'inline-block' : 'none';

    // Question content
    const subjectInfo = window.CERMAT_DATA.subjects[qState.subject];
    document.getElementById('quizBadgeCategory').innerText = `${subjectInfo.shortName} • Sada ${qState.setId}`;
    document.getElementById('quizRewardXp').innerText = `+${currentQ.xp || 25} XP`;
    document.getElementById('quizQuestionText').innerText = currentQ.question;

    // Options rendering
    const optionsContainer = document.getElementById('quizOptionsContainer');
    optionsContainer.innerHTML = '';

    currentQ.options.forEach((optText, optIdx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.innerHTML = `
        <span>${optText}</span>
        <span class="option-marker font-arcade" style="font-size: 10px; color: var(--text-dim);">[VYBRAT]</span>
      `;
      btn.onclick = () => this.handleAnswerSelect(optIdx);
      optionsContainer.appendChild(btn);
    });

    // Reset feedback & Next button
    document.getElementById('quizFeedbackBox').style.display = 'none';
    document.getElementById('btnQuizNext').style.display = 'none';
  }

  handleAnswerSelect(selectedIndex) {
    if (this.quizState.answered) return;
    this.quizState.answered = true;

    const qState = this.quizState;
    const currentQ = qState.questions[qState.currentQuestionIndex];
    const isCorrect = (selectedIndex === currentQ.correct);

    const optionBtns = document.querySelectorAll('.quiz-option-btn');
    optionBtns.forEach(btn => btn.disabled = true);

    const feedbackBox = document.getElementById('quizFeedbackBox');
    const feedbackHeader = document.getElementById('quizFeedbackHeader');
    const feedbackText = document.getElementById('quizFeedbackText');

    if (isCorrect) {
      window.retroAudio.playCorrect();
      optionBtns[selectedIndex].classList.add('correct');

      qState.streak++;
      qState.correctCount++;

      // XP calculation with combo multiplier
      const comboMultiplier = Math.min(3, 1 + Math.floor(qState.streak / 3) * 0.5);
      const earnedXp = Math.round((currentQ.xp || 25) * comboMultiplier);
      qState.xpEarnedThisSession += earnedXp;

      this.addXp(earnedXp);
      this.showFloatingXp(earnedXp, comboMultiplier);

      // Save question as completed in user profile
      const qKey = `${currentQ.subject}_${currentQ.setId}_${currentQ.qNumber}`;
      this.updateCurrentUser(u => {
        if (!u.completedQuestions) u.completedQuestions = {};
        u.completedQuestions[qKey] = true;
        u.streak = qState.streak;
      });

      feedbackBox.className = 'quiz-feedback-box';
      feedbackHeader.innerHTML = '✨ SPRÁVNĚ! VÝBORNÁ PRÁCE!';
      feedbackHeader.style.color = 'var(--neon-green)';
      feedbackText.innerText = currentQ.explanation || 'Správná odpověď byla úspěšně zaznamenána.';
    } else {
      window.retroAudio.playWrong();
      optionBtns[selectedIndex].classList.add('incorrect');
      optionBtns[currentQ.correct].classList.add('correct');

      qState.streak = 0;
      qState.lives--;

      this.updateCurrentUser(u => {
        u.streak = 0;
      });

      // Update hearts
      const maxLives = qState.maxLives || 3;
      let hearts = '';
      for (let i = 0; i < maxLives; i++) {
        hearts += i < qState.lives ? '❤️' : '🖤';
      }
      document.getElementById('quizLives').innerHTML = hearts;

      feedbackBox.className = 'quiz-feedback-box error';
      feedbackHeader.innerHTML = '❌ CHYBA! SPRÁVNĚ BYLO JINÉ ŘEŠENÍ:';
      feedbackHeader.style.color = 'var(--neon-red)';
      feedbackText.innerText = currentQ.explanation || 'Pozorně si přečtěte vysvětlení řešení.';

      if (qState.lives <= 0) {
        setTimeout(() => {
          this.triggerGameOver();
        }, 800);
        return;
      }
    }

    feedbackBox.style.display = 'block';
    document.getElementById('btnQuizNext').style.display = 'inline-flex';
  }

  nextQuizQuestion() {
    window.retroAudio.playClick();
    this.quizState.currentQuestionIndex++;

    if (this.quizState.currentQuestionIndex >= this.quizState.questions.length) {
      this.triggerSetCleared();
    } else {
      this.renderCurrentQuestion();
    }
  }

  jumpToQuestion(index) {
    window.retroAudio.playClick();
    this.quizState.currentQuestionIndex = parseInt(index, 10);
    this.renderCurrentQuestion();
  }

  retryQuiz() {
    window.retroAudio.playCoin();
    document.getElementById('modalGameOver').classList.remove('active');
    this.quizState.lives = this.quizState.maxLives || 3;
    this.renderCurrentQuestion();
  }

  exitQuiz() {
    window.retroAudio.playClick();
    document.getElementById('modalGameOver').classList.remove('active');
    if (this.quizState.isShortPractice) {
      this.navigateTo('lobby');
    } else {
      this.openSubjectSets(this.quizState.subject);
    }
  }

  triggerGameOver() {
    window.retroAudio.playGameOver();
    document.getElementById('modalGameOver').classList.add('active');
  }

  triggerSetCleared() {
    window.retroAudio.playLevelUp();
    const statsContainer = document.getElementById('modalSetSummaryStats');
    statsContainer.innerHTML = `
      <div>Úspěšně vyřešeno úloh: <strong style="color: var(--neon-green);">${this.quizState.correctCount} / ${this.quizState.questions.length}</strong></div>
      <div>Získané XP body: <strong style="color: var(--neon-yellow);">+${this.quizState.xpEarnedThisSession} XP</strong></div>
      <div>Zbývající životy: <strong style="color: #fff;">${this.quizState.lives} ❤️</strong></div>
    `;
    document.getElementById('modalSetCleared').classList.add('active');
  }

  closeSetClearedModal() {
    window.retroAudio.playClick();
    document.getElementById('modalSetCleared').classList.remove('active');
    if (this.quizState.isShortPractice) {
      this.navigateTo('lobby');
    } else {
      this.openSubjectSets(this.quizState.subject);
    }
  }

  // =========================================================================
  // SCREEN 5: AVATAR & ITEMS SHOP
  // =========================================================================
  setShopTab(tab) {
    window.retroAudio.playClick();
    this.shopTab = tab;
    const tabAvatars = document.getElementById('shopTabAvatars');
    const tabItems = document.getElementById('shopTabItems');
    if (tabAvatars) tabAvatars.classList.toggle('active', tab === 'avatars');
    if (tabItems) tabItems.classList.toggle('active', tab === 'items');
    this.renderShop();
  }

  renderShop() {
    if (!this.currentUser) return;
    const user = this.currentUser;

    document.getElementById('shopBalanceDisplay').innerText = `${user.xp} XP`;

    const container = document.getElementById('shopItemsContainer');
    container.innerHTML = '';

    if (this.shopTab === 'avatars') {
      window.CERMAT_DATA.avatars.forEach(item => {
        const isOwned = (user.inventory || []).includes(item.id);
        const isEquipped = (user.avatarId === item.id);
        const canAfford = user.xp >= item.price;

        const card = document.createElement('div');
        card.className = `arcade-card shop-card ${isEquipped ? 'active-cyan' : ''}`;

        let actionBtnHtml = '';
        if (isEquipped) {
          actionBtnHtml = `<button class="arcade-btn arcade-btn-cyan" style="width: 100%;" disabled>✅ AKTIVNÍ</button>`;
        } else if (isOwned) {
          actionBtnHtml = `<button class="arcade-btn arcade-btn-yellow" style="width: 100%;" onclick="app.equipAvatar('${item.id}')">👕 NASADIT</button>`;
        } else {
          actionBtnHtml = `
            <button class="arcade-btn ${canAfford ? 'arcade-btn-green' : 'arcade-btn-ghost'}" style="width: 100%;" 
                    ${canAfford ? '' : 'disabled'} onclick="app.buyAvatar('${item.id}', ${item.price})">
              🪙 KOUPIT (${item.price} XP)
            </button>
          `;
        }

        card.innerHTML = `
          <div class="shop-card-preview" style="border-color: ${item.rarityColor};">
            ${item.svg}
          </div>
          <div class="pixel-badge" style="background: rgba(255,255,255,0.06); color: ${item.rarityColor}; margin-bottom: 8px;">
            ${item.rarity}
          </div>
          <div class="shop-card-name">${item.name}</div>
          <div class="shop-card-desc">${item.description}</div>
          <div style="width: 100%; margin-top: auto;">
            ${actionBtnHtml}
          </div>
        `;
        container.appendChild(card);
      });
    } else {
      // Titles, Themes & Power-ups
      const items = window.CERMAT_DATA.shopTitles || [];
      items.forEach(item => {
        const isOwned = (user.inventory || []).includes(item.id);
        const isEquipped = (user.equippedTitle === item.id) || (user.equippedSkin === item.id);
        const canAfford = user.xp >= item.price;

        const card = document.createElement('div');
        card.className = `arcade-card shop-card ${isEquipped ? 'active-pink' : ''}`;

        let actionBtnHtml = '';
        if (item.type === 'power') {
          if (isOwned) {
            actionBtnHtml = `<button class="arcade-btn arcade-btn-green" style="width: 100%;" disabled>🛡️ AKTIVNÍ PERK</button>`;
          } else {
            actionBtnHtml = `
              <button class="arcade-btn ${canAfford ? 'arcade-btn-green' : 'arcade-btn-ghost'}" style="width: 100%;" 
                      ${canAfford ? '' : 'disabled'} onclick="app.buyShopItem('${item.id}', ${item.price})">
                🪙 KOUPIT (${item.price} XP)
              </button>
            `;
          }
        } else {
          if (isEquipped) {
            actionBtnHtml = `<button class="arcade-btn arcade-btn-cyan" style="width: 100%;" disabled>✅ AKTIVNÍ</button>`;
          } else if (isOwned) {
            actionBtnHtml = `<button class="arcade-btn arcade-btn-yellow" style="width: 100%;" onclick="app.equipShopItem('${item.id}', '${item.type}')">✨ AKTIVOVAT</button>`;
          } else {
            actionBtnHtml = `
              <button class="arcade-btn ${canAfford ? 'arcade-btn-pink' : 'arcade-btn-ghost'}" style="width: 100%;" 
                      ${canAfford ? '' : 'disabled'} onclick="app.buyShopItem('${item.id}', ${item.price})">
                🪙 KOUPIT (${item.price} XP)
              </button>
            `;
          }
        }

        card.innerHTML = `
          <div class="shop-card-preview" style="border-color: ${item.rarityColor}; display: flex; align-items: center; justify-content: center; font-size: 38px; background: #080716;">
            ${item.icon}
          </div>
          <div class="pixel-badge" style="background: rgba(255,255,255,0.06); color: ${item.rarityColor}; margin-bottom: 8px;">
            ${item.rarity} • ${item.type === 'power' ? 'Artefakt' : item.type === 'theme' ? 'Skin' : 'Titul'}
          </div>
          <div class="shop-card-name">${item.name}</div>
          <div class="shop-card-desc">${item.description}</div>
          <div style="width: 100%; margin-top: auto;">
            ${actionBtnHtml}
          </div>
        `;
        container.appendChild(card);
      });
    }
  }

  buyShopItem(itemId, price) {
    if (!this.currentUser) return;
    if (this.currentUser.xp < price) {
      window.retroAudio.playWrong();
      alert('Nemáte dostatek XP bodů na tuto položku.');
      return;
    }

    window.retroAudio.playPurchase();
    const item = (window.CERMAT_DATA.shopTitles || []).find(i => i.id === itemId);

    this.updateCurrentUser(u => {
      u.xp -= price;
      if (!u.inventory) u.inventory = [];
      u.inventory.push(itemId);
      if (item && item.type === 'title') {
        u.equippedTitle = itemId;
      } else if (item && item.type === 'theme') {
        u.equippedSkin = itemId;
      }
    });

    this.renderShop();
    this.updateHud();
    alert(`🎉 Gratulujeme! Položka "${item ? item.name : itemId}" byla úspěšně zakoupena!`);
  }

  equipShopItem(itemId, itemType) {
    window.retroAudio.playClick();
    this.updateCurrentUser(u => {
      if (itemType === 'title') {
        u.equippedTitle = itemId;
      } else if (itemType === 'theme') {
        u.equippedSkin = itemId;
      }
    });
    this.renderShop();
    this.updateHud();
  }

  buyAvatar(avatarId, price) {
    if (!this.currentUser) return;
    if (this.currentUser.xp < price) {
      window.retroAudio.playWrong();
      alert('Nemáte dostatek XP na zakoupení tohoto avatara.');
      return;
    }

    window.retroAudio.playPurchase();

    this.updateCurrentUser(u => {
      u.xp -= price;
      if (!u.inventory) u.inventory = [];
      u.inventory.push(avatarId);
      u.avatarId = avatarId; // Auto equip
    });

    this.renderShop();
    this.updateHud();
  }

  equipAvatar(avatarId) {
    window.retroAudio.playClick();
    this.updateCurrentUser(u => {
      u.avatarId = avatarId;
    });
    this.renderShop();
    this.updateHud();
  }

  // =========================================================================
  // SCREEN 6: NOTICEBOARD & HOMEWORK (NÁSTĚNKA)
  // =========================================================================
  renderNoticeboard() {
    if (!this.currentUser) return;
    const user = this.currentUser;

    const classLabel = user.isAnonymous
      ? 'Anonymní režim (bez přiřazené třídy)'
      : (user.role === 'teacher' ? 'Učitel (všechny třídy)' : `Třída ${user.studentClass || '9.A'}`);
    document.getElementById('boardClassFilterNote').innerText = `Filtrováno pro: ${classLabel}`;

    // 1. Render Announcements
    const announcements = this.getAnnouncements();
    const filteredAnnouncements = announcements.filter(a => 
      a.targetClass === 'all' || 
      (user.studentClass && a.targetClass === user.studentClass) ||
      user.role === 'teacher'
    );

    const annContainer = document.getElementById('boardAnnouncementsList');
    annContainer.innerHTML = '';

    if (filteredAnnouncements.length === 0) {
      annContainer.innerHTML = `<div class="arcade-card" style="padding: 20px; color: var(--text-dim);">Žádné aktuální zprávy na nástěnce.</div>`;
    } else {
      filteredAnnouncements.forEach(a => {
        const card = document.createElement('div');
        card.className = 'arcade-card notice-card';
        card.style.borderLeftColor = a.tagColor || 'var(--neon-pink)';
        card.innerHTML = `
          <div class="notice-card-header">
            <div class="notice-card-title">${a.title}</div>
            <span class="pixel-badge" style="background: rgba(255,0,127,0.2); color: ${a.tagColor || 'var(--neon-pink)'};">
              ${a.tag}
            </span>
          </div>
          <div class="notice-card-meta">Autor: ${a.author} • Cílová skupina: ${a.targetClass === 'all' ? 'Všichni žáci' : a.targetClass} • ${a.date}</div>
          <div class="notice-card-content">${a.content}</div>
        `;
        annContainer.appendChild(card);
      });
    }

    // 2. Render Homework
    const hwContainer = document.getElementById('boardHomeworkList');
    hwContainer.innerHTML = '';

    if (user.isAnonymous) {
      hwContainer.innerHTML = `
        <div class="arcade-card" style="padding: 24px; text-align: center; border: 2px dashed #4b4870; background: rgba(15, 14, 28, 0.7);">
          <div style="font-size: 32px; margin-bottom: 8px;">🔒</div>
          <h4 style="font-family: var(--font-arcade); font-size: 11px; color: var(--neon-yellow); margin-bottom: 8px;">
            ÚKOLY JSOU V ANONYMNÍM REŽIMU UZAMČENY
          </h4>
          <p style="color: var(--text-muted); font-size: 13px; line-height: 1.6; margin-bottom: 16px;">
            V anonymním režimu nejste přiřazeni do žádné třídy (9.A ani 9.B). Domácí úkoly a jejich plnění jsou dostupné pouze pro registrované žáky.
          </p>
          <button type="button" class="arcade-btn arcade-btn-cyan" style="font-size: 9px; padding: 8px 14px;" onclick="app.logout()">
            ✨ Přihlásit se ke svému účtu
          </button>
        </div>
      `;
      return;
    }

    const homework = this.getHomework();
    const filteredHomework = homework.filter(h => 
      h.targetClass === 'all' || 
      (user.studentClass && h.targetClass === user.studentClass) ||
      user.role === 'teacher'
    );

    if (filteredHomework.length === 0) {
      hwContainer.innerHTML = `<div class="arcade-card" style="padding: 20px; color: var(--text-dim);">Žádné zadané domácí úkoly pro vaši třídu.</div>`;
    } else {
      filteredHomework.forEach(hw => {
        const isDone = (hw.completedBy || []).includes(user.id);
        const subject = window.CERMAT_DATA.subjects[hw.subject];

        const card = document.createElement('div');
        card.className = `arcade-card homework-card ${isDone ? 'status-done' : ''}`;
        card.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <strong style="color: #fff; font-size: 15px;">${hw.title}</strong>
            <span class="pixel-badge" style="background: ${isDone ? 'rgba(57, 255, 20, 0.2)' : 'rgba(255, 209, 102, 0.2)'}; color: ${isDone ? 'var(--neon-green)' : 'var(--neon-yellow)'};">
              ${isDone ? '✅ SPLNĚNO' : '⏳ KE SPLNĚNÍ'}
            </span>
          </div>
          <div style="font-family: var(--font-retro); font-size: 15px; color: var(--neon-cyan); margin-bottom: 8px;">
            ${subject.shortName} • Sada ${hw.setId} • Termín: ${hw.dueDate}
          </div>
          <p style="color: var(--text-muted); font-size: 13px; margin-bottom: 14px;">
            ${hw.note || 'Dokončete předepsanou testovací sadu.'}
          </p>
          <div>
            <button class="arcade-btn ${isDone ? 'arcade-btn-ghost' : 'arcade-btn-cyan'}" style="font-size: 9px; padding: 6px 14px;" 
                    onclick="app.startQuiz('${hw.subject}', ${hw.setId})">
              🎮 ${isDone ? 'Zopakovat sadu' : 'Spustit zadanou sadu'}
            </button>
          </div>
        `;
        hwContainer.appendChild(card);
      });
    }
  }

  // =========================================================================
  // SCREEN 7: TEACHER ADMIN MATRIX
  // =========================================================================
  renderTeacherDashboard() {
    this.renderTeacherHomeworkTable();
    this.renderTeacherNewsList();
    this.renderTeacherQuestionsList();
    this.renderTeacherLeaderboard();
  }

  setTeacherSubtab(tabName) {
    window.retroAudio.playClick();
    document.querySelectorAll('.teacher-subtab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.teacher-panel').forEach(p => p.classList.remove('active'));

    if (tabName === 'assign') {
      document.querySelector('.teacher-subtab:nth-child(1)').classList.add('active');
      document.getElementById('panelTeacherAssign').classList.add('active');
      this.renderTeacherHomeworkTable();
    } else if (tabName === 'news') {
      document.querySelector('.teacher-subtab:nth-child(2)').classList.add('active');
      document.getElementById('panelTeacherNews').classList.add('active');
      this.renderTeacherNewsList();
    } else if (tabName === 'editor') {
      document.querySelector('.teacher-subtab:nth-child(3)').classList.add('active');
      document.getElementById('panelTeacherEditor').classList.add('active');
      this.renderTeacherQuestionsList();
    } else if (tabName === 'classes') {
      document.querySelector('.teacher-subtab:nth-child(4)').classList.add('active');
      document.getElementById('panelTeacherClasses').classList.add('active');
      this.renderTeacherLeaderboard();
    } else if (tabName === 'settings') {
      document.querySelector('.teacher-subtab:nth-child(5)').classList.add('active');
      document.getElementById('panelTeacherSettings').classList.add('active');
      this.renderTeacherSettingsPanel();
    }
  }

  renderTeacherSettingsPanel() {
    const toggle = document.getElementById('toggleTeacherBattleActive');
    if (toggle) {
      toggle.checked = this.competitionEnabled;
    }

    const cfg = this.shortPracticeConfig;
    if (document.getElementById('cfgShortQuestionCount')) {
      document.getElementById('cfgShortQuestionCount').value = cfg.count || 10;
    }
    if (document.getElementById('cfgShortSubject')) {
      document.getElementById('cfgShortSubject').value = cfg.subject || 'random';
    }
    if (document.getElementById('cfgShortSet')) {
      document.getElementById('cfgShortSet').value = cfg.set || 'any';
    }
  }

  toggleCompetition(enabled) {
    window.retroAudio.playClick();
    this.competitionEnabled = enabled;
    localStorage.setItem('cermat_competition_enabled', enabled ? 'true' : 'false');

    // Update navigation and buttons label
    const navTabBattle = document.getElementById('navTabBattle');
    if (navTabBattle) {
      if (enabled) {
        navTabBattle.innerHTML = '⚔️ Souboj tříd';
        navTabBattle.style.opacity = '1';
      } else {
        navTabBattle.innerHTML = '🛡️ Souboj (OFFLINE)';
        navTabBattle.style.opacity = '0.75';
      }
    }
    const btnLobbyBattle = document.getElementById('btnLobbyBattle');
    if (btnLobbyBattle) {
      if (enabled) {
        btnLobbyBattle.innerHTML = '⚔️ Souboj tříd';
        btnLobbyBattle.className = 'arcade-btn arcade-btn-pink';
      } else {
        btnLobbyBattle.innerHTML = '🛡️ Souboj (OFFLINE)';
        btnLobbyBattle.className = 'arcade-btn arcade-btn-ghost';
      }
    }

    if (enabled) {
      alert('⚔️ Soupeření mezi třídami bylo POVOLENO (ONLINE).');
    } else {
      alert('🛡️ Režim soupeření je nyní OFFLINE. Záložka zůstává přístupná, žáci v ní uvidí stav offline.');
    }
  }

  saveTeacherShortPracticeConfig(e) {
    e.preventDefault();
    window.retroAudio.playLevelUp();

    const count = parseInt(document.getElementById('cfgShortQuestionCount').value, 10);
    const subject = document.getElementById('cfgShortSubject').value;
    const set = document.getElementById('cfgShortSet').value;

    this.shortPracticeConfig = { count, subject, set };
    localStorage.setItem('cermat_short_practice_cfg', JSON.stringify(this.shortPracticeConfig));

    alert(`✅ Nastavení zkráceného procvičování bylo uloženo!\n\nPočet úloh: ${count}\nPředmět: ${subject}\nSada: ${set}`);
  }

  updateHwSetOptions() {
    const subject = document.getElementById('hwSubject').value;
    const select = document.getElementById('hwSet');
    const sets = window.CERMAT_DATA.subjects[subject].sets;

    select.innerHTML = '';
    sets.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.innerText = `${s.title} (50 úloh)`;
      select.appendChild(opt);
    });
  }

  handleAssignHomework(e) {
    e.preventDefault();
    const subject = document.getElementById('hwSubject').value;
    const setId = parseInt(document.getElementById('hwSet').value, 10);
    const targetClass = document.getElementById('hwTargetClass').value;
    const dueDate = document.getElementById('hwDueDate').value;
    const title = document.getElementById('hwTitle').value.trim();
    const note = document.getElementById('hwNote').value.trim();

    const newHw = {
      id: 'hw_' + Date.now(),
      subject: subject,
      setId: setId,
      targetClass: targetClass,
      dueDate: dueDate,
      assignedDate: new Date().toISOString().split('T')[0],
      title: title,
      note: note,
      completedBy: []
    };

    const homework = this.getHomework();
    homework.unshift(newHw);
    this.saveHomework(homework);

    window.retroAudio.playLevelUp();
    alert('Domácí úkol byl úspěšně přiřazen vybrané třídě!');
    document.getElementById('formAssignHomework').reset();
    this.renderTeacherHomeworkTable();
  }

  renderTeacherHomeworkTable() {
    const container = document.getElementById('teacherHomeworkTableContainer');
    const homework = this.getHomework();

    if (homework.length === 0) {
      container.innerHTML = `<div class="arcade-card" style="padding: 20px; color: var(--text-dim);">Zatím nebyly zadány žádné úkoly.</div>`;
      return;
    }

    let html = `
      <table class="admin-table arcade-card">
        <thead>
          <tr>
            <th>NÁZEV ÚKOLU</th>
            <th>PŘEDMĚT & SADA</th>
            <th>CÍL</th>
            <th>TERMÍN</th>
            <th>STAV ODEVZDÁNÍ</th>
            <th>AKCE</th>
          </tr>
        </thead>
        <tbody>
    `;

    homework.forEach(hw => {
      const subject = window.CERMAT_DATA.subjects[hw.subject];
      const completedCount = (hw.completedBy || []).length;
      const targetText = hw.targetClass === 'all' ? '9.A + 9.B' : hw.targetClass;

      html += `
        <tr>
          <td><strong>${hw.title}</strong></td>
          <td>${subject.shortName} (Sada ${hw.setId})</td>
          <td><span class="pixel-badge" style="background: rgba(0,245,212,0.15); color: var(--neon-cyan);">${targetText}</span></td>
          <td>${hw.dueDate}</td>
          <td><span style="color: var(--neon-green); font-family: var(--font-retro); font-size: 16px;">${completedCount} žáků</span></td>
          <td>
            <button class="arcade-btn arcade-btn-danger" style="padding: 4px 8px; font-size: 8px;" onclick="app.deleteHomework('${hw.id}')">
              🗑️ Smazat
            </button>
          </td>
        </tr>
      `;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
  }

  deleteHomework(hwId) {
    if (!confirm('Opravdu chcete tento domácí úkol odebrat?')) return;
    window.retroAudio.playClick();
    const homework = this.getHomework().filter(h => h.id !== hwId);
    this.saveHomework(homework);
    this.renderTeacherHomeworkTable();
  }

  handleAddNews(e) {
    e.preventDefault();
    const title = document.getElementById('newsTitle').value.trim();
    const targetClass = document.getElementById('newsTargetClass').value;
    const tag = document.getElementById('newsTag').value;
    const content = document.getElementById('newsContent').value.trim();

    const newAnnouncement = {
      id: 'ann_' + Date.now(),
      title: title,
      author: this.currentUser ? this.currentUser.fullName : 'Učitel',
      targetClass: targetClass,
      date: new Date().toLocaleDateString('cs-CZ'),
      tag: tag,
      tagColor: tag === 'DŮLEŽITÉ' ? '#ff007f' : '#00f5d4',
      content: content
    };

    const announcements = this.getAnnouncements();
    announcements.unshift(newAnnouncement);
    this.saveAnnouncements(announcements);

    window.retroAudio.playLevelUp();
    alert('Zpráva byla úspěšně zveřejněna na nástěnce žáků!');
    document.getElementById('formAddNews').reset();
    this.renderTeacherNewsList();
  }

  renderTeacherNewsList() {
    const container = document.getElementById('teacherNewsListContainer');
    const announcements = this.getAnnouncements();

    if (announcements.length === 0) {
      container.innerHTML = `<div class="arcade-card" style="padding: 20px; color: var(--text-dim);">Žádná publikovaná oznámení.</div>`;
      return;
    }

    container.innerHTML = '';
    announcements.forEach(a => {
      const card = document.createElement('div');
      card.className = 'arcade-card notice-card';
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <strong style="color: #fff; font-size: 15px;">${a.title}</strong>
          <div>
            <span class="pixel-badge" style="background: rgba(255,0,127,0.2); color: var(--neon-pink); margin-right: 8px;">${a.tag}</span>
            <button class="arcade-btn arcade-btn-danger" style="padding: 2px 6px; font-size: 8px;" onclick="app.deleteAnnouncement('${a.id}')">
              ✕
            </button>
          </div>
        </div>
        <div style="font-family: var(--font-retro); font-size: 14px; color: var(--text-dim); margin-bottom: 8px;">
          Cíl: ${a.targetClass === 'all' ? 'Všichni' : a.targetClass} • Datum: ${a.date}
        </div>
        <p style="color: #cbd5e1; font-size: 13px;">${a.content}</p>
      `;
      container.appendChild(card);
    });
  }

  deleteAnnouncement(id) {
    if (!confirm('Opravdu chcete toto oznámení smazat?')) return;
    window.retroAudio.playClick();
    const list = this.getAnnouncements().filter(a => a.id !== id);
    this.saveAnnouncements(list);
    this.renderTeacherNewsList();
  }

  // QUESTION CREATOR
  handleAddQuestion(e) {
    e.preventDefault();
    const subject = document.getElementById('qSubject').value;
    const setId = parseInt(document.getElementById('qSetId').value, 10);
    const xp = parseInt(document.getElementById('qXp').value, 10);
    const questionText = document.getElementById('qText').value.trim();

    const opt0 = document.getElementById('qOpt0').value.trim();
    const opt1 = document.getElementById('qOpt1').value.trim();
    const opt2 = document.getElementById('qOpt2').value.trim();
    const opt3 = document.getElementById('qOpt3').value.trim();

    const correctRadio = document.querySelector('input[name="correctOption"]:checked');
    const correctIdx = correctRadio ? parseInt(correctRadio.value, 10) : 0;

    const explanation = document.getElementById('qExplanation').value.trim();

    const questions = this.getQuestions();
    const countInSet = questions.filter(q => q.subject === subject && q.setId === setId).length;

    const newQuestion = {
      subject: subject,
      setId: setId,
      qNumber: countInSet + 1,
      type: 'single',
      question: questionText,
      options: [opt0, opt1, opt2, opt3],
      correct: correctIdx,
      explanation: explanation,
      xp: xp
    };

    questions.push(newQuestion);
    this.saveQuestions(questions);

    window.retroAudio.playLevelUp();
    alert(`Nová CERMAT úloha byla přidána do ${subject === 'czech' ? 'Českého jazyka' : 'Matematiky'} (Level ${setId})!`);
    document.getElementById('formAddQuestion').reset();
    this.renderTeacherQuestionsList();
  }

  renderTeacherQuestionsList() {
    const container = document.getElementById('teacherQuestionsListContainer');
    const questions = this.getQuestions();
    const latest = [...questions].reverse().slice(0, 10); // Show 10 latest

    let html = `
      <div style="font-family: var(--font-retro); font-size: 16px; color: var(--neon-cyan); margin-bottom: 12px;">
        V databázi je celkem ${questions.length} úloh. Níže je ukázka posledních přidaných úloh:
      </div>
      <div style="display: grid; gap: 12px;">
    `;

    latest.forEach(q => {
      const subject = window.CERMAT_DATA.subjects[q.subject];
      html += `
        <div class="arcade-card" style="padding: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span class="pixel-badge" style="background: rgba(0,245,212,0.15); color: var(--neon-cyan);">
              ${subject.shortName} • Sada ${q.setId} • Úloha #${q.qNumber}
            </span>
            <span style="color: var(--neon-yellow); font-family: var(--font-arcade); font-size: 9px;">+${q.xp || 25} XP</span>
          </div>
          <div style="font-size: 14px; color: #fff; margin-bottom: 8px;">${q.question}</div>
          <div style="font-size: 12px; color: var(--neon-green);">
            Správná odpověď: ${q.options[q.correct]}
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }

  renderTeacherLeaderboard() {
    const container = document.getElementById('teacherLeaderboardContainer');
    const allStudents = this.getUsers().filter(u => u.role === 'student');
    const allHomework = this.getHomework();

    // 1. Update Class Stats (9.A and 9.B summary cards)
    const students9A = allStudents.filter(s => s.studentClass === '9.A');
    const students9B = allStudents.filter(s => s.studentClass === '9.B');

    // 9.A Stats calculation
    const avgXp9A = students9A.length ? Math.round(students9A.reduce((sum, s) => sum + (s.xp || 0), 0) / students9A.length) : 0;
    const top9A = students9A.slice().sort((a, b) => (b.xp || 0) - (a.xp || 0))[0];
    const hw9A = allHomework.filter(h => h.targetClass === 'all' || h.targetClass === '9.A');
    let hwDone9A = 0;
    students9A.forEach(s => {
      hw9A.forEach(h => { if ((h.completedBy || []).includes(s.id)) hwDone9A++; });
    });
    const hwRate9A = (students9A.length && hw9A.length) ? Math.round((hwDone9A / (students9A.length * hw9A.length)) * 100) : 0;

    const statsContent9A = document.getElementById('statsContent9A');
    if (statsContent9A) {
      statsContent9A.innerHTML = `
        <div>Počet žáků v databázi: <strong style="color: #fff;">${students9A.length}</strong></div>
        <div>Průměrný zisk XP: <strong style="color: var(--neon-cyan);">${avgXp9A} XP</strong></div>
        <div>Plnění zadaných úkolů: <strong style="color: var(--neon-green);">${hwRate9A} %</strong></div>
        <div>Nejlepší žák: <strong style="color: var(--neon-yellow);">${top9A ? `${top9A.fullName} (${top9A.xp} XP)` : 'Zatím žádný'}</strong></div>
      `;
    }

    // 9.B Stats calculation
    const avgXp9B = students9B.length ? Math.round(students9B.reduce((sum, s) => sum + (s.xp || 0), 0) / students9B.length) : 0;
    const top9B = students9B.slice().sort((a, b) => (b.xp || 0) - (a.xp || 0))[0];
    const hw9B = allHomework.filter(h => h.targetClass === 'all' || h.targetClass === '9.B');
    let hwDone9B = 0;
    students9B.forEach(s => {
      hw9B.forEach(h => { if ((h.completedBy || []).includes(s.id)) hwDone9B++; });
    });
    const hwRate9B = (students9B.length && hw9B.length) ? Math.round((hwDone9B / (students9B.length * hw9B.length)) * 100) : 0;

    const statsContent9B = document.getElementById('statsContent9B');
    if (statsContent9B) {
      statsContent9B.innerHTML = `
        <div>Počet žáků v databázi: <strong style="color: #fff;">${students9B.length}</strong></div>
        <div>Průměrný zisk XP: <strong style="color: var(--neon-pink);">${avgXp9B} XP</strong></div>
        <div>Plnění zadaných úkolů: <strong style="color: var(--neon-green);">${hwRate9B} %</strong></div>
        <div>Nejlepší žák: <strong style="color: var(--neon-yellow);">${top9B ? `${top9B.fullName} (${top9B.xp} XP)` : 'Zatím žádný'}</strong></div>
      `;
    }

    // 2. Filter & Search Students for Table
    const searchVal = (document.getElementById('studentSearchInput')?.value || '').trim().toLowerCase();
    const classFilter = document.getElementById('studentClassFilter')?.value || 'all';
    const sortOrder = document.getElementById('studentSortOrder')?.value || 'xp_desc';

    let filtered = allStudents.filter(s => {
      const matchSearch = s.fullName.toLowerCase().includes(searchVal) || s.username.toLowerCase().includes(searchVal);
      const matchClass = classFilter === 'all' || s.studentClass === classFilter;
      return matchSearch && matchClass;
    });

    // Sort students
    if (sortOrder === 'xp_desc') {
      filtered.sort((a, b) => (b.xp || 0) - (a.xp || 0));
    } else if (sortOrder === 'name_asc') {
      filtered.sort((a, b) => a.fullName.localeCompare(b.fullName, 'cs'));
    } else if (sortOrder === 'solved_desc') {
      filtered.sort((a, b) => Object.keys(b.completedQuestions || {}).length - Object.keys(a.completedQuestions || {}).length);
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="arcade-card" style="padding: 24px; text-align: center; color: var(--text-dim);">
          🔍 Žádní žáci neodpovídají zadaným filtrům.
        </div>
      `;
      return;
    }

    let html = `
      <table class="admin-table arcade-card">
        <thead>
          <tr>
            <th>POŘADÍ</th>
            <th>ŽÁK (PROFIL)</th>
            <th>TŘÍDA</th>
            <th>CELKOVÉ XP</th>
            <th>ÚROVEŇ</th>
            <th>VYŘEŠENO</th>
            <th>ÚKOLY</th>
            <th style="text-align: right;">SPRÁVA A VÝSLEDKY</th>
          </tr>
        </thead>
        <tbody>
    `;

    filtered.forEach((s, idx) => {
      const lvl = this.getLevelInfo(s.xp || 0);
      const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;
      const solvedCount = Object.keys(s.completedQuestions || {}).length;
      const avatar = window.CERMAT_DATA.avatars.find(a => a.id === s.avatarId) || window.CERMAT_DATA.avatars[0];

      // Homework completion for this student
      const studentHw = allHomework.filter(h => h.targetClass === 'all' || h.targetClass === s.studentClass);
      const completedHwCount = studentHw.filter(h => (h.completedBy || []).includes(s.id)).length;

      html += `
        <tr>
          <td style="font-family: var(--font-arcade); font-size: 11px; color: var(--neon-yellow);">${medal}</td>
          <td>
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 32px; height: 32px; border-radius: 6px; border: 1px solid var(--neon-cyan); overflow: hidden; background: #080714; flex-shrink: 0;">
                ${avatar.svg}
              </div>
              <div>
                <strong>${s.fullName}</strong>
                <div style="font-family: var(--font-retro); font-size: 13px; color: var(--text-dim);">@${s.username}</div>
              </div>
            </div>
          </td>
          <td>
            <span class="pixel-badge" style="background: ${s.studentClass === '9.A' ? 'rgba(0,245,212,0.2)' : 'rgba(255,0,127,0.2)'}; color: ${s.studentClass === '9.A' ? 'var(--neon-cyan)' : 'var(--neon-pink)'};">
              ${s.studentClass || '9.A'}
            </span>
          </td>
          <td style="font-family: var(--font-arcade); font-size: 11px; color: var(--neon-green);">
            ${s.xp || 0} XP
          </td>
          <td>
            <span style="font-size: 13px; color: #fff;">Lvl ${lvl.lvl}</span>
            <div style="font-size: 11px; color: var(--text-dim);">${lvl.title}</div>
          </td>
          <td>
            <span style="color: var(--neon-cyan); font-family: var(--font-retro); font-size: 15px;">${solvedCount} / 500 úloh</span>
          </td>
          <td>
            <span style="color: ${completedHwCount === studentHw.length && studentHw.length > 0 ? 'var(--neon-green)' : 'var(--neon-yellow)'}; font-family: var(--font-retro); font-size: 15px;">
              ${completedHwCount} / ${studentHw.length} hotovo
            </span>
          </td>
          <td>
            <div class="student-table-actions" style="justify-content: flex-end;">
              <button type="button" class="arcade-btn arcade-btn-cyan" style="padding: 5px 8px; font-size: 8px;" onclick="app.openStudentResultsDetail('${s.id}')" title="Zobrazit detailní výsledky a přehled úloh">
                👁️ Detail
              </button>
              <button type="button" class="arcade-btn arcade-btn-yellow" style="padding: 5px 8px; font-size: 8px;" onclick="app.resetStudentResults('${s.id}')" title="Resetovat splněné úlohy a XP">
                🔄 Reset
              </button>
              <button type="button" class="arcade-btn arcade-btn-danger" style="padding: 5px 8px; font-size: 8px;" onclick="app.deleteStudentAccount('${s.id}')" title="Trvale odstranit účet žáka">
                🗑️ Smazat
              </button>
            </div>
          </td>
        </tr>
      `;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
  }

  // =========================================================================
  // DETAILED STUDENT RESULTS & ACCOUNT MANAGEMENT MODAL
  // =========================================================================
  openStudentResultsDetail(studentId) {
    window.retroAudio.playClick();
    const student = this.getUserById(studentId);
    if (!student) {
      alert('Žák nebyl nalezen.');
      return;
    }

    const lvl = this.getLevelInfo(student.xp || 0);
    const avatar = window.CERMAT_DATA.avatars.find(a => a.id === student.avatarId) || window.CERMAT_DATA.avatars[0];

    // Header info
    document.getElementById('studentDetailAvatar').innerHTML = avatar.svg;
    document.getElementById('studentDetailName').innerText = student.fullName.toUpperCase();
    document.getElementById('studentDetailMeta').innerText = `Třída ${student.studentClass || '9.A'} • @${student.username} • Level ${lvl.lvl}: ${lvl.title} • ${student.xp || 0} XP • Série 🔥 ${student.streak || 0}x`;

    const completed = student.completedQuestions || {};

    // 1. Czech Language breakdown (5 sets)
    const czechSets = window.CERMAT_DATA.subjects.czech.sets;
    let czechTotalSolved = 0;
    let czechSetsHtml = '';

    czechSets.forEach(set => {
      let setSolved = 0;
      for (let i = 1; i <= 50; i++) {
        if (completed[`czech_${set.id}_${i}`]) setSolved++;
      }
      czechTotalSolved += setSolved;
      const pct = Math.round((setSolved / 50) * 100);

      czechSetsHtml += `
        <div class="set-progress-line">
          <div class="set-progress-line-meta">
            <span><strong>${set.title}</strong></span>
            <span style="color: var(--neon-pink);">${setSolved} / 50 (${pct}%)</span>
          </div>
          <div class="set-progress-track" style="width: 100%; height: 6px;">
            <div class="set-progress-bar" style="width: ${pct}%; background: var(--neon-pink);"></div>
          </div>
        </div>
      `;
    });
    document.getElementById('studentDetailCzechSets').innerHTML = czechSetsHtml;
    document.getElementById('studentDetailCzechTotal').innerText = `${czechTotalSolved} / 250 úloh`;

    // 2. Math breakdown (5 sets)
    const mathSets = window.CERMAT_DATA.subjects.math.sets;
    let mathTotalSolved = 0;
    let mathSetsHtml = '';

    mathSets.forEach(set => {
      let setSolved = 0;
      for (let i = 1; i <= 50; i++) {
        if (completed[`math_${set.id}_${i}`]) setSolved++;
      }
      mathTotalSolved += setSolved;
      const pct = Math.round((setSolved / 50) * 100);

      mathSetsHtml += `
        <div class="set-progress-line">
          <div class="set-progress-line-meta">
            <span><strong>${set.title}</strong></span>
            <span style="color: var(--neon-cyan);">${setSolved} / 50 (${pct}%)</span>
          </div>
          <div class="set-progress-track" style="width: 100%; height: 6px;">
            <div class="set-progress-bar" style="width: ${pct}%; background: var(--neon-cyan);"></div>
          </div>
        </div>
      `;
    });
    document.getElementById('studentDetailMathSets').innerHTML = mathSetsHtml;
    document.getElementById('studentDetailMathTotal').innerText = `${mathTotalSolved} / 250 úloh`;

    // 3. Homework list for this student
    const allHomework = this.getHomework();
    const studentHw = allHomework.filter(h => h.targetClass === 'all' || h.targetClass === student.studentClass);
    let hwHtml = '';

    if (studentHw.length === 0) {
      hwHtml = `<div style="color: var(--text-dim); font-size: 13px;">Pro tuto třídu nejsou zadány žádné úkoly.</div>`;
    } else {
      studentHw.forEach(hw => {
        const isDone = (hw.completedBy || []).includes(student.id);
        const subj = window.CERMAT_DATA.subjects[hw.subject];
        hwHtml += `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #090818; border-radius: 6px; margin-bottom: 6px; border-left: 3px solid ${isDone ? 'var(--neon-green)' : 'var(--neon-yellow)'};">
            <div>
              <strong style="color: #fff; font-size: 13px;">${hw.title}</strong>
              <div style="font-family: var(--font-retro); font-size: 13px; color: var(--text-dim);">
                ${subj.shortName} • Sada ${hw.setId} • Termín: ${hw.dueDate}
              </div>
            </div>
            <span class="pixel-badge" style="background: ${isDone ? 'rgba(57, 255, 20, 0.2)' : 'rgba(255, 209, 102, 0.2)'}; color: ${isDone ? 'var(--neon-green)' : 'var(--neon-yellow)'};">
              ${isDone ? '✅ SPLNĚNO' : '⏳ NESPLNĚNO'}
            </span>
          </div>
        `;
      });
    }
    document.getElementById('studentDetailHomeworkList').innerHTML = hwHtml;

    // Action buttons in modal
    const btnReset = document.getElementById('btnModalResetStudent');
    const btnDelete = document.getElementById('btnModalDeleteStudent');

    btnReset.onclick = () => this.resetStudentResults(student.id);
    btnDelete.onclick = () => this.deleteStudentAccount(student.id);

    document.getElementById('modalStudentDetail').classList.add('active');
  }

  closeStudentDetailModal() {
    window.retroAudio.playClick();
    document.getElementById('modalStudentDetail').classList.remove('active');
  }

  // =========================================================================
  // RESETTING STUDENT RESULTS / PROGRESS
  // =========================================================================
  resetStudentResults(studentId) {
    const student = this.getUserById(studentId);
    if (!student) return;

    const confirmed = confirm(`🔄 OPRAVDU RESETOVAT VÝSLEDKY?\n\nChcete vynulovat veškerý postup, splněné úlohy a získané XP žáka "${student.fullName}"?\n\nÚčet zůstane zachován, ale žák začne znovu s 0 XP.`);
    if (!confirmed) return;

    window.retroAudio.playLevelUp();

    // 1. Reset user progress
    const users = this.getUsers();
    const uIdx = users.findIndex(u => u.id === studentId);
    if (uIdx !== -1) {
      users[uIdx].completedQuestions = {};
      users[uIdx].xp = 0;
      users[uIdx].streak = 0;
      this.saveUsers(users);

      // If resetting currently active user session
      if (this.currentUser && this.currentUser.id === studentId) {
        this.currentUser = users[uIdx];
        localStorage.setItem('cermat_active_user', JSON.stringify(this.currentUser));
        this.updateHud();
      }
    }

    // 2. Clear student's homework completion
    const homework = this.getHomework();
    homework.forEach(hw => {
      if (hw.completedBy) {
        hw.completedBy = hw.completedBy.filter(id => id !== studentId);
      }
    });
    this.saveHomework(homework);

    // Refresh UI
    this.renderTeacherLeaderboard();
    const modalDetail = document.getElementById('modalStudentDetail');
    if (modalDetail && modalDetail.classList.contains('active')) {
      this.openStudentResultsDetail(studentId); // re-render modal with 0
    }

    alert(`✅ Výsledky a XP body žáka ${student.fullName} byly úspěšně vynulovány!`);
  }

  // =========================================================================
  // DELETING STUDENT ACCOUNTS
  // =========================================================================
  deleteStudentAccount(studentId) {
    const student = this.getUserById(studentId);
    if (!student) return;

    const confirmed = confirm(`⚠️ TRVALÉ SMAZÁNÍ ÚČTU ŽÁKA:\n\nOpravdu chcete trvale odstranit účet žáka "${student.fullName}" (@${student.username})?\n\nTato akce je nevratná a odstraní veškeré záznamy žáka ze systému.`);
    if (!confirmed) return;

    window.retroAudio.playClick();

    // 1. Remove from users list
    let users = this.getUsers();
    users = users.filter(u => u.id !== studentId);
    this.saveUsers(users);

    // 2. Remove from homework completed list
    const homework = this.getHomework();
    homework.forEach(hw => {
      if (hw.completedBy) {
        hw.completedBy = hw.completedBy.filter(id => id !== studentId);
      }
    });
    this.saveHomework(homework);

    // Close detail modal if open
    this.closeStudentDetailModal();

    // Re-render teacher table
    this.renderTeacherLeaderboard();

    alert(`🗑️ Účet žáka "${student.fullName}" byl úspěšně odstraněn ze systému.`);
  }

  // =========================================================================
  // TEACHER PIN SYSTEM (PIN: 5231)
  // =========================================================================
  promptTeacherPin(onSuccessCallback) {
    window.retroAudio.playClick();
    this.currentPinInput = '';
    this.onPinSuccessCallback = onSuccessCallback;
    this.updatePinDisplay();
    const errEl = document.getElementById('teacherPinError');
    if (errEl) errEl.innerText = '';
    const modal = document.getElementById('modalTeacherPin');
    if (modal) modal.classList.add('active');
  }

  closeTeacherPinModal() {
    window.retroAudio.playClick();
    const modal = document.getElementById('modalTeacherPin');
    if (modal) modal.classList.remove('active');
    this.currentPinInput = '';
    this.onPinSuccessCallback = null;
    if (this.currentScreen === 'teacher' && !this.teacherUnlocked) {
      if (this.currentUser && this.currentUser.role === 'student') {
        this.navigateTo('lobby');
      } else {
        this.navigateTo('auth');
      }
    }
  }

  pressPinKey(key) {
    if (this.currentPinInput.length < 4) {
      window.retroAudio.playClick();
      this.currentPinInput += key;
      this.updatePinDisplay();
      const errEl = document.getElementById('teacherPinError');
      if (errEl) errEl.innerText = '';

      if (this.currentPinInput.length === 4) {
        setTimeout(() => this.submitPin(), 120);
      }
    }
  }

  clearPin() {
    window.retroAudio.playClick();
    this.currentPinInput = '';
    this.updatePinDisplay();
    const errEl = document.getElementById('teacherPinError');
    if (errEl) errEl.innerText = '';
  }

  updatePinDisplay() {
    const display = document.getElementById('pinCodeDisplay');
    if (!display) return;
    if (this.currentPinInput.length === 0) {
      display.innerText = '_ _ _ _';
    } else {
      let str = '';
      for (let i = 0; i < 4; i++) {
        if (i < this.currentPinInput.length) {
          str += '● ';
        } else {
          str += '_ ';
        }
      }
      display.innerText = str.trim();
    }
  }

  submitPin() {
    if (this.currentPinInput === this.TEACHER_PIN) {
      window.retroAudio.playCorrect();
      this.teacherUnlocked = true;
      const modal = document.getElementById('modalTeacherPin');
      if (modal) modal.classList.remove('active');
      const cb = this.onPinSuccessCallback;
      this.onPinSuccessCallback = null;
      this.currentPinInput = '';
      if (cb) cb();
    } else {
      window.retroAudio.playWrong();
      const errEl = document.getElementById('teacherPinError');
      if (errEl) errEl.innerText = '❌ CHYBNÝ PIN! PŘÍSTUP ZAMÍTNUT.';
      this.currentPinInput = '';
      this.updatePinDisplay();
    }
  }

  // =========================================================================
  // SCREEN: LEADERBOARD (ŽEBŘÍČEK HRÁČŮ)
  // =========================================================================
  renderLeaderboard() {
    const filterEl = document.getElementById('leaderboardClassFilter');
    const selectedClass = filterEl ? filterEl.value : 'all';

    let students = this.getUsers().filter(u => u.role === 'student');
    if (selectedClass !== 'all') {
      students = students.filter(s => s.studentClass === selectedClass);
    }

    // Sort by XP descending
    students.sort((a, b) => (b.xp || 0) - (a.xp || 0));

    // Render Podium (Top 3)
    const podiumContainer = document.getElementById('leaderboardPodiumContainer');
    if (podiumContainer) {
      if (students.length >= 2) {
        const top1 = students[0];
        const top2 = students[1];
        const top3 = students[2] || null;

        const getAvatarSvg = (u) => {
          const av = (window.CERMAT_DATA.avatars || []).find(a => a.id === u.avatarId) || window.CERMAT_DATA.avatars[0];
          return av.svg;
        };

        const getTitleTag = (u) => {
          if (!u.equippedTitle) return '';
          const t = (window.CERMAT_DATA.shopTitles || []).find(item => item.id === u.equippedTitle);
          return t ? `<div style="font-size: 11px; color: ${t.rarityColor}; margin-top: 2px;">${t.name}</div>` : '';
        };

        podiumContainer.innerHTML = `
          <!-- 2nd place -->
          <div class="podium-card podium-silver">
            <div class="podium-rank-icon">🥈 2. MÍSTO</div>
            <div class="podium-avatar-box">${getAvatarSvg(top2)}</div>
            <div class="podium-name">${top2.fullName}</div>
            <div class="podium-class">${top2.studentClass || '9.A'}</div>
            <div class="podium-xp neon-text-cyan">${top2.xp} XP</div>
            ${getTitleTag(top2)}
          </div>

          <!-- 1st place -->
          <div class="podium-card podium-gold">
            <div class="podium-rank-icon">👑 1. MÍSTO 👑</div>
            <div class="podium-avatar-box gold-glow">${getAvatarSvg(top1)}</div>
            <div class="podium-name">${top1.fullName}</div>
            <div class="podium-class">${top1.studentClass || '9.A'}</div>
            <div class="podium-xp neon-text-yellow">${top1.xp} XP</div>
            ${getTitleTag(top1)}
          </div>

          <!-- 3rd place -->
          ${top3 ? `
            <div class="podium-card podium-bronze">
              <div class="podium-rank-icon">🥉 3. MÍSTO</div>
              <div class="podium-avatar-box">${getAvatarSvg(top3)}</div>
              <div class="podium-name">${top3.fullName}</div>
              <div class="podium-class">${top3.studentClass || '9.A'}</div>
              <div class="podium-xp neon-text-pink">${top3.xp} XP</div>
              ${getTitleTag(top3)}
            </div>
          ` : `
            <div class="podium-card podium-bronze" style="opacity: 0.5;">
              <div class="podium-rank-icon">🥉 3. MÍSTO</div>
              <div style="font-size: 12px; color: var(--text-dim); padding: 20px;">Čeká na vyzyvatele</div>
            </div>
          `}
        `;
      } else {
        podiumContainer.innerHTML = '';
      }
    }

    // Render Full Table
    const listContainer = document.getElementById('leaderboardListContainer');
    if (!listContainer) return;

    if (students.length === 0) {
      listContainer.innerHTML = `<div class="arcade-card" style="padding: 24px; text-align: center; color: var(--text-dim);">Žádní žáci k zobrazení.</div>`;
      return;
    }

    let html = `
      <table class="admin-table arcade-card">
        <thead>
          <tr>
            <th>POŘADÍ</th>
            <th>HRÁČ / PROFIL</th>
            <th>TŘÍDA</th>
            <th>LEVEL & TITUL</th>
            <th>CELKOVÉ XP</th>
            <th>VYŘEŠENO ÚLOH</th>
          </tr>
        </thead>
        <tbody>
    `;

    students.forEach((s, idx) => {
      const isCur = (this.currentUser && this.currentUser.id === s.id);
      const lvl = this.getLevelInfo(s.xp || 0);
      const medal = idx === 0 ? '🥇 1.' : idx === 1 ? '🥈 2.' : idx === 2 ? '🥉 3.' : `#${idx + 1}`;
      const avatar = window.CERMAT_DATA.avatars.find(a => a.id === s.avatarId) || window.CERMAT_DATA.avatars[0];
      const solvedCount = Object.keys(s.completedQuestions || {}).length;

      let titleLabel = '';
      if (s.equippedTitle) {
        const tObj = (window.CERMAT_DATA.shopTitles || []).find(it => it.id === s.equippedTitle);
        if (tObj) titleLabel = `<span style="font-size: 11px; color: ${tObj.rarityColor}; display: block;">${tObj.name}</span>`;
      }

      html += `
        <tr style="${isCur ? 'background: rgba(0, 245, 212, 0.08); outline: 1px solid var(--neon-cyan);' : ''}">
          <td style="font-family: var(--font-arcade); font-size: 11px; color: ${idx === 0 ? 'var(--neon-yellow)' : idx === 1 ? '#e2e8f0' : idx === 2 ? '#f59e0b' : 'var(--text-dim)'};">
            ${medal}
          </td>
          <td>
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 32px; height: 32px; border-radius: 6px; border: 1px solid var(--neon-cyan); overflow: hidden; background: #080714; flex-shrink: 0;">
                ${avatar.svg}
              </div>
              <div>
                <strong>${s.fullName} ${isCur ? '<span class="pixel-badge" style="background: rgba(0,245,212,0.2); color: var(--neon-cyan); font-size: 7px;">TY</span>' : ''}</strong>
                <div style="font-family: var(--font-retro); font-size: 13px; color: var(--text-dim);">@${s.username}</div>
              </div>
            </div>
          </td>
          <td>
            <span class="pixel-badge" style="background: ${s.studentClass === '9.A' ? 'rgba(0,245,212,0.2)' : 'rgba(255,0,127,0.2)'}; color: ${s.studentClass === '9.A' ? 'var(--neon-cyan)' : 'var(--neon-pink)'};">
              ${s.studentClass || '9.A'}
            </span>
          </td>
          <td>
            <span style="font-size: 13px; color: #fff;">Lvl ${lvl.lvl}: ${lvl.title}</span>
            ${titleLabel}
          </td>
          <td style="font-family: var(--font-arcade); font-size: 11px; color: var(--neon-green);">
            ${s.xp || 0} XP
          </td>
          <td>
            <span style="color: var(--neon-cyan); font-family: var(--font-retro); font-size: 15px;">${solvedCount} / 500</span>
          </td>
        </tr>
      `;
    });

    html += `</tbody></table>`;
    listContainer.innerHTML = html;
  }

  // =========================================================================
  // SCREEN: SOUBOJ TŘÍD (9.A VS 9.B BATTLE)
  // =========================================================================
  renderBattleScreen() {
    const disabledBanner = document.getElementById('battleDisabledBanner');
    const activeContainer = document.getElementById('battleActiveContainer');

    if (!this.competitionEnabled) {
      if (disabledBanner) disabledBanner.style.display = 'block';
      if (activeContainer) activeContainer.style.display = 'none';
      return;
    }

    if (disabledBanner) disabledBanner.style.display = 'none';
    if (activeContainer) activeContainer.style.display = 'block';

    const allStudents = this.getUsers().filter(u => u.role === 'student');
    const students9A = allStudents.filter(s => s.studentClass === '9.A');
    const students9B = allStudents.filter(s => s.studentClass === '9.B');

    const totalXp9A = students9A.reduce((sum, s) => sum + (s.xp || 0), 0);
    const totalXp9B = students9B.reduce((sum, s) => sum + (s.xp || 0), 0);

    const totalSolved9A = students9A.reduce((sum, s) => sum + Object.keys(s.completedQuestions || {}).length, 0);
    const totalSolved9B = students9B.reduce((sum, s) => sum + Object.keys(s.completedQuestions || {}).length, 0);

    const avgXp9A = students9A.length ? Math.round(totalXp9A / students9A.length) : 0;
    const avgXp9B = students9B.length ? Math.round(totalXp9B / students9B.length) : 0;

    // Display numbers
    document.getElementById('battleXp9A').innerText = `${totalXp9A} XP`;
    document.getElementById('battleXp9B').innerText = `${totalXp9B} XP`;

    document.getElementById('battleDetails9A').innerHTML = `
      <div>Aktivních bojovníků: <strong style="color: #fff;">${students9A.length}</strong></div>
      <div>Průměr na žáka: <strong style="color: var(--neon-cyan);">${avgXp9A} XP</strong></div>
      <div>Celkem splněných úloh: <strong style="color: var(--neon-green);">${totalSolved9A}</strong></div>
    `;

    document.getElementById('battleDetails9B').innerHTML = `
      <div>Aktivních bojovníků: <strong style="color: #fff;">${students9B.length}</strong></div>
      <div>Průměr na žáka: <strong style="color: var(--neon-pink);">${avgXp9B} XP</strong></div>
      <div>Celkem splněných úloh: <strong style="color: var(--neon-green);">${totalSolved9B}</strong></div>
    `;

    // Calculate ratio bar
    const sumXp = totalXp9A + totalXp9B;
    let pct9A = 50;
    let pct9B = 50;
    if (sumXp > 0) {
      pct9A = Math.round((totalXp9A / sumXp) * 100);
      pct9B = 100 - pct9A;
    }

    document.getElementById('battlePct9A').innerText = `${pct9A}%`;
    document.getElementById('battlePct9B').innerText = `${pct9B}%`;
    document.getElementById('battleBar9A').style.width = `${pct9A}%`;
    document.getElementById('battleBar9B').style.width = `${pct9B}%`;

    const leadMsg = document.getElementById('battleLeadingMessage');
    if (totalXp9A > totalXp9B) {
      leadMsg.innerHTML = `🔥 TŘÍDA 9.A VEDE O ${totalXp9A - totalXp9B} XP BODŮ!`;
      leadMsg.style.color = 'var(--neon-cyan)';
    } else if (totalXp9B > totalXp9A) {
      leadMsg.innerHTML = `🔥 TŘÍDA 9.B VEDE O ${totalXp9B - totalXp9A} XP BODŮ!`;
      leadMsg.style.color = 'var(--neon-pink)';
    } else {
      leadMsg.innerHTML = `⚔️ Bitva je naprosto vyrovnaná! Obě třídy mají shodné skóre.`;
      leadMsg.style.color = 'var(--neon-yellow)';
    }

    // Top MVPs
    const topList9A = [...students9A].sort((a, b) => (b.xp || 0) - (a.xp || 0)).slice(0, 3);
    const topList9B = [...students9B].sort((a, b) => (b.xp || 0) - (a.xp || 0)).slice(0, 3);

    const renderMvpList = (list, colorVar) => {
      if (list.length === 0) return `<div style="color: var(--text-dim); font-size: 13px;">Zatím žádní žáci.</div>`;
      let res = '';
      list.forEach((st, idx) => {
        const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉';
        res += `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #090818; border-radius: 6px; margin-bottom: 6px; border-left: 3px solid ${colorVar};">
            <span style="font-size: 13px; color: #fff;">${medal} ${st.fullName}</span>
            <span style="font-family: var(--font-arcade); font-size: 10px; color: ${colorVar};">${st.xp || 0} XP</span>
          </div>
        `;
      });
      return res;
    };

    document.getElementById('battleMvp9A').innerHTML = renderMvpList(topList9A, 'var(--neon-cyan)');
    document.getElementById('battleMvp9B').innerHTML = renderMvpList(topList9B, 'var(--neon-pink)');
  }

  // =========================================================================
  // ANONYMOUS MODE FOR STUDENTS (NO PERSISTENCE, NO CLASS SELECTION)
  // =========================================================================
  startAnonymousSession() {
    window.retroAudio.playClick();
    const anonUser = {
      id: 'user_anonymous',
      username: 'anonym_host',
      fullName: 'Anonymní Žák',
      role: 'student',
      studentClass: null, // Bez volby třídy!
      avatarId: 'avatar_pixel_cadet',
      xp: 0,
      inventory: ['avatar_pixel_cadet'],
      completedQuestions: {},
      streak: 0,
      isAnonymous: true // Flag that no achievements or data will be saved
    };

    this.loginUser(anonUser);
  }
}

// Global initialization
window.app = new CermatArcadeApp();
window.addEventListener('DOMContentLoaded', () => {
  window.app.start();
});
