import { useState, useEffect } from 'react';
import axios from 'axios'; // To communicate with flask api
import './App.css';  // optional

// TypeScript interface defining structure of each expense object
interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string; // "YYYY-MM-DD"
}

// State management
function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [loading, setLoading] = useState(false);
  const [selectedFilterCategory, setSelectedFilterCategory] = useState('All');
  const [selectedFilterDate, setSelectedFilterDate] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, []);

//FETCH ALL EXPENSES FROM BACKEND
  const fetchExpenses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/expenses');
      setExpenses(res.data);
    } catch (err) {
      console.error('Error loading expenses:', err);
    }
  };

 //ADD NEW EXPENSE 
  const addExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return alert('Fill note and amount');

    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/expenses', {
        description,
        amount: parseFloat(amount),
        category,
      });
      setDescription('');
      setAmount('');
      fetchExpenses();
    } catch (err) {
      console.error('Error adding expense:', err);
      alert('Something went wrong');
    }
    setLoading(false);
  };

//DELETE EXPENSE
  const deleteExpense = async (id: number) => {
    if (!confirm('Delete this expense?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      fetchExpenses();
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  // Unique categories
  const uniqueCategories = ['All', ...new Set(expenses.map(exp => exp.category))];

  // Apply filters
  const filteredExpenses = expenses
    .filter(exp => selectedFilterCategory === 'All' || exp.category === selectedFilterCategory)
    .filter(exp => !selectedFilterDate || exp.date === selectedFilterDate);

  // Calculate total of currently filtered expenses
  const filteredTotal = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Expense Tracker</h1>
      
      {/* Dynamic filtered total */}
      <div style={{ background: '#2067a4', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Total Spent: ₹{filteredTotal.toFixed(2)}</h3>
        {filteredExpenses.length !== expenses.length && (
          <small>(Total in {selectedFilterCategory})</small>
        )}
      </div>

      {/* Add Form */}
      <form onSubmit={addExpense} style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', gap: '10px' }}>
        <input
          type="text"
          placeholder="Note (e.g. Lunch)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ flex: '2', padding: '10px' }}
        />
        <input
          type="number"
          placeholder="Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          step="0.01"
          style={{ flex: '1', padding: '10px' }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ flex: '1', padding: '10px' }}
        >
          <option value="Food">Food 🍲</option>
          <option value="Transport">Transport 🚕</option>
          <option value="Bills">Bills 💡</option>
          <option value="Shopping">Shopping 🛍️</option>
          <option value="Entertainment">Entertainment 🎬</option>
          <option value="Other">Other</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          style={{ padding: '10px 20px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </form>

      {/* Table */}
      <h2>Expenses List</h2>
      {expenses.length === 0 ? (
        <p>No expenses yet. Add one above!</p>
      ) : (
        <>
        {/* Filters side by side */}
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '30px', alignItems: 'center' }}>
            <div>
              <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Filter by Category:</label>
              <select
                value={selectedFilterCategory}
                onChange={(e) => setSelectedFilterCategory(e.target.value)}
                style={{ padding: '8px', minWidth: '160px' }}
              >
                {uniqueCategories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Filter by Date:</label>
              <input
                type="date"
                value={selectedFilterDate}
                onChange={(e) => setSelectedFilterDate(e.target.value)}
                style={{ padding: '8px' }}
              />
              {selectedFilterDate && (
                <button
                  onClick={() => setSelectedFilterDate('')}
                  style={{ marginLeft: '8px', padding: '6px 10px', fontSize: '0.9em', background: '#757575', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ background: '#882525' }}>
                <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Note</th>
                <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Amount (₹)</th>
                <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Category</th>
                <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Date</th>
                <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((exp) => (
                <tr key={exp.id}>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{exp.description}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{exp.amount.toFixed(2)}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{exp.category}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{exp.date}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                    <button
                      onClick={() => deleteExpense(exp.id)}
                      style={{ background: '#f44336', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          
        </>
      )}
    </div>
  );
}

export default App;