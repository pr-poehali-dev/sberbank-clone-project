import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Transaction {
  id: number;
  type: string;
  amount: number;
  date: string;
  description: string;
}

interface BankCard {
  id: number;
  name: string;
  number: string;
  balance: number;
  type: string;
}

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('main');

  const cards: BankCard[] = [
    { id: 1, name: 'Дебетовая карта', number: '12228 50000', balance: 156780.50, type: 'debit' },
    { id: 2, name: 'Кредитная карта', number: '0090 0024', balance: 45000, type: 'credit' }
  ];

  const transactions: Transaction[] = [
    { id: 1, type: 'expense', amount: -450, date: '15 окт 2025', description: 'Магазин Пятёрочка' },
    { id: 2, type: 'income', amount: 5000, date: '14 окт 2025', description: 'Перевод от Ивана М.' },
    { id: 3, type: 'expense', amount: -1200, date: '14 окт 2025', description: 'Оплата интернета' },
    { id: 4, type: 'expense', amount: -890, date: '13 окт 2025', description: 'Ресторан' },
    { id: 5, type: 'income', amount: 75000, date: '10 окт 2025', description: 'Зачисление зарплаты' }
  ];

  const handleLogin = () => {
    if (login && password) {
      setIsLoggedIn(true);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#21A038] to-[#147B2C] flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 bg-[#21A038] rounded-2xl flex items-center justify-center">
                <Icon name="Landmark" size={32} className="text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-[#333333]">СберБанк Онлайн</CardTitle>
            <p className="text-muted-foreground mt-2">Войдите в личный кабинет</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#333333]">Логин</label>
              <Input
                type="text"
                placeholder="Введите логин"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#333333]">Пароль</label>
              <Input
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
              />
            </div>
            <Button
              onClick={handleLogin}
              className="w-full h-12 bg-[#21A038] hover:bg-[#147B2C] text-white font-medium text-base"
            >
              Войти
            </Button>
            <div className="text-center">
              <a href="#" className="text-sm text-[#21A038] hover:underline">
                Забыли пароль?
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#21A038] rounded-xl flex items-center justify-center">
              <Icon name="Landmark" size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-[#333333]">СберБанк</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsLoggedIn(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="LogOut" size={20} />
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-6 w-full bg-white border h-auto p-1">
            <TabsTrigger value="main" className="data-[state=active]:bg-[#21A038] data-[state=active]:text-white">
              <Icon name="Home" size={18} className="mr-2" />
              Главная
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-[#21A038] data-[state=active]:text-white">
              <Icon name="CreditCard" size={18} className="mr-2" />
              Платежи
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-[#21A038] data-[state=active]:text-white">
              <Icon name="Clock" size={18} className="mr-2" />
              История
            </TabsTrigger>
            <TabsTrigger value="transfers" className="data-[state=active]:bg-[#21A038] data-[state=active]:text-white">
              <Icon name="ArrowLeftRight" size={18} className="mr-2" />
              Переводы
            </TabsTrigger>
            <TabsTrigger value="cards" className="data-[state=active]:bg-[#21A038] data-[state=active]:text-white">
              <Icon name="Wallet" size={18} className="mr-2" />
              Карты
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-[#21A038] data-[state=active]:text-white">
              <Icon name="User" size={18} className="mr-2" />
              Профиль
            </TabsTrigger>
          </TabsList>

          <TabsContent value="main" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#333333] mb-4">Мои счета</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {cards.map((card) => (
                  <Card key={card.id} className="border-2 hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg font-medium text-[#333333]">{card.name}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">••{card.number}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="text-[#21A038]">
                          <Icon name="MoreVertical" size={20} />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-3xl font-bold text-[#333333]">
                          {card.balance.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽
                        </p>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" className="bg-[#21A038] hover:bg-[#147B2C] text-white flex-1">
                            <Icon name="Send" size={16} className="mr-1" />
                            Перевести
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 border-[#21A038] text-[#21A038]">
                            <Icon name="Plus" size={16} className="mr-1" />
                            Пополнить
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#333333] mb-4">Быстрые действия</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-[#21A038]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Icon name="Smartphone" size={24} className="text-[#21A038]" />
                    </div>
                    <p className="text-sm font-medium text-[#333333]">Мобильный</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-[#21A038]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Icon name="Zap" size={24} className="text-[#21A038]" />
                    </div>
                    <p className="text-sm font-medium text-[#333333]">Коммуналка</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-[#21A038]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Icon name="Users" size={24} className="text-[#21A038]" />
                    </div>
                    <p className="text-sm font-medium text-[#333333]">Перевод</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-[#21A038]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Icon name="ShoppingCart" size={24} className="text-[#21A038]" />
                    </div>
                    <p className="text-sm font-medium text-[#333333]">Покупки</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <h2 className="text-2xl font-bold text-[#333333]">Платежи и переводы</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <Icon name="Smartphone" size={32} className="text-[#21A038] mb-3" />
                  <h3 className="font-bold text-[#333333] mb-1">Мобильная связь</h3>
                  <p className="text-sm text-muted-foreground">Пополнение телефона</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <Icon name="Zap" size={32} className="text-[#21A038] mb-3" />
                  <h3 className="font-bold text-[#333333] mb-1">ЖКХ</h3>
                  <p className="text-sm text-muted-foreground">Оплата коммунальных услуг</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <Icon name="Wifi" size={32} className="text-[#21A038] mb-3" />
                  <h3 className="font-bold text-[#333333] mb-1">Интернет и ТВ</h3>
                  <p className="text-sm text-muted-foreground">Оплата провайдеров</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <Icon name="Car" size={32} className="text-[#21A038] mb-3" />
                  <h3 className="font-bold text-[#333333] mb-1">Штрафы ГИБДД</h3>
                  <p className="text-sm text-muted-foreground">Проверка и оплата</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <Icon name="Building" size={32} className="text-[#21A038] mb-3" />
                  <h3 className="font-bold text-[#333333] mb-1">Налоги</h3>
                  <p className="text-sm text-muted-foreground">Уплата налогов</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <Icon name="Receipt" size={32} className="text-[#21A038] mb-3" />
                  <h3 className="font-bold text-[#333333] mb-1">По реквизитам</h3>
                  <p className="text-sm text-muted-foreground">Произвольный платёж</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#333333]">История операций</h2>
              <Button variant="outline" size="sm" className="border-[#21A038] text-[#21A038]">
                <Icon name="Filter" size={16} className="mr-2" />
                Фильтры
              </Button>
            </div>
            <Card>
              <CardContent className="p-0">
                {transactions.map((transaction, index) => (
                  <div
                    key={transaction.id}
                    className={`p-4 flex items-center justify-between hover:bg-muted/50 transition-colors ${
                      index !== transactions.length - 1 ? 'border-b' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                        }`}
                      >
                        <Icon
                          name={transaction.type === 'income' ? 'ArrowDownLeft' : 'ArrowUpRight'}
                          size={20}
                          className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-[#333333]">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-[#333333]'
                      }`}
                    >
                      {transaction.amount > 0 ? '+' : ''}
                      {transaction.amount.toLocaleString('ru-RU')} ₽
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transfers" className="space-y-4">
            <h2 className="text-2xl font-bold text-[#333333]">Переводы</h2>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Новый перевод</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#333333]">Номер карты получателя</label>
                  <Input placeholder="0000 0000 0000 0000" className="h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#333333]">Сумма</label>
                  <Input placeholder="0" type="number" className="h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#333333]">Комментарий</label>
                  <Input placeholder="Необязательно" className="h-12" />
                </div>
                <Button className="w-full h-12 bg-[#21A038] hover:bg-[#147B2C] text-white">
                  <Icon name="Send" size={18} className="mr-2" />
                  Отправить перевод
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cards" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#333333]">Мои карты</h2>
              <Button className="bg-[#21A038] hover:bg-[#147B2C] text-white">
                <Icon name="Plus" size={18} className="mr-2" />
                Заказать карту
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {cards.map((card) => (
                <Card key={card.id} className="overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-[#21A038] to-[#147B2C] p-6 text-white flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <Icon name="CreditCard" size={32} />
                      <span className="text-sm font-medium">{card.type === 'debit' ? 'Дебетовая' : 'Кредитная'}</span>
                    </div>
                    <div>
                      <p className="text-lg tracking-wider mb-3">•••• {card.number}</p>
                      <p className="text-2xl font-bold">{card.balance.toLocaleString('ru-RU')} ₽</p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Детали
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Настройки
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <h2 className="text-2xl font-bold text-[#333333]">Профиль</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-[#21A038] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    АБ
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#333333]">Александр Белов</h3>
                    <p className="text-muted-foreground">+7 (900) 123-45-67</p>
                  </div>
                </div>
                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between items-center py-2 hover:bg-muted/50 px-3 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Icon name="Settings" size={20} className="text-[#21A038]" />
                      <span className="font-medium text-[#333333]">Настройки</span>
                    </div>
                    <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                  </div>
                  <div className="flex justify-between items-center py-2 hover:bg-muted/50 px-3 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Icon name="Shield" size={20} className="text-[#21A038]" />
                      <span className="font-medium text-[#333333]">Безопасность</span>
                    </div>
                    <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                  </div>
                  <div className="flex justify-between items-center py-2 hover:bg-muted/50 px-3 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Icon name="Bell" size={20} className="text-[#21A038]" />
                      <span className="font-medium text-[#333333]">Уведомления</span>
                    </div>
                    <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                  </div>
                  <div className="flex justify-between items-center py-2 hover:bg-muted/50 px-3 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Icon name="HelpCircle" size={20} className="text-[#21A038]" />
                      <span className="font-medium text-[#333333]">Помощь</span>
                    </div>
                    <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
