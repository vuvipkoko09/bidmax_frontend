import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { FiPlus, FiTrash2, FiEdit2, FiShoppingCart } from 'react-icons/fi';
import Modal from '../../components/common/Modal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const OrderManage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const schema = yup.object().shape({
    userId: yup.number().typeError('ID Người dùng phải là số').required('Bắt buộc nhập ID người dùng'),
    auctionId: yup.number().typeError('ID Phiên đấu giá phải là số').required('Bắt buộc nhập ID phiên đấu giá'),
    totalPrice: yup.number().typeError('Tổng tiền phải là số').required('Bắt buộc nhập tổng tiền'),
    shippingAddress: yup.string().required('Địa chỉ giao hàng là bắt buộc'),
    status: yup.string().required('Trạng thái là bắt buộc'),
  });

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { userId: '', auctionId: '', totalPrice: '', shippingAddress: '', status: 'PENDING' }
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminService.getAllOrders();
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Không thể kết nối đến Backend để tải danh sách đơn hàng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openCreateModal = () => {
    setEditingOrder(null);
    reset({ userId: '', auctionId: '', totalPrice: '', shippingAddress: '', status: 'PENDING' });
    setIsModalOpen(true);
  };

  const openEditModal = (order) => {
    setEditingOrder(order);
    reset({ 
      userId: order.userId || '', 
      auctionId: order.auctionId || '', 
      totalPrice: order.totalPrice || order.amount || '', 
      shippingAddress: order.shippingAddress || '', 
      status: order.status || 'PENDING' 
    });
    setIsModalOpen(true);
  };

  const onSubmitForm = async (data) => {
    // Note: The backend currently lacks a full updateOrder endpoint for all fields. 
    // We are passing status for the mock functionality.
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      if (editingOrder) {
        // Mock update
        // await adminService.updateOrder(editingOrder.orderId, data);
        setSuccess(`Chức năng cập nhật đang phát triển. Đã ghi nhận trạng thái: ${data.status}`);
      } else {
        // Mock create
        setSuccess(`Chức năng thêm mới đang phát triển.`);
      }
      setIsModalOpen(false);
      await fetchOrders();
    } catch (err) {
      console.error('Error saving order:', err);
      setError('Lỗi khi lưu đơn hàng trên hệ thống.');
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (id, itemName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa đơn hàng "${itemName}"?`)) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await adminService.deleteOrder(id);
      setSuccess(`Đã xóa thành công đơn hàng ID: ${id}`);
      await fetchOrders();
    } catch (err) {
      console.error('Error deleting order:', err);
      setError(`Lỗi khi thực hiện xóa đơn hàng ID: ${id}`);
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const badgeStyle = (status) => {
    if (status === 'PAID') {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    } else if (status === 'SHIPPED') {
      return 'bg-blue-50 text-blue-700 border-blue-200';
    } else {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Title block */}
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 m-0">
            <FiShoppingCart className="text-blue-600" /> Quản lý Đơn hàng (Orders)
          </h2>
          <p className="text-xs text-gray-500 mt-1">Theo dõi, cập nhật và quản lý tình trạng thanh toán/vận chuyển các đơn hàng sau khi đấu giá thành công.</p>
        </div>
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-colors duration-150 shadow-sm shrink-0" 
          onClick={openCreateModal}
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
      ) : orders.length === 0 ? (
        <div className="p-12 text-center text-sm text-gray-500 font-medium">Chưa có đơn hàng nào trên hệ thống.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">ID</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Tên sản phẩm</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Người thắng cuộc</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Tổng giá trị (Total Price)</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Trạng thái</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.orderId || order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">{order.orderId || order.id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{order.auctionTitle || order.itemName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{order.winnerName}</td>
                  <td className="px-6 py-4 text-sm font-bold text-emerald-600">{formatCurrency(order.totalPrice || order.amount)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" 
                        onClick={() => openEditModal(order)}
                        title="Sửa"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors" 
                        onClick={() => handleDeleteOrder(order.orderId || order.id, order.auctionTitle || order.itemName)}
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

      {/* Modal Form */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingOrder ? 'Cập nhật Trạng thái Đơn hàng' : 'Thêm Đơn hàng mới'}
      >
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">ID Người dùng <span className="text-red-500">*</span></label>
              <input 
                type="number"
                {...register('userId')}
                className={`w-full px-4 py-2 border ${errors.userId ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                placeholder="Nhập User ID..."
              />
              {errors.userId && <p className="text-red-500 text-xs italic mt-1">{errors.userId.message}</p>}
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">ID Phiên đấu giá <span className="text-red-500">*</span></label>
              <input 
                type="number"
                {...register('auctionId')}
                className={`w-full px-4 py-2 border ${errors.auctionId ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                placeholder="Nhập Auction ID..."
              />
              {errors.auctionId && <p className="text-red-500 text-xs italic mt-1">{errors.auctionId.message}</p>}
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tổng tiền (VND) <span className="text-red-500">*</span></label>
              <input 
                type="number"
                {...register('totalPrice')}
                className={`w-full px-4 py-2 border ${errors.totalPrice ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                placeholder="Nhập tổng giá trị..."
              />
              {errors.totalPrice && <p className="text-red-500 text-xs italic mt-1">{errors.totalPrice.message}</p>}
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái (Status) <span className="text-red-500">*</span></label>
              <select 
                {...register('status')}
                className={`w-full px-4 py-2 border ${errors.status ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
              >
                <option value="PENDING">PENDING</option>
                <option value="PAID">PAID</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
              {errors.status && <p className="text-red-500 text-xs italic mt-1">{errors.status.message}</p>}
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ giao hàng <span className="text-red-500">*</span></label>
              <textarea 
                {...register('shippingAddress')}
                rows={3}
                className={`w-full px-4 py-2 border ${errors.shippingAddress ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                placeholder="Nhập địa chỉ giao hàng..."
              />
              {errors.shippingAddress && <p className="text-red-500 text-xs italic mt-1">{errors.shippingAddress.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-100">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              Hủy
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu lại'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default OrderManage;
