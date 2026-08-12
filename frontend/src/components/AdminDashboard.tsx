import React, { useState } from 'react';
import { useAdminAnalytics, useRewards, useUsersList, useCreateReward, useDeleteReward, useAdjustPoints } from '../lib/api';
import { Users, Gift, TrendingUp, Plus, Trash2, ShieldCheck, Sparkles, Coins } from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminDashboard: React.FC = () => {
  const { data: analytics } = useAdminAnalytics();
  const { data: rewards } = useRewards('All');
  const { data: usersList } = useUsersList();

  const createRewardMutation = useCreateReward();
  const deleteRewardMutation = useDeleteReward();
  const adjustPointsMutation = useAdjustPoints();

  // Create Reward Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCat, setNewCat] = useState('Drinks');
  const [newPts, setNewPts] = useState(250);
  const [newPrice, setNewPrice] = useState(50);
  const [newImg, setNewImg] = useState('');
  const [newStock, setNewStock] = useState(100);

  // Manual Points Grant state
  const adjustAmount = 200;
  const adjustReason = 'Store VIP Promotion Bonus';
  const [grantSuccessMsg, setGrantSuccessMsg] = useState<string | null>(null);

  const handleCreateRewardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRewardMutation.mutate(
      {
        title: newTitle,
        description: newDesc,
        category: newCat,
        pointsRequired: Number(newPts),
        retailPrice: Number(newPrice),
        imageUrl: newImg,
        stock: Number(newStock),
        expiryDays: 30,
      },
      {
        onSuccess: () => {
          setIsAddModalOpen(false);
          setNewTitle('');
          setNewDesc('');
        },
      }
    );
  };

  const handleAdjustPointsSubmit = (userId: string) => {
    adjustPointsMutation.mutate(
      {
        userId,
        pointsAmount: Number(adjustAmount),
        reason: adjustReason,
      },
      {
        onSuccess: (updatedUser) => {
          setGrantSuccessMsg(`Successfully granted ${adjustAmount} points to ${updatedUser.name}!`);
          setTimeout(() => setGrantSuccessMsg(null), 4000);
        },
      }
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Clean Minimal Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-slate-700" />
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Store Manager Admin Console
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-normal">
            System metrics, customer CRM, and live catalog management
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer active:scale-98"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Reward Item</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Members</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{analytics?.totalMembers ?? usersList?.length ?? 2}</p>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-block">Active Registered</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Points Issued</span>
            <Coins className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {(analytics?.totalPointsIssued ?? 9650).toLocaleString()} <span className="text-xs font-medium text-slate-400">PTS</span>
          </p>
          <span className="text-[10px] text-amber-600 font-semibold mt-1 inline-block">Lifetime Member Earnings</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Vouchers Claimed</span>
            <Gift className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{analytics?.totalRedemptions ?? 18}</p>
          <span className="text-[10px] text-indigo-600 font-semibold mt-1 inline-block">Redeemed Rewards</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">GMV Sales Volume</span>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900">
            ฿{(analytics?.totalRevenueVolume ?? 96500).toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-500 font-semibold mt-1 inline-block">Estimated Volume</span>
        </div>
      </div>

      {/* Grant Success Alert */}
      {grantSuccessMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-emerald-800 text-xs shadow-xs"
        >
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{grantSuccessMsg}</span>
        </motion.div>
      )}

      {/* Member Management Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Users className="w-4 h-4 text-slate-600" />
            <span>Member Accounts & Manual Point Allocations</span>
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">
            {usersList?.length || 0} Accounts Registered
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="pb-3">Member Name</th>
                <th className="pb-3">ID</th>
                <th className="pb-3">Tier</th>
                <th className="pb-3">Points Balance</th>
                <th className="pb-3">Role</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usersList?.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 font-bold text-slate-900 flex items-center space-x-3">
                    <img
                      src={u.avatarUrl}
                      alt={u.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div>{u.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{u.email}</div>
                    </div>
                  </td>
                  <td className="py-3 font-mono text-slate-600">{u.memberId}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                      {u.tier}
                    </span>
                  </td>
                  <td className="py-3 font-bold text-slate-900">{u.pointsBalance} PTS</td>
                  <td className="py-3 font-mono text-slate-500">{u.role || 'Member'}</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleAdjustPointsSubmit(u.id)}
                      disabled={adjustPointsMutation.isPending}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-lg text-[11px] font-semibold transition-all cursor-pointer active:scale-95"
                    >
                      +200 Bonus PTS
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rewards Catalog Management Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Gift className="w-4 h-4 text-slate-600" />
            <span>Catalog Items & Inventory</span>
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">
            {rewards?.length || 0} Listed Items
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards?.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50/50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between space-x-3"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                <p className="text-[11px] text-slate-700 font-bold mt-0.5">
                  {item.pointsRequired} PTS <span className="text-slate-400 font-normal text-[10px]">(฿{item.retailPrice})</span>
                </p>
                <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-1">
                  <span>Stock: {item.stock}</span>
                  <span>•</span>
                  <span>{item.category}</span>
                </div>
              </div>
              <button
                onClick={() => deleteRewardMutation.mutate(item.id)}
                disabled={deleteRewardMutation.isPending}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200 cursor-pointer"
                title="Delete Item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Reward Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <Plus className="w-5 h-5 text-slate-700" />
              <span>Create Reward Item</span>
            </h3>

            <form onSubmit={handleCreateRewardSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cold Brew Iced Coffee"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  required
                  placeholder="Item details..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 h-16 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  >
                    <option value="Drinks">Drinks</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Vouchers">Vouchers</option>
                    <option value="Electronics">Electronics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Stock Qty</label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Points Required</label>
                  <input
                    type="number"
                    required
                    value={newPts}
                    onChange={(e) => setNewPts(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Retail Price (฿)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newImg}
                  onChange={(e) => setNewImg(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="flex items-center space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createRewardMutation.isPending}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-sm cursor-pointer"
                >
                  {createRewardMutation.isPending ? 'Saving...' : 'Add Reward'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
