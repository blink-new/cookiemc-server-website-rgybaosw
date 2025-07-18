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
}

const minecraftSkins = [
  'https://mc-heads.net/avatar/steve/64',
  'https://mc-heads.net/avatar/alex/64',
  'https://mc-heads.net/avatar/notch/64',
  'https://mc-heads.net/avatar/jeb_/64',
  'https://mc-heads.net/avatar/dinnerbone/64',
  'https://mc-heads.net/avatar/grumm/64'
]

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [selectedSkin, setSelectedSkin] = useState(minecraftSkins[0])
  const [showPassword, setShowPassword] = useState(false)
  const [showRegPassword, setShowRegPassword] = useState(false)
  const [discountCode, setDiscountCode] = useState('')
  
  // Mock data
  const mockPayments: Payment[] = [
    { id: '1', amount: 9.99, item: 'VIP Rank', date: '2024-01-15', status: 'completed' },
    { id: '2', amount: 4.99, item: '1000 Coins', date: '2024-01-10', status: 'completed' },
    { id: '3', amount: 19.99, item: 'Premium Kit', date: '2024-01-05', status: 'pending' }
  ]

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
    
    if (username && password) {
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
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    
    if (username && password) {
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
    toast.success('Logged out successfully!', {
      style: {
        background: '#D2691E',
        color: 'white',
      },
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <Toaster position="top-right" />
      
      {/* Left Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-orange-100 to-yellow-100 border-r-4 border-orange-300 shadow-xl z-10">
        <div className="p-6 space-y-6">
          
          {/* Login Section */}
          <Card className="border-2 border-orange-300 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-orange-800">
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
                                <img src={skin} alt={`Skin ${index + 1}`} className="w-12 h-12 mx-auto" />
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
                      <Button variant="outline" className="w-full border-2 border-orange-300 text-orange-700 hover:bg-orange-50">
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
                                <img src={skin} alt={`Skin ${index + 1}`} className="w-12 h-12 mx-auto" />
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
                    <Avatar className="w-12 h-12 border-2 border-orange-300">
                      <AvatarImage src={user.avatar} className="minecraft-skin" />
                      <AvatarFallback>{user.username[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-orange-800">{user.username}</p>
                      <Badge style={{ backgroundColor: user.rankColor }} className="text-white text-xs">
                        {user.rank}
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    onClick={logout}
                    variant="outline" 
                    size="sm" 
                    className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
                  >
                    Logout
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Coins & Ranks */}
          {user && (
            <Card className="border-2 border-orange-300 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <Coins className="w-5 h-5" />
                  Coins & Ranks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-orange-700">Coins:</span>
                  <Badge variant="secondary" className="bg-yellow-200 text-yellow-800">
                    {user.coins.toLocaleString()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-orange-700">Current Rank:</span>
                  <Badge style={{ backgroundColor: user.rankColor }} className="text-white">
                    <Crown className="w-3 h-3 mr-1" />
                    {user.rank}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Payments */}
          {user && (
            <Card className="border-2 border-orange-300 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <CreditCard className="w-5 h-5" />
                  Recent Payments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {mockPayments.slice(0, 3).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium text-orange-800">{payment.item}</p>
                      <p className="text-orange-600">${payment.amount}</p>
                    </div>
                    <Badge 
                      variant={payment.status === 'completed' ? 'default' : payment.status === 'pending' ? 'secondary' : 'destructive'}
                      className="text-xs"
                    >
                      {payment.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Discount Code */}
          <Card className="border-2 border-orange-300 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-orange-800">
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
                  className="border-orange-300 focus:border-orange-500"
                />
                <Button 
                  onClick={handleDiscountCode}
                  className="w-full minecraft-button text-white font-semibold"
                  disabled={!discountCode}
                >
                  Apply Code
                </Button>
              </div>
              <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
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
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-center gap-8">
              {/* CookieMC Logo */}
              <div className="text-center">
                <img 
                  src="https://dunb17ur4ymx4.cloudfront.net/webstore/logos/9a6b330d3562ceea74782a8b93a0505c15a8305c.png" 
                  alt="CookieMC Logo" 
                  className="w-32 h-32 mx-auto mb-4 rounded-lg shadow-lg border-4 border-white"
                />
                <h1 className="text-4xl font-bold text-white drop-shadow-lg">CookieMC</h1>
              </div>

              {/* Server Info */}
              <div className="space-y-4">
                {/* Server IP */}
                <Card className="border-2 border-white shadow-lg bg-white/90">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src="https://static.wikia.nocookie.net/minecraft_gamepedia/images/2/2d/Plains_Grass_Block.png" 
                        alt="Minecraft Logo" 
                        className="w-8 h-8 minecraft-skin"
                      />
                      <div>
                        <p className="text-sm text-orange-700 font-medium">Server IP:</p>
                        <p className="text-lg font-bold text-orange-800">cookiemc.vaulthosting.in</p>
                      </div>
                      <Button
                        onClick={() => copyToClipboard('cookiemc.vaulthosting.in', 'Server IP')}
                        size="sm"
                        className="minecraft-button text-white"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Discord */}
                <Card className="border-2 border-white shadow-lg bg-white/90">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-orange-700 font-medium">Discord:</p>
                        <p className="text-lg font-bold text-orange-800">Join our community!</p>
                      </div>
                      <Button
                        onClick={() => copyToClipboard('https://discord.gg/r9km3pQV', 'Discord invite')}
                        size="sm"
                        className="minecraft-button text-white"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="container mx-auto px-6 py-12">
          <div className="text-center space-y-8">
            <div>
              <h2 className="text-5xl font-bold text-orange-800 mb-4">Welcome to CookieMC!</h2>
              <p className="text-xl text-orange-700 max-w-2xl mx-auto">
                Join our amazing Minecraft community! Experience the best cookie-themed server with custom plugins, 
                friendly players, and endless adventures waiting for you.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="border-2 border-orange-300 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-orange-800">🍪 Cookie World</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-orange-700">Explore our unique cookie-themed world with custom biomes and structures!</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-300 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-orange-800">⚔️ PvP Arena</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-orange-700">Battle other players in our epic PvP arenas and climb the leaderboards!</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-300 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-orange-800">🏆 Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-orange-700">Join daily events and competitions to win amazing prizes and rewards!</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-orange-800">Ready to start your adventure?</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App