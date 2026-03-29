// Tokemoji MVP data management (localStorage)

const TOKENS = ["EVIL","LIKE","FEAR","LOVE","HATE","HAPPY","MAD","GOOD","OMG","GREED","LOL","SAD"];

const DEFAULT_STATE = {
  season: 1,
  week: 1,
  postOfTheDay: {
    date: new Date().toISOString().split('T')[0],
    ranking: ["HAPPY", "FEAR", "GREED"],
    reason: "News about market optimism boosted HAPPY; fear spread due to regulatory talks; greed remains high.",
    image: "assets/img/stock-post-of-day.png",
    matchups: ["GREED vs FEAR", "GOOD vs EVIL"]
  },
  quests: [
    {
      id: "rt-quote",
      type: "RT_QUOTE",
      title: "Retweet or Quote",
      description: "Retweet or Quote today's Post of the Day on X.",
      xp: { rt: 50, quote: 100 },
      requiresXHandle: true,
      completed: false,
      proof: null
    },
    {
      id: "vote-matchup",
      type: "VOTE_MATCHUP",
      title: "Pick the Winning Emotion",
      description: "Vote in today's matchup: GREED vs FEAR. Which will dominate this week?",
      xp: 75,
      completed: false,
      vote: null
    },
    {
      id: "read-mood",
      type: "READ_MOOD",
      title: "Read the Mood Report",
      description: "Read today's short mood report on the site.",
      xp: 25,
      completed: false
    }
  ],
  leaderboard: generateSampleLeaderboard(100),
  prediction: {
    week: 1,
    votes: {},
    resultsRevealed: false,
    winner: null,
    sentimentWireScore: {
      emotion: "HAPPY",
      score: 0.35
    }
  }
};

function generateSampleLeaderboard(count) {
  const names = ["CryptoKing","EmoTrader","MemeLord","HODLer","MoonShot","FOMOster","RugPull","WhaleWatcher","SatoshiFan","DegenDave"];
  const arr = [];
  for (let i = 0; i < count; i++) {
    const activity = Math.floor(Math.random() * 10000);
    const holder = Math.floor(Math.random() * 10000);
    arr.push({
      rank: 0,
      username: names[i % names.length] + (i > 9 ? i : ""),
      activityScore: activity,
      holderScore: holder,
      total: 0.5*activity + 0.5*holder
    });
  }
  arr.sort((a,b) => b.total - a.total);
  arr.forEach((p,i) => p.rank = i+1);
  return arr;
}

const STORAGE_KEY = "tokemoji_mvp_state";

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch (e) { console.error("Failed to parse state", e); }
  }
  saveState(DEFAULT_STATE);
  return DEFAULT_STATE;
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function updateState(partial) {
  const state = loadState();
  const newState = { ...state, ...partial };
  saveState(newState);
  return newState;
}

function completeQuest(questId, proof = null) {
  const state = loadState();
  const quest = state.quests.find(q => q.id === questId);
  if (!quest) return state;
  quest.completed = true;
  if (proof) quest.proof = proof;
  saveState(state);
  return state;
}

function castVote(emotion) {
  const state = loadState();
  state.prediction.votes[emotion] = (state.prediction.votes[emotion] || 0) + 1;
  state.prediction.userVote = emotion;
  saveState(state);
  return state;
}

function revealPrediction(winner) {
  const state = loadState();
  state.prediction.resultsRevealed = true;
  state.prediction.winner = winner;
  saveState(state);
  return state;
}
