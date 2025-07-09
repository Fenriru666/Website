import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useNotification } from '../../contexts/NotificationContext';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatCard = ({ title, value, icon, loading }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className="bg-orange-100 p-3 rounded-full mr-4">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            {loading ? (
                <div className="h-8 bg-gray-200 rounded w-24 mt-1 animate-pulse"></div>
            ) : (
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            )}
        </div>
    </div>
);

function AdminDashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addNotification } = useNotification();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const response = await api.get('/api/admin/stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setStats(response.data);
            } catch (error) {
                addNotification('Lỗi khi tải dữ liệu thống kê.', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const chartData = {
        labels: stats?.weeklyRevenue.map(d => new Date(d.date).toLocaleDateString('vi-VN')) || [],
        datasets: [
            {
                label: 'Doanh thu (VND)',
                data: stats?.weeklyRevenue.map(d => d.revenue) || [],
                backgroundColor: 'rgba(249, 115, 22, 0.6)',
                borderColor: 'rgba(249, 115, 22, 1)',
                borderWidth: 1,
            },
        ],
    };
    
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Doanh thu 7 ngày qua',
            },
        },
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Tổng quan</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <StatCard 
                    title="Tổng doanh thu" 
                    value={`${Number(stats?.totalRevenue || 0).toLocaleString('vi-VN')} ₫`} 
                    icon={<span>💰</span>}
                    loading={loading}
                />
                <StatCard 
                    title="Đơn hàng hôm nay" 
                    value={stats?.todayOrders ?? 0} 
                    icon={<span>📦</span>}
                    loading={loading}
                />
                <StatCard 
                    title="Tổng người dùng" 
                    value={stats?.totalUsers ?? 0} 
                    icon={<span>👥</span>}
                    loading={loading}
                />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                {loading ? (
                    <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                    <Bar options={chartOptions} data={chartData} />
                )}
            </div>
        </div>
    );
}

export default AdminDashboardPage;