import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, History, Search, Trash2, Filter } from 'lucide-react';

interface ExchangeHistory {
  from: string;
  to: string;
  amount: number;
  result: number;
  date: string;
}

interface CurrencySelectProps {
  value: string;
  onChange: (value: string) => void;
  currencies: string[];
  label: string;
}

interface HistoryFilters {
  search: string;
  currency: string;
  dateFrom: string;
  dateTo: string;
  amountMin: string;
  amountMax: string;
}

function CurrencySelect({ value, onChange, currencies, label }: CurrencySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const filteredCurrencies = currencies.filter(currency =>
    currency.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white text-left"
      >
        {value}
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search currency..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-auto">
            {filteredCurrencies.map(currency => (
              <button
                key={currency}
                onClick={() => {
                  onChange(currency);
                  setIsOpen(false);
                  setSearch('');
                }}
                className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
                  currency === value ? 'bg-gray-50' : ''
                }`}
              >
                {currency}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [history, setHistory] = useState<ExchangeHistory[]>([]);
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<HistoryFilters>({
    search: '',
    currency: '',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: '',
  });

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem('exchangeHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    // Fetch available currencies
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
      .then(res => res.json())
      .then(data => {
        setCurrencies(Object.keys(data.rates));
      });
  }, []);

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
        .then(res => res.json())
        .then(data => {
          setExchangeRate(data.rates[toCurrency]);
        });
    }
  }, [fromCurrency, toCurrency]);

  const handleConvert = () => {
    const result = parseFloat(amount) * exchangeRate;
    const newHistory: ExchangeHistory = {
      from: fromCurrency,
      to: toCurrency,
      amount: parseFloat(amount),
      result,
      date: new Date().toISOString(),
    };

    const updatedHistory = [newHistory, ...history].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem('exchangeHistory', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('exchangeHistory');
  };

  const filteredHistory = history.filter(item => {
    const searchMatch = filters.search
      ? (item.from + item.to + item.amount + item.result)
          .toLowerCase()
          .includes(filters.search.toLowerCase())
      : true;

    const currencyMatch = filters.currency
      ? item.from === filters.currency || item.to === filters.currency
      : true;

    const dateFromMatch = filters.dateFrom
      ? new Date(item.date) >= new Date(filters.dateFrom)
      : true;

    const dateToMatch = filters.dateTo
      ? new Date(item.date) <= new Date(filters.dateTo)
      : true;

    const amountMinMatch = filters.amountMin
      ? item.amount >= parseFloat(filters.amountMin)
      : true;

    const amountMaxMatch = filters.amountMax
      ? item.amount <= parseFloat(filters.amountMax)
      : true;

    return searchMatch && currencyMatch && dateFromMatch && dateToMatch && amountMinMatch && amountMaxMatch;
  });

  // Close currency selects when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.relative')) {
        const customSelects = document.querySelectorAll('.relative');
        customSelects.forEach((select) => {
          if (select instanceof HTMLElement) {
            const button = select.querySelector('button');
            if (button && button.getAttribute('aria-expanded') === 'true') {
              button.click();
            }
          }
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <ArrowRightLeft className="w-8 h-8" />
            Currency Converter
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                min="0"
              />
            </div>

            <CurrencySelect
              value={fromCurrency}
              onChange={setFromCurrency}
              currencies={currencies}
              label="From"
            />

            <CurrencySelect
              value={toCurrency}
              onChange={setToCurrency}
              currencies={currencies}
              label="To"
            />
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <div className="text-center">
              <p className="text-lg text-gray-600">
                {parseFloat(amount) > 0 ? (
                  <>
                    {amount} {fromCurrency} =
                    <span className="text-2xl font-bold text-gray-900 ml-2">
                      {(parseFloat(amount) * exchangeRate).toFixed(2)} {toCurrency}
                    </span>
                  </>
                ) : (
                  'Enter an amount to convert'
                )}
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleConvert}
              className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Convert & Save
            </button>
          </div>
        </div>

        {/* History Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <History className="w-6 h-6" />
              <h2 className="text-2xl font-bold text-gray-900">Conversion History</h2>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  Clear History
                </button>
              )}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search in history..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select
                    value={filters.currency}
                    onChange={(e) => setFilters({ ...filters, currency: e.target.value })}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">All Currencies</option>
                    {currencies.map(currency => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                    <input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={filters.amountMin}
                      onChange={(e) => setFilters({ ...filters, amountMin: e.target.value })}
                      placeholder="Min"
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                    <input
                      type="number"
                      value={filters.amountMax}
                      onChange={(e) => setFilters({ ...filters, amountMax: e.target.value })}
                      placeholder="Max"
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {filteredHistory.length > 0 ? (
            <div className="space-y-4">
              {filteredHistory.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="mb-2 md:mb-0">
                    <p className="text-lg">
                      <span className="font-medium">{item.amount}</span> {item.from} =
                      <span className="font-bold text-black ml-2">
                        {item.result.toFixed(2)} {item.to}
                      </span>
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(item.date).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No conversion history yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;