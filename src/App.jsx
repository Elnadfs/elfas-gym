import React, { useState, useEffect } from 'react';

// Default Dummy Data
const defaultPackages = [
  { id: 'pkg-1', name: 'Bulanan Regular', duration: 1, price: 350000 },
  { id: 'pkg-2', name: '3 Bulan Hemat', duration: 3, price: 900000 },
  { id: 'pkg-3', name: 'Tahunan VIP', duration: 12, price: 3200000 }
];

const defaultMembers = [
  { 
    id: 'MBR-001', 
    name: 'Rian Hidayat', 
    phone: '081234567890', 
    packageId: 'pkg-1', 
    startDate: '2026-08-01', 
    endDate: '2026-09-01' 
  },
  { 
    id: 'MBR-002', 
    name: 'Siti Aminah', 
    phone: '085678901234', 
    packageId: 'pkg-2', 
    startDate: '2026-06-15', 
    endDate: '2026-09-15' 
  },
  { 
    id: 'MBR-003', 
    name: 'Budi Santoso', 
    phone: '087890123456', 
    packageId: 'pkg-1', 
    startDate: '2026-07-05', 
    endDate: '2026-08-05' 
  }
];

const defaultProducts = [
  { id: 'prod-1', name: 'Air Mineral 600ml', price: 5000, stock: 48 },
  { id: 'prod-2', name: 'Whey Protein Shake', price: 35000, stock: 20 },
  { id: 'prod-3', name: 'Energy Bar Muesli', price: 15000, stock: 15 },
  { id: 'prod-4', name: 'Gym T-Shirt Fit', price: 120000, stock: 8 }
];

const defaultDailyVisitors = [
  { id: 'DLY-001', name: 'Fikri Alamsyah', phone: '089912345678', date: '2026-08-10', amountPaid: 35000 },
  { id: 'DLY-002', name: 'Hendra Wijaya', phone: '081122334455', date: '2026-08-11', amountPaid: 35000 }
];

const defaultExpenses = [
  { id: 'EXP-1001', date: '2026-08-02', desc: 'Listrik & Air Bulanan', amount: 450000, paymentMethod: 'Cash' },
  { id: 'EXP-1002', date: '2026-08-05', desc: 'Beli Sabun & Tisu Toilet', amount: 75000, paymentMethod: 'Cash' }
];

const defaultTransactions = [
  { id: 'TX-1001', memberName: 'Rian Hidayat', type: 'Membership', desc: 'Bulanan Regular', date: '2026-08-01', amount: 350000, paymentMethod: 'Cash' },
  { id: 'TX-1002', memberName: 'Siti Aminah', type: 'Membership', desc: '3 Bulan Hemat', date: '2026-06-15', amount: 900000, paymentMethod: 'QRIS' },
  { id: 'TX-1003', memberName: 'Budi Santoso', type: 'Membership', desc: 'Bulanan Regular', date: '2026-07-05', amount: 350000, paymentMethod: 'Cash' },
  { id: 'TX-1004', memberName: 'Fikri Alamsyah', type: 'Kunjungan Harian', desc: 'Daily Pass', date: '2026-08-10', amount: 35000, paymentMethod: 'Cash' },
  { id: 'TX-1005', memberName: 'Hendra Wijaya', type: 'Kunjungan Harian', desc: 'Daily Pass', date: '2026-08-11', amount: 35000, paymentMethod: 'QRIS' }
];

export default function App() {
  // Tabs: overview, members, daily_visitors, gym_store, packages, transactions, reports
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data States
  const [members, setMembers] = useState(() => {
    const local = localStorage.getItem('gymfit_members');
    return local ? JSON.parse(local) : defaultMembers;
  });
  
  const [packages, setPackages] = useState(() => {
    const local = localStorage.getItem('gymfit_packages');
    return local ? JSON.parse(local) : defaultPackages;
  });
  
  const [products, setProducts] = useState(() => {
    const local = localStorage.getItem('gymfit_products');
    return local ? JSON.parse(local) : defaultProducts;
  });

  const [dailyVisitors, setDailyVisitors] = useState(() => {
    const local = localStorage.getItem('gymfit_daily_visitors');
    return local ? JSON.parse(local) : defaultDailyVisitors;
  });

  const [dailyPrice, setDailyPrice] = useState(() => {
    const local = localStorage.getItem('gymfit_daily_price');
    return local ? parseInt(local) : 35000;
  });
  
  const [transactions, setTransactions] = useState(() => {
    const local = localStorage.getItem('gymfit_transactions');
    return local ? JSON.parse(local) : defaultTransactions;
  });

  const [expenses, setExpenses] = useState(() => {
    const local = localStorage.getItem('gymfit_expenses');
    return local ? JSON.parse(local) : defaultExpenses;
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('gymfit_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('gymfit_packages', JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem('gymfit_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('gymfit_daily_visitors', JSON.stringify(dailyVisitors));
  }, [dailyVisitors]);

  useEffect(() => {
    localStorage.setItem('gymfit_daily_price', dailyPrice);
  }, [dailyPrice]);

  useEffect(() => {
    localStorage.setItem('gymfit_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('gymfit_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Search & Filter States
  const [memberSearch, setMemberSearch] = useState('');
  const [memberFilterStatus, setMemberFilterStatus] = useState('all');
  const [dailySearch, setDailySearch] = useState('');
  const [expenseSearch, setExpenseSearch] = useState('');

  // Report State
  const [reportPeriod, setReportPeriod] = useState('month'); // today, week, month, year, custom
  const [chartPeriod, setChartPeriod] = useState('monthly'); // daily, weekly, monthly, yearly
  const [customStartDate, setCustomStartDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  });
  const [customEndDate, setCustomEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [storePaymentMethod, setStorePaymentMethod] = useState('Cash');
  
  useEffect(() => {
    setHoveredPoint(null);
  }, [chartPeriod]);

  // Modals States
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [isDailyModalOpen, setIsDailyModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // Form States
  const [memberForm, setMemberForm] = useState({
    id: '',
    name: '',
    phone: '',
    packageId: defaultPackages[0]?.id || '',
    startDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Cash'
  });

  const [expenseForm, setExpenseForm] = useState({
    id: '',
    date: new Date().toISOString().split('T')[0],
    desc: '',
    amount: 0,
    paymentMethod: 'Cash'
  });

  const [packageForm, setPackageForm] = useState({
    id: '',
    name: '',
    duration: 1,
    price: 0
  });

  const [dailyForm, setDailyForm] = useState({
    id: '',
    name: '',
    phone: '',
    amountPaid: dailyPrice,
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Cash'
  });

  const [productForm, setProductForm] = useState({
    id: '',
    name: '',
    price: 0,
    stock: 0
  });

  // POS Store State
  const [cart, setCart] = useState({});
  const [buyerName, setBuyerName] = useState('');

  // Helpers
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  const getStatus = (endDateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(endDateStr);
    endDate.setHours(0, 0, 0, 0);
    return endDate >= today ? 'Active' : 'Expired';
  };

  const getDaysRemaining = (endDateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(endDateStr);
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Date Filtering Helper
  const isInPeriod = (dateStr, period) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(dateStr);
    targetDate.setHours(0, 0, 0, 0);

    if (period === 'today') {
      return targetDate.getTime() === today.getTime();
    }
    if (period === 'week') {
      const oneWeekAgo = new Date(today);
      oneWeekAgo.setDate(today.getDate() - 7);
      return targetDate >= oneWeekAgo && targetDate <= today;
    }
    if (period === 'month') {
      return targetDate.getMonth() === today.getMonth() && targetDate.getFullYear() === today.getFullYear();
    }
    if (period === 'year') {
      return targetDate.getFullYear() === today.getFullYear();
    }
    if (period === 'custom') {
      const start = new Date(customStartDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(customEndDate);
      end.setHours(23, 59, 59, 999);
      return targetDate >= start && targetDate <= end;
    }
    return true;
  };

  // Calculations for Stats (Global overview)
  const activeMembersCount = members.filter(m => getStatus(m.endDate) === 'Active').length;
  
  const expiringMembers = members.filter(m => {
    const days = getDaysRemaining(m.endDate);
    return days >= 0 && days <= 30;
  });

  const membershipRev = transactions.filter(t => t.type === 'Membership').reduce((acc, curr) => acc + curr.amount, 0);
  const dailyRev = transactions.filter(t => t.type === 'Kunjungan Harian').reduce((acc, curr) => acc + curr.amount, 0);
  const storeRev = transactions.filter(t => t.type === 'Toko').reduce((acc, curr) => acc + curr.amount, 0);
  const totalRevenue = transactions.reduce((acc, curr) => acc + curr.amount, 0);

  // Period-based stats calculations (For Reports Tab)
  const filteredTransactions = transactions.filter(t => isInPeriod(t.date, reportPeriod));
  const periodRevenue = filteredTransactions.reduce((acc, curr) => acc + curr.amount, 0);
  
  const periodMembershipRev = filteredTransactions.filter(t => t.type === 'Membership').reduce((acc, curr) => acc + curr.amount, 0);
  const periodDailyRev = filteredTransactions.filter(t => t.type === 'Kunjungan Harian').reduce((acc, curr) => acc + curr.amount, 0);
  const periodStoreRev = filteredTransactions.filter(t => t.type === 'Toko').reduce((acc, curr) => acc + curr.amount, 0);

  const periodNewMembers = members.filter(m => isInPeriod(m.startDate, reportPeriod)).length;
  const periodDailyCount = dailyVisitors.filter(d => isInPeriod(d.date, reportPeriod)).length;

  // Best selling products extractor for selected period
  const getBestSellingProducts = () => {
    const sales = {};
    filteredTransactions.filter(t => t.type === 'Toko').forEach(t => {
      // Parse desc e.g. "Air Mineral 600ml (x3), Whey Protein Shake (x1)"
      const items = t.desc.split(', ');
      items.forEach(item => {
        const match = item.match(/(.+)\s\(x(\d+)\)/);
        if (match) {
          const name = match[1];
          const qty = parseInt(match[2]);
          sales[name] = (sales[name] || 0) + qty;
        } else {
          sales[item] = (sales[item] || 0) + 1;
        }
      });
    });
    return Object.entries(sales).map(([name, qty]) => ({ name, qty })).sort((a,b) => b.qty - a.qty);
  };

  const bestSellers = getBestSellingProducts();

  const totalCash = transactions.filter(t => t.paymentMethod === 'Cash' || !t.paymentMethod).reduce((acc, curr) => acc + curr.amount, 0);
  const totalQRIS = transactions.filter(t => t.paymentMethod === 'QRIS').reduce((acc, curr) => acc + curr.amount, 0);

  const periodCash = filteredTransactions.filter(t => t.paymentMethod === 'Cash' || !t.paymentMethod).reduce((acc, curr) => acc + curr.amount, 0);
  const periodQRIS = filteredTransactions.filter(t => t.paymentMethod === 'QRIS').reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  const filteredExpenses = expenses.filter(e => isInPeriod(e.date, reportPeriod));
  const periodExpenses = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const periodNetProfit = periodRevenue - periodExpenses;

  // CRUD Member Actions
  const handleOpenAddMember = () => {
    setMemberForm({
      id: '',
      name: '',
      phone: '',
      packageId: packages[0]?.id || '',
      startDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'Cash'
    });
    setIsMemberModalOpen(true);
  };

  const handleOpenEditMember = (member) => {
    setMemberForm({
      id: member.id,
      name: member.name,
      phone: member.phone,
      packageId: member.packageId,
      startDate: member.startDate,
      paymentMethod: member.paymentMethod || 'Cash'
    });
    setIsMemberModalOpen(true);
  };

  const handleSaveMember = (e) => {
    e.preventDefault();
    const selectedPkg = packages.find(p => p.id === memberForm.packageId);
    const duration = selectedPkg ? selectedPkg.duration : 1;

    const startDate = new Date(memberForm.startDate);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + duration);
    const endDateStr = endDate.toISOString().split('T')[0];

    if (memberForm.id) {
      // Edit
      setMembers(prev => prev.map(m => m.id === memberForm.id ? {
        ...m,
        name: memberForm.name,
        phone: memberForm.phone,
        packageId: memberForm.packageId,
        startDate: memberForm.startDate,
        endDate: endDateStr
      } : m));
    } else {
      // Add New
      const newId = `MBR-${String(members.length + 1).padStart(3, '0')}`;
      const newMember = {
        id: newId,
        name: memberForm.name,
        phone: memberForm.phone,
        packageId: memberForm.packageId,
        startDate: memberForm.startDate,
        endDate: endDateStr,
        paymentMethod: memberForm.paymentMethod
      };
      setMembers(prev => [...prev, newMember]);

      // Record transaction
      if (selectedPkg) {
        const txId = `TX-${Date.now().toString().slice(-6)}`;
        setTransactions(prev => [...prev, {
          id: txId,
          memberName: memberForm.name,
          type: 'Membership',
          desc: selectedPkg.name,
          date: memberForm.startDate,
          amount: selectedPkg.price,
          paymentMethod: memberForm.paymentMethod
        }]);
      }
    }
    setIsMemberModalOpen(false);
  };

  const handleDeleteMember = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus member ini?')) {
      setMembers(prev => prev.filter(m => m.id !== id));
    }
  };

  // CRUD Package Actions
  const handleOpenAddPackage = () => {
    setPackageForm({ id: '', name: '', duration: 1, price: 0 });
    setIsPackageModalOpen(true);
  };

  const handleOpenEditPackage = (pkg) => {
    setPackageForm({ id: pkg.id, name: pkg.name, duration: pkg.duration, price: pkg.price });
    setIsPackageModalOpen(true);
  };

  const handleSavePackage = (e) => {
    e.preventDefault();
    if (packageForm.id) {
      setPackages(prev => prev.map(p => p.id === packageForm.id ? {
        ...p,
        name: packageForm.name,
        duration: parseInt(packageForm.duration),
        price: parseInt(packageForm.price)
      } : p));
    } else {
      const newId = `pkg-${Date.now()}`;
      setPackages(prev => [...prev, {
        id: newId,
        name: packageForm.name,
        duration: parseInt(packageForm.duration),
        price: parseInt(packageForm.price)
      }]);
    }
    setIsPackageModalOpen(false);
  };

  const handleDeletePackage = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus paket ini?')) {
      setPackages(prev => prev.filter(p => p.id !== id));
    }
  };

  // CRUD Daily Visitor Actions
  const handleOpenAddDaily = () => {
    setDailyForm({
      id: '',
      name: '',
      phone: '',
      amountPaid: dailyPrice,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Cash'
    });
    setIsDailyModalOpen(true);
  };

  const handleOpenEditDaily = (visitor) => {
    setDailyForm({
      id: visitor.id,
      name: visitor.name,
      phone: visitor.phone,
      amountPaid: visitor.amountPaid,
      date: visitor.date,
      paymentMethod: visitor.paymentMethod || 'Cash'
    });
    setIsDailyModalOpen(true);
  };

  const handleSaveDaily = (e) => {
    e.preventDefault();
    
    if (dailyForm.id) {
      // Edit
      const oldVisitor = dailyVisitors.find(d => d.id === dailyForm.id);
      setDailyVisitors(prev => prev.map(d => d.id === dailyForm.id ? {
        ...d,
        name: dailyForm.name,
        phone: dailyForm.phone,
        amountPaid: parseInt(dailyForm.amountPaid),
        date: dailyForm.date,
        paymentMethod: dailyForm.paymentMethod
      } : d));

      // Sync matching transaction
      if (oldVisitor) {
        setTransactions(prev => prev.map(t => (t.type === 'Kunjungan Harian' && t.memberName === oldVisitor.name && t.date === oldVisitor.date) ? {
          ...t,
          memberName: dailyForm.name,
          date: dailyForm.date,
          amount: parseInt(dailyForm.amountPaid),
          paymentMethod: dailyForm.paymentMethod
        } : t));
      }
    } else {
      // Add New
      const newId = `DLY-${Date.now().toString().slice(-4)}`;
      const newVisitor = {
        id: newId,
        name: dailyForm.name,
        phone: dailyForm.phone,
        amountPaid: parseInt(dailyForm.amountPaid),
        date: dailyForm.date,
        paymentMethod: dailyForm.paymentMethod
      };
      
      setDailyVisitors(prev => [...prev, newVisitor]);

      // Record Transaction
      const txId = `TX-${Date.now().toString().slice(-6)}`;
      setTransactions(prev => [...prev, {
        id: txId,
        memberName: dailyForm.name,
        type: 'Kunjungan Harian',
        desc: 'Daily Pass',
        date: dailyForm.date,
        amount: parseInt(dailyForm.amountPaid),
        paymentMethod: dailyForm.paymentMethod
      }]);
    }

    setIsDailyModalOpen(false);
  };

  const handleDeleteDaily = (id) => {
    if (window.confirm('Hapus data kunjungan harian ini?')) {
      const visitor = dailyVisitors.find(d => d.id === id);
      setDailyVisitors(prev => prev.filter(d => d.id !== id));
      
      // Also remove its transaction from revenue
      if (visitor) {
        setTransactions(prev => prev.filter(t => !(t.type === 'Kunjungan Harian' && t.memberName === visitor.name && t.date === visitor.date)));
      }
    }
  };

  // CRUD Product Actions (Gym Store)
  const handleOpenAddProduct = () => {
    setProductForm({ id: '', name: '', price: 0, stock: 0 });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setProductForm({ id: prod.id, name: prod.name, price: prod.price, stock: prod.stock });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (productForm.id) {
      setProducts(prev => prev.map(p => p.id === productForm.id ? {
        ...p,
        name: productForm.name,
        price: parseInt(productForm.price),
        stock: parseInt(productForm.stock)
      } : p));
    } else {
      const newId = `prod-${Date.now()}`;
      setProducts(prev => [...prev, {
        id: newId,
        name: productForm.name,
        price: parseInt(productForm.price),
        stock: parseInt(productForm.stock)
      }]);
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Hapus produk ini dari katalog?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  // CRUD Expense Actions
  const handleOpenAddExpense = () => {
    setExpenseForm({
      id: '',
      date: new Date().toISOString().split('T')[0],
      desc: '',
      amount: 0,
      paymentMethod: 'Cash'
    });
    setIsExpenseModalOpen(true);
  };

  const handleOpenEditExpense = (exp) => {
    setExpenseForm({
      id: exp.id,
      date: exp.date,
      desc: exp.desc,
      amount: exp.amount,
      paymentMethod: exp.paymentMethod || 'Cash'
    });
    setIsExpenseModalOpen(true);
  };

  const handleSaveExpense = (e) => {
    e.preventDefault();
    if (expenseForm.id) {
      // Edit
      setExpenses(prev => prev.map(exp => exp.id === expenseForm.id ? {
        ...exp,
        date: expenseForm.date,
        desc: expenseForm.desc,
        amount: parseInt(expenseForm.amount),
        paymentMethod: expenseForm.paymentMethod
      } : exp));
    } else {
      // Add New
      const newId = `EXP-${Date.now().toString().slice(-6)}`;
      setExpenses(prev => [...prev, {
        id: newId,
        date: expenseForm.date,
        desc: expenseForm.desc,
        amount: parseInt(expenseForm.amount),
        paymentMethod: expenseForm.paymentMethod
      }]);
    }
    setIsExpenseModalOpen(false);
  };

  const handleDeleteExpense = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data pengeluaran ini?')) {
      setExpenses(prev => prev.filter(exp => exp.id !== id));
    }
  };

  // Cart / POS Actions
  const addToCart = (prod) => {
    const currentQty = cart[prod.id] || 0;
    if (currentQty >= prod.stock) {
      alert('Stok produk tidak mencukupi!');
      return;
    }
    setCart(prev => ({ ...prev, [prod.id]: currentQty + 1 }));
  };

  const removeFromCart = (prodId) => {
    setCart(prev => {
      const copy = { ...prev };
      if (copy[prodId] <= 1) {
        delete copy[prodId];
      } else {
        copy[prodId] -= 1;
      }
      return copy;
    });
  };

  const calculateCartTotal = () => {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const prod = products.find(p => p.id === id);
      return sum + (prod ? prod.price * qty : 0);
    }, 0);
  };

  const handleCheckout = () => {
    if (Object.keys(cart).length === 0) {
      alert('Keranjang belanja kosong!');
      return;
    }
    if (!buyerName.trim()) {
      alert('Harap masukkan nama pembeli!');
      return;
    }

    const total = calculateCartTotal();
    const itemsDescription = Object.entries(cart).map(([id, qty]) => {
      const prod = products.find(p => p.id === id);
      return `${prod ? prod.name : 'Produk'} (x${qty})`;
    }).join(', ');

    // Update stocks
    setProducts(prev => prev.map(p => {
      if (cart[p.id]) {
        return { ...p, stock: p.stock - cart[p.id] };
      }
      return p;
    }));

    // Record Transaction
    const txId = `TX-${Date.now().toString().slice(-6)}`;
    setTransactions(prev => [...prev, {
      id: txId,
      memberName: buyerName,
      type: 'Toko',
      desc: itemsDescription,
      date: new Date().toISOString().split('T')[0],
      amount: total,
      paymentMethod: storePaymentMethod
    }]);

    // Reset Cart
    setCart({});
    setBuyerName('');
    alert('Checkout berhasil!');
  };

  const { chartPoints, monthsLabel, maxVal } = (() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let labels = [];
    let values = [];

    if (chartPeriod === 'daily') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        labels.push(d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }));
        
        const dateStr = d.toISOString().split('T')[0];
        const sum = transactions
          .filter(t => t.date === dateStr)
          .reduce((acc, curr) => acc + curr.amount, 0);
        values.push(sum);
      }
    } else if (chartPeriod === 'weekly') {
      // Last 4 weeks
      for (let i = 3; i >= 0; i--) {
        labels.push(`Minggu ${4 - i}`);
        const start = new Date(today);
        start.setDate(today.getDate() - (i + 1) * 7 + 1);
        const end = new Date(today);
        end.setDate(today.getDate() - i * 7);
        
        const sum = transactions.filter(t => {
          const tDate = new Date(t.date);
          return tDate >= start && tDate <= end;
        }).reduce((acc, curr) => acc + curr.amount, 0);
        values.push(sum);
      }
    } else if (chartPeriod === 'monthly') {
      // Bulanan (Current Month): Day 1 to Last Day of Month
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      
      for (let i = 1; i <= daysInMonth; i++) {
        labels.push(`${i}`);
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const sum = transactions
          .filter(t => t.date === dateStr)
          .reduce((acc, curr) => acc + curr.amount, 0);
        values.push(sum);
      }
    } else {
      // Tahunan (Yearly): Months of this year (Jan - Dec)
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const currentYear = today.getFullYear();
      values = Array(12).fill(0);
      transactions.forEach(t => {
        const tDate = new Date(t.date);
        if (tDate.getFullYear() === currentYear) {
          values[tDate.getMonth()] += t.amount;
        }
      });
    }

    const maxV = Math.max(...values, 1000000);
    const len = values.length;
    const chartPts = values.map((val, idx) => {
      const x = 35 + idx * (450 / (len - 1 || 1));
      const y = 140 - (val / maxV) * 100;
      return { x, y, val };
    });

    return { chartPoints: chartPts, monthsLabel: labels, maxVal: maxV };
  })();

  const lineD = chartPoints.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = chartPoints.length > 0 
    ? `${lineD} L ${chartPoints[chartPoints.length - 1].x} 150 L ${chartPoints[0].x} 150 Z` 
    : '';

  const getPointBreakdown = (point) => {
    if (!point) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let filtered = [];
    if (chartPeriod === 'daily') {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - point.index));
      const dateStr = d.toISOString().split('T')[0];
      filtered = transactions.filter(t => t.date === dateStr);
    } else if (chartPeriod === 'weekly') {
      const start = new Date(today);
      start.setDate(today.getDate() - (4 - point.index) * 7 + 1);
      const end = new Date(today);
      end.setDate(today.getDate() - (3 - point.index) * 7);
      filtered = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate >= start && tDate <= end;
      });
    } else if (chartPeriod === 'monthly') {
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth();
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(point.index + 1).padStart(2, '0')}`;
      filtered = transactions.filter(t => t.date === dateStr);
    } else {
      const currentYear = today.getFullYear();
      filtered = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getFullYear() === currentYear && tDate.getMonth() === point.index;
      });
    }

    const membership = filtered.filter(t => t.type === 'Membership').reduce((acc, curr) => acc + curr.amount, 0);
    const daily = filtered.filter(t => t.type === 'Kunjungan Harian').reduce((acc, curr) => acc + curr.amount, 0);
    const store = filtered.filter(t => t.type === 'Toko').reduce((acc, curr) => acc + curr.amount, 0);

    return { membership, daily, store };
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside>
        <div className="brand">
          <div className="brand-icon">💪</div>
          <span>ELFAS GYM</span>
        </div>
        <ul className="nav-links">
          <li className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}>
            <button onClick={() => setActiveTab('overview')}>
              <svg viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
              Overview
            </button>
          </li>
          <li className={`nav-item ${activeTab === 'members' ? 'active' : ''}`}>
            <button onClick={() => setActiveTab('members')}>
              <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              Anggota (Members)
            </button>
          </li>
          <li className={`nav-item ${activeTab === 'daily_visitors' ? 'active' : ''}`}>
            <button onClick={() => setActiveTab('daily_visitors')}>
              <svg viewBox="0 0 24 24"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/></svg>
              Kunjungan Harian
            </button>
          </li>
          <li className={`nav-item ${activeTab === 'gym_store' ? 'active' : ''}`}>
            <button onClick={() => setActiveTab('gym_store')}>
              <svg viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
              Toko
            </button>
          </li>
          <li className={`nav-item ${activeTab === 'packages' ? 'active' : ''}`}>
            <button onClick={() => setActiveTab('packages')}>
              <svg viewBox="0 0 24 24"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>
              Paket Layanan
            </button>
          </li>
          <li className={`nav-item ${activeTab === 'transactions' ? 'active' : ''}`}>
            <button onClick={() => setActiveTab('transactions')}>
              <svg viewBox="0 0 24 24"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
              Transaksi
            </button>
          </li>
          <li className={`nav-item ${activeTab === 'expenses' ? 'active' : ''}`}>
            <button onClick={() => setActiveTab('expenses')}>
              <svg viewBox="0 0 24 24"><path d="M19 14V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-9-2c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-6v10c0 1.1-.9 2-2 2H4v-2h17V6h2z"/></svg>
              Pengeluaran
            </button>
          </li>
          <li className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}>
            <button onClick={() => setActiveTab('reports')}>
              <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
              Laporan & Rekap
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main>
        <header>
          <div className="page-title">
            <h1>
              {activeTab === 'overview' && 'Overview'}
              {activeTab === 'members' && 'Anggota (Members)'}
              {activeTab === 'daily_visitors' && 'Kunjungan Harian (Daily Passes)'}
              {activeTab === 'gym_store' && 'Toko Gym'}
              {activeTab === 'packages' && 'Paket Layanan'}
              {activeTab === 'transactions' && 'Transaksi'}
              {activeTab === 'expenses' && 'Pengeluaran'}
              {activeTab === 'reports' && 'Laporan & Rekapitulasi'}
            </h1>
            <p>
              {activeTab === 'overview' && 'Dashboard ringkasan statistik dan pendapatan gym Anda.'}
              {activeTab === 'members' && 'Kelola data member gym aktif and non-aktif.'}
              {activeTab === 'daily_visitors' && 'Catat dan kelola kunjungan tamu harian non-member.'}
              {activeTab === 'gym_store' && 'Transaksi penjualan suplemen, minuman, dan inventori toko.'}
              {activeTab === 'packages' && 'Atur jenis membership, durasi, dan harga paket.'}
              {activeTab === 'transactions' && 'Riwayat lengkap seluruh transaksi kasir gym.'}
              {activeTab === 'expenses' && 'Catatan pengeluaran biaya operasional dan kebutuhan gym.'}
              {activeTab === 'reports' && 'Analisis keuangan dan performa bisnis gym secara berkala.'}
            </p>
          </div>
          {activeTab === 'members' && (
            <button className="btn btn-primary" onClick={handleOpenAddMember}>
              <span>+ Tambah Member</span>
            </button>
          )}
          {activeTab === 'daily_visitors' && (
            <button className="btn btn-primary" onClick={handleOpenAddDaily}>
              <span>+ Log Kunjungan Baru</span>
            </button>
          )}
          {activeTab === 'expenses' && (
            <button className="btn btn-primary" onClick={handleOpenAddExpense}>
              <span>+ Catat Pengeluaran</span>
            </button>
          )}
        </header>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div>
            {/* Upper stats row */}
            <div className="grid-stats">
              <div className="card-stat">
                <div className="stat-info">
                  <p>Total Member Aktif</p>
                  <h3>{activeMembersCount}</h3>
                </div>
                <div className="stat-icon green">
                  <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                </div>
              </div>
              <div className="card-stat">
                <div className="stat-info">
                  <p>Total Pemasukan (Omzet)</p>
                  <h3 style={{ color: 'var(--accent)' }}>{formatRupiah(totalRevenue)}</h3>
                </div>
                <div className="stat-icon blue">
                  <svg viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 1.21-1.04 1.93-2.7 1.93-1.93 0-2.7-.93-2.82-2.1H5.1c.1 2.15 1.72 3.39 3.7 3.84V21h3v-2.15c2-.37 3.66-1.58 3.66-3.61 0-2.85-2.66-3.75-3.66-4.34z"/></svg>
                </div>
              </div>
              <div className="card-stat">
                <div className="stat-info">
                  <p>Total Pengeluaran</p>
                  <h3 style={{ color: 'var(--danger)' }}>{formatRupiah(totalExpenses)}</h3>
                </div>
                <div className="stat-icon warning">
                  <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 6h-4v2h4v2h-4v2h4v2H9V7h6v2z"/></svg>
                </div>
              </div>
              <div className="card-stat">
                <div className="stat-info">
                  <p>Keuntungan Bersih</p>
                  <h3 style={{ color: netProfit >= 0 ? 'var(--success)' : 'var(--danger)' }}>{formatRupiah(netProfit)}</h3>
                </div>
                <div className="stat-icon green">
                  <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                </div>
              </div>
            </div>

            {/* Grafik Omzet Bulanan */}
            <div className="card-table-wrapper" style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                  {chartPeriod === 'daily' && 'Tren Pendapatan Harian (7 Hari Terakhir)'}
                  {chartPeriod === 'weekly' && 'Tren Pendapatan Mingguan (4 Minggu Terakhir)'}
                  {chartPeriod === 'monthly' && `Tren Pendapatan Bulanan (Bulan Ini)`}
                  {chartPeriod === 'yearly' && `Tren Pendapatan Tahunan (${new Date().getFullYear()})`}
                </h3>
                {/* Chart Period Selectors */}
                <div style={{ display: 'flex', gap: '6px', backgroundColor: 'var(--bg-tertiary)', padding: '4px', borderRadius: '8px' }}>
                  <button 
                    onClick={() => setChartPeriod('daily')} 
                    style={{ background: chartPeriod === 'daily' ? 'var(--bg-secondary)' : 'none', border: 'none', color: 'var(--text-primary)', fontSize: '0.75rem', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                  >
                    Harian
                  </button>
                  <button 
                    onClick={() => setChartPeriod('weekly')} 
                    style={{ background: chartPeriod === 'weekly' ? 'var(--bg-secondary)' : 'none', border: 'none', color: 'var(--text-primary)', fontSize: '0.75rem', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                  >
                    Mingguan
                  </button>
                  <button 
                    onClick={() => setChartPeriod('monthly')} 
                    style={{ background: chartPeriod === 'monthly' ? 'var(--bg-secondary)' : 'none', border: 'none', color: 'var(--text-primary)', fontSize: '0.75rem', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                  >
                    Bulanan
                  </button>
                  <button 
                    onClick={() => setChartPeriod('yearly')} 
                    style={{ background: chartPeriod === 'yearly' ? 'var(--bg-secondary)' : 'none', border: 'none', color: 'var(--text-primary)', fontSize: '0.75rem', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                  >
                    Tahunan
                  </button>
                </div>
              </div>
              <div style={{ position: 'relative', width: '100%', height: '220px' }}>
                <svg viewBox="0 0 500 180" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="30" y1="40" x2="480" y2="40" stroke="var(--border-color)" strokeDasharray="3" />
                  <line x1="30" y1="90" x2="480" y2="90" stroke="var(--border-color)" strokeDasharray="3" />
                  <line x1="30" y1="140" x2="480" y2="140" stroke="var(--border-color)" strokeDasharray="3" />
                  
                  {/* Y Axis Labels */}
                  <text x="5" y="45" fill="var(--text-muted)" fontSize="8">{formatRupiah(maxVal)}</text>
                  <text x="5" y="95" fill="var(--text-muted)" fontSize="8">{formatRupiah(maxVal / 2)}</text>
                  <text x="5" y="145" fill="var(--text-muted)" fontSize="8">Rp 0</text>

                  {/* Area Under Curve */}
                  {areaD && <path d={areaD} fill="url(#chartGrad)" />}

                  {/* Line Path */}
                  {lineD && <path d={lineD} fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}

                  {/* Data Points (Dots) */}
                  {chartPoints.map((p, idx) => (
                    <g 
                      key={idx} 
                      className="chart-dot-group" 
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredPoint({ index: idx, label: monthsLabel[idx], value: p.val })}
                    >
                      <circle 
                        cx={p.x} 
                        cy={p.y} 
                        r={hoveredPoint && hoveredPoint.index === idx ? "6" : "4"} 
                        fill={hoveredPoint && hoveredPoint.index === idx ? "var(--accent)" : "var(--bg-secondary)"} 
                        stroke="var(--accent)" 
                        strokeWidth="2.5" 
                      />
                    </g>
                  ))}

                  {/* X Axis Month Labels */}
                  {chartPoints.map((p, idx) => {
                    // Prevent label overlap on daily/monthly views by skipping labels
                    if (chartPeriod === 'monthly' && idx % 5 !== 0 && idx !== chartPoints.length - 1) {
                      return null;
                    }
                    return (
                      <text key={idx} x={p.x} y="165" fill="var(--text-secondary)" fontSize="9" textAnchor="middle">
                        {monthsLabel[idx]}
                      </text>
                    );
                  })}
                </svg>
              </div>

              {/* Detailed Tooltip Card below the chart */}
              <div style={{ marginTop: '20px', padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)', minHeight: '80px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {!hoveredPoint ? (
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center', margin: 'auto' }}>
                    💡 Sorot (hover) titik pada grafik untuk melihat rincian keuangan detail.
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Periode: <strong>{hoveredPoint.label}</strong></span>
                      <span style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: '700' }}>Total: {formatRupiah(hoveredPoint.value)}</span>
                    </div>
                    
                    {/* Itemized breakdown for hovered point */}
                    {(() => {
                      const breakdown = getPointBreakdown(hoveredPoint);
                      if (!breakdown) return null;
                      return (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Membership:</span>
                            <strong>{formatRupiah(breakdown.membership)}</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Kunjungan:</span>
                            <strong>{formatRupiah(breakdown.daily)}</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Toko:</span>
                            <strong>{formatRupiah(breakdown.store)}</strong>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>

            {/* Split breakdown metrics card */}
            <div className="card-table-wrapper" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              <div>
                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Breakdown Kategori Keuangan</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <span>Membership:</span>
                    <strong style={{ color: 'var(--success)' }}>{formatRupiah(membershipRev)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <span>Daily Pass:</span>
                    <strong style={{ color: 'var(--success)' }}>{formatRupiah(dailyRev)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <span>Toko:</span>
                    <strong style={{ color: 'var(--success)' }}>{formatRupiah(storeRev)}</strong>
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Metode Penerimaan Kas</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <span>Cash / Tunai:</span>
                    <strong style={{ color: 'var(--success)' }}>{formatRupiah(totalCash)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <span>QRIS:</span>
                    <strong style={{ color: 'var(--accent)' }}>{formatRupiah(totalQRIS)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <span>Total Kas Terkumpul:</span>
                    <strong style={{ color: 'var(--accent)', fontSize: '0.95rem' }}>{formatRupiah(totalRevenue)}</strong>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Jatuh Tempo Membership</h4>
                <div className="table-container" style={{ marginTop: '12px' }}>
                  <table style={{ fontSize: '0.85rem' }}>
                    <thead>
                      <tr>
                        <th>Nama</th>
                        <th>Berakhir</th>
                        <th>Sisa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expiringMembers.slice(0, 3).map(m => (
                        <tr key={m.id}>
                          <td>
                            <strong>{m.name}</strong>
                          </td>
                          <td>{m.endDate}</td>
                          <td><span className="badge badge-expired">{getDaysRemaining(m.endDate)} Hari</span></td>
                        </tr>
                      ))}
                      {expiringMembers.length === 0 && (
                        <tr><td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Aman. Tidak ada yang segera habis.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MEMBERS TAB */}
        {activeTab === 'members' && (
          <div className="card-table-wrapper">
            <div className="table-header">
              <div className="table-search">
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Cari member berdasarkan nama atau telepon..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                />
                <select 
                  className="select-input" 
                  style={{ maxWidth: '150px' }}
                  value={memberFilterStatus}
                  onChange={(e) => setMemberFilterStatus(e.target.value)}
                >
                  <option value="all">Semua Status</option>
                  <option value="Active">Aktif</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nama</th>
                    <th>Telepon</th>
                    <th>Paket</th>
                    <th>Mulai</th>
                    <th>Berakhir</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {members.filter(m => {
                    const matchesSearch = m.name.toLowerCase().includes(memberSearch.toLowerCase()) || m.phone.includes(memberSearch);
                    const status = getStatus(m.endDate);
                    const matchesFilter = memberFilterStatus === 'all' || status === memberFilterStatus;
                    return matchesSearch && matchesFilter;
                  }).length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                        Data member tidak ditemukan.
                      </td>
                    </tr>
                  ) : (
                    members.filter(m => {
                      const matchesSearch = m.name.toLowerCase().includes(memberSearch.toLowerCase()) || m.phone.includes(memberSearch);
                      const status = getStatus(m.endDate);
                      const matchesFilter = memberFilterStatus === 'all' || status === memberFilterStatus;
                      return matchesSearch && matchesFilter;
                    }).map(m => {
                      const pkgName = packages.find(p => p.id === m.packageId)?.name || 'Paket Kustom';
                      const status = getStatus(m.endDate);
                      return (
                        <tr key={m.id}>
                          <td><code>{m.id}</code></td>
                          <td><strong>{m.name}</strong></td>
                          <td>{m.phone}</td>
                          <td>{pkgName}</td>
                          <td>{m.startDate}</td>
                          <td>{m.endDate}</td>
                          <td>
                            <span className={`badge ${status === 'Active' ? 'badge-active' : 'badge-expired'}`}>
                              {status === 'Active' ? 'Aktif' : 'Expired'}
                            </span>
                          </td>
                          <td>
                            <button className="action-btn" onClick={() => handleOpenEditMember(m)} title="Edit">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </button>
                            <button className="action-btn delete" onClick={() => handleDeleteMember(m.id)} title="Hapus">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DAILY VISITORS TAB */}
        {activeTab === 'daily_visitors' && (
          <div className="card-table-wrapper">
            <div className="table-header">
              <div className="table-search" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Cari pengunjung harian..."
                  value={dailySearch}
                  onChange={(e) => setDailySearch(e.target.value)}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '260px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Tarif Harian (Rp):</label>
                  <input 
                    type="number" 
                    className="search-input" 
                    style={{ maxWidth: '120px', padding: '8px 12px' }}
                    value={dailyPrice}
                    onChange={(e) => setDailyPrice(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nama</th>
                    <th>Telepon</th>
                    <th>Tanggal Kunjungan</th>
                    <th>Pembayaran</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyVisitors.filter(d => d.name.toLowerCase().includes(dailySearch.toLowerCase()) || d.phone.includes(dailySearch)).length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                        Tidak ada riwayat kunjungan harian yang cocok.
                      </td>
                    </tr>
                  ) : (
                    dailyVisitors.filter(d => d.name.toLowerCase().includes(dailySearch.toLowerCase()) || d.phone.includes(dailySearch)).map(d => (
                      <tr key={d.id}>
                        <td><code>{d.id}</code></td>
                        <td><strong>{d.name}</strong></td>
                        <td>{d.phone}</td>
                        <td>{d.date}</td>
                        <td><strong style={{ color: 'var(--success)' }}>{formatRupiah(d.amountPaid)}</strong></td>
                        <td>
                          <button className="action-btn" onClick={() => handleOpenEditDaily(d)} title="Edit">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </button>
                          <button className="action-btn delete" onClick={() => handleDeleteDaily(d.id)} title="Hapus">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* GYM STORE / TOKO TAB */}
        {activeTab === 'gym_store' && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            {/* Products List */}
            <div className="card-table-wrapper">
              <div className="table-header">
                <h2>Katalog Produk Toko</h2>
                <button className="btn btn-secondary" onClick={handleOpenAddProduct}>+ Produk Baru</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginTop: '16px' }}>
                {products.map(p => (
                  <div key={p.id} style={{ position: 'relative', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '130px' }}>
                    {/* Tombol Edit & Hapus di Pojok Kanan Atas */}
                    <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '6px' }}>
                      <button className="action-btn" onClick={() => handleOpenEditProduct(p)} title="Edit" style={{ padding: '4px 6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.8rem' }}>✏️</button>
                      <button className="action-btn delete" onClick={() => handleDeleteProduct(p.id)} title="Hapus" style={{ padding: '4px 6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.8rem' }}>🗑️</button>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: '600', paddingRight: '55px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0 12px 0' }}>
                        Stok: {p.stock} pcs
                      </p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ color: 'var(--accent)', fontSize: '0.95rem' }}>{formatRupiah(p.price)}</strong>
                      <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '6px' }} onClick={() => addToCart(p)} disabled={p.stock <= 0}>
                        + Beli
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shopping Cart / Cashier POS */}
            <div className="card-table-wrapper" style={{ height: 'fit-content' }}>
              <div className="table-header">
                <h2>Kasir Toko</h2>
              </div>
              
              <div className="form-group" style={{ marginTop: '16px' }}>
                <label>Nama Pembeli / Anggota</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Masukkan nama pembeli..."
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                />
              </div>

              <div style={{ margin: '20px 0', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>Daftar Belanjaan</h4>
                {Object.keys(cart).length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>Keranjang kosong. Klik "+ Beli" di katalog.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {Object.entries(cart).map(([id, qty]) => {
                      const prod = products.find(p => p.id === id);
                      if (!prod) return null;
                      return (
                        <div key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                          <span>{prod.name} (x{qty})</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>{formatRupiah(prod.price * qty)}</span>
                            <button style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }} onClick={() => removeFromCart(id)}>✕</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="form-group" style={{ marginTop: '16px' }}>
                <label>Metode Pembayaran</label>
                <select 
                  className="form-control"
                  value={storePaymentMethod}
                  onChange={(e) => setStorePaymentMethod(e.target.value)}
                >
                  <option value="Cash">Cash / Tunai</option>
                  <option value="QRIS">QRIS</option>
                </select>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <strong>Total Bayar:</strong>
                <h3 style={{ color: 'var(--success)' }}>{formatRupiah(calculateCartTotal())}</h3>
              </div>

              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleCheckout} disabled={Object.keys(cart).length === 0}>
                Checkout Penjualan
              </button>
            </div>
          </div>
        )}

        {/* PACKAGES TAB */}
        {activeTab === 'packages' && (
          <div className="card-table-wrapper">
            <div className="table-header">
              <h2>Daftar Paket Layanan</h2>
              <button className="btn btn-primary" onClick={handleOpenAddPackage}>+ Tambah Paket</button>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nama Paket</th>
                    <th>Durasi (Bulan)</th>
                    <th>Harga</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map(p => (
                    <tr key={p.id}>
                      <td><strong>{p.name}</strong></td>
                      <td>{p.duration} Bulan</td>
                      <td>{formatRupiah(p.price)}</td>
                      <td>
                        <button className="action-btn" onClick={() => handleOpenEditPackage(p)} title="Edit">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button className="action-btn delete" onClick={() => handleDeletePackage(p.id)} title="Hapus">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TRANSACTIONS TAB */}
        {activeTab === 'transactions' && (
          <div className="card-table-wrapper">
            <div className="table-header">
              <h2>Riwayat Transaksi</h2>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID Transaksi</th>
                    <th>Nama Pelanggan</th>
                    <th>Kategori</th>
                    <th>Deskripsi Belanja</th>
                    <th>Tanggal Bayar</th>
                    <th>Metode</th>
                    <th>Jumlah Pembayaran</th>
                  </tr>
                </thead>
                <tbody>
                  {[...transactions].reverse().length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                        Belum ada transaksi terekam.
                      </td>
                    </tr>
                  ) : (
                    [...transactions].reverse().map(t => (
                      <tr key={t.id}>
                        <td><code>{t.id}</code></td>
                        <td><strong>{t.memberName}</strong></td>
                        <td>
                          <span className={`badge ${t.type === 'Membership' ? 'badge-active' : t.type === 'Kunjungan Harian' ? 'badge-pending' : 'badge-expired'}`}>
                            {t.type}
                          </span>
                        </td>
                        <td>{t.desc}</td>
                        <td>{t.date}</td>
                        <td>
                          <span className={`badge ${t.paymentMethod === 'QRIS' ? 'badge-active' : 'badge-pending'}`} style={{ fontSize: '0.75rem' }}>
                            {t.paymentMethod || 'Cash'}
                          </span>
                        </td>
                        <td><strong style={{ color: 'var(--success)' }}>{formatRupiah(t.amount)}</strong></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* EXPENSES TAB */}
        {activeTab === 'expenses' && (
          <div className="card-table-wrapper">
            <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
              <h2>Daftar Catatan Pengeluaran</h2>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Cari deskripsi pengeluaran..." 
                  style={{ width: '250px', padding: '8px 12px', fontSize: '0.85rem' }}
                  value={expenseSearch}
                  onChange={(e) => setExpenseSearch(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleOpenAddExpense} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  + Catat Pengeluaran
                </button>
              </div>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID Pengeluaran</th>
                    <th>Deskripsi Pengeluaran</th>
                    <th>Tanggal Pengeluaran</th>
                    <th>Metode Pembayaran</th>
                    <th>Jumlah Nominal</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const filteredList = expenses.filter(exp => 
                      exp.desc.toLowerCase().includes(expenseSearch.toLowerCase())
                    );
                    if (filteredList.length === 0) {
                      return (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                            Tidak ada data pengeluaran ditemukan.
                          </td>
                        </tr>
                      );
                    }
                    return [...filteredList].reverse().map(exp => (
                      <tr key={exp.id}>
                        <td><code>{exp.id}</code></td>
                        <td><strong>{exp.desc}</strong></td>
                        <td>{exp.date}</td>
                        <td>
                          <span className={`badge ${exp.paymentMethod === 'QRIS' ? 'badge-active' : 'badge-pending'}`} style={{ fontSize: '0.75rem' }}>
                            {exp.paymentMethod || 'Cash'}
                          </span>
                        </td>
                        <td><strong style={{ color: 'var(--danger)' }}>-{formatRupiah(exp.amount)}</strong></td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="action-btn" onClick={() => handleOpenEditExpense(exp)} title="Edit">✏️</button>
                            <button className="action-btn delete" onClick={() => handleDeleteExpense(exp.id)} title="Hapus">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REPORTS & RECAPS TAB */}
        {activeTab === 'reports' && (
          <div>
            {/* Filter Timeframe & Print Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }} className="no-print">
              <div style={{ display: 'flex', gap: '10px', backgroundColor: 'var(--bg-secondary)', padding: '8px', borderRadius: '12px', width: 'fit-content', border: '1px solid var(--border-color)' }}>
                <button 
                className={`btn ${reportPeriod === 'today' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                onClick={() => setReportPeriod('today')}
              >
                Hari Ini
              </button>
              <button 
                className={`btn ${reportPeriod === 'week' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                onClick={() => setReportPeriod('week')}
              >
                Minggu Ini
              </button>
              <button 
                className={`btn ${reportPeriod === 'month' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                onClick={() => setReportPeriod('month')}
              >
                Bulan Ini
              </button>
              <button 
                className={`btn ${reportPeriod === 'year' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                onClick={() => setReportPeriod('year')}
              >
                Tahun Ini
              </button>
              <button 
                className={`btn ${reportPeriod === 'custom' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                onClick={() => setReportPeriod('custom')}
              >
                Pilih Tanggal
              </button>
              </div>

              {/* Print Button */}
              <button 
                className="btn btn-primary"
                onClick={() => window.print()}
                style={{ padding: '10px 20px', gap: '8px' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                Cetak Laporan
              </button>
            </div>

            {/* Custom Date Pickers */}
            {reportPeriod === 'custom' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', width: 'fit-content', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Mulai Tanggal</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    style={{ maxWidth: '160px', padding: '6px 12px' }}
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Sampai Tanggal</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    style={{ maxWidth: '160px', padding: '6px 12px' }}
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Performance Stats Cards */}
            <div className="grid-stats">
              <div className="card-stat">
                <div className="stat-info">
                  <p>Omzet Periode Ini</p>
                  <h3 style={{ color: 'var(--accent)' }}>{formatRupiah(periodRevenue)}</h3>
                </div>
                <div className="stat-icon blue">
                  <svg viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 1.21-1.04 1.93-2.7 1.93-1.93 0-2.7-.93-2.82-2.1H5.1c.1 2.15 1.72 3.39 3.7 3.84V21h3v-2.15c2-.37 3.66-1.58 3.66-3.61 0-2.85-2.66-3.75-3.66-4.34z"/></svg>
                </div>
              </div>
              <div className="card-stat">
                <div className="stat-info">
                  <p>Volume Transaksi</p>
                  <h3>{filteredTransactions.length} Transaksi</h3>
                </div>
                <div className="stat-icon green">
                  <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
                </div>
              </div>
              <div className="card-stat">
                <div className="stat-info">
                  <p>Member Baru Terdaftar</p>
                  <h3>+{periodNewMembers} Member</h3>
                </div>
                <div className="stat-icon blue">
                  <svg viewBox="0 0 24 24"><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                </div>
              </div>
              <div className="card-stat">
                <div className="stat-info">
                  <p>Tamu Harian Masuk</p>
                  <h3>{periodDailyCount} Kunjungan</h3>
                </div>
                <div className="stat-icon warning">
                  <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                </div>
              </div>
            </div>

            {/* Split breakdown and bestselling items */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              
              {/* Left Column: Financial Breakdown */}
              <div className="card-table-wrapper">
                <div className="table-header">
                  <h2>Sumber Pendapatan Periode Ini</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '16px' }}>
                  
                  {/* Membership */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                      <span>Membership Anggota</span>
                      <strong>{formatRupiah(periodMembershipRev)} ({periodRevenue ? Math.round((periodMembershipRev/periodRevenue)*100) : 0}%)</strong>
                    </div>
                    <div style={{ backgroundColor: 'var(--bg-tertiary)', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ backgroundColor: 'var(--success)', height: '100%', width: `${periodRevenue ? (periodMembershipRev/periodRevenue)*100 : 0}%` }}></div>
                    </div>
                  </div>

                  {/* Daily Pass */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                      <span>Kunjungan Harian (Tamu)</span>
                      <strong>{formatRupiah(periodDailyRev)} ({periodRevenue ? Math.round((periodDailyRev/periodRevenue)*100) : 0}%)</strong>
                    </div>
                    <div style={{ backgroundColor: 'var(--bg-tertiary)', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ backgroundColor: 'var(--accent)', height: '100%', width: `${periodRevenue ? (periodDailyRev/periodRevenue)*100 : 0}%` }}></div>
                    </div>
                  </div>

                  {/* Toko */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                      <span>Toko Gym</span>
                      <strong>{formatRupiah(periodStoreRev)} ({periodRevenue ? Math.round((periodStoreRev/periodRevenue)*100) : 0}%)</strong>
                    </div>
                    <div style={{ backgroundColor: 'var(--bg-tertiary)', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ backgroundColor: 'var(--warning)', height: '100%', width: `${periodRevenue ? (periodStoreRev/periodRevenue)*100 : 0}%` }}></div>
                    </div>
                  </div>

                  {/* Payment Method Breakdown */}
                  <div style={{ borderTop: '1px solid var(--border-color)', margin: '8px 0 0 0', paddingTop: '20px' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '16px', color: 'var(--text-secondary)' }}>Metode Pembayaran Periode Ini</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {/* Cash */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                          <span>Cash / Tunai</span>
                          <strong>{formatRupiah(periodCash)} ({periodRevenue ? Math.round((periodCash/periodRevenue)*100) : 0}%)</strong>
                        </div>
                        <div style={{ backgroundColor: 'var(--bg-tertiary)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ backgroundColor: 'var(--success)', height: '100%', width: `${periodRevenue ? (periodCash/periodRevenue)*100 : 0}%` }}></div>
                        </div>
                      </div>

                      {/* QRIS */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                          <span>QRIS</span>
                          <strong>{formatRupiah(periodQRIS)} ({periodRevenue ? Math.round((periodQRIS/periodRevenue)*100) : 0}%)</strong>
                        </div>
                        <div style={{ backgroundColor: 'var(--bg-tertiary)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ backgroundColor: 'var(--accent)', height: '100%', width: `${periodRevenue ? (periodQRIS/periodRevenue)*100 : 0}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Right Column: Best Selling Products */}
              <div className="card-table-wrapper">
                <div className="table-header">
                  <h2>Produk Terlaris (Toko)</h2>
                </div>
                <div className="table-container" style={{ marginTop: '8px' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Nama Produk</th>
                        <th>Kuantitas Terjual</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bestSellers.length === 0 ? (
                        <tr>
                          <td colSpan="2" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                            Tidak ada penjualan produk pada periode ini.
                          </td>
                        </tr>
                      ) : (
                        bestSellers.map((item, index) => (
                          <tr key={index}>
                            <td><strong>{item.name}</strong></td>
                            <td><span className="badge badge-active">{item.qty} pcs</span></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Periodic Transactions Table */}
            <div className="card-table-wrapper" style={{ marginTop: '24px' }}>
              <div className="table-header">
                <h2>Rincian Transaksi Periode Ini</h2>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID Transaksi</th>
                      <th>Nama Pelanggan</th>
                      <th>Kategori</th>
                      <th>Deskripsi</th>
                      <th>Tanggal</th>
                      <th>Metode</th>
                      <th>Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                          Tidak ada transaksi yang tercatat dalam periode ini.
                        </td>
                      </tr>
                    ) : (
                      filteredTransactions.map(t => (
                        <tr key={t.id}>
                          <td><code>{t.id}</code></td>
                          <td><strong>{t.memberName}</strong></td>
                          <td>
                            <span className={`badge ${t.type === 'Membership' ? 'badge-active' : t.type === 'Kunjungan Harian' ? 'badge-pending' : 'badge-expired'}`}>
                              {t.type}
                            </span>
                          </td>
                          <td>{t.desc}</td>
                          <td>{t.date}</td>
                          <td>
                            <span className={`badge ${t.paymentMethod === 'QRIS' ? 'badge-active' : 'badge-pending'}`} style={{ fontSize: '0.75rem' }}>
                              {t.paymentMethod || 'Cash'}
                            </span>
                          </td>
                          <td><strong style={{ color: 'var(--success)' }}>{formatRupiah(t.amount)}</strong></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Periodic Expenses Table */}
            <div className="card-table-wrapper" style={{ marginTop: '24px' }}>
              <div className="table-header">
                <h2>Rincian Pengeluaran Periode Ini</h2>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID Pengeluaran</th>
                      <th>Deskripsi Pengeluaran</th>
                      <th>Tanggal</th>
                      <th>Metode</th>
                      <th>Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                          Tidak ada pengeluaran yang tercatat dalam periode ini.
                        </td>
                      </tr>
                    ) : (
                      filteredExpenses.map(exp => (
                        <tr key={exp.id}>
                          <td><code>{exp.id}</code></td>
                          <td><strong>{exp.desc}</strong></td>
                          <td>{exp.date}</td>
                          <td>
                            <span className={`badge ${exp.paymentMethod === 'QRIS' ? 'badge-active' : 'badge-pending'}`} style={{ fontSize: '0.75rem' }}>
                              {exp.paymentMethod || 'Cash'}
                            </span>
                          </td>
                          <td><strong style={{ color: 'var(--danger)' }}>-{formatRupiah(exp.amount)}</strong></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </main>

      {/* MEMBER MODAL */}
      {isMemberModalOpen && (
        <div className="modal" onClick={() => setIsMemberModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{memberForm.id ? 'Edit Member' : 'Tambah Member Baru'}</h3>
              <button className="modal-close" onClick={() => setIsMemberModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveMember}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Nama Lengkap</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={memberForm.name}
                    onChange={(e) => setMemberForm(prev => ({ ...prev, name: e.target.value }))}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Nomor Telepon</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="08xxxxxxxxxx"
                    value={memberForm.phone}
                    onChange={(e) => setMemberForm(prev => ({ ...prev, phone: e.target.value }))}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Pilih Paket Layanan</label>
                  <select 
                    className="form-control"
                    value={memberForm.packageId}
                    onChange={(e) => setMemberForm(prev => ({ ...prev, packageId: e.target.value }))}
                    required
                  >
                    {packages.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} - ({p.duration} Bln - {formatRupiah(p.price)})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Tanggal Mulai</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={memberForm.startDate}
                    onChange={(e) => setMemberForm(prev => ({ ...prev, startDate: e.target.value }))}
                    required 
                  />
                  <div className="form-group">
                   <label>Metode Pembayaran</label>
                   <select 
                     className="form-control"
                     value={memberForm.paymentMethod}
                     onChange={(e) => setMemberForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                     required
                   >
                     <option value="Cash">Cash / Tunai</option>
                     <option value="QRIS">QRIS</option>
                   </select>
                 </div>
               </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsMemberModalOpen(false)}>Batal</button>
                <button type="submit" className="btn className=btn-primary">Simpan Member</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DAILY VISITOR LOG MODAL */}
      {isDailyModalOpen && (
        <div className="modal" onClick={() => setIsDailyModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{dailyForm.id ? 'Edit Kunjungan Harian' : 'Log Kunjungan Harian'}</h3>
              <button className="modal-close" onClick={() => setIsDailyModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveDaily}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Nama Lengkap Tamu</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={dailyForm.name}
                    onChange={(e) => setDailyForm(prev => ({ ...prev, name: e.target.value }))}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Nomor Telepon</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="08xxxxxxxxxx"
                    value={dailyForm.phone}
                    onChange={(e) => setDailyForm(prev => ({ ...prev, phone: e.target.value }))}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Tanggal Kunjungan</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={dailyForm.date}
                    onChange={(e) => setDailyForm(prev => ({ ...prev, date: e.target.value }))}
                    required 
                  />
                  <div className="form-group">
                   <label>Metode Pembayaran</label>
                   <select 
                     className="form-control"
                     value={dailyForm.paymentMethod}
                     onChange={(e) => setDailyForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                     required
                   >
                     <option value="Cash">Cash / Tunai</option>
                     <option value="QRIS">QRIS</option>
                   </select>
                 </div>
               </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsDailyModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan Kunjungan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PACKAGE MODAL */}
      {isPackageModalOpen && (
        <div className="modal" onClick={() => setIsPackageModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{packageForm.id ? 'Edit Paket' : 'Tambah Paket Baru'}</h3>
              <button className="modal-close" onClick={() => setIsPackageModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSavePackage}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Nama Paket</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Contoh: Bulanan Regular" 
                    value={packageForm.name}
                    onChange={(e) => setPackageForm(prev => ({ ...prev, name: e.target.value }))}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Durasi (Bulan)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    min="1" 
                    value={packageForm.duration}
                    onChange={(e) => setPackageForm(prev => ({ ...prev, duration: e.target.value }))}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Harga (Rupiah)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    min="0" 
                    placeholder="350000" 
                    value={packageForm.price}
                    onChange={(e) => setPackageForm(prev => ({ ...prev, price: e.target.value }))}
                    required 
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsPackageModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan Paket</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="modal" onClick={() => setIsProductModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{productForm.id ? 'Edit Produk Toko' : 'Tambah Produk Baru'}</h3>
              <button className="modal-close" onClick={() => setIsProductModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveProduct}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Nama Produk</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Contoh: Aqua 600ml" 
                    value={productForm.name}
                    onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Harga Jual (Rp)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={productForm.price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Jumlah Stok</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={productForm.stock}
                    onChange={(e) => setProductForm(prev => ({ ...prev, stock: e.target.value }))}
                    required 
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsProductModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan Produk</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXPENSE MODAL */}
      {isExpenseModalOpen && (
        <div className="modal" onClick={() => setIsExpenseModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{expenseForm.id ? 'Edit Catatan Pengeluaran' : 'Catat Pengeluaran Baru'}</h3>
              <button className="modal-close" onClick={() => setIsExpenseModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveExpense}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Deskripsi Pengeluaran</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Contoh: Bayar Listrik, Beli Sabun, Gaji Trainer" 
                    value={expenseForm.desc}
                    onChange={(e) => setExpenseForm(prev => ({ ...prev, desc: e.target.value }))}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Tanggal Pengeluaran</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={expenseForm.date}
                    onChange={(e) => setExpenseForm(prev => ({ ...prev, date: e.target.value }))}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Jumlah Nominal (Rp)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="150000"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Metode Pembayaran</label>
                  <select 
                    className="form-control" 
                    value={expenseForm.paymentMethod}
                    onChange={(e) => setExpenseForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  >
                    <option value="Cash">Cash (Tunai)</option>
                    <option value="QRIS">QRIS</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsExpenseModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan Pengeluaran</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
