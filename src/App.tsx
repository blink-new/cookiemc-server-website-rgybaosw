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
  EyeOff,
  Shield,
  Search,
  ShoppingCart,
  Ticket,
  Trash2,
  Calendar,
  DollarSign
} from 'lucide-react'

interface User {
  id: string
  username: string
  avatar: string
  coins: number
  rank: string
  rankColor: string
  isAdmin?: boolean
}

interface Payment {
  id: string
  amount: number
  item: string
  date: string
  status: 'completed' | 'pending' | 'failed'
  playerName: string
  playerSkin: string
  purchaseDate: Date
  originalPrice?: number
  discountApplied?: boolean
}

const minecraftSkins = [
  'https://mc-heads.net/avatar/steve/64',
  'https://mc-heads.net/avatar/alex/64',
  'https://mc-heads.net/avatar/notch/64',
  'https://mc-heads.net/avatar/jeb_/64',
  'https://mc-heads.net/avatar/dinnerbone/64',
  'https://mc-heads.net/avatar/grumm/64'
]

// Draft skins for easy selection
const draftSkins = [
  { name: 'Steve', url: 'https://mc-heads.net/avatar/steve/64' },
  { name: 'Alex', url: 'https://mc-heads.net/avatar/alex/64' },
  { name: 'Herobrine', url: 'https://mc-heads.net/avatar/herobrine/64' },
  { name: 'Notch', url: 'https://mc-heads.net/avatar/notch/64' },
  { name: 'Jeb', url: 'https://mc-heads.net/avatar/jeb_/64' },
  { name: 'Dinnerbone', url: 'https://mc-heads.net/avatar/dinnerbone/64' }
]

// Mock registered users database
const registeredUsers = [
  { username: 'steve123', password: 'password123' },
  { username: 'alex456', password: 'mypass456' },
  { username: 'notch', password: 'minecraft' },
  { username: 'admin', password: 'admin123', isAdmin: true }
]

// Ranks with pricing (starting at $3, then +$3 each)
const ranks = [
  { name: 'Knight', price: 3, color: '#8B4513' },
  { name: 'Titan', price: 6, color: '#4169E1' },
  { name: 'Zeus', price: 9, color: '#FFD700' },
  { name: 'Devil', price: 12, color: '#DC143C' }
]

// Coins packages (new pricing: $2, $4, $6, $8, $10, $12)
const coinPackages = [
  { coins: 1000, price: 2 },
  { coins: 2000, price: 4 },
  { coins: 3000, price: 6 },
  { coins: 4000, price: 8 },
  { coins: 5000, price: 10 },
  { coins: 6000, price: 12 }
]

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [selectedSkin, setSelectedSkin] = useState(minecraftSkins[0])
  const [showPassword, setShowPassword] = useState(false)
  const [showRegPassword, setShowRegPassword] = useState(false)
  const [showAdminPassword, setShowAdminPassword] = useState(false)
  const [discountCode, setDiscountCode] = useState('')
  const [discountApplied, setDiscountApplied] = useState(false)
  const [currentPage, setCurrentPage] = useState('home')
  const [isAdminLogin, setIsAdminLogin] = useState(false)
  const [skinSearch, setSkinSearch] = useState('')
  const [cart, setCart] = useState<any[]>([])
  const [showCart, setShowCart] = useState(false)
  
  // Mock payments data - starts empty, gets populated when someone buys something
  const [payments, setPayments] = useState<Payment[]>([])

  // Filter payments to only show recent ones (within 2 weeks) and completed
  const getRecentPayments = () => {
    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
    
    return payments.filter(payment => 
      payment.status === 'completed' && 
      payment.purchaseDate >= twoWeeksAgo
    )
  }

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

  const addToCart = (item: any) => {
    setCart([...cart, item])
    toast.success(`${item.name || item.coins + ' coins'} added to cart!`, {
      style: {
        background: '#D2691E',
        color: 'white',
      },
    })
  }

  const purchaseItem = (item: any) => {
    // Calculate final price with discount
    let finalPrice = item.price
    const originalPrice = item.price
    let discountUsed = false
    
    if (discountApplied) {
      finalPrice = Math.round(item.price * 0.5) // 50% off
      discountUsed = true
    }

    // Add to payments immediately when someone clicks buy
    const newPayment: Payment = {
      id: `payment_${Date.now()}`,
      amount: finalPrice,
      item: item.name || `${item.coins} coins`,
      date: new Date().toLocaleDateString(),
      status: 'completed',
      playerName: user?.username || 'Guest',
      playerSkin: user?.avatar || 'https://mc-heads.net/avatar/steve/64',
      purchaseDate: new Date(),
      originalPrice: discountUsed ? originalPrice : undefined,
      discountApplied: discountUsed
    }
    
    setPayments(prev => [newPayment, ...prev])

    // Show cart message with Discord instructions
    toast.success(
      <div className="text-center">
        <div className="flex items-center justify-center mb-2">
          <ShoppingCart className="w-5 h-5 mr-2" />
          <span className="font-bold">Purchase Successful!</span>
        </div>
        <p className="text-sm mb-2">
          🎉 Thank you for your purchase!
        </p>
        <p className="text-xs bg-blue-100 text-blue-800 p-2 rounded">
          📢 Go to Discord and make a ticket to get your rank/coins!
        </p>
      </div>,
      {
        duration: 5000,
        style: {
          background: '#22c55e',
          color: 'white',
        },
      }
    )

    // Reset discount after use
    if (discountApplied) {
      setDiscountApplied(false)
      setDiscountCode('')
    }
  }

  const deletePayment = (paymentId: string) => {
    setPayments(prev => prev.filter(p => p.id !== paymentId))
    toast.success('Payment deleted successfully!', {
      style: {
        background: '#D2691E',
        color: 'white',
      },
    })
  }

  const searchSkin = (username: string) => {
    if (username.trim()) {
      const skinUrl = `https://mc-heads.net/avatar/${username.trim()}/64`
      setSelectedSkin(skinUrl)
      toast.success(`Skin loaded for ${username}!`, {
        style: {
          background: '#D2691E',
          color: 'white',
        },
      })
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    const adminPassword = formData.get('adminPassword') as string
    
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

    // Check admin login
    if (isAdminLogin) {
      if (adminPassword !== 'admin123') {
        toast.error('Incorrect admin password!', {
          style: {
            background: '#DC143C',
            color: 'white',
          },
        })
        return
      }
      if (!foundUser.isAdmin) {
        toast.error('This account is not an admin account!', {
          style: {
            background: '#DC143C',
            color: 'white',
          },
        })
        return
      }
    }
    
    // Login successful - don't use selectedSkin for login, use default
    setUser({
      id: '1',
      username,
      avatar: 'https://mc-heads.net/avatar/steve/64', // Default skin for login
      coins: 2500,
      rank: foundUser.isAdmin ? 'Admin' : 'VIP',
      rankColor: foundUser.isAdmin ? '#FF0000' : '#FFD700',
      isAdmin: foundUser.isAdmin || false
    })
    setIsLoginOpen(false)
    setIsAdminLogin(false)
    toast.success(`Welcome back, ${username}!${foundUser.isAdmin ? ' (Admin)' : ''}`, {
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
    const adminPassword = formData.get('adminPassword') as string
    
    if (username && password) {
      // Check admin registration
      if (isAdminLogin) {
        if (adminPassword !== 'admin123') {
          toast.error('Incorrect admin password!', {
            style: {
              background: '#DC143C',
              color: 'white',
            },
          })
          return
        }
        // Add admin to registered users
        registeredUsers.push({ username, password, isAdmin: true })
        
        setUser({
          id: '2',
          username,
          avatar: selectedSkin,
          coins: 100,
          rank: 'Admin',
          rankColor: '#FF0000',
          isAdmin: true
        })
      } else {
        // Add regular user to registered users
        registeredUsers.push({ username, password })
        
        setUser({
          id: '2',
          username,
          avatar: selectedSkin,
          coins: 100,
          rank: 'Member',
          rankColor: '#90EE90'
        })
      }
      
      setIsRegisterOpen(false)
      setIsAdminLogin(false)
      toast.success(`Account created! Welcome, ${username}!${isAdminLogin ? ' (Admin)' : ''}`, {
        style: {
          background: '#D2691E',
          color: 'white',
        },
      })
    }
  }

  const handleDiscountCode = () => {
    if (discountCode.toLowerCase() === 'nightermc') {
      setDiscountApplied(true)
      toast.success('Discount code applied! 50% off your next purchase!', {
        duration: 3000,
        style: {
          background: '#228B22',
          color: 'white',
        },
      })
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
    setDiscountApplied(false)
    setDiscountCode('')
    toast.success('Logged out successfully!', {
      style: {
        background: '#D2691E',
        color: 'white',
      },
    })
  }

  // Render different pages
  const renderPage = () => {
    if (currentPage === 'admin-tickets' && user?.isAdmin) {
      return (
        <Card className="border-4 border-red-300 shadow-2xl bg-gradient-to-br from-red-50 to-pink-50">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-4xl font-bold text-red-800 mb-2">
              <Ticket className="w-12 h-12 mx-auto mb-4" />
              Admin Panel - Orders & Tickets
            </CardTitle>
          </CardHeader>
          <CardContent className="py-8">
            <div className="space-y-6">
              {/* All Orders Section */}
              <div className="bg-white p-6 rounded-lg border-2 border-red-200 shadow-lg">
                <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
                  <DollarSign className="w-6 h-6" />
                  All Orders ({payments.length})
                </h3>
                
                {payments.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {payments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between bg-gray-50 p-4 rounded border">
                        <div className="flex items-center gap-3">
                          <img 
                            src={payment.playerSkin} 
                            alt={payment.playerName}
                            className="w-8 h-8 minecraft-skin border border-gray-300 rounded"
                          />
                          <div>
                            <p className="font-semibold text-gray-800">{payment.playerName}</p>
                            <p className="text-sm text-gray-600">{payment.item}</p>
                            <div className="flex items-center gap-2">
                              {payment.discountApplied && payment.originalPrice ? (
                                <>
                                  <span className="text-red-500 line-through text-sm">${payment.originalPrice}</span>
                                  <span className="text-green-600 font-bold">${payment.amount}</span>
                                  <Badge className="bg-green-100 text-green-800 text-xs">50% OFF</Badge>
                                </>
                              ) : (
                                <span className="text-green-600 font-bold">${payment.amount}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {payment.date}
                            </p>
                            <Badge 
                              className={`text-xs ${
                                payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}
                            >
                              {payment.status}
                            </Badge>
                          </div>
                          <Button
                            onClick={() => deletePayment(payment.id)}
                            size="sm"
                            variant="destructive"
                            className="text-xs"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">No orders found.</p>
                )}
              </div>

              {/* Support Tickets Section */}
              <div className="bg-white p-6 rounded-lg border-2 border-red-200 shadow-lg">
                <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
                  <Ticket className="w-6 h-6" />
                  Support Tickets
                </h3>
                <p className="text-gray-600 mb-4">No tickets available at the moment.</p>
                <p className="text-sm text-gray-500">
                  When players create tickets in Discord, they will appear here for admin review.
                </p>
              </div>

              <Button 
                onClick={() => setCurrentPage('home')}
                className="minecraft-button text-white font-semibold px-8 mx-auto block"
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    }

    if (currentPage === 'coins') {
      return (
        <Card className="border-4 border-orange-300 shadow-2xl bg-gradient-to-br from-orange-50 to-yellow-50">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-4xl font-bold text-orange-800 mb-2">
              <Coins className="w-12 h-12 mx-auto mb-4" />
              Coins Store
            </CardTitle>
          </CardHeader>
          <CardContent className="py-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {coinPackages.map((pkg, index) => (
                <Card key={index} className="border-2 border-orange-200 bg-white shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">🪙</div>
                    <h3 className="text-2xl font-bold text-orange-800 mb-2">
                      {pkg.coins.toLocaleString()} Coins
                    </h3>
                    <div className="mb-4">
                      {discountApplied ? (
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-red-500 line-through text-lg">${pkg.price}</span>
                          <span className="text-3xl font-bold text-green-600">${Math.round(pkg.price * 0.5)}</span>
                        </div>
                      ) : (
                        <p className="text-3xl font-bold text-green-600">${pkg.price}</p>
                      )}
                    </div>
                    <Button 
                      onClick={() => purchaseItem({ coins: pkg.coins, price: pkg.price, name: `${pkg.coins} coins` })}
                      className="w-full minecraft-button text-white font-semibold"
                    >
                      Purchase
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button 
                onClick={() => setCurrentPage('home')}
                className="minecraft-button text-white font-semibold px-8"
              >
                Back to Home
              </Button>
            </div>
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
              Ranks Store
            </CardTitle>
          </CardHeader>
          <CardContent className="py-8">
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {ranks.map((rank, index) => (
                <Card key={index} className="border-2 border-orange-200 bg-white shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">👑</div>
                    <h3 className="text-2xl font-bold mb-2" style={{ color: rank.color }}>
                      {rank.name}
                    </h3>
                    <div className="mb-4">
                      {discountApplied ? (
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-red-500 line-through text-lg">${rank.price}</span>
                          <span className="text-3xl font-bold text-green-600">${Math.round(rank.price * 0.5)}</span>
                        </div>
                      ) : (
                        <p className="text-3xl font-bold text-green-600">${rank.price}</p>
                      )}
                    </div>
                    <Button 
                      onClick={() => purchaseItem({ name: rank.name, price: rank.price, type: 'rank' })}
                      className="w-full minecraft-button text-white font-semibold"
                    >
                      Purchase Rank
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button 
                onClick={() => setCurrentPage('home')}
                className="minecraft-button text-white font-semibold px-8"
              >
                Back to Home
              </Button>
            </div>
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

  const recentPayments = getRecentPayments()

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
                        
                        {/* Admin Login Toggle */}
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="adminLogin"
                            checked={isAdminLogin}
                            onChange={(e) => setIsAdminLogin(e.target.checked)}
                            className="rounded"
                          />
                          <label htmlFor="adminLogin" className="text-sm text-orange-700 flex items-center gap-1">
                            <Shield className="w-4 h-4" />
                            Admin Login
                          </label>
                        </div>
                        
                        {/* Admin Password Field */}
                        {isAdminLogin && (
                          <div className="relative">
                            <Input
                              name="adminPassword"
                              type={showAdminPassword ? "text" : "password"}
                              placeholder="Admin Password"
                              required
                              className="border-red-300 focus:border-red-500 pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowAdminPassword(!showAdminPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                              {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        )}
                        
                        <Button type="submit" className="w-full minecraft-button text-white font-semibold">
                          {isAdminLogin ? 'Admin Login' : 'Login'}
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
                    <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-orange-800">Join CookieMC</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-orange-700">Choose Your Profile Picture</label>
                          
                          {/* Skin Search */}
                          <div className="flex gap-2">
                            <Input
                              value={skinSearch}
                              onChange={(e) => setSkinSearch(e.target.value)}
                              placeholder="Search any Minecraft username..."
                              className="border-orange-300 focus:border-orange-500"
                            />
                            <Button
                              type="button"
                              onClick={() => searchSkin(skinSearch)}
                              size="sm"
                              className="minecraft-button text-white"
                            >
                              <Search className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          {/* Current Selected Skin */}
                          <div className="text-center p-2 border-2 border-orange-200 rounded bg-orange-50">
                            <img src={selectedSkin} alt="Selected skin" className="w-16 h-16 mx-auto minecraft-skin" />
                            <p className="text-xs text-orange-700 mt-1">Selected Skin</p>
                          </div>
                          
                          {/* Draft Skins */}
                          <div>
                            <p className="text-xs text-gray-600 mb-2">Or choose from drafts:</p>
                            <div className="grid grid-cols-3 gap-2">
                              {draftSkins.map((skin, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => setSelectedSkin(skin.url)}
                                  className={`p-2 rounded border-2 minecraft-skin ${
                                    selectedSkin === skin.url ? 'border-orange-500 bg-orange-100' : 'border-gray-300'
                                  }`}
                                >
                                  <img src={skin.url} alt={skin.name} className="w-8 h-8 mx-auto" />
                                  <p className="text-xs mt-1">{skin.name}</p>
                                </button>
                              ))}
                            </div>
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
                        
                        {/* Admin Registration Toggle */}
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="adminRegister"
                            checked={isAdminLogin}
                            onChange={(e) => setIsAdminLogin(e.target.checked)}
                            className="rounded"
                          />
                          <label htmlFor="adminRegister" className="text-sm text-orange-700 flex items-center gap-1">
                            <Shield className="w-4 h-4" />
                            Register as Admin
                          </label>
                        </div>
                        
                        {/* Admin Password Field */}
                        {isAdminLogin && (
                          <div className="relative">
                            <Input
                              name="adminPassword"
                              type={showAdminPassword ? "text" : "password"}
                              placeholder="Admin Password"
                              required
                              className="border-red-300 focus:border-red-500 pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowAdminPassword(!showAdminPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                              {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        )}
                        
                        <Button type="submit" className="w-full minecraft-button text-white font-semibold">
                          {isAdminLogin ? 'Create Admin Account' : 'Create Account'}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 border-2 border-gray-300">
                      <AvatarImage src={user.avatar} className="minecraft-skin" />
                      <AvatarFallback>{user.username[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm flex items-center gap-1">
                        {user.username}
                        {user.isAdmin && <Shield className="w-3 h-3 text-red-500" />}
                      </p>
                      <Badge style={{ backgroundColor: user.rankColor }} className="text-white text-xs">
                        {user.rank}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Admin View Tickets Button */}
                  {user.isAdmin && (
                    <Button
                      onClick={() => setCurrentPage('admin-tickets')}
                      variant="outline"
                      size="sm"
                      className="w-full border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <Ticket className="w-4 h-4 mr-2" />
                      View Tickets
                    </Button>
                  )}
                  
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
                Store
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => setCurrentPage('coins')}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 justify-start"
              >
                <Coins className="w-4 h-4 mr-2" />
                Buy Coins
              </Button>
              <Button
                onClick={() => setCurrentPage('ranks')}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 justify-start"
              >
                <Crown className="w-4 h-4 mr-2" />
                Buy Ranks
              </Button>
            </CardContent>
          </Card>

          {/* Recent Payments - Show actual purchases when they happen */}
          <Card className="border-2 border-gray-300 shadow-lg bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <CreditCard className="w-5 h-5" />
                Recent Payments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentPayments.length > 0 ? (
                <div className="flex flex-wrap gap-2 justify-center">
                  {recentPayments.slice(0, 8).map((payment) => (
                    <div key={payment.id} className="flex flex-col items-center">
                      <img 
                        src={payment.playerSkin} 
                        alt={payment.playerName}
                        className="w-4 h-4 minecraft-skin border border-gray-300 rounded"
                      />
                      <span className="text-xs text-gray-600 mt-1 max-w-[40px] truncate">
                        {payment.playerName}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 mb-2">💸</p>
                  <p className="text-xs text-gray-600">No one has any purchases</p>
                  <p className="text-xs text-gray-500 mt-1">
                    When someone buys something, it updates. After 2 weeks they go off cause it's not recent anymore.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

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
                  disabled={!discountCode || discountApplied}
                >
                  {discountApplied ? 'Code Applied!' : 'Apply Code'}
                </Button>
              </div>
              {discountApplied && (
                <div className="text-xs text-green-700 bg-green-50 p-2 rounded border border-green-200">
                  ✅ 50% discount active on next purchase!
                </div>
              )}
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
              {/* Minecraft Logo - Left Side - Just Small Logo */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => copyToClipboard('cookiemc.vaulthosting.in', 'Server IP')}
                  className="minecraft-button text-white p-2 rounded-lg shadow-md"
                >
                  <img 
                    src="https://static.wikia.nocookie.net/minecraft_gamepedia/images/2/2d/Plains_Grass_Block.png" 
                    alt="Minecraft Logo" 
                    className="w-6 h-6 minecraft-skin"
                  />
                </Button>
              </div>

              {/* CookieMC Logo - Center - Biggest */}
              <div className="text-center">
                <img 
                  src="https://dunb17ur4ymx4.cloudfront.net/webstore/logos/9a6b330d3562ceea74782a8b93a0505c15a8305c.png" 
                  alt="CookieMC Logo" 
                  className="w-40 h-40 mx-auto rounded-lg shadow-lg border-4 border-white"
                />
              </div>

              {/* Discord Logo - Right Side - Just Small Logo */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => copyToClipboard('https://discord.gg/r9km3pQV', 'Discord invite')}
                  className="minecraft-button text-white p-2 rounded-lg shadow-md"
                >
                  <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                  </div>
                </Button>
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