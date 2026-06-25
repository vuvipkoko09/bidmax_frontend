import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { FiPlus, FiTrash2, FiEdit2, FiCreditCard } from 'react-icons/fi';

const TransactionManage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminService.getAllTransactions();
      setTransactions(data || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Không thể kết nối đến Backend để tải danh sách giao dịch.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleCreateTransaction = async () => {
    const userIdStr = window.prompt('Nhập ID người dùng (User ID):');
    if (!userIdStr) return;
    const userId = parseInt(userIdStr) || 0;

    const amountStr = window.prompt('Nhập số tiền giao dịch (VND):');
    if (!amountStr) return;
    const amount = parseFloat(amountStr) || 0;

    const method = window.prompt('Nhập phương thức thanh toán (ví dụ: VNPAY, BANK_TRANSFER):');
    if (!method) return;

    const newTx = { userId, amount, paymentMethod: method, status: 'SUCCESS', transactionTime: new Date().toISOString() };

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await adminService.createTransaction(newTx);
      setSuccess(`Đã tạo thành công giao dịch cho User ID: ${userId} trị giá ${amount} VND`);
      await fetchTransactions();
    } catch (err) {
      console.error('Error creating transaction:', err);
      setError('Lỗi khi tạo mới giao dịch trên hệ thống.');
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa giao dịch ID: ${id}?`)) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await adminService.deleteTransaction(id);
      setSuccess(`Đã xóa thành công giao dịch ID: ${id}`);
      await fetchTransactions();
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError(`Lỗi khi thực hiện xóa giao dịch ID: ${id}`);
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const handleEditMock = (tx) => {
    window.prompt(`Cập nhật trạng thái giao dịch:`, tx.status);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Title block */}
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 m-0">
            <FiCreditCard className="text-blue-600" /> Quản lý Giao dịch (Transactions)
          </h2>
          <p className="text-xs text-gray-500 mt-1">Giám sát các dòng tiền giao dịch nạp tiền, rút tiền, đặt cọc và thanh toán đấu giá.</p>
        </div>
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-colors duration-150 shadow-sm shrink-0" 
          onClick={handleCreateTransaction}
        >
          <FiPlus className="w-4 h-4" /> Tạo mới
        </button>
      </div>

      {/* Success notification */}
      {success && (
        <div className="mx-6 mt-6 p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-sm font-semibold">
          {success}
        </div>
      )}

      {/* Error notification */}
      {error && (
        <div className="mx-6 mt-6 p-4 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-sm font-semibold">
          {error}
        </div>
      )}

      {/* Loading state or Table */}
      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500 font-medium">Đang tải dữ liệu...</div>
      ) : transactions.length === 0 ? (
        <div className="p-12 text-center text-sm text-gray-500 font-medium">Chưa có giao dịch nào trên hệ thống.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">ID</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">ID Người dùng</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Số tiền</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Phương thức</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Trạng thái</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">{tx.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{tx.userId}</td>
                  <td className="px-6 py-4 text-sm font-bold text-emerald-600">{formatCurrency(tx.amount)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{tx.paymentMethod}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200">
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" 
                        onClick={() => handleEditMock(tx)}
                        title="Sửa"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors" 
                        onClick={() => handleDeleteTransaction(tx.id)}
                        title="Xóa"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionManage;
