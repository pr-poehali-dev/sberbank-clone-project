import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type Page = 'login' | 'sms' | 'pincode' | 'main' | 'wallet';

export default function Index() {
  const [page, setPage] = useState<Page>('pincode');
  const [smsCode, setSmsCode] = useState(['', '', '', '']);
  const [pinCode, setPinCode] = useState(['', '', '', '', '']);

  const handleSmsInput = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...smsCode];
      newCode[index] = value;
      setSmsCode(newCode);
      if (value && index < 3) {
        document.getElementById(`sms-${index + 1}`)?.focus();
      }
    }
  };

  const handlePinInput = (num: string) => {
    const firstEmpty = pinCode.findIndex(v => !v);
    if (firstEmpty !== -1) {
      const newCode = [...pinCode];
      newCode[firstEmpty] = num;
      setPinCode(newCode);
      if (firstEmpty === 4) {
        setTimeout(() => setPage('main'), 300);
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

  if (page === 'sms') {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <Icon name="CheckCircle2" size={28} className="text-[#21A038]" />
              <span className="text-[#21A038] text-xl font-bold">СБЕР БАНК</span>
            </div>
          </div>
          
          <Button
            onClick={() => setPage('pincode')}
            variant="ghost"
            className="mb-6 p-0 h-auto hover:bg-transparent"
          >
            <Icon name="ArrowLeft" size={24} className="text-gray-700" />
          </Button>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Введите код из СМС</h1>
          <p className="text-gray-500 text-sm mb-6">Мы отправили его на ваш номер</p>

          <div className="flex gap-3 mb-4">
            {smsCode.map((digit, i) => (
              <Input
                key={i}
                id={`sms-${i}`}
                value={digit}
                onChange={(e) => handleSmsInput(i, e.target.value)}
                className="w-16 h-16 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-[#21A038]"
                maxLength={1}
              />
            ))}
          </div>

          <p className="text-sm text-gray-600 mb-2">Через 1:59 можно получить новый код</p>
          <button className="text-[#21A038] text-sm font-medium">Не пришёл код</button>
        </Card>
      </div>
    );
  }

  if (page === 'pincode') {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <Icon name="CheckCircle2" size={28} className="text-[#21A038]" />
              <span className="text-[#21A038] text-xl font-bold">СБЕР БАНК</span>
            </div>
          </div>

          <Button
            onClick={() => setPage('sms')}
            variant="ghost"
            className="mb-6 p-0 h-auto hover:bg-transparent"
          >
            <Icon name="ArrowLeft" size={24} className="text-gray-700" />
          </Button>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Придумайте код для входа</h1>
          <p className="text-gray-500 text-sm mb-8">
            В следующий раз сможете войти по этому коду без пароля или номера карты
          </p>

          <div className="flex gap-3 justify-center mb-8">
            {pinCode.map((digit, i) => (
              <div
                key={i}
                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-xl font-bold transition-all ${
                  digit ? 'bg-gray-200 border-gray-300 text-gray-700' : 'bg-gray-100 border-gray-200 text-transparent'
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
                className="h-16 text-2xl font-bold bg-gray-100 hover:bg-gray-200 rounded-2xl"
              >
                {num}
              </Button>
            ))}
            <div />
            <Button
              onClick={() => handlePinInput('0')}
              variant="ghost"
              className="h-16 text-2xl font-bold bg-gray-100 hover:bg-gray-200 rounded-2xl"
            >
              0
            </Button>
            <Button
              onClick={handlePinDelete}
              variant="ghost"
              className="h-16 bg-gray-100 hover:bg-gray-200 rounded-2xl"
            >
              <Icon name="Delete" size={24} />
            </Button>
          </div>

          <button className="text-[#21A038] text-sm font-medium w-full">Войти без кода</button>
          <p className="text-center text-xs text-gray-500 mt-4">
            Или настройте вход по <a href="#" className="text-[#21A038] underline">логину и паролю</a>
          </p>
        </Card>
      </div>
    );
  }

  if (page === 'wallet') {
    return (
      <div className="min-h-screen bg-[#dcd9f0]">
        <div className="max-w-md mx-auto bg-[#dcd9f0] min-h-screen pb-20">
          <header className="p-4 flex items-center justify-between gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0" />
            <div className="flex-1 bg-white/60 backdrop-blur rounded-full px-4 py-2.5 flex items-center gap-2">
              <Icon name="Search" size={18} className="text-gray-500" />
              <span className="text-gray-600 text-sm">Поиск</span>
            </div>
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <Icon name="Grid3x3" size={24} />
            </Button>
          </header>

          <div className="px-4 py-2">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">Кошелёк</h1>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon">
                  <Icon name="MoreHorizontal" size={24} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Icon name="EyeOff" size={24} />
                </Button>
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              <Card className="min-w-[100px] max-w-[100px] bg-white rounded-3xl p-4 flex flex-col gap-3 h-40">
                <div className="flex-1 flex items-center justify-center">
                  <Icon name="QrCode" size={36} />
                </div>
                <div className="flex items-center justify-center">
                  <Icon name="Shield" size={28} />
                </div>
              </Card>

              <Card className="min-w-[220px] max-w-[220px] bg-white rounded-3xl p-4 relative h-40">
                <div className="flex gap-2 mb-3">
                  <div className="w-12 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-md" />
                  <div className="w-12 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-md" />
                </div>
                <div className="flex gap-3 text-xs text-gray-500 mb-2">
                  <span>2512</span>
                  <span>4771</span>
                </div>
                <p className="text-2xl font-bold mb-1">0 ₽</p>
                <p className="text-xs text-gray-500">Счёт •• 1253</p>
                <div className="absolute top-3 right-3">
                  <div className="px-2 py-1 bg-orange-100 text-orange-600 text-[10px] rounded font-medium">
                    Заблокирована
                  </div>
                </div>
              </Card>

              <Card className="min-w-[140px] max-w-[140px] bg-white rounded-3xl p-4 h-40">
                <div className="w-10 h-10 bg-[#21A038] rounded-xl flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-lg">Р</span>
                </div>
                <p className="text-2xl font-bold mb-1">0 ₽</p>
                <p className="text-xs text-gray-500">Счёт •• 5467</p>
              </Card>

              <Card className="min-w-[140px] max-w-[140px] bg-white rounded-3xl p-4 h-40">
                <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center mb-3">
                  <span className="text-gray-600 font-bold text-lg">С</span>
                </div>
                <p className="text-2xl font-bold mb-1">0</p>
                <p className="text-xs text-gray-500">СберСпасибо</p>
              </Card>
            </div>

            <Card className="bg-white rounded-3xl p-4 mb-4 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm mb-1">До 13,5% годовых</h3>
                <p className="text-xs text-gray-500">Откройте «Накопительный счёт»</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Icon name="Wallet" size={20} className="text-green-600" />
                </div>
                <Button className="bg-[#21A038] hover:bg-[#1a8030] text-white rounded-xl px-4 h-9 text-sm">
                  Открыть
                </Button>
              </div>
              <Button variant="ghost" size="icon" className="w-8 h-8 flex-shrink-0">
                <Icon name="X" size={18} className="text-gray-400" />
              </Button>
            </Card>

            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold">История</h2>
              <button className="text-[#21A038] font-medium text-sm">Все</button>
            </div>

            <Card className="bg-white rounded-3xl divide-y">
              <div className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="Building" size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">Григорий Андреевич Г.</p>
                  <p className="text-xs text-gray-500">7 октября • Перевод в банк-партнёр по номеру телефона</p>
                </div>
                <span className="font-bold flex-shrink-0">10 000 ₽</span>
              </div>

              <div className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="User" size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">Галина Александровна Б.</p>
                  <p className="text-xs text-gray-500">7 октября • Входящий перевод</p>
                </div>
                <span className="font-bold text-green-600 flex-shrink-0">+5 000 ₽</span>
              </div>

              <div className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="User" size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">Валерий Иванович Г.</p>
                  <p className="text-xs text-gray-500">7 октября • Входящий перевод</p>
                </div>
                <span className="font-bold text-green-600 flex-shrink-0">+5 000 ₽</span>
              </div>
            </Card>

            <div className="mt-6">
              <h2 className="text-xl font-bold mb-3">Переводы</h2>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {['ГА', 'ИО', 'КМ', 'АВ', 'ПН', 'ГА', 'МІС'].map((initials, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 min-w-[60px]">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center border-2 border-gray-200 relative">
                      <span className="font-bold text-sm">{initials}</span>
                      {i < 3 && (
                        <button className="absolute -top-1 -right-1 w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                          <Icon name="X" size={12} className="text-gray-600" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <nav className="fixed bottom-0 left-0 right-0 bg-white border-t max-w-md mx-auto">
            <div className="flex justify-around px-2 py-2">
              <Button
                variant="ghost"
                className="flex-col h-auto py-2 px-3 text-[#21A038]"
              >
                <Icon name="Home" size={24} />
                <span className="text-[10px] mt-1 font-medium">Главный</span>
              </Button>
              <Button 
                variant="ghost" 
                className="flex-col h-auto py-2 px-3"
                onClick={() => setPage('main')}
              >
                <Icon name="BarChart3" size={24} className="text-gray-600" />
                <span className="text-[10px] mt-1 text-gray-600">Накопления</span>
              </Button>
              <Button variant="ghost" className="flex-col h-auto py-2 px-3">
                <Icon name="Sparkles" size={24} className="text-gray-600" />
                <span className="text-[10px] mt-1 text-gray-600">Ассистент</span>
              </Button>
              <Button variant="ghost" className="flex-col h-auto py-2 px-3">
                <Icon name="Send" size={24} className="text-gray-600" />
                <span className="text-[10px] mt-1 text-gray-600">Платежи</span>
              </Button>
              <Button variant="ghost" className="flex-col h-auto py-2 px-3">
                <Icon name="Clock" size={24} className="text-gray-600" />
                <span className="text-[10px] mt-1 text-gray-600">История</span>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0effa]">
      <div className="max-w-md mx-auto bg-[#f0effa] min-h-screen pb-20">
        <header className="p-4 flex items-center justify-between gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0" />
          <div className="flex-1 bg-white/60 backdrop-blur rounded-full px-4 py-2.5 flex items-center gap-2">
            <Icon name="Search" size={18} className="text-gray-500" />
            <span className="text-gray-600 text-sm">Поиск</span>
          </div>
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <Icon name="Grid3x3" size={24} />
          </Button>
        </header>

        <div className="px-4 py-2">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Накопления</h1>
            <Button variant="ghost" size="icon">
              <Icon name="EyeOff" size={24} />
            </Button>
          </div>

          <Card className="bg-white rounded-3xl p-6 mb-6">
            <p className="text-sm text-gray-600 mb-1">Всего средств на всех счетах</p>
            <p className="text-4xl font-bold mb-4">127,19 ₽</p>
            <div className="h-2 bg-purple-500 rounded-full mb-3" />
            <div className="flex flex-wrap gap-3 text-xs text-gray-600">
              <span className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-gray-300 rounded-full" />
                Карты
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-gray-300 rounded-full" />
                Вклады
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-purple-500 rounded-full" />
                Инвестиции
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-gray-300 rounded-full" />
                Пенсии
              </span>
            </div>
          </Card>

          <Card className="bg-white rounded-3xl p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Вклады и счета</h2>
              <Button variant="ghost" size="icon" className="text-[#21A038] -mr-2">
                <Icon name="ChevronUp" size={24} />
              </Button>
              <Button variant="ghost" size="icon" className="text-[#21A038]">
                <Icon name="Plus" size={24} />
              </Button>
            </div>
            <Card className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border flex-shrink-0">
                <Icon name="Vault" size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold mb-0.5">Откройте вклад онлайн</p>
                <p className="text-xs text-gray-500">Просто, быстро, удобно. От 1000 ₽</p>
              </div>
            </Card>
          </Card>

          <Card className="bg-white rounded-3xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Инвестиции</h2>
              <Button variant="ghost" size="icon" className="text-[#21A038] -mr-2">
                <Icon name="ChevronUp" size={24} />
              </Button>
              <Button variant="ghost" size="icon" className="text-[#21A038]">
                <Icon name="Plus" size={24} />
              </Button>
            </div>
            <Card className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border flex-shrink-0">
                <Icon name="TrendingUp" size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold mb-0.5">Начать инвестировать просто</p>
                <p className="text-xs text-gray-500">Начальный капитал и опыт не имеют значения</p>
              </div>
            </Card>
          </Card>
        </div>

        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t max-w-md mx-auto">
          <div className="flex justify-around px-2 py-2">
            <Button
              variant="ghost"
              className="flex-col h-auto py-2 px-3"
              onClick={() => setPage('wallet')}
            >
              <Icon name="Home" size={24} className="text-gray-600" />
              <span className="text-[10px] mt-1 text-gray-600">Главный</span>
            </Button>
            <Button variant="ghost" className="flex-col h-auto py-2 px-3 text-[#21A038]">
              <Icon name="BarChart3" size={24} />
              <span className="text-[10px] mt-1 font-medium">Накопления</span>
            </Button>
            <Button variant="ghost" className="flex-col h-auto py-2 px-3">
              <Icon name="Sparkles" size={24} className="text-gray-600" />
              <span className="text-[10px] mt-1 text-gray-600">Ассистент</span>
            </Button>
            <Button variant="ghost" className="flex-col h-auto py-2 px-3">
              <Icon name="Send" size={24} className="text-gray-600" />
              <span className="text-[10px] mt-1 text-gray-600">Платежи</span>
            </Button>
            <Button variant="ghost" className="flex-col h-auto py-2 px-3">
              <Icon name="Clock" size={24} className="text-gray-600" />
              <span className="text-[10px] mt-1 text-gray-600">История</span>
            </Button>
          </div>
        </nav>
      </div>
    </div>
  );
}
