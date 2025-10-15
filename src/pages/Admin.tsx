import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

interface CardData {
  id: number;
  name: string;
  number: string;
  balance: number;
  type: 'debit' | 'credit';
  currency: string;
  blocked?: boolean;
}

interface Transaction {
  id: number;
  title: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  icon: string;
}

export default function Admin() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingCard, setEditingCard] = useState<CardData | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    const savedCards = localStorage.getItem('sber_cards');
    const savedTransactions = localStorage.getItem('sber_transactions');
    
    if (savedCards) setCards(JSON.parse(savedCards));
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
  }, []);

  const saveCards = (newCards: CardData[]) => {
    setCards(newCards);
    localStorage.setItem('sber_cards', JSON.stringify(newCards));
  };

  const saveTransactions = (newTransactions: Transaction[]) => {
    setTransactions(newTransactions);
    localStorage.setItem('sber_transactions', JSON.stringify(newTransactions));
  };

  const handleAddCard = () => {
    const newCard: CardData = {
      id: Date.now(),
      name: 'Новая карта',
      number: Math.random().toString().slice(2, 6),
      balance: 0,
      type: 'debit',
      currency: '₽',
    };
    saveCards([...cards, newCard]);
  };

  const handleUpdateCard = (card: CardData) => {
    saveCards(cards.map(c => c.id === card.id ? card : c));
    setEditingCard(null);
  };

  const handleDeleteCard = (id: number) => {
    saveCards(cards.filter(c => c.id !== id));
  };

  const handleAddTransaction = () => {
    const newTransaction: Transaction = {
      id: Date.now(),
      title: 'Новая операция',
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }),
      amount: 0,
      type: 'expense',
      category: 'Прочее',
      icon: 'CircleDollarSign',
    };
    saveTransactions([newTransaction, ...transactions]);
  };

  const handleUpdateTransaction = (transaction: Transaction) => {
    saveTransactions(transactions.map(t => t.id === transaction.id ? transaction : t));
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: number) => {
    saveTransactions(transactions.filter(t => t.id !== id));
  };

  const resetToDefaults = () => {
    localStorage.removeItem('sber_cards');
    localStorage.removeItem('sber_transactions');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="Shield" size={24} className="text-[#21A038]" />
            <h1 className="text-xl font-bold">Админ-панель СберБанк</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={resetToDefaults}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <Icon name="RotateCcw" size={16} className="mr-2" />
              Сбросить данные
            </Button>
            <Button
              onClick={() => window.location.href = '/'}
              className="bg-[#21A038] hover:bg-[#1a8030]"
            >
              <Icon name="Home" size={16} className="mr-2" />
              На главную
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="cards" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="cards">Карты</TabsTrigger>
            <TabsTrigger value="transactions">Транзакции</TabsTrigger>
          </TabsList>

          <TabsContent value="cards" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Управление картами</h2>
              <Button onClick={handleAddCard} className="bg-[#21A038] hover:bg-[#1a8030]">
                <Icon name="Plus" size={16} className="mr-2" />
                Добавить карту
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cards.map((card) => (
                <Card key={card.id} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-br from-[#21A038] to-[#1a8030] text-white">
                    <CardTitle className="text-lg flex justify-between items-start">
                      {card.name}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteCard(card.id)}
                        className="text-white hover:bg-white/20"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </CardTitle>
                    <p className="text-sm opacity-90">•••• {card.number}</p>
                    <p className="text-2xl font-bold mt-2">
                      {card.balance.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} {card.currency}
                    </p>
                  </CardHeader>
                  <CardContent className="p-4">
                    {editingCard?.id === card.id ? (
                      <div className="space-y-3">
                        <Input
                          placeholder="Название"
                          value={editingCard.name}
                          onChange={(e) => setEditingCard({ ...editingCard, name: e.target.value })}
                        />
                        <Input
                          placeholder="Последние 4 цифры"
                          value={editingCard.number}
                          onChange={(e) => setEditingCard({ ...editingCard, number: e.target.value })}
                        />
                        <Input
                          type="number"
                          placeholder="Баланс"
                          value={editingCard.balance}
                          onChange={(e) => setEditingCard({ ...editingCard, balance: parseFloat(e.target.value) })}
                        />
                        <select
                          value={editingCard.type}
                          onChange={(e) => setEditingCard({ ...editingCard, type: e.target.value as 'debit' | 'credit' })}
                          className="w-full p-2 border rounded"
                        >
                          <option value="debit">Дебетовая</option>
                          <option value="credit">Кредитная</option>
                        </select>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editingCard.blocked}
                            onChange={(e) => setEditingCard({ ...editingCard, blocked: e.target.checked })}
                          />
                          <span className="text-sm">Заблокирована</span>
                        </label>
                        <div className="flex gap-2">
                          <Button onClick={() => handleUpdateCard(editingCard)} className="flex-1">
                            Сохранить
                          </Button>
                          <Button onClick={() => setEditingCard(null)} variant="outline" className="flex-1">
                            Отмена
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Тип:</span>
                          <Badge variant={card.type === 'debit' ? 'default' : 'secondary'}>
                            {card.type === 'debit' ? 'Дебетовая' : 'Кредитная'}
                          </Badge>
                        </div>
                        {card.blocked && (
                          <Badge variant="destructive" className="w-full justify-center">
                            Заблокирована
                          </Badge>
                        )}
                        <Button
                          onClick={() => setEditingCard(card)}
                          variant="outline"
                          className="w-full mt-2"
                        >
                          <Icon name="Edit" size={16} className="mr-2" />
                          Редактировать
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Управление транзакциями</h2>
              <Button onClick={handleAddTransaction} className="bg-[#21A038] hover:bg-[#1a8030]">
                <Icon name="Plus" size={16} className="mr-2" />
                Добавить транзакцию
              </Button>
            </div>

            <Card>
              <CardContent className="p-0 divide-y">
                {transactions.map((tx) => (
                  <div key={tx.id} className="p-4">
                    {editingTransaction?.id === tx.id ? (
                      <div className="space-y-3">
                        <Input
                          placeholder="Название"
                          value={editingTransaction.title}
                          onChange={(e) => setEditingTransaction({ ...editingTransaction, title: e.target.value })}
                        />
                        <Input
                          placeholder="Дата"
                          value={editingTransaction.date}
                          onChange={(e) => setEditingTransaction({ ...editingTransaction, date: e.target.value })}
                        />
                        <Input
                          type="number"
                          placeholder="Сумма"
                          value={editingTransaction.amount}
                          onChange={(e) => setEditingTransaction({ ...editingTransaction, amount: parseFloat(e.target.value) })}
                        />
                        <select
                          value={editingTransaction.type}
                          onChange={(e) => setEditingTransaction({ ...editingTransaction, type: e.target.value as 'income' | 'expense' })}
                          className="w-full p-2 border rounded"
                        >
                          <option value="expense">Расход</option>
                          <option value="income">Доход</option>
                        </select>
                        <Input
                          placeholder="Категория"
                          value={editingTransaction.category}
                          onChange={(e) => setEditingTransaction({ ...editingTransaction, category: e.target.value })}
                        />
                        <Input
                          placeholder="Иконка (название из lucide-react)"
                          value={editingTransaction.icon}
                          onChange={(e) => setEditingTransaction({ ...editingTransaction, icon: e.target.value })}
                        />
                        <div className="flex gap-2">
                          <Button onClick={() => handleUpdateTransaction(editingTransaction)} className="flex-1">
                            Сохранить
                          </Button>
                          <Button onClick={() => setEditingTransaction(null)} variant="outline" className="flex-1">
                            Отмена
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          tx.type === 'income' ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <Icon 
                            name={tx.icon as any} 
                            size={20} 
                            className={tx.type === 'income' ? 'text-green-600' : 'text-gray-600'}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{tx.title}</p>
                          <p className="text-sm text-gray-500">{tx.date} • {tx.category}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-lg ${
                            tx.type === 'income' ? 'text-green-600' : 'text-gray-900'
                          }`}>
                            {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('ru-RU')} ₽
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingTransaction(tx)}
                          >
                            <Icon name="Edit" size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteTransaction(tx.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
