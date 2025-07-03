import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'
import { giveService } from '../services/giveService'
import { 
  Trophy, 
  Users, 
  Gift, 
  TrendingUp,
  Calendar,
  Award
} from 'lucide-react'
import toast from 'react-hot-toast'
import { FaTrophy } from 'react-icons/fa'

const Dashboard = () => {
  const { user } = useAuth()
  const [userStats, setUserStats] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [lastWeekLeaderboard, setLastWeekLeaderboard] = useState([])
  const [givesStats, setGivesStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      // Fetch all gives and aggregate by user
      const [statsRes, givesRes, givesStatsRes] = await Promise.all([
        authService.getUserStats(),
        giveService.getAllGives(),
        giveService.getStats()
      ])
      setUserStats(statsRes.data)
      setGivesStats(givesStatsRes.data)
      // Aggregate gives per user (all time)
      const gives = givesRes.data.results || givesRes.data
      const userMap = {}
      gives.forEach(give => {
        const u = give.user
        if (!u) return
        if (!userMap[u.id]) {
          userMap[u.id] = {
            id: u.id,
            first_name: u.first_name || u.username || '',
            last_name: u.last_name || '',
            profile_picture: u.profile_picture || null,
            total_gives: 0
          }
        }
        userMap[u.id].total_gives += 1
      })
      const leaderboardArr = Object.values(userMap).sort((a, b) => b.total_gives - a.total_gives)
      setLeaderboard(leaderboardArr)
      // Aggregate gives per user (last 7 days)
      const now = new Date()
      const weekAgo = new Date(now)
      weekAgo.setDate(now.getDate() - 7)
      const lastWeekGives = gives.filter(give => {
        if (!give.created_at) return false
        const created = new Date(give.created_at)
        return created >= weekAgo && created <= now
      })
      const weekUserMap = {}
      lastWeekGives.forEach(give => {
        const u = give.user
        if (!u) return
        if (!weekUserMap[u.id]) {
          weekUserMap[u.id] = {
            id: u.id,
            first_name: u.first_name || u.username || '',
            last_name: u.last_name || '',
            profile_picture: u.profile_picture || null,
            total_gives: 0
          }
        }
        weekUserMap[u.id].total_gives += 1
      })
      const weekLeaderboardArr = Object.values(weekUserMap).sort((a, b) => b.total_gives - a.total_gives)
      setLastWeekLeaderboard(weekLeaderboardArr)
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Award className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-sm font-medium text-gray-500">#{rank}</span>
    }
  }

  // Prepare top3/rest for both leaderboards
  const top3All = Array.isArray(leaderboard) ? leaderboard.slice(0, 3) : [];
  const restAll = Array.isArray(leaderboard) ? leaderboard.slice(3) : [];
  const top3Week = Array.isArray(lastWeekLeaderboard) ? lastWeekLeaderboard.slice(0, 3) : [];
  const restWeek = Array.isArray(lastWeekLeaderboard) ? lastWeekLeaderboard.slice(3) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.first_name || user?.username}!
        </h1>
        <p className="text-primary-100">
          Manage your referrals and track your contributions to the community.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 ml-3 my-2">
              <Gift className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Gives</p>
              <p className="text-2xl font-bold text-gray-900">{userStats?.total_gives || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 ml-3 my-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">{userStats?.last_week_gives || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 ml-3 my-2">
              <Trophy className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Your Rank</p>
              <p className="text-2xl font-bold text-gray-900">#{userStats?.rank || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 ml-3 my-2">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Gives</p>
              <p className="text-2xl font-bold text-gray-900">{givesStats?.active_gives || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* All-Time Leaders */}
        <div className="relative bg-[#dbeafe] rounded-xl p-4 text-gray-900 overflow-hidden border border-blue-100 shadow-sm">
          {/* Confetti (simple) */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute left-1/4 top-4 w-1.5 h-1.5 bg-green-300 rounded-full animate-bounce" />
            <div className="absolute right-1/3 top-10 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-bounce" />
            <div className="absolute left-1/2 top-1/2 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" />
            <div className="absolute right-1/4 bottom-8 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
          </div>
          <h2 className="text-lg font-bold text-center mb-4 relative z-10">All-Time Leaders</h2>
          {/* Podium for Top 3 */}
          <div className="flex justify-center items-end gap-4 mb-4 relative z-10">
            {/* 2nd Place */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-gray-200 border-2 border-primary-200 overflow-hidden mb-1 flex items-center justify-center">
                {top3All[1]?.profile_picture ? (
                  <img src={top3All[1].profile_picture} alt="2nd" className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-7 h-7 text-gray-400" />
                )}
              </div>
              <span className="font-bold text-base text-gray-800 text-center">{top3All[1]?.first_name} {top3All[1]?.last_name}</span>
              <span className="text-primary-400 text-xs">{top3All[1]?.total_gives || 0} GV</span>
              <div className="w-10 h-8" style={{ background: '#FFD54F', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                <span className="text-lg font-bold text-gray-800 flex items-center justify-center h-full">2</span>
              </div>
            </div>
            {/* 1st Place */}
            <div className="flex flex-col items-center">
              <FaTrophy className="text-yellow-400 text-xl mb-1" />
              <div className="w-16 h-16 rounded-full bg-gray-200 border-2 border-yellow-300 overflow-hidden mb-1 flex items-center justify-center">
                {top3All[0]?.profile_picture ? (
                  <img src={top3All[0].profile_picture} alt="1st" className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-9 h-9 text-gray-400" />
                )}
              </div>
              <span className="font-bold text-lg text-gray-900 text-center">{top3All[0]?.first_name} {top3All[0]?.last_name}</span>
              <span className="text-yellow-600 text-sm">{top3All[0]?.total_gives || 0} GV</span>
              <div className="w-12 h-14" style={{ background: '#2196F3', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                <span className="text-xl font-bold text-white flex items-center justify-center h-full">1</span>
              </div>
            </div>
            {/* 3rd Place */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-gray-200 border-2 border-primary-200 overflow-hidden mb-1 flex items-center justify-center">
                {top3All[2]?.profile_picture ? (
                  <img src={top3All[2].profile_picture} alt="3rd" className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-7 h-7 text-gray-400" />
                )}
              </div>
              <span className="font-bold text-base text-gray-800 text-center">{top3All[2]?.first_name} {top3All[2]?.last_name}</span>
              <span className="text-primary-400 text-xs">{top3All[2]?.total_gives || 0} GV</span>
              <div className="w-10 h-8" style={{ background: '#FF8A65', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                <span className="text-lg font-bold text-white flex items-center justify-center h-full">3</span>
              </div>
            </div>
          </div>
          {/* Rest of the leaderboard */}
          <div className="bg-white rounded-xl p-2 max-w-xs mx-auto shadow relative z-10">
            {restAll.length === 0 && (
              <p className="text-center text-gray-400 py-4">No data available</p>
            )}
            {restAll.map((user, idx) => (
              <div key={user.id} className="flex items-center gap-3 py-1 border-b last:border-b-0">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                  {user.profile_picture ? (
                    <img src={user.profile_picture} alt={user.first_name} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <span className="font-bold text-gray-800 flex-1 text-sm">{user.first_name} {user.last_name}</span>
                <span className="text-gray-500 text-xs">{user.total_gives} Gives</span>
              </div>
            ))}
          </div>
        </div>
        {/* Last Week Leaders */}
        <div className="relative bg-[#dbeafe] rounded-xl p-4 text-gray-900 overflow-hidden border border-blue-100 shadow-sm">
          {/* Confetti (simple) */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute left-1/4 top-4 w-1.5 h-1.5 bg-green-300 rounded-full animate-bounce" />
            <div className="absolute right-1/3 top-10 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-bounce" />
            <div className="absolute left-1/2 top-1/2 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" />
            <div className="absolute right-1/4 bottom-8 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
          </div>
          <h2 className="text-lg font-bold text-center mb-4 relative z-10">Last Week's Top Contributors</h2>
          {/* Podium for Top 3 */}
          <div className="flex justify-center items-end gap-4 mb-4 relative z-10">
            {/* 2nd Place */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-gray-200 border-2 border-primary-200 overflow-hidden mb-1 flex items-center justify-center">
                {top3Week[1]?.profile_picture ? (
                  <img src={top3Week[1].profile_picture} alt="2nd" className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-7 h-7 text-gray-400" />
                )}
              </div>
              <span className="font-bold text-base text-gray-800 text-center">{top3Week[1]?.first_name} {top3Week[1]?.last_name}</span>
              <span className="text-primary-400 text-xs">{top3Week[1]?.total_gives || 0} GV</span>
              <div className="w-10 h-8" style={{ background: '#FFD54F', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                <span className="text-lg font-bold text-gray-800 flex items-center justify-center h-full">2</span>
              </div>
            </div>
            {/* 1st Place */}
            <div className="flex flex-col items-center">
              <FaTrophy className="text-yellow-400 text-xl mb-1" />
              <div className="w-16 h-16 rounded-full bg-gray-200 border-2 border-yellow-300 overflow-hidden mb-1 flex items-center justify-center">
                {top3Week[0]?.profile_picture ? (
                  <img src={top3Week[0].profile_picture} alt="1st" className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-9 h-9 text-gray-400" />
                )}
              </div>
              <span className="font-bold text-lg text-gray-900 text-center">{top3Week[0]?.first_name} {top3Week[0]?.last_name}</span>
              <span className="text-yellow-600 text-sm">{top3Week[0]?.total_gives || 0} GV</span>
              <div className="w-12 h-14" style={{ background: '#2196F3', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                <span className="text-xl font-bold text-white flex items-center justify-center h-full">1</span>
              </div>
            </div>
            {/* 3rd Place */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-gray-200 border-2 border-primary-200 overflow-hidden mb-1 flex items-center justify-center">
                {top3Week[2]?.profile_picture ? (
                  <img src={top3Week[2].profile_picture} alt="3rd" className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-7 h-7 text-gray-400" />
                )}
              </div>
              <span className="font-bold text-base text-gray-800 text-center">{top3Week[2]?.first_name} {top3Week[2]?.last_name}</span>
              <span className="text-primary-400 text-xs">{top3Week[2]?.total_gives || 0} GV</span>
              <div className="w-10 h-8" style={{ background: '#FF8A65', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                <span className="text-lg font-bold text-white flex items-center justify-center h-full">3</span>
              </div>
            </div>
          </div>
          {/* Rest of the leaderboard */}
          <div className="bg-white rounded-xl p-2 max-w-xs mx-auto shadow relative z-10">
            {restWeek.length === 0 && (
              <p className="text-center text-gray-400 py-4">No data available</p>
            )}
            {restWeek.map((user, idx) => (
              <div key={user.id} className="flex items-center gap-3 py-1 border-b last:border-b-0">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                  {user.profile_picture ? (
                    <img src={user.profile_picture} alt={user.first_name} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <span className="font-bold text-gray-800 flex-1 text-sm">{user.first_name} {user.last_name}</span>
                <span className="text-gray-500 text-xs">{user.total_gives} Gives</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Stats */}
      {givesStats?.category_stats && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">Gives by Category</h2>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(givesStats.category_stats).map(([category, count]) => (
                <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-primary-600">{count}</p>
                  <p className="text-sm text-gray-600 capitalize">{category.replace('_', ' ')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard 