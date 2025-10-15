import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

type Page = 'login' | 'pin' | 'main' | 'savings' | 'payments' | 'history' | 'profile' | 'cards' | 'transfer' | 'profile-details' | 'settings' | 'security' | 'notifications' | 'documents';
type LoginStep = 'username' | 'password' | 'sms';

interface Transaction {
  id: number;
  title: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  icon: string;
}

interface CardData {
  id: number;
  name: string;
  number: string;
  balance: number;
  type: 'debit' | 'credit';
  currency: string;
  blocked?: boolean;
}

const DEFAULT_CARDS: CardData[] = [
  { id: 1, name: 'Дебетовая карта', number: '2512', balance: 45678.90, type: 'debit', currency: '₽' },
  { id: 2, name: 'Кредитная карта', number: '4771', balance: 15000, type: 'credit', currency: '₽' },
  { id: 3, name: 'Сберегательный счёт', number: '1253', balance: 127500.50, type: 'debit', currency: '₽' },
];

const DEFAULT_TRANSACTIONS: Transaction[] = [
  { id: 1, title: 'Зарплата ООО "Рога и копыта"', date: '15 октября', amount: 85000, type: 'income', category: 'Доход', icon: 'Briefcase' },
  { id: 2, title: 'Банкомат СберБанка', date: '14 октября', amount: -15000, type: 'expense', category: 'Наличные', icon: 'Landmark' },
  { id: 3, title: 'Пятёрочка', date: '14 октября', amount: -2450, type: 'expense', category: 'Продукты', icon: 'ShoppingCart' },
  { id: 4, title: 'Яндекс Такси', date: '13 октября', amount: -580, type: 'expense', category: 'Транспорт', icon: 'Car' },
  { id: 5, title: 'Перевод от Ивана М.', date: '13 октября', amount: 5000, type: 'income', category: 'Переводы', icon: 'User' },
  { id: 6, title: 'Ozon', date: '12 октября', amount: -3890, type: 'expense', category: 'Покупки', icon: 'Package' },
  { id: 7, title: 'Кофе Хауз', date: '12 октября', amount: -450, type: 'expense', category: 'Кафе', icon: 'Coffee' },
  { id: 8, title: 'МТС', date: '11 октября', amount: -500, type: 'expense', category: 'Связь', icon: 'Smartphone' },
  { id: 9, title: 'Аптека 36.6', date: '11 октября', amount: -890, type: 'expense', category: 'Здоровье', icon: 'Heart' },
  { id: 10, title: 'Азбука вкуса', date: '10 октября', amount: -4560, type: 'expense', category: 'Продукты', icon: 'ShoppingBag' },
  { id: 11, title: 'Netflix', date: '10 октября', amount: -990, type: 'expense', category: 'Подписки', icon: 'Tv' },
  { id: 12, title: 'Перевод Анне К.', date: '9 октября', amount: -2000, type: 'expense', category: 'Переводы', icon: 'Send' },
  { id: 13, title: 'Спортмастер', date: '8 октября', amount: -7890, type: 'expense', category: 'Спорт', icon: 'Dumbbell' },
  { id: 14, title: 'Макдоналдс', date: '8 октября', amount: -650, type: 'expense', category: 'Еда', icon: 'Utensils' },
  { id: 15, title: 'Cashback', date: '7 октября', amount: 450, type: 'income', category: 'Кэшбэк', icon: 'Gift' },
];

export default function Index() {
  const [page, setPage] = useState<Page>('login');
  const [loginStep, setLoginStep] = useState<LoginStep>('username');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pinCode, setPinCode] = useState(['', '', '', '', '']);
  const [smsCode, setSmsCode] = useState(['', '', '', '']);
  const [showBalance, setShowBalance] = useState(true);
  const [cards, setCards] = useState<CardData[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferRecipient, setTransferRecipient] = useState('');
  const [transferComment, setTransferComment] = useState('');
  const [selectedCardId, setSelectedCardId] = useState(1);
  const [userProfile] = useState({
    firstName: 'Иван',
    lastName: 'Петров',
    middleName: 'Сергеевич',
    birthDate: '15.03.1990',
    phone: '+7 (900) 123-45-67',
    email: 'ivan.petrov@example.com',
    passport: '4512 123456',
    inn: '773012345678',
  });
  const { toast } = useToast();

  useEffect(() => {
    const savedCards = localStorage.getItem('sber_cards');
    const savedTransactions = localStorage.getItem('sber_transactions');
    
    if (savedCards) {
      setCards(JSON.parse(savedCards));
    } else {
      setCards(DEFAULT_CARDS);
      localStorage.setItem('sber_cards', JSON.stringify(DEFAULT_CARDS));
    }
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    } else {
      setTransactions(DEFAULT_TRANSACTIONS);
      localStorage.setItem('sber_transactions', JSON.stringify(DEFAULT_TRANSACTIONS));
    }
  }, []);

  const saveCards = (newCards: CardData[]) => {
    setCards(newCards);
    localStorage.setItem('sber_cards', JSON.stringify(newCards));
  };

  const saveTransactions = (newTransactions: Transaction[]) => {
    setTransactions(newTransactions);
    localStorage.setItem('sber_transactions', JSON.stringify(newTransactions));
  };

  const handleTransfer = () => {
    if (!transferAmount || !transferRecipient) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive',
      });
      return;
    }

    const amount = parseFloat(transferAmount);
    const selectedCard = cards.find(c => c.id === selectedCardId);

    if (!selectedCard || selectedCard.balance < amount) {
      toast({
        title: 'Недостаточно средств',
        description: 'На карте недостаточно денег для перевода',
        variant: 'destructive',
      });
      return;
    }

    const updatedCards = cards.map(c => 
      c.id === selectedCardId 
        ? { ...c, balance: c.balance - amount }
        : c
    );

    const newTransaction: Transaction = {
      id: Date.now(),
      title: `Перевод ${transferRecipient}`,
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }),
      amount: -amount,
      type: 'expense',
      category: 'Переводы',
      icon: 'Send',
    };

    saveCards(updatedCards);
    saveTransactions([newTransaction, ...transactions]);

    toast({
      title: 'Перевод выполнен',
      description: `${amount.toLocaleString('ru-RU')} ₽ отправлено`,
    });

    setTransferAmount('');
    setTransferRecipient('');
    setTransferComment('');
    setPage('main');
  };

  const handlePinInput = (num: string) => {
    const firstEmpty = pinCode.findIndex(v => !v);
    if (firstEmpty !== -1) {
      const newCode = [...pinCode];
      newCode[firstEmpty] = num;
      setPinCode(newCode);
      if (firstEmpty === 4) {
        setTimeout(() => setPage('main'), 500);
      }
    }
  };

  const handlePinDelete = () => {
    const lastFilled = pinCode.map((v, i) => v ? i : -1).filter(i => i !== -1).pop();
    if (lastFilled !== undefined) {
      const newCode = [...pinCode];
      newCode[lastFilled] = '';
      setPinCode(newCode);
    }
  };

  const handleSmsInput = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...smsCode];
      newCode[index] = value;
      setSmsCode(newCode);
      if (value && index < 3) {
        document.getElementById(`sms-${index + 1}`)?.focus();
      }
      if (newCode.every(v => v) && index === 3) {
        setTimeout(() => setPage('pin'), 500);
      }
    }
  };

  const formatBalance = (amount: number) => {
    return showBalance ? amount.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '••••';
  };

  const totalBalance = cards.reduce((sum, card) => sum + card.balance, 0);

  if (page === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#21A038] to-[#1a8030] flex items-center justify-center p-4 animate-fade-in">
        <Card className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 animate-scale-in">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <Icon name="CheckCircle2" size={32} className="text-[#21A038]" />
              <span className="text-[#21A038] text-2xl font-bold">СБЕРБАНК</span>
            </div>
          </div>

          {loginStep === 'username' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Вход в Сбербанк Онлайн</h1>
                <p className="text-gray-600 text-sm">Введите любой логин для входа</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Логин или телефон</label>
                <Input
                  type="text"
                  placeholder="+7 900 000-00-00"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12 text-base"
                  autoFocus
                />
              </div>

              <Button
                onClick={() => username && setLoginStep('password')}
                disabled={!username}
                className="w-full h-12 bg-[#21A038] hover:bg-[#1a8030] text-white font-medium text-base transition-all hover:scale-[1.02]"
              >
                Продолжить
              </Button>

              <div className="text-center space-y-2">
                <p className="text-xs text-gray-500">
                  Демо-версия • Работает любой логин/пароль
                </p>
              </div>
            </div>
          )}

          {loginStep === 'password' && (
            <div className="space-y-6 animate-fade-in">
              <Button
                onClick={() => setLoginStep('username')}
                variant="ghost"
                className="mb-2 p-0 h-auto hover:bg-transparent"
              >
                <Icon name="ArrowLeft" size={24} className="text-gray-700" />
              </Button>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Введите пароль</h1>
                <p className="text-gray-600 text-sm">{username}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Пароль</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 text-base"
                  autoFocus
                />
              </div>

              <Button
                onClick={() => password && setLoginStep('sms')}
                disabled={!password}
                className="w-full h-12 bg-[#21A038] hover:bg-[#1a8030] text-white font-medium text-base transition-all hover:scale-[1.02]"
              >
                Войти
              </Button>
            </div>
          )}

          {loginStep === 'sms' && (
            <div className="space-y-6 animate-fade-in">
              <Button
                onClick={() => setLoginStep('password')}
                variant="ghost"
                className="mb-2 p-0 h-auto hover:bg-transparent"
              >
                <Icon name="ArrowLeft" size={24} className="text-gray-700" />
              </Button>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Введите код из СМС</h1>
                <p className="text-gray-600 text-sm">Введите любые 4 цифры</p>
              </div>

              <div className="flex gap-3 justify-center">
                {smsCode.map((digit, i) => (
                  <Input
                    key={i}
                    id={`sms-${i}`}
                    value={digit}
                    onChange={(e) => handleSmsInput(i, e.target.value)}
                    className="w-14 h-14 text-center text-2xl font-bold border-2 focus:border-[#21A038] rounded-xl transition-all"
                    maxLength={1}
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              <div className="text-center">
                <button 
                  onClick={() => setPage('pin')}
                  className="text-[#21A038] text-sm font-medium hover:underline"
                >
                  Пропустить →
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  }

  if (page === 'pin') {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4 animate-fade-in">
        <Card className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 animate-scale-in">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <Icon name="CheckCircle2" size={28} className="text-[#21A038]" />
              <span className="text-[#21A038] text-xl font-bold">СБЕРБАНК</span>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Придумайте код для входа</h1>
            <p className="text-gray-600 text-sm">
              В следующий раз сможете войти по этому коду
            </p>
          </div>

          <div className="flex gap-3 justify-center mb-10">
            {pinCode.map((digit, i) => (
              <div
                key={i}
                className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-all duration-300 ${
                  digit 
                    ? 'bg-[#21A038] border-[#21A038] text-white scale-110' 
                    : 'bg-gray-100 border-gray-200 text-transparent'
                }`}
              >
                {digit || '0'}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <Button
                key={num}
                onClick={() => handlePinInput(num)}
                variant="ghost"
                className="h-16 text-2xl font-bold bg-gray-100 hover:bg-gray-200 hover:scale-105 rounded-2xl transition-all"
              >
                {num}
              </Button>
            ))}
            <div />
            <Button
              onClick={() => handlePinInput('0')}
              variant="ghost"
              className="h-16 text-2xl font-bold bg-gray-100 hover:bg-gray-200 hover:scale-105 rounded-2xl transition-all"
            >
              0
            </Button>
            <Button
              onClick={handlePinDelete}
              variant="ghost"
              className="h-16 bg-gray-100 hover:bg-gray-200 hover:scale-105 rounded-2xl transition-all"
            >
              <Icon name="Delete" size={24} />
            </Button>
          </div>

          <button 
            onClick={() => setPage('main')}
            className="text-[#21A038] text-sm font-medium w-full hover:underline"
          >
            Пропустить
          </button>
        </Card>
      </div>
    );
  }

  const NavBar = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t max-w-md mx-auto z-50">
      <div className="flex justify-around px-2 py-2">
        <Button
          variant="ghost"
          className={`flex-col h-auto py-2 px-3 transition-all hover:scale-105 ${
            page === 'main' ? 'text-[#21A038]' : 'text-gray-600'
          }`}
          onClick={() => setPage('main')}
        >
          <Icon name="Home" size={24} />
          <span className="text-[10px] mt-1 font-medium">Главная</span>
        </Button>
        <Button
          variant="ghost"
          className={`flex-col h-auto py-2 px-3 transition-all hover:scale-105 ${
            page === 'savings' ? 'text-[#21A038]' : 'text-gray-600'
          }`}
          onClick={() => setPage('savings')}
        >
          <Icon name="PiggyBank" size={24} />
          <span className="text-[10px] mt-1 font-medium">Накопления</span>
        </Button>
        <Button
          variant="ghost"
          className={`flex-col h-auto py-2 px-3 transition-all hover:scale-105 ${
            page === 'payments' ? 'text-[#21A038]' : 'text-gray-600'
          }`}
          onClick={() => setPage('payments')}
        >
          <Icon name="Send" size={24} />
          <span className="text-[10px] mt-1 font-medium">Платежи</span>
        </Button>
        <Button
          variant="ghost"
          className={`flex-col h-auto py-2 px-3 transition-all hover:scale-105 ${
            page === 'history' ? 'text-[#21A038]' : 'text-gray-600'
          }`}
          onClick={() => setPage('history')}
        >
          <Icon name="Clock" size={24} />
          <span className="text-[10px] mt-1 font-medium">История</span>
        </Button>
        <Button
          variant="ghost"
          className={`flex-col h-auto py-2 px-3 transition-all hover:scale-105 ${
            page === 'profile' ? 'text-[#21A038]' : 'text-gray-600'
          }`}
          onClick={() => setPage('profile')}
        >
          <Icon name="User" size={24} />
          <span className="text-[10px] mt-1 font-medium">Профиль</span>
        </Button>
      </div>
    </nav>
  );

  const Header = ({ title }: { title: string }) => (
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowBalance(!showBalance)}
            className="hover:bg-gray-100 transition-all hover:scale-105"
          >
            <Icon name={showBalance ? 'Eye' : 'EyeOff'} size={20} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100 transition-all hover:scale-105"
          >
            <Icon name="Bell" size={20} />
          </Button>
        </div>
      </div>
    </header>
  );

  if (page === 'main') {
    return (
      <div className="min-h-screen bg-[#f5f5f5] pb-20 animate-fade-in">
        <div className="max-w-md mx-auto">
          <Header title="Главная" />

          <div className="p-4 space-y-4">
            <Card className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Всего денег</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatBalance(totalBalance)} ₽
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setPage('cards')}
                  className="hover:bg-gray-100 transition-all hover:scale-105"
                >
                  <Icon name="CreditCard" size={24} className="text-[#21A038]" />
                </Button>
              </div>

              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-[#21A038] hover:bg-[#1a8030] text-white transition-all hover:scale-105"
                  onClick={() => setPage('transfer')}
                >
                  <Icon name="Send" size={18} className="mr-2" />
                  Перевести
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-[#21A038] text-[#21A038] hover:bg-[#21A038] hover:text-white transition-all hover:scale-105"
                >
                  <Icon name="Plus" size={18} className="mr-2" />
                  Пополнить
                </Button>
              </div>
            </Card>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-bold text-gray-900">Мои карты</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setPage('cards')}
                  className="text-[#21A038] hover:bg-[#21A038]/10 transition-all"
                >
                  Все карты
                </Button>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {cards.map((card) => (
                  <Card
                    key={card.id}
                    className="min-w-[280px] bg-gradient-to-br from-[#21A038] to-[#1a8030] rounded-3xl p-6 text-white cursor-pointer hover:scale-105 transition-all shadow-lg"
                    onClick={() => setPage('cards')}
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <p className="text-sm opacity-90">{card.name}</p>
                        <p className="text-lg font-bold mt-1">•••• {card.number}</p>
                      </div>
                      <Icon name="CreditCard" size={28} className="opacity-80" />
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-2xl font-bold">{formatBalance(card.balance)} {card.currency}</p>
                      </div>
                      {card.blocked && (
                        <Badge variant="destructive" className="bg-red-500">
                          Заблокирована
                        </Badge>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-bold text-gray-900">Последние операции</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setPage('history')}
                  className="text-[#21A038] hover:bg-[#21A038]/10 transition-all"
                >
                  Все
                </Button>
              </div>

              <Card className="bg-white rounded-3xl divide-y">
                {transactions.slice(0, 5).map((tx) => (
                  <div
                    key={tx.id}
                    className="p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-all"
                    onClick={() => setPage('history')}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      tx.type === 'income' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Icon 
                        name={tx.icon as any} 
                        size={20} 
                        className={tx.type === 'income' ? 'text-green-600' : 'text-gray-600'}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{tx.title}</p>
                      <p className="text-xs text-gray-500">{tx.date} • {tx.category}</p>
                    </div>
                    <span className={`font-bold text-lg flex-shrink-0 ${
                      tx.type === 'income' ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                ))}
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-6 text-white cursor-pointer hover:scale-105 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-2">СберСпасибо</h3>
                  <p className="text-sm opacity-90 mb-4">Копите бонусы и тратьте на покупки</p>
                  <Button variant="secondary" size="sm" className="bg-white text-purple-600 hover:bg-gray-100">
                    Узнать больше
                  </Button>
                </div>
                <Icon name="Gift" size={32} className="opacity-80" />
              </div>
            </Card>
          </div>

          <NavBar />
        </div>
      </div>
    );
  }

  if (page === 'cards') {
    return (
      <div className="min-h-screen bg-[#f5f5f5] pb-20 animate-fade-in">
        <div className="max-w-md mx-auto">
          <header className="bg-white border-b sticky top-0 z-40">
            <div className="px-4 py-4 flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPage('main')}
                className="hover:bg-gray-100 transition-all"
              >
                <Icon name="ArrowLeft" size={24} />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">Мои карты</h1>
            </div>
          </header>

          <div className="p-4 space-y-4">
            {cards.map((card) => (
              <Card key={card.id} className="bg-white rounded-3xl overflow-hidden hover:shadow-lg transition-all">
                <div className="h-48 bg-gradient-to-br from-[#21A038] to-[#1a8030] p-6 text-white relative">
                  <div className="flex justify-between items-start mb-auto">
                    <div>
                      <p className="text-sm opacity-90">{card.name}</p>
                      <p className="text-xl font-bold mt-1">•••• •••• •••• {card.number}</p>
                    </div>
                    <Icon name="CreditCard" size={32} className="opacity-80" />
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-3xl font-bold">{formatBalance(card.balance)} {card.currency}</p>
                    {card.blocked && (
                      <Badge variant="destructive" className="mt-2 bg-red-500">
                        Заблокирована
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="p-4 grid grid-cols-3 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="hover:bg-gray-50 transition-all"
                    onClick={() => {
                      setSelectedCardId(card.id);
                      setPage('transfer');
                    }}
                  >
                    <Icon name="Send" size={16} className="mr-1" />
                    Перевод
                  </Button>
                  <Button variant="outline" size="sm" className="hover:bg-gray-50 transition-all">
                    <Icon name="Settings" size={16} className="mr-1" />
                    Настройки
                  </Button>
                  <Button variant="outline" size="sm" className="hover:bg-gray-50 transition-all">
                    <Icon name="Info" size={16} className="mr-1" />
                    Детали
                  </Button>
                </div>
              </Card>
            ))}

            <Button 
              className="w-full h-14 bg-[#21A038] hover:bg-[#1a8030] text-white rounded-2xl transition-all hover:scale-105"
            >
              <Icon name="Plus" size={20} className="mr-2" />
              Заказать новую карту
            </Button>
          </div>

          <NavBar />
        </div>
      </div>
    );
  }

  if (page === 'transfer') {
    return (
      <div className="min-h-screen bg-[#f5f5f5] pb-20 animate-fade-in">
        <div className="max-w-md mx-auto">
          <header className="bg-white border-b sticky top-0 z-40">
            <div className="px-4 py-4 flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPage('main')}
                className="hover:bg-gray-100 transition-all"
              >
                <Icon name="ArrowLeft" size={24} />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">Перевод</h1>
            </div>
          </header>

          <div className="p-4 space-y-4">
            <Card className="bg-white rounded-3xl p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Номер карты или телефон
                  </label>
                  <Input
                    placeholder="0000 0000 0000 0000"
                    value={transferRecipient}
                    onChange={(e) => setTransferRecipient(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Сумма перевода
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      className="h-16 text-3xl font-bold pr-12"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">
                      ₽
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    С карты
                  </label>
                  <select
                    value={selectedCardId}
                    onChange={(e) => setSelectedCardId(Number(e.target.value))}
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl font-medium"
                  >
                    {cards.map(card => (
                      <option key={card.id} value={card.id}>
                        •••• {card.number} ({card.balance.toFixed(2)} ₽)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Комментарий (необязательно)
                  </label>
                  <Input
                    placeholder="Добавить комментарий"
                    value={transferComment}
                    onChange={(e) => setTransferComment(e.target.value)}
                    className="h-12"
                  />
                </div>
              </div>
            </Card>

            <Button 
              onClick={handleTransfer}
              className="w-full h-14 bg-[#21A038] hover:bg-[#1a8030] text-white rounded-2xl text-base font-medium transition-all hover:scale-105"
              disabled={!transferAmount || !transferRecipient}
            >
              Перевести {transferAmount ? `${parseFloat(transferAmount).toLocaleString('ru-RU')} ₽` : ''}
            </Button>
          </div>

          <NavBar />
        </div>
      </div>
    );
  }

  if (page === 'payments') {
    const paymentCategories = [
      { icon: 'Smartphone', title: 'Мобильная связь', color: 'bg-blue-500' },
      { icon: 'Zap', title: 'ЖКХ', color: 'bg-orange-500' },
      { icon: 'Wifi', title: 'Интернет и ТВ', color: 'bg-purple-500' },
      { icon: 'Car', title: 'Штрафы ГИБДД', color: 'bg-red-500' },
      { icon: 'Building', title: 'Налоги', color: 'bg-green-500' },
      { icon: 'GraduationCap', title: 'Образование', color: 'bg-indigo-500' },
    ];

    return (
      <div className="min-h-screen bg-[#f5f5f5] pb-20 animate-fade-in">
        <div className="max-w-md mx-auto">
          <Header title="Платежи" />

          <div className="p-4 space-y-4">
            <div className="relative">
              <Icon name="Search" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Поиск услуг и организаций"
                className="h-12 pl-12 rounded-2xl"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {paymentCategories.map((category, index) => (
                <Card
                  key={index}
                  className="p-4 text-center cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                >
                  <div className={`w-14 h-14 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                    <Icon name={category.icon as any} size={24} className="text-white" />
                  </div>
                  <p className="text-xs font-medium text-gray-900">{category.title}</p>
                </Card>
              ))}
            </div>
          </div>

          <NavBar />
        </div>
      </div>
    );
  }

  if (page === 'history') {
    return (
      <div className="min-h-screen bg-[#f5f5f5] pb-20 animate-fade-in">
        <div className="max-w-md mx-auto">
          <Header title="История операций" />

          <div className="p-4 space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <Badge variant="secondary" className="px-4 py-2 bg-[#21A038] text-white hover:bg-[#1a8030] cursor-pointer whitespace-nowrap">
                Все
              </Badge>
              <Badge variant="outline" className="px-4 py-2 hover:bg-gray-100 cursor-pointer whitespace-nowrap">
                Расходы
              </Badge>
              <Badge variant="outline" className="px-4 py-2 hover:bg-gray-100 cursor-pointer whitespace-nowrap">
                Доходы
              </Badge>
              <Badge variant="outline" className="px-4 py-2 hover:bg-gray-100 cursor-pointer whitespace-nowrap">
                Переводы
              </Badge>
            </div>

            <Card className="bg-white rounded-3xl divide-y">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-all"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    tx.type === 'income' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Icon 
                      name={tx.icon as any} 
                      size={20} 
                      className={tx.type === 'income' ? 'text-green-600' : 'text-gray-600'}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{tx.title}</p>
                    <p className="text-xs text-gray-500">{tx.date} • {tx.category}</p>
                  </div>
                  <span className={`font-bold text-lg flex-shrink-0 ${
                    tx.type === 'income' ? 'text-green-600' : 'text-gray-900'
                  }`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              ))}
            </Card>
          </div>

          <NavBar />
        </div>
      </div>
    );
  }

  if (page === 'savings') {
    return (
      <div className="min-h-screen bg-[#f0effa] pb-20 animate-fade-in">
        <div className="max-w-md mx-auto">
          <Header title="Накопления" />

          <div className="p-4 space-y-4">
            <Card className="bg-white rounded-3xl p-6">
              <p className="text-sm text-gray-600 mb-1">Всего средств на всех счетах</p>
              <p className="text-4xl font-bold mb-4">{formatBalance(totalBalance)} ₽</p>
              <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-3" />
              <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                <span className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-[#21A038] rounded-full" />
                  Карты
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-purple-500 rounded-full" />
                  Вклады
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-pink-500 rounded-full" />
                  Инвестиции
                </span>
              </div>
            </Card>

            <Card className="bg-white rounded-3xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Вклады и счета</h2>
                <Button variant="ghost" size="icon" className="text-[#21A038]">
                  <Icon name="Plus" size={24} />
                </Button>
              </div>
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border-2 border-green-200 cursor-pointer hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                    <Icon name="Vault" size={24} className="text-[#21A038]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 mb-1">Откройте вклад онлайн</p>
                    <p className="text-xs text-gray-600">До 13,5% годовых • От 1000 ₽</p>
                  </div>
                  <Icon name="ChevronRight" size={20} className="text-gray-400" />
                </div>
              </Card>
            </Card>

            <Card className="bg-white rounded-3xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Инвестиции</h2>
                <Button variant="ghost" size="icon" className="text-[#21A038]">
                  <Icon name="Plus" size={24} />
                </Button>
              </div>
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border-2 border-blue-200 cursor-pointer hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                    <Icon name="TrendingUp" size={24} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 mb-1">Начать инвестировать</p>
                    <p className="text-xs text-gray-600">Просто и выгодно</p>
                  </div>
                  <Icon name="ChevronRight" size={20} className="text-gray-400" />
                </div>
              </Card>
            </Card>
          </div>

          <NavBar />
        </div>
      </div>
    );
  }

  if (page === 'profile') {
    return (
      <div className="min-h-screen bg-[#f5f5f5] pb-20 animate-fade-in">
        <div className="max-w-md mx-auto">
          <Header title="Профиль" />

          <div className="p-4 space-y-4">
            <Card 
              className="bg-white rounded-3xl p-6 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => setPage('profile-details')}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-[#21A038] to-[#1a8030] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {userProfile.firstName[0]}{userProfile.lastName[0]}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    {userProfile.lastName} {userProfile.firstName}
                  </h3>
                  <p className="text-gray-600">{userProfile.phone}</p>
                </div>
                <Icon name="ChevronRight" size={20} className="text-gray-400" />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Дата рождения</p>
                  <p className="font-medium">{userProfile.birthDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="font-medium text-sm truncate">{userProfile.email}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-white rounded-3xl p-4">
              <div className="space-y-2">
                {[
                  { icon: 'Settings', title: 'Настройки', page: 'settings' as Page },
                  { icon: 'Shield', title: 'Безопасность', page: 'security' as Page },
                  { icon: 'Bell', title: 'Уведомления', page: 'notifications' as Page },
                  { icon: 'FileText', title: 'Документы', page: 'documents' as Page },
                  { icon: 'HelpCircle', title: 'Помощь и поддержка', page: 'profile' as Page },
                ].map((item, index) => (
                  <div
                    key={index}
                    onClick={() => setPage(item.page)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Icon name={item.icon as any} size={20} className="text-[#21A038]" />
                      <span className="font-medium text-gray-900">{item.title}</span>
                    </div>
                    <Icon name="ChevronRight" size={20} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>
            </Card>

            <Button
              onClick={() => window.location.href = '/admin'}
              variant="outline"
              className="w-full h-12 border-[#21A038] text-[#21A038] hover:bg-[#21A038] hover:text-white rounded-2xl transition-all"
            >
              <Icon name="Shield" size={18} className="mr-2" />
              Админ-панель
            </Button>

            <Button
              onClick={() => setPage('login')}
              variant="outline"
              className="w-full h-12 border-red-300 text-red-600 hover:bg-red-50 rounded-2xl transition-all"
            >
              <Icon name="LogOut" size={18} className="mr-2" />
              Выйти из аккаунта
            </Button>
          </div>

          <NavBar />
        </div>
      </div>
    );
  }

  if (page === 'profile-details') {
    return (
      <div className="min-h-screen bg-[#f5f5f5] pb-20 animate-fade-in">
        <div className="max-w-md mx-auto">
          <header className="bg-white border-b sticky top-0 z-40">
            <div className="px-4 py-4 flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPage('profile')}
                className="hover:bg-gray-100 transition-all"
              >
                <Icon name="ArrowLeft" size={24} />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">Личные данные</h1>
            </div>
          </header>

          <div className="p-4 space-y-4">
            <Card className="bg-white rounded-3xl p-6">
              <div className="flex items-center justify-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-[#21A038] to-[#1a8030] rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  {userProfile.firstName[0]}{userProfile.lastName[0]}
                </div>
              </div>

              <div className="space-y-4">
                <div className="pb-4 border-b">
                  <p className="text-sm text-gray-500 mb-1">Фамилия</p>
                  <p className="text-lg font-medium">{userProfile.lastName}</p>
                </div>

                <div className="pb-4 border-b">
                  <p className="text-sm text-gray-500 mb-1">Имя</p>
                  <p className="text-lg font-medium">{userProfile.firstName}</p>
                </div>

                <div className="pb-4 border-b">
                  <p className="text-sm text-gray-500 mb-1">Отчество</p>
                  <p className="text-lg font-medium">{userProfile.middleName}</p>
                </div>

                <div className="pb-4 border-b">
                  <p className="text-sm text-gray-500 mb-1">Дата рождения</p>
                  <p className="text-lg font-medium">{userProfile.birthDate}</p>
                </div>

                <div className="pb-4 border-b">
                  <p className="text-sm text-gray-500 mb-1">Телефон</p>
                  <p className="text-lg font-medium">{userProfile.phone}</p>
                </div>

                <div className="pb-4 border-b">
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-lg font-medium">{userProfile.email}</p>
                </div>

                <div className="pb-4 border-b">
                  <p className="text-sm text-gray-500 mb-1">Паспорт</p>
                  <p className="text-lg font-medium">{userProfile.passport}</p>
                </div>

                <div className="pb-4">
                  <p className="text-sm text-gray-500 mb-1">ИНН</p>
                  <p className="text-lg font-medium">{userProfile.inn}</p>
                </div>
              </div>
            </Card>

            <Button className="w-full h-12 bg-[#21A038] hover:bg-[#1a8030] text-white rounded-2xl">
              <Icon name="Edit" size={18} className="mr-2" />
              Редактировать данные
            </Button>
          </div>

          <NavBar />
        </div>
      </div>
    );
  }

  if (page === 'settings') {
    return (
      <div className="min-h-screen bg-[#f5f5f5] pb-20 animate-fade-in">
        <div className="max-w-md mx-auto">
          <header className="bg-white border-b sticky top-0 z-40">
            <div className="px-4 py-4 flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPage('profile')}
                className="hover:bg-gray-100 transition-all"
              >
                <Icon name="ArrowLeft" size={24} />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">Настройки</h1>
            </div>
          </header>

          <div className="p-4 space-y-4">
            <Card className="bg-white rounded-3xl p-4">
              <h3 className="font-bold mb-3">Общие</h3>
              <div className="space-y-3">
                {[
                  { title: 'Язык приложения', value: 'Русский' },
                  { title: 'Валюта', value: 'Российский рубль (₽)' },
                  { title: 'Часовой пояс', value: 'МСК (UTC+3)' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl cursor-pointer">
                    <span className="font-medium">{item.title}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 text-sm">{item.value}</span>
                      <Icon name="ChevronRight" size={16} className="text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-white rounded-3xl p-4">
              <h3 className="font-bold mb-3">Отображение</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3">
                  <span className="font-medium">Показывать баланс</span>
                  <button className={`w-12 h-6 rounded-full transition-colors ${showBalance ? 'bg-[#21A038]' : 'bg-gray-300'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${showBalance ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
                <div className="flex justify-between items-center p-3">
                  <span className="font-medium">Темная тема</span>
                  <button className="w-12 h-6 rounded-full bg-gray-300">
                    <div className="w-5 h-5 bg-white rounded-full translate-x-1" />
                  </button>
                </div>
              </div>
            </Card>
          </div>

          <NavBar />
        </div>
      </div>
    );
  }

  if (page === 'security') {
    return (
      <div className="min-h-screen bg-[#f5f5f5] pb-20 animate-fade-in">
        <div className="max-w-md mx-auto">
          <header className="bg-white border-b sticky top-0 z-40">
            <div className="px-4 py-4 flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPage('profile')}
                className="hover:bg-gray-100 transition-all"
              >
                <Icon name="ArrowLeft" size={24} />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">Безопасность</h1>
            </div>
          </header>

          <div className="p-4 space-y-4">
            <Card className="bg-white rounded-3xl p-4">
              <h3 className="font-bold mb-3">Вход и авторизация</h3>
              <div className="space-y-2">
                {[
                  { icon: 'Key', title: 'Изменить пароль' },
                  { icon: 'Fingerprint', title: 'Вход по отпечатку пальца' },
                  { icon: 'Lock', title: 'Изменить PIN-код' },
                  { icon: 'Smartphone', title: 'Вход по SMS' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer">
                    <Icon name={item.icon as any} size={20} className="text-[#21A038]" />
                    <span className="font-medium flex-1">{item.title}</span>
                    <Icon name="ChevronRight" size={16} className="text-gray-400" />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-white rounded-3xl p-4">
              <h3 className="font-bold mb-3">Активные сессии</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon name="Monitor" size={20} className="text-[#21A038]" />
                    <div className="flex-1">
                      <p className="font-medium">Текущее устройство</p>
                      <p className="text-xs text-gray-500">Москва • Сейчас</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <NavBar />
        </div>
      </div>
    );
  }

  if (page === 'notifications') {
    return (
      <div className="min-h-screen bg-[#f5f5f5] pb-20 animate-fade-in">
        <div className="max-w-md mx-auto">
          <header className="bg-white border-b sticky top-0 z-40">
            <div className="px-4 py-4 flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPage('profile')}
                className="hover:bg-gray-100 transition-all"
              >
                <Icon name="ArrowLeft" size={24} />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">Уведомления</h1>
            </div>
          </header>

          <div className="p-4 space-y-4">
            <Card className="bg-white rounded-3xl p-4">
              <h3 className="font-bold mb-3">Push-уведомления</h3>
              <div className="space-y-3">
                {[
                  { title: 'Операции по картам', enabled: true },
                  { title: 'Акции и предложения', enabled: false },
                  { title: 'Новости банка', enabled: true },
                  { title: 'Платежи и переводы', enabled: true },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-3">
                    <span className="font-medium">{item.title}</span>
                    <button className={`w-12 h-6 rounded-full transition-colors ${item.enabled ? 'bg-[#21A038]' : 'bg-gray-300'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${item.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-white rounded-3xl p-4">
              <h3 className="font-bold mb-3">Email-уведомления</h3>
              <div className="space-y-3">
                {[
                  { title: 'Выписки по счетам', enabled: true },
                  { title: 'Рассылки и новости', enabled: false },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-3">
                    <span className="font-medium">{item.title}</span>
                    <button className={`w-12 h-6 rounded-full transition-colors ${item.enabled ? 'bg-[#21A038]' : 'bg-gray-300'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${item.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <NavBar />
        </div>
      </div>
    );
  }

  if (page === 'documents') {
    return (
      <div className="min-h-screen bg-[#f5f5f5] pb-20 animate-fade-in">
        <div className="max-w-md mx-auto">
          <header className="bg-white border-b sticky top-0 z-40">
            <div className="px-4 py-4 flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPage('profile')}
                className="hover:bg-gray-100 transition-all"
              >
                <Icon name="ArrowLeft" size={24} />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">Документы</h1>
            </div>
          </header>

          <div className="p-4 space-y-4">
            <Card className="bg-white rounded-3xl p-4">
              <h3 className="font-bold mb-3">Договоры и соглашения</h3>
              <div className="space-y-2">
                {[
                  { icon: 'FileText', title: 'Договор банковского обслуживания', date: '15.03.2024' },
                  { icon: 'FileText', title: 'Тарифы и условия', date: '15.03.2024' },
                  { icon: 'FileText', title: 'Согласие на обработку данных', date: '15.03.2024' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer">
                    <Icon name={item.icon as any} size={20} className="text-[#21A038]" />
                    <div className="flex-1">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.date}</p>
                    </div>
                    <Icon name="Download" size={16} className="text-gray-400" />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-white rounded-3xl p-4">
              <h3 className="font-bold mb-3">Выписки и справки</h3>
              <div className="space-y-2">
                {[
                  { icon: 'Receipt', title: 'Выписка за октябрь 2024', date: '15.10.2024' },
                  { icon: 'Receipt', title: 'Выписка за сентябрь 2024', date: '30.09.2024' },
                  { icon: 'FileCheck', title: 'Справка о состоянии счета', date: '10.10.2024' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer">
                    <Icon name={item.icon as any} size={20} className="text-[#21A038]" />
                    <div className="flex-1">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.date}</p>
                    </div>
                    <Icon name="Download" size={16} className="text-gray-400" />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <NavBar />
        </div>
      </div>
    );
  }

  return null;
}