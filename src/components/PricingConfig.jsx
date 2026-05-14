import { useState, useEffect } from 'react';
import axios from 'axios';

const PricingConfig = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const { data } = await axios.get(`${API_URL}/pricing`);
      if (data && data.plans && data.plans.length > 0) {
        // Sort to ensure order 1, 2, 3
        const sortedPlans = [...data.plans].sort((a, b) => a.id - b.id);
        setPlans(sortedPlans);
      } else {
        setPlans([
          { id: 1, price: 349 },
          { id: 2, price: 799 },
          { id: 3, price: 3499 }
        ]);
      }
    } catch (err) {
      setError('Failed to load pricing configurations');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (id, value) => {
    const updatedPlans = plans.map(p => 
      p.id === id ? { ...p, price: value } : p
    );
    setPlans(updatedPlans);
  };

  const getDaysForPlan = (id) => {
    if (id === 1) return 30; // 1 month
    if (id === 2) return 90; // 3 months
    if (id === 3) return 365; // 12 months
    return 30; // default
  };

  const calculatePricePerDay = (price, id) => {
    if (!price) return 0;
    const days = getDaysForPlan(id);
    return (price / days).toFixed(1);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await axios.put(`${API_URL}/admin/pricing`, { plans });
      setMessage('Pricing updated successfully!');
      fetchPricing(); // Refetch to get updated database versions
    } catch (err) {
      setError('Failed to update pricing');
    }
  };

  const getPlanName = (id) => {
    if (id === 1) return '1 Month (Starter)';
    if (id === 2) return '3 Months (Growth)';
    if (id === 3) return '12 Months (Pro Yearly)';
    return `Plan ${id}`;
  };

  if (loading) return <div className="p-4">Loading pricing configuration...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bebas tracking-tight text-slate-800">Pricing Configuration</h2>
      </div>
      
      {message && <div className="p-3 mb-6 text-sm text-green-700 bg-green-50 rounded-lg">{message}</div>}
      {error && <div className="p-3 mb-6 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="border border-slate-200 rounded-xl p-5 bg-slate-50 space-y-4">
              <h3 className="font-bold text-slate-700">{getPlanName(plan.id)}</h3>
              
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Total Price (₹)</label>
                <input
                  type="number"
                  value={plan.price}
                  onChange={(e) => handleUpdate(plan.id, Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-xl font-bold"
                  min="0"
                  required
                />
              </div>
              
              <div className="pt-2 flex justify-between items-center text-sm font-medium text-slate-600 border-t border-slate-200 mt-4">
                <span>Calculated Daily:</span>
                <span className="text-indigo-600 font-bold">₹{calculatePricePerDay(plan.price, plan.id)}/day</span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            Save Pricing
          </button>
        </div>
      </form>
    </div>
  );
};

export default PricingConfig;
