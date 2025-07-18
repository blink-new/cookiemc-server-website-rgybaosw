import { useState } from 'react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar'
import { Badge } from './components/ui/badge'
import { Separator } from './components/ui/separator'
import { toast } from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'
import { 
  Copy, 
  User, 
  Coins, 
  Crown, 
  CreditCard, 
  Tag, 
  LogIn, 
  UserPlus,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react'

interface User {
  id: string
  username: string
  avatar: string
  coins: number
  rank: string
  rankColor: string
}

interface Payment {
  id: string
  amount: number
  item: string
  date: string
  status: 'completed' | 'pending' | 'failed'
  playerName: string
  playerSkin: string
}

const minecraftSkins = [
  'https://mc-heads.net/avatar/steve/64',
  'https://mc-heads.net/avatar/alex/64',
  'https://mc-heads.net/avatar/notch/64',
  'https://mc-heads.net/avatar/jeb_/64',
  'https://mc-heads.net/avatar/dinnerbone/64',
  'https://mc-heads.net/avatar/grumm/64'
]

// Mock registered users database
const registeredUsers = [
  { username: 'steve123', password: 'password123' },
  { username: 'alex456', password: 'mypass456' },
  { username: 'notch', password: 'minecraft' }
]

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [selectedSkin, setSelectedSkin] = useState(minecraftSkins[0])
  const [showPassword, setShowPassword] = useState(false)
  const [showRegPassword, setShowRegPassword] = useState(false)
  const [discountCode, setDiscountCode] = useState('')
  const [currentPage, setCurrentPage] = useState('home')
  
  // Mock data with player skins and names - only show if someone bought something
  const mockPayments: Payment[] = [
    { 
      id: '1', 
      amount: 9.99, 
      item: 'VIP Rank', 
      date: '2024-01-15', 
      status: 'completed',
      playerName: 'CookieKing',
      playerSkin: 'https://mc-heads.net/avatar/steve/24'
    },
    { 
      id: '2', 
      amount: 4.99, 
      item: '1000 Coins', 
      date: '2024-01-10', 
      status: 'completed',
      playerName: 'SweetWarrior',
      playerSkin: 'https://mc-heads.net/avatar/alex/24'
    },
    { 
      id: '3', 
      amount: 19.99, 
      item: 'Premium Kit', 
      date: '2024-01-05', 
      status: 'completed',
      playerName: 'ChocolateNinja',
      playerSkin: 'https://mc-heads.net/avatar/notch/24'
    },
    { 
      id: '4', 
      amount: 14.99, 
      item: 'MVP Rank', 
      date: '2024-01-03', 
      status: 'completed',
      playerName: 'CandyCrusher',
      playerSkin: 'https://mc-heads.net/avatar/jeb_/24'
    },
    { 
      id: '5', 
      amount: 7.99, 
      item: 'Special Kit', 
      date: '2024-01-01', 
      status: 'completed',
      playerName: 'BiscuitBeast',
      playerSkin: 'https://mc-heads.net/avatar/dinnerbone/24'
    }
  ]

  // Only show payments that are completed (someone actually bought something)
  const completedPayments = mockPayments.filter(payment => payment.status === 'completed')

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard!`, {
      duration: 2000,
      style: {
        background: '#D2691E',
        color: 'white',
      },
    })
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    
    // Check if user exists and password is correct
    const foundUser = registeredUsers.find(u => u.username === username)
    
    if (!foundUser) {
      toast.error('Account does not exist! Please register first.', {
        style: {
          background: '#DC143C',
          color: 'white',
        },
      })
      return
    }
    
    if (foundUser.password !== password) {
      toast.error('Incorrect password!', {
        style: {
          background: '#DC143C',
          color: 'white',
        },
      })
      return
    }
    
    // Login successful
    setUser({
      id: '1',
      username,
      avatar: selectedSkin,
      coins: 2500,
      rank: 'VIP',
      rankColor: '#FFD700'
    })
    setIsLoginOpen(false)
    toast.success(`Welcome back, ${username}!`, {
      style: {
        background: '#D2691E',
        color: 'white',
      },
    })
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    
    if (username && password) {
      // Add to registered users (in real app, this would be saved to database)
      registeredUsers.push({ username, password })
      
      setUser({
        id: '2',
        username,
        avatar: selectedSkin,
        coins: 100,
        rank: 'Member',
        rankColor: '#90EE90'
      })
      setIsRegisterOpen(false)
      toast.success(`Account created! Welcome, ${username}!`, {
        style: {
          background: '#D2691E',
          color: 'white',
        },
      })
    }
  }

  const handleDiscountCode = () => {
    if (discountCode.toLowerCase() === 'nightermc') {
      toast.success('Discount code applied! 50% off your next purchase!', {
        duration: 3000,
        style: {
          background: '#228B22',
          color: 'white',
        },
      })
      setDiscountCode('')
    } else {
      toast.error('Invalid discount code!', {
        style: {
          background: '#DC143C',
          color: 'white',
        },
      })
    }
  }

  const logout = () => {
    setUser(null)
    setCurrentPage('home')
    toast.success('Logged out successfully!', {
      style: {
        background: '#D2691E',
        color: 'white',
      },
    })
  }

  // Render different pages
  const renderPage = () => {
    if (currentPage === 'coins') {
      return (
        <Card className="border-4 border-orange-300 shadow-2xl bg-gradient-to-br from-orange-50 to-yellow-50">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-4xl font-bold text-orange-800 mb-2">
              <Coins className="w-12 h-12 mx-auto mb-4" />
              Coins
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-6">🪙</div>
            <h2 className="text-2xl font-bold text-orange-800 mb-4">No Coins Available</h2>
            <p className="text-orange-600 text-lg">Check back later for coin packages!</p>
            <Button 
              onClick={() => setCurrentPage('home')}
              className="mt-6 minecraft-button text-white font-semibold"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      )
    }

    if (currentPage === 'ranks') {
      return (
        <Card className="border-4 border-orange-300 shadow-2xl bg-gradient-to-br from-orange-50 to-yellow-50">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-4xl font-bold text-orange-800 mb-2">
              <Crown className="w-12 h-12 mx-auto mb-4" />
              Ranks
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-6">👑</div>
            <h2 className="text-2xl font-bold text-orange-800 mb-4">No Ranks Available</h2>
            <p className="text-orange-600 text-lg">Check back later for rank upgrades!</p>
            <Button 
              onClick={() => setCurrentPage('home')}
              className="mt-6 minecraft-button text-white font-semibold"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      )
    }

    // Home page content
    return (
      <Card className="border-4 border-orange-300 shadow-2xl bg-gradient-to-br from-orange-50 to-yellow-50 mb-12">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-4xl font-bold text-orange-800 mb-2">
            About 🍪CookieMc🍪
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-orange max-w-none px-8 pb-8">
          <div className="text-orange-700 leading-relaxed space-y-6">
            <p className="text-lg font-medium">
              🍪 Welcome to CookieMC — the sweetest Lifesteal experience in Minecraft! More than just a server, CookieMC is where adventure meets chaos, strategy meets skill, and cookies meet combat. Built on a foundation of community, competitiveness, and creativity, our Lifesteal SMP is the perfect battleground for players who love high-stakes PvP and an active, evolving world.
            </p>
            
            <p>
              In our server, every hit counts — lose a fight, lose a heart; win, and steal theirs. Whether you're fighting for glory, defending your base, or forming alliances, every decision shapes your journey. CookieMC isn't just about gameplay — it's about becoming part of a thriving, tight-knit community that grows and evolves with you.
            </p>
            
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-orange-800 mb-6 text-center">
                🍬 What Sets CookieMC Apart?
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border-2 border-orange-200 bg-white/70 shadow-md">
                  <CardContent className="p-4">
                    <h4 className="font-bold text-orange-800 mb-2">❤️ Authentic Lifesteal Mechanics</h4>
                    <p className="text-sm">Every PvP battle matters. Hearts are currency, and survival is the goal.</p>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-orange-200 bg-white/70 shadow-md">
                  <CardContent className="p-4">
                    <h4 className="font-bold text-orange-800 mb-2">🏆 Unique Ranks & Perks</h4>
                    <p className="text-sm">From casual explorers to hardcore warriors, our custom ranks offer something for everyone — cosmetics, commands, boosters, and exclusive features.</p>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-orange-200 bg-white/70 shadow-md">
                  <CardContent className="p-4">
                    <h4 className="font-bold text-orange-800 mb-2">🌐 Player-Focused Development</h4>
                    <p className="text-sm">We listen. Community feedback directly impacts the future of CookieMC. You speak, we build.</p>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-orange-200 bg-white/70 shadow-md">
                  <CardContent className="p-4">
                    <h4 className="font-bold text-orange-800 mb-2">🍪 Seasonal Content & Events</h4>
                    <p className="text-sm">Regularly refreshed content, limited-time events, custom challenges, and more — boredom doesn't stand a chance here.</p>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-orange-200 bg-white/70 shadow-md">
                  <CardContent className="p-4">
                    <h4 className="font-bold text-orange-800 mb-2">⚙️ Lag-Free Performance</h4>
                    <p className="text-sm">Hosted on powerful servers, we prioritize smooth gameplay so you can focus on the fun (and the fight).</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-orange-800 mb-4">
                🛍️ Why Support the CookieMC Store?
              </h3>
              
              <p className="mb-6">
                This isn't pay-to-win. Supporting the store means supporting a project driven by passion, maintained with love, and built for its players. Your purchases help us fund better hardware, push frequent updates, run exciting community events, and continue offering the best possible experience to every player — new or veteran.
              </p>
            </div>
            
            <Card className="border-3 border-orange-400 bg-gradient-to-r from-orange-200 to-yellow-200 shadow-lg">
              <CardContent className="p-6 text-center">
                <h3 className="text-2xl font-bold text-orange-800 mb-4">
                  📢 Join the CookieMC Family Today!
                </h3>
                <p className="mb-4">
                  Whether you're here to dominate duels, rise through the ranks, or just vibe in a world full of cookies and chaos, CookieMC welcomes you. From our wild PvP fights to cozy community hangouts, there's always something sweet going on.
                </p>
                <p className="font-semibold text-orange-800 text-lg">
                  Thanks for making CookieMC the awesome place it is. We couldn't do it without you 💙
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                  <Button 
                    onClick={() => copyToClipboard('cookiemc.vaulthosting.in', 'Server IP')}
                    size="lg"
                    className="minecraft-button text-white font-bold text-lg px-8 py-3"
                  >
                    <Copy className="w-5 h-5 mr-2" />
                    Copy Server IP
                  </Button>
                  <Button 
                    onClick={() => window.open('https://discord.gg/r9km3pQV', '_blank')}
                    size="lg"
                    variant="outline"
                    className="border-2 border-orange-400 text-orange-700 hover:bg-orange-50 font-bold text-lg px-8 py-3"
                  >
                    Join Discord
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen cookie-gradient overflow-y-auto">
      <Toaster position="top-right" />
      
      {/* Left Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-gray-100 to-gray-200 border-r-4 border-gray-300 shadow-xl z-10 overflow-y-auto">
        <div className="p-6 space-y-6">
          
          {/* Login Section */}
          <Card className="border-2 border-gray-300 shadow-lg bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <User className="w-5 h-5" />
                Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!user ? (
                <div className="space-y-3">
                  <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full minecraft-button text-white font-semibold">
                        <LogIn className="w-4 h-4 mr-2" />
                        Login
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-orange-800">Login to CookieMC</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-orange-700">Choose Your Skin</label>
                          <div className="grid grid-cols-3 gap-2">
                            {minecraftSkins.map((skin, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => setSelectedSkin(skin)}
                                className={`p-2 rounded border-2 minecraft-skin ${
                                  selectedSkin === skin ? 'border-orange-500 bg-orange-100' : 'border-gray-300'
                                }`}
                              >
                                <img src={skin} alt={`Skin ${index + 1}`} className="w-8 h-8 mx-auto" />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Input
                            name="username"
                            placeholder="IGN (In-Game Name)"
                            required
                            className="border-orange-300 focus:border-orange-500"
                          />
                        </div>
                        <div className="relative">
                          <Input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            required
                            className="border-orange-300 focus:border-orange-500 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <Button type="submit" className="w-full minecraft-button text-white font-semibold">
                          Login
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Register
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-orange-800">Join CookieMC</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-orange-700">Choose Your Profile Picture</label>
                          <div className="grid grid-cols-3 gap-2">
                            {minecraftSkins.map((skin, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => setSelectedSkin(skin)}
                                className={`p-2 rounded border-2 minecraft-skin ${
                                  selectedSkin === skin ? 'border-orange-500 bg-orange-100' : 'border-gray-300'
                                }`}
                              >
                                <img src={skin} alt={`Skin ${index + 1}`} className="w-8 h-8 mx-auto" />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Input
                            name="username"
                            placeholder="Choose Username"
                            required
                            className="border-orange-300 focus:border-orange-500"
                          />
                        </div>
                        <div className="relative">
                          <Input
                            name="password"
                            type={showRegPassword ? "text" : "password"}
                            placeholder="Create Password"
                            required
                            className="border-orange-300 focus:border-orange-500 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegPassword(!showRegPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          >
                            {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <Button type="submit" className="w-full minecraft-button text-white font-semibold">
                          Create Account
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8 border-2 border-gray-300">
                      <AvatarImage src={user.avatar} className="minecraft-skin" />
                      <AvatarFallback>{user.username[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{user.username}</p>
                      <Badge style={{ backgroundColor: user.rankColor }} className="text-white text-xs">
                        {user.rank}
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    onClick={logout}
                    variant="outline" 
                    size="sm" 
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Logout
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Coins & Ranks - Always visible, clickable */}
          <Card className="border-2 border-gray-300 shadow-lg bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Coins className="w-5 h-5" />
                Coins & Ranks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => setCurrentPage('coins')}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 justify-start"
              >
                <Coins className="w-4 h-4 mr-2" />
                View Coins
              </Button>
              <Button
                onClick={() => setCurrentPage('ranks')}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 justify-start"
              >
                <Crown className="w-4 h-4 mr-2" />
                View Ranks
              </Button>
            </CardContent>
          </Card>

          {/* Recent Payments - Only show if there are completed payments */}
          {completedPayments.length > 0 && (
            <Card className="border-2 border-gray-300 shadow-lg bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <CreditCard className="w-5 h-5" />
                  Recent Payments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2 justify-center">
                  {completedPayments.slice(0, 8).map((payment) => (
                    <div key={payment.id} className="flex flex-col items-center">
                      <img 
                        src={payment.playerSkin} 
                        alt={payment.playerName}
                        className="w-6 h-6 minecraft-skin border border-gray-300 rounded"
                      />
                      <span className="text-xs text-gray-600 mt-1 max-w-[50px] truncate">
                        {payment.playerName}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Discount Code - Always visible */}
          <Card className="border-2 border-gray-300 shadow-lg bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Tag className="w-5 h-5" />
                Discount Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Input
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="Enter code (try: nightermc)"
                  className="border-gray-300 focus:border-orange-500"
                />
                <Button 
                  onClick={handleDiscountCode}
                  className="w-full minecraft-button text-white font-semibold"
                  disabled={!discountCode}
                >
                  Apply Code
                </Button>
              </div>
              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                💡 Use code "nightermc" for 50% off!
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-80 min-h-screen">
        {/* Header Banner */}
        <header className="cookie-gradient border-b-4 border-orange-400 shadow-lg">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              {/* Server IP - Left Side - Tiny Box */}
              <div className="bg-white/90 rounded-lg border-2 border-white shadow-md px-3 py-2">
                <div className="flex items-center gap-2">
                  <img 
                    src="https://static.wikia.nocookie.net/minecraft_gamepedia/images/2/2d/Plains_Grass_Block.png" 
                    alt="Minecraft Logo" 
                    className="w-5 h-5 minecraft-skin"
                  />
                  <div>
                    <p className="text-xs text-orange-700 font-medium">Server IP:</p>
                    <p className="text-sm font-bold text-orange-800">cookiemc.vaulthosting.in</p>
                  </div>
                  <Button
                    onClick={() => copyToClipboard('cookiemc.vaulthosting.in', 'Server IP')}
                    size="sm"
                    className="minecraft-button text-white text-xs px-2 py-1"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* CookieMC Logo - Center - Smaller */}
              <div className="text-center">
                <img 
                  src="https://dunb17ur4ymx4.cloudfront.net/webstore/logos/9a6b330d3562ceea74782a8b93a0505c15a8305c.png" 
                  alt="CookieMC Logo" 
                  className="w-20 h-20 mx-auto rounded-lg shadow-lg border-4 border-white"
                />
              </div>

              {/* Discord - Right Side - Tiny Box */}
              <div className="bg-white/90 rounded-lg border-2 border-white shadow-md px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-orange-700 font-medium">Discord:</p>
                    <p className="text-sm font-bold text-orange-800">Join us!</p>
                  </div>
                  <Button
                    onClick={() => copyToClipboard('https://discord.gg/r9km3pQV', 'Discord invite')}
                    size="sm"
                    className="minecraft-button text-white text-xs px-2 py-1"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area - Scrollable */}
        <main className="container mx-auto px-6 py-12">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}

export default App