import React, { useState } from 'react';
import { Calendar, Clock, Target, BookOpen, Plus, Trash2, Download } from 'lucide-react';

export default function PracticeLogApp() {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState({
    date: new Date().toISOString().split('T')[0],
    activity: '',
    duration: '',
    focus: '',
    notes: ''
  });
  const [showCelebration, setShowCelebration] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState('');

  const handleInputChange = (field, value) => {
    setCurrentSession(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getMotivationalMessage = (sessionCount) => {
    const messages = [
      "🌟 Awesome job! You're on fire!",
      "🎉 Amazing work! Keep it up!",
      "💪 You're crushing it! So proud!",
      "🚀 Fantastic! You're a superstar!",
      "✨ Brilliant! Practice makes perfect!",
      "🎯 Nailed it! You're getting better every day!",
      "🏆 Champion mindset! Keep going!",
      "⭐ Incredible! You're unstoppable!",
      "🎸 Rock star performance!",
      "🌈 Way to go! You're doing great!"
    ];

    if (sessionCount === 1) return "🎊 First session logged! This is the start of something great!";
    if (sessionCount === 5) return "🔥 5 sessions! You're building a strong habit!";
    if (sessionCount === 10) return "💎 10 sessions! You're a practice champion!";
    if (sessionCount % 7 === 0) return "🎯 A full week of practice! You're dedicated!";

    return messages[Math.floor(Math.random() * messages.length)];
  };

  const addSession = (e) => {
    e.preventDefault();
    if (currentSession.activity && currentSession.duration) {
      const newSession = { ...currentSession, id: Date.now() };
      setSessions(prev => {
        const updated = [...prev, newSession];
        setMotivationalMessage(getMotivationalMessage(updated.length));
        return updated;
      });

      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);

      setCurrentSession({
        date: new Date().toISOString().split('T')[0],
        activity: '',
        duration: '',
        focus: '',
        notes: ''
      });
    }
  };

  const removeSession = (id) => {
    setSessions(prev => prev.filter(session => session.id !== id));
  };

  const getWeekNumber = (date) => {
    const d = new Date(date);
    const startOfYear = new Date(d.getFullYear(), 0, 1);
    const days = Math.floor((d - startOfYear) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startOfYear.getDay() + 1) / 7);
  };

  const getTotalDuration = () => {
    return sessions.reduce((total, session) => total + parseFloat(session.duration || 0), 0);
  };

  const downloadLog = () => {
    const weekNum = getWeekNumber(new Date());
    const year = new Date().getFullYear();

    // Create HTML table with embedded styles for better Excel rendering
    let htmlContent = `
<html xmlns:x="urn:schemas-microsoft-com:office:excel">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; }
    .title {
      font-size: 18pt;
      font-weight: bold;
      text-align: center;
      margin: 20px 0 5px 0;
    }
    .subtitle {
      font-size: 12pt;
      text-align: center;
      margin: 0 0 20px 0;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 20px 0;
    }
    th {
      background-color: #4F46E5;
      color: white;
      font-weight: bold;
      padding: 12px 8px;
      text-align: left;
      border: 2px solid #312E81;
    }
    td {
      padding: 10px 8px;
      border: 1px solid #D1D5DB;
      vertical-align: top;
    }
    tr:nth-child(even) {
      background-color: #F9FAFB;
    }
    .summary {
      margin-top: 30px;
      font-size: 11pt;
    }
    .summary-title {
      font-weight: bold;
      font-size: 12pt;
      margin-bottom: 10px;
    }
    .date-col { width: 12%; }
    .day-col { width: 12%; }
    .activity-col { width: 40%; }
    .duration-col { width: 12%; }
    .signature-col { width: 24%; }
  </style>
</head>
<body>
  <div class="title">WEEKLY PRACTICE LOG</div>
  <div class="subtitle">Week ${weekNum}, ${year}</div>

  <table>
    <thead>
      <tr>
        <th class="date-col">Date</th>
        <th class="day-col">Day</th>
        <th class="activity-col">What I Practiced</th>
        <th class="duration-col">Duration</th>
        <th class="signature-col">Parent Signature</th>
      </tr>
    </thead>
    <tbody>`;

    // Table rows
    sessions.forEach((session) => {
      const sessionDate = new Date(session.date + 'T00:00:00');
      const dateStr = sessionDate.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
      const dayStr = sessionDate.toLocaleDateString('en-US', { weekday: 'long' });

      let activity = session.activity;
      if (session.focus) {
        activity += '<br><i>Focus: ' + session.focus + '</i>';
      }
      if (session.notes) {
        activity += '<br><small>Note: ' + session.notes + '</small>';
      }

      const durationStr = session.duration + ' hrs';

      htmlContent += `
      <tr>
        <td>${dateStr}</td>
        <td>${dayStr}</td>
        <td>${activity}</td>
        <td>${durationStr}</td>
        <td>&nbsp;</td>
      </tr>`;
    });

    htmlContent += `
    </tbody>
  </table>

  <div class="summary">
    <div class="summary-title">SUMMARY</div>
    <div>Total Practice Sessions: ${sessions.length}</div>
    <div>Total Practice Time: ${getTotalDuration()} hours</div>
  </div>
</body>
</html>`;

    // Create blob and download as HTML (Excel will open it with formatting)
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `practice-log-week${weekNum}-${year}.xls`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center animate-bounce max-w-sm mx-4">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-2xl font-bold text-indigo-600 mb-2">{motivationalMessage}</p>
            <div className="text-4xl">⭐✨🌟</div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BookOpen className="text-indigo-600 w-8 h-8" />
              <h1 className="text-3xl font-bold text-gray-800">Weekly Practice Log</h1>
            </div>
            {sessions.length > 0 && (
              <div className="text-right">
                <div className="text-sm text-gray-600">Total Sessions</div>
                <div className="text-3xl font-bold text-indigo-600">{sessions.length}</div>
              </div>
            )}
          </div>
          
          <form onSubmit={addSession} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  Date
                </label>
                <input
                  type="date"
                  value={currentSession.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4" />
                  Duration (hours)
                </label>
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  value={currentSession.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="1.5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Target className="w-4 h-4" />
                Activity
              </label>
              <input
                type="text"
                value={currentSession.activity}
                onChange={(e) => handleInputChange('activity', e.target.value)}
                placeholder="e.g., Piano scales, Basketball drills, Spanish vocabulary"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Focus Area (optional)
              </label>
              <input
                type="text"
                value={currentSession.focus}
                onChange={(e) => handleInputChange('focus', e.target.value)}
                placeholder="e.g., Improving speed, Working on technique"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Notes (optional)
              </label>
              <textarea
                value={currentSession.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Any observations, challenges, or achievements..."
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg text-lg"
            >
              <Plus className="w-6 h-6" />
              🎯 Log My Practice!
            </button>
          </form>
        </div>

        {sessions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">This Week's Log</h2>
                <p className="text-gray-600 mt-1">
                  {sessions.length} session{sessions.length !== 1 ? 's' : ''} • {getTotalDuration()} hours total
                </p>
              </div>
              <button
                onClick={downloadLog}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>

            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(session.date + 'T00:00:00').toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                        <span className="mx-1">•</span>
                        <Clock className="w-4 h-4" />
                        {session.duration} hours
                      </div>
                      <h3 className="font-semibold text-lg text-gray-800">{session.activity}</h3>
                      {session.focus && (
                        <p className="text-sm text-indigo-600 mt-1">Focus: {session.focus}</p>
                      )}
                      {session.notes && (
                        <p className="text-sm text-gray-600 mt-2">{session.notes}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeSession(session.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                      aria-label="Remove session"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
